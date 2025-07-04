import mongoose, { Schema } from "mongoose";
import { jobCategories } from "../lib/data";


const employeeProfileSchema = new Schema({
     workerStatus : {type : Boolean, required : true, default : true},
    name: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
        },
        coordinates: {
            type: [Number],
        },
        address: {
            type: String,
            required: true,
        }
    },

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

}, {
    timestamps: true,
})



employeeProfileSchema.index({ location: '2dsphere' });
employeeProfileSchema.index({ userId: 1 });
employeeProfileSchema.index({
    jobCategory: 1,
    skills: 1,
    hourlyRate: 1
});




export const EmployeeProfile = mongoose.models.EmployeeProfile || mongoose.model("EmployeeProfile", employeeProfileSchema);


