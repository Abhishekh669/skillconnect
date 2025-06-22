'use server'

import axios from "axios";


export const createProduct = async(productData : {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}) =>{
    const res = await axios.post("http://localhost:8000/api/v1/product/create", productData, {
        withCredentials: true
    });
    const data = res.data;
    if (!data) {
        return {
            error: "Failed to create product"
        };
    }
    return {
        product: data,
        message: "Product created successfully"
    };


}