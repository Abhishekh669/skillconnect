import { Request, Response } from "express";
import { createProduct } from "../../services/product/product-service";


export const createNewProductHandler = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        if (!productData.name || !productData.description || !productData.price || !productData.image || !productData.category) {
             res.status(400).json({ message: "All fields are required" });
        }

        console.log("Product data received:", productData);
        const product = await createProduct(productData);
         res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
         res.status(500).json({ message: "Failed to create product" });
    }
}