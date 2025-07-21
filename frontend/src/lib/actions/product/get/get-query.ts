'use server'


export async function fetchProducts(limit = 10, offset = 0) {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/product/get-products?limit=${limit}&offset=${offset}`);

        if (!res.ok) throw new Error("Network response was not ok");

        return await res.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}