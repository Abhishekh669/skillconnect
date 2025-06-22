import { Product } from "../../models/product.model";

export const createProduct = async(productData : any) =>{
    try {
        const { name, description, price, image, category } = productData;

        if (!name || !description || !price || !image || !category) {
            throw new Error("All fields are required");
        }

        const newProduct = {
            name,
            description,
            price,
            image,
            category,
        };

        const product = await Product.create(newProduct);
        
        return product;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}