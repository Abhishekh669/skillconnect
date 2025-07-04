import {  Response } from "express";
import { User } from "../../models/user.model";
import { AuthRequest } from "../../lib/types/auth-request";



export const getEmployeeDataHandler = async (req: AuthRequest, res: Response) => {
  console.log("i am called")
  try {
    const userId = req.params.userId;
    if (!userId) throw new Error("userid invalid");
    if(userId != req.userId)throw new Error("user not authenticated");
    const userData = await User.findOne({

      userId,
      userRole: "employee"
    });
    if (!userData) throw new Error();
    res.status(200).json({ message: "successfully got user", success: true, user: userData })
  } catch (error) {
    
    console.log("error in fetching employee data : ",error)
    res.status(401).json({ message: "failed to get user", success: false })
  }
};