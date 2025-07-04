import mongoose, { Schema } from "mongoose";


const rejectedSchema  = new Schema({
  
    employeeId : {
        type :  String,
        required : true,
    },
    customerId : {
        type :  String,
        required : true,
    },
    offeredPrice : {
        type : Number,
        required : true,
    }
},{
    timestamps : true
});


export const RejectedAppointments = mongoose.models.RejectedAppointments || mongoose.model("RejectedAppointments", rejectedSchema);