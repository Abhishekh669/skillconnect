import { Router } from "express";
import { createAppointmentForCustomerHandler } from "../../controllers/appointment/appointment.customer.controller";
import { verifyToken } from "../../middlewares/user-validation";
import { appointmentRecordsForEmployee, getAppointsOfEmployeeHandler, getEmployeeAppointmentRecordById, updateAppointmentStatus } from "../../controllers/appointment/appointment.employee.controller";

const router = Router();

router.post("/customer/create",verifyToken, createAppointmentForCustomerHandler)

router.get("/employee/get",verifyToken, getAppointsOfEmployeeHandler)
router.get("/employee/get/records",verifyToken, appointmentRecordsForEmployee)
router.put("/employee/records/update-status",verifyToken, updateAppointmentStatus)
router.get("/employee/get/records/:appointmentId",verifyToken, getEmployeeAppointmentRecordById)
export default router;