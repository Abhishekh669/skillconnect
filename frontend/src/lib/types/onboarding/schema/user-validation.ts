import { jobCategories } from "@/components/desktop/onboarding/steps/employee-profile"
import { z } from "zod"

export const basicInfoSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    coordinate: z.tuple([z.number(), z.number()]),
  }),
})

export const employeeProfileSchema = z.object({
  jobCategory: z.enum(jobCategories as [string, ...string[]]),
  skills: z.string().min(10, "Skills description must be at least 10 characters"),
  hourlyRate: z.number().min(1, "Hourly rate must be greater than 0"),
  rating: z.number().min(0).max(5).default(0),
  userId: z.string().default(""),
  completedJobs: z.number().min(0).default(0),
})
