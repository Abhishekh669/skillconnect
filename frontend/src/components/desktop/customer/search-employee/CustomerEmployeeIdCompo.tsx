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

  const { data: employeeProfile, isLoading: employeeProfileLoading } = useGetEmployeeProfile(employeeId)
  const { data: appointmentData, isLoading: appointmentDataLoading } = useGetAppointmentForCustomer(employeeId)

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      timeRequired: 1,
      offeredPrice: 0,
      description: "",
    },
  })

  const timeRequired = form.watch("timeRequired")

  useEffect(() => {
    if (employeeProfile?.hourlyRate && timeRequired) {
      const calculatedPrice = employeeProfile.hourlyRate * timeRequired
      setActualPrice(calculatedPrice)
      if (form.getValues("offeredPrice") === 0) {
        form.setValue("offeredPrice", calculatedPrice)
      }
    }
  }, [timeRequired, employeeProfile?.hourlyRate, form])

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
    console.log({
      ...formValues,
      actualPrice,
      employeeId,
    })
    setShowDisclaimer(false)
    setDialogOpen(false)
    form.reset()
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
    <div className="bg-[#161717] min-h-screen">
      {/* Custom scrollbar styles */}
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

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            <span className="hover:text-[#21c063] cursor-pointer transition-colors">Search Employees</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-white">{employeeProfile.name}</span>
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Profile & Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden shadow-xl border border-[#242626] bg-[#242626]">
              <div className="bg-gradient-to-r from-[#21c063] to-emerald-600 h-20"></div>
              <CardContent className="relative p-6 -mt-10">
                {/* ... (rest of the profile card content remains the same) ... */}
              </CardContent>
            </Card>

            {/* Booking Section */}
            <Card className="shadow-xl border border-[#242626] bg-[#242626]">
              <CardHeader className="bg-[#21c063]/10 border-b border-[#21c063]/20">
                <CardTitle className="text-xl text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#21c063]" />
                  Book an Appointment
                </CardTitle>
                <p className="text-gray-400">
                  Ready to work with <span className="font-semibold text-[#21c063]">{employeeProfile.name}</span>?
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Dialog open={dialogOpen} onOpenChange={(open) => {
                    if (!open) {
                      setShowDisclaimer(false)
                    }
                    setDialogOpen(open)
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="px-8 py-3 text-lg bg-[#21c063] hover:bg-[#21c063]/90 shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-white"
                      >
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto bg-[#242626] border border-gray-600 text-white">
                      {showDisclaimer ? (
                        <div className="space-y-6">
                          <DialogHeader className="text-center pb-4">
                            <DialogTitle className="text-2xl text-white">Legal Disclaimer</DialogTitle>
                          </DialogHeader>
                          
                          <Alert variant="destructive" className="border-red-600 bg-red-900/20">
                            <AlertCircle className="h-5 w-5" />
                            <AlertTitle className="text-lg">Important Legal Notice</AlertTitle>
                            <AlertDescription className="mt-2 space-y-2 text-red-200">
                              <p>
                                You are about to submit an offer of <span className="font-bold">${formValues?.offeredPrice}</span> for this service.
                              </p>
                              <p>
                                By proceeding, you acknowledge that:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>You are making this offer in good faith</li>
                                <li>The amount reflects your genuine intention to pay</li>
                                <li>You have the financial means to fulfill this obligation</li>
                              </ul>
                              <p className="font-bold">
                                If the employee claims you have entered a fraudulent offer price:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>You may face legal action</li>
                                <li>You may be fined up to $1000</li>
                                <li>You may face potential jail time</li>
                              </ul>
                            </AlertDescription>
                          </Alert>

                          <div className="flex gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 py-3 bg-transparent border-gray-600 hover:bg-gray-700"
                              onClick={() => setShowDisclaimer(false)}
                            >
                              Go Back
                            </Button>
                            <Button
                              type="button"
                              className="flex-1 py-3 bg-[#21c063] hover:bg-[#21c063]/90"
                              onClick={handleFinalSubmission}
                            >
                              I Understand & Accept
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <DialogHeader className="text-center pb-4">
                            <DialogTitle className="text-2xl text-white">Book Your Appointment</DialogTitle>
                            <p className="text-gray-400">with {employeeProfile.name}</p>
                          </DialogHeader>

                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAppointment)} className="space-y-6">
                              {/* Time and Cost Calculator */}
                              <div className="bg-[#21c063]/10 p-6 rounded-lg border border-[#21c063]/20">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <FormField
                                    control={form.control}
                                    name="timeRequired"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-300">Hours Needed</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="1"
                                            max="24"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="text-center text-lg font-semibold bg-[#161717] border-gray-600 text-white focus:border-[#21c063]"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                      </FormItem>
                                    )}
                                  />
                                  <div>
                                    <Label className="text-sm font-medium text-gray-300">Base Cost</Label>
                                    <div className="relative mt-2">
                                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                      <Input
                                        value={actualPrice}
                                        disabled
                                        className="bg-[#161717] border-gray-600 pl-10 text-center text-lg font-bold text-[#21c063]"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="text-center p-3 bg-[#161717] rounded-lg border border-gray-600">
                                  <p className="text-sm text-gray-300">
                                    <Clock className="w-4 h-4 inline mr-1" />${employeeProfile.hourlyRate}/hour ×{" "}
                                    {timeRequired} hours =
                                    <span className="font-bold text-[#21c063] ml-1">${actualPrice}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Your Offer */}
                              <FormField
                                control={form.control}
                                name="offeredPrice"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300">Your Offer</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                          type="number"
                                          min="1"
                                          {...field}
                                          onChange={(e) => field.onChange(Number(e.target.value))}
                                          className="pl-10 text-center text-lg font-semibold bg-[#161717] border-gray-600 text-white focus:border-[#21c063]"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                    {validationError && (
                                      <p className="text-sm text-red-400 mt-2 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {validationError}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />

                              {/* Deadline */}
                              <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="text-sm font-medium text-gray-300">Project Deadline</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full pl-3 text-left font-normal bg-[#161717] border-gray-600 text-white hover:bg-[#161717] hover:text-white",
                                              !field.value && "text-muted-foreground",
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
                                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage className="text-red-400" />
                                  </FormItem>
                                )}
                              />

                              {/* Description */}
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300">
                                      Project Description
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Tell us about your project, requirements, and any special instructions..."
                                        {...field}
                                        rows={4}
                                        className="bg-[#161717] border-gray-600 text-white focus:border-[#21c063] placeholder:text-gray-500"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                  </FormItem>
                                )}
                              />

                              <Button
                                type="submit"
                                className="w-full py-4 text-lg bg-[#21c063] hover:bg-[#21c063]/90 shadow-lg border-0 text-white"
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

                {/* Quick Contact Options */}
                <Separator className="my-6 bg-gray-600" />
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-[#161717] border-gray-600 text-gray-300 hover:bg-[#242626] hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-[#161717] border-gray-600 text-gray-300 hover:bg-[#242626] hover:text-white"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-[#161717] border-gray-600 text-gray-300 hover:bg-[#242626] hover:text-white"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Appointments */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-90px)]">
            <Card className="shadow-xl border border-[#242626] bg-[#242626] h-full flex flex-col">
              <CardHeader className="bg-orange-500/10 border-b border-orange-500/20">
                <CardTitle className="text-lg text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-400" />
                  Recent Requests
                </CardTitle>
                <p className="text-sm text-gray-400">{totalAppointments} total appointments</p>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto">
                {appointments.length ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appointment: any) => (
                      <div
                        key={appointment._id}
                        className="border border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-[#21c063]/50 bg-[#161717]"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <Badge className={`text-xs px-2 py-1 ${getStatusColor(appointment.requestStatus)}`}>
                            {appointment.requestStatus.replace("-", " ").toUpperCase()}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#21c063]">${appointment.offeredPrice}</div>
                            <div className="text-xs text-gray-500">offered</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between text-gray-400">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{appointment.timeRequired}h</span>
                            </div>
                            <span className="text-xs">{new Date(appointment.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center text-gray-400">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-xs">
                              Due: {new Date(appointment.deadline).toLocaleDateString()}
                            </span>
                          </div>

                          {appointment.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{appointment.description}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {totalAppointments > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-[#21c063] hover:text-[#21c063]/80 hover:bg-[#21c063]/10"
                      >
                        View All {totalAppointments} Requests
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No requests yet</p>
                    <p className="text-sm text-gray-500">Be the first to book {employeeProfile.name}!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerEmployeeIdCompo