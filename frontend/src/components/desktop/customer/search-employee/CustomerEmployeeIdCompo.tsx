"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar as CalendarIcon,
  User,
  Award,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { useGetAppointmentForCustomer } from "@/lib/hooks/tanstack/query-hook/customer/useGetAppointmentForCustomer"
import { useGetEmployeeProfile } from "@/lib/hooks/tanstack/query-hook/customer/useGetEmployeeProfile"
import { useCustomerStore } from "@/lib/store/customer/use-customer-store"
import { useEmployeeId } from "@/lib/hooks/params/useEmployeeId"
import Image from "next/image"
import { useCreateAppointmentForCustomer } from "@/lib/hooks/tanstack/mutate-hook/appointment/customer/useCreateAppointmentForCustomer"
import toast from "react-hot-toast"

const appointmentSchema = z
  .object({
    timeRequired: z.number().min(1, "Time required must be at least 1 hour").max(24, "Maximum 24 hours allowed"),
    offeredPrice: z.number().min(1, "Offered price must be greater than 0"),
    deadline: z.date({
      required_error: "A deadline is required.",
    }),
    description: z.string().min(10, "Description must be at least 10 characters"),
  })
  .refine(
    (data) => {
      return true
    },
    {
      message: "Please check your offer amount",
      path: ["offeredPrice"],
    },
  )

