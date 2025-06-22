"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { EmployeeProfile, OnboardingData } from "@/lib/types/onboarding/types/types"
import { employeeProfileSchema } from "@/lib/types/onboarding/schema/user-validation"

interface EmployeeProfileStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export const jobCategories = [
  "Technology",
  "Healthcare",
  "Education",
  "Construction",
  "Hospitality",
  "Transportation",
  "Cleaning",
  "Beauty & Wellness",
  "Home Services",
  "Other",
]

export function EmployeeProfileStep({ data, updateData, onNext, onBack }: EmployeeProfileStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const employeeProfile = data.employeeProfile || {
    jobCategory: "",
    skills: "",
    hourlyRate: 0,
    rating: 0,
    userId: "",
    completedJobs: 0,
    verificationStatus: "pending",
  }

  const handleInputChange = (field: keyof EmployeeProfile, value: string | number) => {
    const updatedProfile = { ...employeeProfile, [field]: value }
    updateData({ employeeProfile: updatedProfile })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleNext = () => {
    const result = employeeProfileSchema.safeParse(employeeProfile)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        const path = error.path.join(".")
        newErrors[path] = error.message
      })
      setErrors(newErrors)
      return
    }

    setErrors({})
    onNext()
  }

  return (
    <Card className="border-green-200 shadow-lg bg-[#242626] text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Service Provider Profile</CardTitle>
        <CardDescription className="text-white">Tell us about your professional background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
              <Label htmlFor="jobCategory" className="text-white">
            Job Category
          </Label>
          <Select
            value={employeeProfile.jobCategory}
            onValueChange={(value) => handleInputChange("jobCategory", value)}
            
          >
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue placeholder="Select your job category" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {jobCategories.map((category) => (
                <SelectItem key={category} value={category} className="text-green-800 focus:bg-green-50 w-full">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.jobCategory && <p className="text-sm text-red-500">{errors.jobCategory}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="skills" className="text-white">
            Skills
          </Label>
          <Textarea
            id="skills"
            placeholder="Describe your skills and expertise"
            value={employeeProfile.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            className="border-green-300 focus:border-green-500 min-h-[100px]"
          />
          {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-white">
            Hourly Rate ($)
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter your hourly rate"
            value={employeeProfile.hourlyRate || ""}
            onChange={(e) => handleInputChange("hourlyRate", Number.parseFloat(e.target.value) || 0)}
            className="border-green-300 focus:border-green-500"
          />
          {errors.hourlyRate && <p className="text-sm text-red-500">{errors.hourlyRate}</p>}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
