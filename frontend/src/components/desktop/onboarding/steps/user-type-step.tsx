"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingData } from "@/lib/types/onboarding/types/types"
import { Users, Briefcase, ArrowLeft } from "lucide-react"

interface UserTypeStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function UserTypeStep({ data, updateData, onNext, onBack }: UserTypeStepProps) {
  const handleUserTypeSelect = (userType: "customer" | "employee") => {
    if (userType === 'customer') {
      updateData({ userType, employeeProfile: null })
    } else {
      updateData({ userType })
    }
    onNext()
  }

  return (
    <Card className="border-green-200 shadow-lg bg-[#242626]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Choose Your Role</CardTitle>
        <CardDescription className="text-white">
          Are you looking to hire services or provide services?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Card
            className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all"
            onClick={() => handleUserTypeSelect("customer")}
          >
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-[#21c063] mr-4" />
              <div>
                <h3 className="font-semibold text-[#21c063]">Customer</h3>
                <p className="text-sm text-[#21c063]">I want to hire services</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all"
            onClick={() => handleUserTypeSelect("employee")}
          >
            <CardContent className="flex items-center p-6">
                <Briefcase className="h-8 w-8 text-[#21c063] mr-4" />
              <div>
                <h3 className="font-semibold text-[#21c063]">Service Provider</h3>
                <p className="text-sm text-[#21c063]">I want to offer my services</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button variant="outline" onClick={onBack} className=" text-[#21c063] w-full border-green-300  hover:bg-green-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </CardContent>
    </Card>
  )
}
