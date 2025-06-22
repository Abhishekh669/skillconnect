"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { OnboardingData } from "@/lib/types/onboarding/types/types"
import { basicInfoSchema } from "@/lib/types/onboarding/schema/user-validation"
import toast from "react-hot-toast"

interface BasicInfoStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    updateData({ [field]: value })

    const errorKey = field === "location" ? "location.address" : field
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }))
    }
  }

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
     toast.error("geo-location not supported")
      return
    }

    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`,
          )
          const geocodeData = await response.json()

          let address = "Current Location"
          if (geocodeData.results && geocodeData.results.length > 0) {
            address = geocodeData.results[0].formatted
          }

          updateData({
            location: {
              address,
              coordinate: [longitude, latitude],
            },
          })

         toast.success('location updated')
        } catch (error) {
          console.error("Geocoding error:", error)
          updateData({
            location: {
              address: "Current Location",
              coordinate: [longitude, latitude],
            },
          })
          toast.success("location set successfully")
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        toast.error("failed to get location")
      },
    )
  }

  const handleNext = () => {
    const result = basicInfoSchema.safeParse({
      username: data.username,
      phoneNumber: data.phoneNumber,
      location: data.location,
    })

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
    <Card className=" bg-[#242626] border-none text-white text-shadow-emerald-600  h-[auto] shadow-emerald-600">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome!</CardTitle>
        <CardDescription className="text-white">Let's get started with your basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={data.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="border-green-300 focus:border-green-500"
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={data.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="border-green-300 focus:border-green-500"
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-white">
            Location Address
          </Label>
          <div className="flex gap-2">
            <Input
              id="address"
              placeholder="Enter your address"
              value={data.location.address}
              onChange={(e) => handleInputChange("location", { ...data.location, address: e.target.value })}
              className="border-green-300 focus:border-green-500 flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="border-green-300 text-white hover:bg-green-50"
            >
              {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4 text-green-600" />}
            </Button>
          </div>
          {errors["location.address"] && <p className="text-sm text-red-500">{errors["location.address"]}</p>}
          {data.location.coordinate[0] !== 0 && data.location.coordinate[1] !== 0 && (
            <p className="text-xs text-white">
              Coordinates: {data.location.coordinate[1].toFixed(6)}, {data.location.coordinate[0].toFixed(6)}
            </p>
          )}
        </div>

        <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700 text-white">
          Next
        </Button>
      </CardContent>
    </Card>
  )
}
