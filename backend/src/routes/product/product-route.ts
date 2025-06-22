import { Router } from "express";
import { createNewProductHandler } from "../../controllers/product/product-controller";

const router = Router();

router.post("/create", createNewProductHandler);

export default router;