import { Router } from "express";
import { createAppointmentForCustomerHandler, customerRecordData } from "../../controllers/appointment/appointment.customer.controller";
import { verifyToken } from "../../middlewares/user-validation";
import { appointmentRecordsForEmployee, getAppointsOfEmployeeHandler, getEmployeeAppointmentRecordById, getRejectedData, rejectAppointment, updateAppointmentStatus } from "../../controllers/appointment/appointment.employee.controller";

const router = Router();
router.get("/customer/get/appointment-records", verifyToken, customerRecordData)
router.post("/customer/create",verifyToken, createAppointmentForCustomerHandler)

router.get("/employee/get",verifyToken, getAppointsOfEmployeeHandler)
router.get("/employee/get/records",verifyToken, appointmentRecordsForEmployee)
router.get("/employee/get/records/:appointmentId",verifyToken, getEmployeeAppointmentRecordById)
router.get("/employee/get/records-rejected",verifyToken, getRejectedData)


router.put("/employee/records/update-status",verifyToken, updateAppointmentStatus)


router.delete("/employee/reject/request/:appointmentId", verifyToken, rejectAppointment)
export default router;