import express from "express";
import { createNewUserHandler, getAllUserHandler, getCustomerData, getEmployeeData, getUserByIdHandler } from "../../controllers/user/user.controller";

const router = express.Router();

router.post("/create", createNewUserHandler);
router.get("/get/users", getAllUserHandler);
router.get("/get/:userId", getUserByIdHandler); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/customer", getCustomerData); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/employee", getEmployeeData); // Assuming you want to fetch a specific user by userId

export default router;
