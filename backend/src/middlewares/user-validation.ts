import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user.model";
import { AuthRequest } from "../lib/types/auth-request";

export interface decodedDataType extends JwtPayload{
    email : string,
    userId : string, 
    userDataId : string,
}


export const verifyToken = async(req : AuthRequest, res : Response, next : NextFunction) =>{
    try {
        const {user_token} = req.cookies;
        if(!user_token) {
            res.status(403).json({
                error : "failed to validate user",
            })
            return ;
        }

        const user_data = jwt.verify(
            user_token,
            process.env.JWT_TOKEN!,
        ) as decodedDataType


        if(!user_data){
            res.status(403).json({error : "user not found"});
            return;
        }
        const findUser = await User.findOne({
            _id : user_data.userDataId,
            userId : user_data.userId,
            email : user_data.email
        })

        if(!findUser){
            res.status(403).json({
                error : "user not found"
            })
            return;
        }
        req.userDataId = user_data.userDataId;
        req.userId = user_data.userId;
        next();

    } catch (error) {
          res.status(400).json({error : "something went wrong"})
        
    }
}