function CustomerEmployeeIdCompo() {
  const { user } = useCustomerStore()
  const employeeId = useEmployeeId()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actualPrice, setActualPrice] = useState<number>(0)
  const [validationError, setValidationError] = useState<string>("")
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [formValues, setFormValues] = useState<z.infer<typeof appointmentSchema>>()
  const [isAutoPrice, setIsAutoPrice] = useState(true)

  const { data: employeeProfile, isLoading: employeeProfileLoading } = useGetEmployeeProfile(employeeId)
  const { data: appointmentData, isLoading: appointmentDataLoading } = useGetAppointmentForCustomer(employeeId)
  const { mutate: create_appointment, isPending: creatingAppointment } = useCreateAppointmentForCustomer();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      timeRequired: 1,
      offeredPrice: 0,
      description: "",
    },
  })

  const timeRequired = form.watch("timeRequired")
  const offeredPrice = form.watch("offeredPrice")

  useEffect(() => {
    if (employeeProfile?.hourlyRate && timeRequired && isAutoPrice) {
      const calculatedPrice = employeeProfile.hourlyRate * timeRequired
      setActualPrice(calculatedPrice)
      form.setValue("offeredPrice", calculatedPrice)
    }
  }, [timeRequired, employeeProfile?.hourlyRate, form, isAutoPrice])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    form.setValue("offeredPrice", value)
    setIsAutoPrice(false)
  }

  useEffect(() => {
    if (!isAutoPrice) {
      const timer = setTimeout(() => {
        setIsAutoPrice(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [offeredPrice, isAutoPrice])

  const handleAppointment = (values: z.infer<typeof appointmentSchema>) => {
    if (values.offeredPrice < actualPrice) {
      setValidationError(`Offer must be at least $${actualPrice}`)
      return
    }
    setValidationError("")
    setFormValues(values)
    setShowDisclaimer(true)
  }

  const handleFinalSubmission = () => {
    try {
      if (!user?.userId) {
        toast.error("No user found")
        return;
      }
      const vales = form.getValues();
      const data = {
        actualPrice,
        offeredPrice: vales.offeredPrice,
        timeRequired: vales.timeRequired,
        deadline: vales.deadline,
        description: vales.description,
        employeeId: employeeProfile.userId,
        customerId: user?.userId,
        employeeProfileId: employeeProfile._id,
      }

      create_appointment(data, {
        onSuccess: (res) => {
          if (res.success && res.message) {
            toast.success(res.message || "Successfully created")
            setShowDisclaimer(false)
            setDialogOpen(false)
            form.reset()
          } else if (!res.success && res.error) {
            toast.error(res.error);
          }
        },
        onError: () => { 
          toast.error("Failed to create appointment")
        },
      })
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-responded":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "accepted":
        return "bg-[#21c063]/20 text-[#21c063] border-[#21c063]/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  if (employeeProfileLoading) {
    return (
      <div className="min-h-screen bg-[#161717] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="w-6 h-6 animate-spin text-[#21c063]" />
          <span className="text-lg">Loading employee profile...</span>
        </div>
      </div>
    )
  }

  if (!employeeProfile) {
    return (
      <div className="min-h-screen bg-[#161717] flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
          <p className="text-gray-400">The requested employee profile could not be found.</p>
        </div>
      </div>
    )
  }

  const appointments = appointmentData?.appointments || []
  const totalAppointments = appointmentData?.totalAppointment || 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #242626;
        }
        ::-webkit-scrollbar-thumb {
          background: #21c063;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #1aa955;
        }
      `}</style>
      <div className="mb-6">
        <p className="text-sm text-white">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Search Employees</span>
          <span className="mx-2">›</span>
          <span className="font-medium text-white">{employeeProfile.name}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden bg-[#242626] text-white">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24">
              Employee Profile
            </div>
            <CardContent className="relative p-6 ">
              <div className="flex items-start space-x-4">
                <Image
                  width={500}
                  height={500}
                  src={employeeProfile.image}
                  alt={employeeProfile.name}
                  className="w-[200px] h-[200px] rounded-md border-4 border-white shadow-lg"
                />
                <div className="flex-1 mt-8 ml-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white">{employeeProfile.name}</h1>
                      <p className="text-lg text-blue-600 font-medium">{employeeProfile.jobCategory}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">${employeeProfile.hourlyRate}</div>
                      <div className="text-sm text-white">per hour</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 text-sm text-white">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{employeeProfile.rating}/5</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{employeeProfile.completedJobs} jobs completed</span>
                    </div>
                    {employeeProfile.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{employeeProfile.location.address}, Lat: {employeeProfile.location.coordinates[0]}, Lon: {employeeProfile.location.coordinates[1]}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-white mb-2">Skills</h3>
                    <p className="text-white">{employeeProfile.skills}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#242626]">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="text-xl flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
                Book an Appointment
              </CardTitle>
              <p className="text-gray-600">
                Ready to work with <span className="font-semibold text-green-600">{employeeProfile.name}</span>?
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  if (!open) {
                    setShowDisclaimer(false)
                    form.reset();
                  }
                  setDialogOpen(open)
                }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8 py-3 text-lg">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                    {showDisclaimer ? (
                      <div className="space-y-6">
                        <DialogHeader className="text-center pb-4">
                          <DialogTitle className="text-2xl">Legal Disclaimer</DialogTitle>
                        </DialogHeader>

                        <Alert variant="destructive">
                          <AlertCircle className="h-5 w-5" />
                          <AlertTitle className="text-lg">Important Legal Notice</AlertTitle>
                          <AlertDescription className="mt-2 space-y-2">
                            <p>
                              You are about to submit an offer of <span className="font-bold">${formValues?.offeredPrice}</span> for this service.
                            </p>
                            <p>By proceeding, you acknowledge that you are making this offer in good faith and have the financial means to fulfill this obligation.</p>
                            <p>If any complain regarding your offered price is not received then you may go through legal procedure.</p>
                          </AlertDescription>
                        </Alert>

                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-3"
                            onClick={() => setShowDisclaimer(false)}
                          >
                            Go Back
                          </Button>
                          <Button
                            type="button"
                            className="flex-1 py-3"
                            onClick={handleFinalSubmission}
                          >
                           {creatingAppointment ? "creating..." : "I Understand & Accept"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <DialogHeader className="text-center pb-4">
                          <DialogTitle className="text-2xl">Book Your Appointment</DialogTitle>
                          <p className="text-gray-600">with {employeeProfile.name}</p>
                        </DialogHeader>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleAppointment)} className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <FormField
                                  control={form.control}
                                  name="timeRequired"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Hours Needed</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="1"
                                          max="24"
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(Number(e.target.value))
                                            setIsAutoPrice(true)
                                          }}
                                          className="text-center text-lg font-semibold"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div>
                                  <Label>Base Cost</Label>
                                  <div className="relative mt-2">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                      value={actualPrice}
                                      disabled
                                      className="pl-10 text-center text-lg font-bold text-green-600"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="text-center p-3 bg-white rounded border">
                                <p className="text-sm text-gray-600">
                                  <Clock className="w-4 h-4 inline mr-1" />${employeeProfile.hourlyRate}/hour × {timeRequired} hours =
                                  <span className="font-bold text-green-600 ml-1">${actualPrice}</span>
                                </p>
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name="offeredPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Offer</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                      <Input
                                        type="number"
                                        min="1"
                                        {...field}
                                        onChange={handlePriceChange}
                                        className="pl-10 text-center text-lg font-semibold"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                  {validationError && (
                                    <p className="text-sm text-red-600 mt-2 flex items-center">
                                      <AlertCircle className="w-4 h-4 mr-1" />
                                      {validationError}
                                    </p>
                                  )}
                                  {!isAutoPrice && (
                                    <p className="text-sm text-blue-600 mt-2 flex items-center">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Custom price set. Will reset to auto-calculated price after 5 seconds.
                                    </p>
                                  )}
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="deadline"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Project Deadline</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us about your project, requirements, and any special instructions..."
                                      {...field}
                                      rows={4}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              className="w-full py-4 text-lg"
                              disabled={form.formState.isSubmitting}
                            >
                              {form.formState.isSubmitting ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>Send Request (${form.watch("offeredPrice") || 0})</>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <Separator className="my-6" />
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:h-fit">
          <Card>
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Recent Requests
              </CardTitle>
              <p className="text-sm text-gray-600">{totalAppointments} total appointments</p>
            </CardHeader>
            <CardContent className="p-4">
              {appointments.length ? (
                <div className="space-y-4">
                  {appointments.map((appointment: any) => (
                    <div
                      key={appointment._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={getStatusColor(appointment.requestStatus)}>
                          {appointment.requestStatus.replace("-", " ").toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${appointment.offeredPrice}</div>
                          <div className="text-xs text-gray-500">offered</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{appointment.timeRequired}h</span>
                          </div>
                          <span className="text-xs">{new Date(appointment.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          <span className="text-xs">
                            Due: {new Date(appointment.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalAppointments > 5 && (
                    <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700">
                      View All {totalAppointments} Requests
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No requests yet</p>
                  <p className="text-sm text-gray-500">Be the first to book {employeeProfile.name}!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomerEmployeeIdCompo