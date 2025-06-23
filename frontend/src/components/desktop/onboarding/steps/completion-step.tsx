"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser } from "@/lib/actions/user/post/user.post"
import { OnboardingData } from "@/lib/types/onboarding/types/types"
import { CheckCircle, ArrowLeft, User, MapPin, Phone, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface CompletionStepProps {
  data: OnboardingData
  onBack: () => void
}

export function CompletionStep({ data, onBack }: CompletionStepProps) {
  const router = useRouter();
  const handleComplete = async() => {
      const response = await createUser(data);
      if(response.success && response.message ){
        toast.success(response.message || "User created successfully");
        router.push(`${response.user.userRole}/dashboard`);
        return;
      }else if(!response.success && response.error){
        toast.error(response.error || "Failed to create user"); 
      }
  }

  return (
    <Card className="border-green-200 shadow-lg  bg-[#242626]">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-800">Almost Done!</CardTitle>
        <CardDescription className="text-green-600">Please review your information before completing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{data.username}</p>
              <p className="text-sm text-green-600">Username</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Phone className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{data.phoneNumber}</p>
              <p className="text-sm text-green-600">Phone Number</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{data.location.address}</p>
              <p className="text-sm text-green-600">Location</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Briefcase className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 capitalize">{data.userType}</p>
              <p className="text-sm text-green-600">Account Type</p>
            </div>
          </div>

          {(data.userType =='employee' && data.employeeProfile) && (
            <div className="space-y-2 p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Service Provider Details</h4>
              <div className="text-sm text-green-600 space-y-1">
                <p>
                  <span className="font-medium">Category:</span> {data.employeeProfile.jobCategory}
                </p>
                <p>
                  <span className="font-medium">Hourly Rate:</span> ${data.employeeProfile.hourlyRate}
                </p>
                <p>
                  <span className="font-medium">Skills:</span> {data.employeeProfile.skills}
                </p>
              </div>
            </div>
          )}
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
          <Button onClick={handleComplete} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            Complete Onboarding
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
