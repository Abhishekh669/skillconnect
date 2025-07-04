import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
 
  customerId: {
    type: String,
    required: true,
    index: true, // For faster lookups by customer
  },
  employeeProfileId : {
    type : String,
    required : true,
  },
  employeeId: {
    type : String,
    required: true,
    index: true, // For employee-specific appointment queries
  },
  actualPrice: {
    type: Number,
    required: true,
  },
  offeredPrice: {
    type: Number,
    required: true,
  },
  companyCommissionPrice: {
    type: Number,
    required: true,
  },
   commissionStatus: {
    type: Boolean, 
    required: true,
    default : false,
    index: true,
  }
  ,
  timeRequired: {
    type: Number, // Time unit can be minutes or hours
    required: true,
  },

  deadline: {
    type: Date,
    required: true,
    index: true, // Helps with sorting/filtering upcoming appointments
  },
 
  requestStatus: {
    type: String,
    enum: ["accepted", "rejected", "not-responded"],
    required: true,
    default : 'not-responded',
    index: true,
  },
  
  workStatus : {
    type : String, 
    enum : ['pending','progress', 'done'],
    default : 'pending'
  },

  workFixedDate : {
    type : Date,

  },

  description : {
    type : String, 
    required : true,
  },
   createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Good for sorting or pagination
  },

 
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

// Compound Indexes for combined filtering
appointmentSchema.index({ employeeId: 1, status: 1 });
appointmentSchema.index({ status: 1, deadline: 1 });
appointmentSchema.index({ offeredPrice : 1 , employeeProfileId : 1});
appointmentSchema.index({_id : 1, employeeId : 1})

export const Appointment = model("Appointment", appointmentSchema);
