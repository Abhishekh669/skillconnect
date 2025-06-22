// src/controllers/user/user.controller.ts
import { Request, Response } from "express";
import { createUser, getusers } from "../../services/user/user.service";
import { EmployeeProfile } from "../../models/employee-profile.model";
import { User } from "../../models/user.model";

export const createNewUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await req.body;

    if (!userData.email || !userData.userId || !userData.username || !userData.userRole) {
      res.status(400).json({ message: "Missing required user fields", success: false });
      return;
    }


    const basicUserData = {
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
      image: userData.image || "",
      userRole: userData.userRole || "customer",
      location: userData.location,
      isAdmin: false,
    };

    const newUser = await createUser(basicUserData);

    if (!newUser) {
      res.status(500).json({ message: "Failed to create user", success: false });
      return;
    }

    if (userData.userRole === "employee" && userData.employeeProfile) {
      const employeeProfile = {
        jobCategory: userData.employeeProfile.jobCategory,
        skills: userData.employeeProfile.skills,
        hourlyRate: userData.employeeProfile.hourlyRate,
        rating: userData.employeeProfile.rating,
        completedJobs: userData.employeeProfile.completedJobs || 0,
        userId: userData.userId,
      };

      const employeeProfileData = await EmployeeProfile.create(employeeProfile);

      if (!employeeProfileData) {
        await User.findOneAndDelete({ userId: userData.userId });
        console.error("Failed to create employee profile");
        res.status(500).json({ message: "Failed to create employee profile", success: false });
        return;
      }
    }

    res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", success: false });
  }
};

export const getUserByIdHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  console.log("userId in getUserByIdHandler:", userId);

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user", success: false });
  }
};

export const getAllUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getusers();
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", success: false });
  }
};


export const getCustomerData  = async( req : Request, res : Response) =>{
  try {
    const userId = req.params.userId;
    if(!userId) throw new Error("userid invalid");
    const userData = await User.findOne({
      userId,
      userRole : "customer"
    });
    if(!userData) throw new Error();
    res.status(200).json({message : "successfully got user", success : true, user : userData})
  } catch (error) {
    console.log(error)
    res.status(500).json({message : "failed to get user", success : false})
    
  }
}


export const getEmployeeData  = async( req : Request, res : Response) =>{
  try {
    const userId = req.params.userId;
    if(!userId) throw new Error("userid invalid");
    const userData = await User.findOne({
      userId,
      userRole : "employee"
    });
    if(!userData) throw new Error();
    res.status(200).json({message : "successfully got user", success : true, user : userData})
  } catch (error) {
    console.log(error)
    res.status(500).json({message : "failed to get user", success : false})
    
  }
}