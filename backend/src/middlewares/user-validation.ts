import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../lib/types/auth-request";

export interface decodedDataType extends JwtPayload {
  email: string;
  userId: string;
  userDataId: string;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user_token } = req.cookies;
    
    // No token provided
    if (!user_token) {
      res.status(401).json({
        error: "Authentication token missing",
      });
      return;
    }
    
    // Verify tokendfsd
    const user_data = jwt.verify(
      user_token,
      process.env.JWT_TOKEN!,
    ) as decodedDataType;
    
    // Token invalid or malformed
    if (!user_data) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    
    // Look up user in DB
    const findUser = await User.findOne({
      _id: user_data.userDataId,
      userId: user_data.userId,
      email: user_data.email,
    });

    
    console.log("user in verificaiotn : ", findUser)
    
    // Authenticated, but no such user in DB
    if (!findUser) {
      res.status(403).json({
        error: "User not authorized",
      });
      return;
    }

    // Attach user info to request and proceed
    req.userDataId = user_data.userDataId;
    req.userId = user_data.userId;
    console.log("user after verifcaito n: ", req.userDataId, req.userId)
    next();
  } catch (error) {
    // Likely a malformed token or verification error
    res.status(400).json({ error: "Invalid request or token" });
  }
};
