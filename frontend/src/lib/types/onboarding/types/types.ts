import type { z } from "zod"
import { basicInfoSchema, employeeProfileSchema } from "../schema/user-validation"

export type BasicInfo = z.infer<typeof basicInfoSchema>

export type EmployeeProfile = z.infer<typeof employeeProfileSchema>

export interface OnboardingData {
  username: string
  phoneNumber: string
  location: {
    address: string
    coordinate: [number, number] // [longitude, latitude]
  }
  userType: "customer" | "employee"
  employeeProfile: EmployeeProfile | null
}

