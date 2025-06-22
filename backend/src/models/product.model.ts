import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,             
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,       
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },

}, {
    timestamps: true,
}); 

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
