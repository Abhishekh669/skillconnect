import { Router } from "express";
import { createNewProductHandler, GetProductsHandler } from "../../controllers/product/product-controller";

const router = Router();

router.post("/create", createNewProductHandler);
router.get("/get-products/" , GetProductsHandler)

export default router;