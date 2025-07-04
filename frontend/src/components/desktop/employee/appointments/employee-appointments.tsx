"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, User, AlertTriangle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useGetAppointmentOfEmployee } from "@/lib/hooks/tanstack/query-hook/employee/useGetAppointmentOfEmployee"
import { scheduleAppointments } from "@/lib/utils/job-sequencing"
import { AppointmentSchema } from "@/lib/types/appointment/appointment.types"
import { useEmployeePaymentStore } from "@/lib/store/employee/payment/use-payment-store"
import { useRouter } from "next/navigation"


const getStatusText = (status: "accepted" | "rejected" | "not-responded") => {
  switch (status) {
    case "accepted":
      return "On Progress";
      break;
    case "rejected":
      return "Request Rejected";
      break;
    case "not-responded":
      return "Respont to Request";
      break;
    default:
      return "Something went wrong";
      break;

  }
}

type FilterType = "all" | "date" | "maxProfit" | "giveMaxProfit"

function EmployeeAppointments() {
  const { data: appointmentData, isLoading: appointmentDataLoading } = useGetAppointmentOfEmployee()
  const [filteredAppointmentData, setFilteredAppointmentData] = useState<AppointmentSchema[]>([])
  const {setAppointmentId, setAmountData} = useEmployeePaymentStore()
  const [originalData, setOriginalData] = useState<AppointmentSchema[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [totalProfit, setTotalProfit] = useState(0)
  const rotuer = useRouter()

  useEffect(() => {
    if (appointmentDataLoading) return
    if (appointmentData && appointmentData?.appointments.length > 0) {
      setOriginalData(appointmentData?.appointments)
      setFilteredAppointmentData(appointmentData?.appointments)
      calculateTotalProfit(appointmentData?.appointments)
    }
  }, [appointmentDataLoading, appointmentData])

  const calculateTotalProfit = (appointments: AppointmentSchema[]) => {
    const total = appointments.reduce((sum, appointment) => sum + appointment.offeredPrice, 0)
    setTotalProfit(total)
  }

  const applyFilter = (filterType: FilterType) => {
    setActiveFilter(filterType)
    let filtered = [...originalData] // Fix: use originalData

    switch (filterType) {
      case "all":
        filtered = originalData // Fix: use originalData
        break
      case "date":
        filtered = originalData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "maxProfit":
        filtered = originalData.sort((a, b) => b.offeredPrice - a.offeredPrice)
        break
      case "giveMaxProfit":
        const scheduledData = scheduleAppointments(originalData) // Fix: use originalData
        filtered = scheduledData.scheduled
        console.log("Optimized schedule:", scheduledData)
        break
    }

    setFilteredAppointmentData(filtered)
    calculateTotalProfit(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-responded":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "accepted":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getWorkStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "done":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const isDeadlinePassed = (deadline: Date) => {
    return new Date(deadline) < new Date()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAcceptRequest = async(id : string, offeredAmount : number, commissionAmount : number) =>{
      if(!id)return;
      setAppointmentId(id);
      setAmountData({
        offeredAmount : offeredAmount,
        commissionAmount
      })
      rotuer.push("/employee/payment");

  }

  if (appointmentDataLoading) {
    return (
      <div className="min-h-screen bg-[#161717] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">


        <Card className="bg-[#262727] border-gray-600 shadow-2xl">
          <CardHeader className="text-white text-lg font-bold">
            Employee Appointments
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[#161717] rounded-xl border border-gray-600">
                <div className="text-3xl font-bold text-green-400 mb-2">{filteredAppointmentData.length}</div>
                <div className="text-sm text-gray-300 font-medium">Total Appointments</div>
              </div>
              <div className="text-center p-6 bg-[#161717] rounded-xl border border-gray-600">
                <div className="text-3xl font-bold text-green-400 mb-2">${totalProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-300 font-medium">Total Potential Profit</div>
              </div>
              <div className="text-center p-6 bg-[#161717] rounded-xl border border-gray-600">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {filteredAppointmentData.filter((apt) => !isDeadlinePassed(apt.deadline)).length}
                </div>
                <div className="text-sm text-gray-300 font-medium">Active Appointments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => applyFilter("all")}
            className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 font-medium ${activeFilter === "all"
                ? "bg-green-400 hover:bg-green-200 text-black shadow-lg shadow-green-400/20"
                : "bg-[#262727] hover:bg-[#363737] text-white border-gray-600 hover:border-green-400"
              }`}
          >
            <CheckCircle className="h-4 w-4" />
            All Appointments
          </Button>
          <Button
            variant={activeFilter === "date" ? "default" : "outline"}
            onClick={() => applyFilter("date")}
            className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 font-medium ${activeFilter === "date"
                ? "bg-green-400 hover:bg-green-200 text-black shadow-lg shadow-green-400/20"
                : "bg-[#262727] hover:bg-[#363737] text-white border-gray-600 hover:border-green-400"
              }`}
          >
            <Calendar className="h-4 w-4" />
            Sort by Date
          </Button>
          <Button
            variant={activeFilter === "maxProfit" ? "default" : "outline"}
            onClick={() => applyFilter("maxProfit")}
            className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 font-medium ${activeFilter === "maxProfit"
                ? "bg-green-400 hover:bg-green-200 text-black shadow-lg shadow-green-400/20"
                : "bg-[#262727] hover:bg-[#363737] text-white border-gray-600 hover:border-green-400"
              }`}
          >
            <DollarSign className="h-4 w-4" />
            Max Profit First
          </Button>
          <Button
            variant={activeFilter === "giveMaxProfit" ? "default" : "outline"}
            onClick={() => applyFilter("giveMaxProfit")}
            className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 font-medium ${activeFilter === "giveMaxProfit"
                ? "bg-green-400 hover:bg-green-200 text-black shadow-lg shadow-green-400/20"
                : "bg-[#262727] hover:bg-[#363737] text-white border-gray-600 hover:border-green-400"
              }`}
          >
            <DollarSign className="h-4 w-4" />
            Optimize Schedule
          </Button>
        </div>

        {/* Appointments Grid */}
        {filteredAppointmentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointmentData.map((appointment, index) => (
              <Card
                key={appointment._id}
                className={`hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${isDeadlinePassed(appointment.deadline)
                    ? "bg-red-900/20 border-red-500/50 shadow-red-500/20"
                    : "bg-[#262727] border-gray-600 hover:border-green-400/50 shadow-xl"
                  }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Appointment #{index + 1}</CardTitle>
                    {isDeadlinePassed(appointment.deadline) && <AlertTriangle className="h-5 w-5 text-red-400" />}
                  </div>
                  <CardDescription className="text-sm text-gray-300 line-clamp-2">
                    {appointment.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price Information */}
                  <div className="bg-green-400/10 p-4 rounded-lg border border-green-400/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-300">Offered Price</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${appointment.offeredPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-green-300">Commission</span>
                      <span className="text-sm text-green-300">
                        ${appointment.companyCommissionPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getStatusColor(appointment.requestStatus)} font-medium`}>
                      {appointment.requestStatus.replace("-", " ")}
                    </Badge>
                    <Badge className={`${getWorkStatusColor(appointment.workStatus)} font-medium`}>
                      {appointment.workStatus}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span>Time Required: {appointment.timeRequired}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className={isDeadlinePassed(appointment.deadline) ? "text-red-400 font-medium" : ""}>
                        Deadline: {formatDate(appointment.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="h-4 w-4 text-green-400" />
                      <span>Customer: {appointment.customerId.slice(-8)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-between">
                    <Button
                    className={` mt-4 transition-all duration-300 font-medium bg-red-400 hover:bg-red-200 text-black shadow-lg shadow-green-400/20"
                      }`}
                    disabled={isDeadlinePassed(appointment.deadline)}
                  >
                   Reject the request
                  </Button>
                  <Button
                    className={`mt-4 transition-all duration-300 font-medium bg-green-400 hover:bg-green-200 text-black shadow-lg shadow-green-400/20"}`}
                    // disabled={isDeadlinePassed(appointment.deadline)}
                    onClick={()=> handleAcceptRequest(appointment._id, appointment.offeredPrice, appointment.companyCommissionPrice)}
                  >
                   Respond to request
                  </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-[#262727] border-gray-600 shadow-xl">
            <CardContent>
              <div className="text-white text-xl mb-2">No appointments found</div>
              <div className="text-gray-400 text-sm">Try adjusting your filters</div>
            </CardContent>
          </Card>
        )}

        {/* Active Filter Indicator */}
        {activeFilter !== "all" && (
          <div className="text-center pb-8">
            <Badge
              variant="outline"
              className="text-sm bg-[#262727] text-green-400 border-green-400/50 px-4 py-2 font-medium"
            >
              Active Filter: {activeFilter === "giveMaxProfit" ? "Optimized Schedule" : activeFilter}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeAppointments
