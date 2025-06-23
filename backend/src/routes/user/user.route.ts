import express from "express";
import { createNewUserHandler, getAllUserHandler, getCustomerData, getEmployeeData, getUserByIdAfterLogin, getUserByIdHandler } from "../../controllers/user/user.controller";
import { verifyToken } from "../../middlewares/user-validation";

const router = express.Router();

router.post("/create", createNewUserHandler);
router.get("/get/users", getAllUserHandler);
router.get("/get/:userId", getUserByIdHandler); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/customer", getCustomerData); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/employee", getEmployeeData); // Assuming you want to fetch a specific user by userId
router.get("/get/:userId/logged", verifyToken, getUserByIdAfterLogin);

export default router;
