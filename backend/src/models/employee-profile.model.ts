import mongoose, { Schema } from "mongoose";
import { jobCategories } from "../lib/data";


const employeeProfileSchema = new Schema({
    jobCategory: {
        type: String,
        required: true,
        enum: jobCategories
    },
    skills: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    userId: {
        type: String,
        required: true
    },
    completedJobs: {
        type: Number,
        required: true,
        min: 0
    },
    
},{
    timestamps: true,
})


export  const EmployeeProfile = mongoose.models.EmployeeProfile || mongoose.model("EmployeeProfile", employeeProfileSchema);


