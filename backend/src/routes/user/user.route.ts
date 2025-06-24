import express from "express";
import { createNewUserHandler, getAllUserHandler, getCustomerData, getUserByIdAfterLogin, getUserByIdHandler } from "../../controllers/user/user.controller";
import { verifyToken } from "../../middlewares/user-validation";
import { getEmployeeData } from "../../controllers/user/employee.controller";
import { getAllEmployeeForCustomerHandler } from "../../controllers/user/customer.controller";

const router = express.Router();

router.post("/create", createNewUserHandler);
router.get("/get/users", getAllUserHandler);
router.get("/get/:userId", getUserByIdHandler); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/customer", getCustomerData); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/logged", verifyToken, getUserByIdAfterLogin);




router.get("/get/customer/getemployees", verifyToken, getAllEmployeeForCustomerHandler);




router.get("/get/:userId/employee", getEmployeeData ); // Assuming you want to fetch a specific user by userId

export default router;
