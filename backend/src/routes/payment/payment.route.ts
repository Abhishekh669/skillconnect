import { Router } from "express";
import { verifyToken } from "../../middlewares/user-validation";
import { initiateEsewaPayment, verifyEsewaPayment } from "../../controllers/payment/esewa.payment";

const router = Router();

router.post("/employee/:appointmentId/esewa",verifyToken, initiateEsewaPayment)
router.post("/employee/verify/payment-status/esewa",verifyToken, verifyEsewaPayment)

export default router;