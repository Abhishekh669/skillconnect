import mongoose, { mongo, Schema } from "mongoose";

const orderSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    payment_method : {
        type : String,
        required : true,
        default : "esewa"
    },
    amount : {
        type: Number,
        required: true,
    },
    product : [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,         
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    transaction_id: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
            type: String,
            required: true,
            enum: ['created', 'paid and processing', 'shipping', 'delivered'],
            default: 'created',
        },
        address: String,
},{
    timestamps : true
})


export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);