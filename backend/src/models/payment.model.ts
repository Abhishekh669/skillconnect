import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
        default: "esewa",
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);