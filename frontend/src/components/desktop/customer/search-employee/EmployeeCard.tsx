"use client"

import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Employee } from "@/lib/actions/user/customer/get/user.customer.get"
import Image from "next/image"

interface EmployeeCardProps {
  employee: Employee,

}

export default function EmployeeCard({ employee }: EmployeeCardProps) {

  return (
    <Card className="hover:shadow-xl overflow-hidden border border-gray-700 bg-[#242626] backdrop-blur-sm hover:border-[#21c063]/50 group transition-all duration-300 hover:shadow-[#21c063]/10">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Image
              src={employee.image || "/placeholder.svg"}
              alt={employee.name}
              width={300}
              height={300}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#21c063] group-hover:border-[#21c063] transition-colors"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#21c063] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-white group-hover:text-[#21c063] transition-colors">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-300">{employee.jobTitle}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-[#21c063] text-[#21c063]" />
              <span className="font-medium text-white">{employee.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 ml-1">rating</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Badge className="bg-[#21c063]/20 text-[#21c063] border border-[#21c063]/30 hover:bg-[#21c063]/30 transition-colors">
            {employee.jobCategory}
          </Badge>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="h-4 w-4 text-[#21c063] flex-shrink-0" />
            <span className="truncate">{employee.location.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
          <div className="text-left">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Hourly Rate</span>
            <div className="font-bold text-xl text-[#21c063]">${employee.hourlyRate}/hr</div>
          </div>
          <Link href={`/customer/search-employee/employee/${employee._id}`} passHref>
            <Button
              className="bg-[#21c063] hover:bg-[#21c063]/90 text-white border-none shadow-lg hover:shadow-[#21c063]/25 transition-all duration-200 font-medium"
              size="sm"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
