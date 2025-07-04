import express from "express";
import { createNewUserHandler, getAllUserHandler,  getCustomerDataHandler, getUserByIdAfterLogin, getUserByIdHandler } from "../../controllers/user/user.controller";
import { verifyToken } from "../../middlewares/user-validation";
import { getEmployeeDataHandler } from "../../controllers/user/employee.controller";
import { getAllEmployeeForCustomerHandler, getEmployeeAppointmentForCustomer, getEmployeeFromIdHandler,  } from "../../controllers/user/customer.controller";

const router = express.Router();

router.post("/create", createNewUserHandler);
router.get("/get/users", getAllUserHandler);
router.get("/get/:userId", getUserByIdHandler); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/logged", verifyToken, getUserByIdAfterLogin);




router.get("/get/customer/getemployees", verifyToken, getAllEmployeeForCustomerHandler);
router.get("/get/customer/employee/:userId", verifyToken, getEmployeeFromIdHandler)
router.get("/get/customer/employee/:profileId/appointments", verifyToken, getEmployeeAppointmentForCustomer)




router.get("/get/:userId/customer", verifyToken,getCustomerDataHandler); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/employee",verifyToken, getEmployeeDataHandler ); // Assuming you want to fetch a specific user by userId

export default router;
