import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    employeeId: {
       type : String, 
       required : true,
    },
    appointmentId : {
        type : String,
        required : true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionCode : {
        type : String
    },
    paymentMethod : {
        type: String,
        required: true,
        enum: ["khalti", "esewa"]
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentDate : {
        type : Date,
        default : Date.now,
    }
}, {
    timestamps: true,
});
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);