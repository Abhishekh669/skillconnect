import { Request, Response } from "express";
import { createProduct } from "../../services/product/product-service";
import { Product } from "../../models/product.model";


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


export const GetProductsHandler = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        console.log("i am fetching ", limit, offset)

        const products = await Product.find({})
            .skip(offset * limit)
            .limit(limit);

        const total = await Product.countDocuments();

        res.status(200).json({
            rows: products,
            hasMore: (offset + 1) * limit < total,
            nextOffset: offset + 1,
        });
    } catch (error) {
        res.status(500).json({ message: "failed" });
    }
};
