"use client"

import { Star, MapPin, Clock, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Employee {
  _id: string
  name: string
  image: string
  location: {
    address: string
  }
  jobCategory: string
  skills: string
  hourlyRate: number
  rating: number
  completedJobs: number
  availability: string
  experience: string
}

interface EmployeeCardProps {
  employee: Employee
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-500"
      case "Busy":
        return "bg-red-500"
      case "Away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-[#3A3C3C] bg-[#2F3131] rounded-lg overflow-hidden hover:scale-105 hover:border-[#25D366]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={employee.image || "/placeholder.svg"}
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#25D366]"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2F3131] ${getAvailabilityColor(employee.availability)}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-[#E8E8E8]">{employee.name}</h3>
            <p className="text-sm text-[#B0B0B0] flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#25D366]" />
              {employee.location.address}
            </p>
            <p className="text-xs text-[#B0B0B0] flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-[#25D366]" />
              {employee.availability}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]">{employee.jobCategory}</Badge>
            <Badge variant="outline" className="border-[#3A3C3C] text-[#B0B0B0]">
              <Briefcase className="h-3 w-3 mr-1" />
              {employee.experience}
            </Badge>
          </div>

          <p className="text-sm text-[#B0B0B0] line-clamp-2">{employee.skills}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-[#E8E8E8]">{employee.rating}</span>
              <span className="text-[#B0B0B0]">({employee.completedJobs} jobs)</span>
            </div>
            <div className="font-semibold text-[#25D366]">${employee.hourlyRate}/hr</div>
          </div>

          <Button className="w-full mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white">View Profile</Button>
        </div>
      </CardContent>
    </Card>
  )
}
