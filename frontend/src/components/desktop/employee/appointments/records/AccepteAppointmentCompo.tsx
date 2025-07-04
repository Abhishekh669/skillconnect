"use client"

import { useAppointmentId } from "@/lib/hooks/params/use-appintment-idd"
import { useGetEmployeeAppointmentRecordById } from "@/lib/hooks/tanstack/query-hook/appointments/use-get-appointment-by-id"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, FileText, CheckCircle, User, Mail, MapPin, CircleChevronLeft, ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useUpdateAppointmentSTatus } from "@/lib/hooks/tanstack/mutate-hook/appointment/records/update-records"
import Link from "next/link"

function AcceptedAppointmentCompo() {
  const appointmentId = useAppointmentId()
  const { data, isLoading: appointmentLoading, isError, error } = useGetEmployeeAppointmentRecordById(appointmentId)
  const [workStatus, setWorkStatus] = useState<"pending" | "progress" | "done">(
    data?.appointment?.workStatus || "pending",
  )
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentSTatus()

  useEffect(() => {
    if (data?.appointment?.workStatus) {
      setWorkStatus(data.appointment.workStatus)
    }
  }, [data?.appointment?.workStatus])

  const handleStatusChange = (newStatus: "pending" | "progress" | "done") => {
    setWorkStatus(newStatus)
  }

  const handleUpdateStatus = async () => {
    if (!workStatus) return
    if (workStatus === data?.appointment.workStatus) {
      toast.error("Please change the status to proceed")
      return
    }

    updateStatus(
      { appointmentId, status: workStatus },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message || "Status updated successfully")
          } else if (res.error) {
            toast.error((res.error as string) || "Failed to update status")
          }
        },
        onError: () => {
          toast.error("Something went wrong while updating status")
        },
      },
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (appointmentLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <FileText className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-center">Failed to load appointment</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error?.message || "An error occurred while loading the appointment details"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relatvie max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="absolute  left-4 ">
        <Link href={"/employee/job-records"}>
        <Button className="bg-white text-black hover:text-black hover:bg-white">
          <ChevronLeft />
          go back
        </Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Appointment Details</h1>
          <p className="text-muted-foreground text-sm break-all">ID: {data?.appointment._id}</p>
        </div>
        <Badge className={`${getStatusColor(data?.appointment.requestStatus)} shrink-0`}>
          {data?.appointment.requestStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          {/* Description Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 shrink-0" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed break-words">
                {data?.appointment.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 shrink-0" />
                Pricing & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">Offered Price</p>
                  <p className="text-xl sm:text-2xl font-bold">${data?.appointment.offeredPrice}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">Actual Price</p>
                  <p className="text-xl sm:text-2xl font-bold">${data?.appointment.actualPrice}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="font-semibold">${data?.appointment.companyCommissionPrice}</p>
                </div>
                <Badge variant={data?.appointment.commissionStatus ? "default" : "secondary"} className="w-fit">
                  {data?.appointment.commissionStatus ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium shrink-0">Work Status:</span>
                  <Badge className={`${getStatusColor(data?.appointment.workStatus)} w-fit`}>
                    {data?.appointment.workStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Select value={workStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder={workStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || workStatus === data?.appointment.workStatus}
                    className="w-full sm:w-auto"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Info */}
        <div className="space-y-4 sm:space-y-6 min-w-0">
          {/* Customer Details Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 shrink-0" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {data?.userData?.image && (
                  <Image
                    src={data.userData.image || "/placeholder.svg"}
                    alt="Customer profile"
                    width={64}
                    height={64}
                    className="rounded-full shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate">{data?.userData?.username}</h3>
                  <p className="text-sm text-muted-foreground truncate">{data?.userData?.userRole}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm break-all">{data?.userData?.email}</p>
                </div>
                {data?.userData?.location?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm break-words">{data.userData.location.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 shrink-0" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium text-sm break-words">{formatDate(data?.appointment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium text-sm break-words">{formatDate(data?.appointment.updatedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium text-red-600 text-sm break-words">{formatDate(data?.appointment.deadline)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 shrink-0" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Time Required</p>
                <p className="font-medium">{data?.appointment.timeRequired} hour(s)</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Customer ID</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{data?.appointment.customerId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{data?.appointment.employeeId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AcceptedAppointmentCompo
