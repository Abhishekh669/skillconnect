import { Request, Response } from "express";
import { User } from "../../models/user.model";



export const getEmployeeData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) throw new Error("userid invalid");
    const userData = await User.findOne({
      userId,
      userRole: "employee"
    });
    if (!userData) throw new Error();
    res.status(200).json({ message: "successfully got user", success: true, user: userData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "failed to get user", success: false })

  }
}


