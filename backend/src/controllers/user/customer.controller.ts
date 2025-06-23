import { Request, Response } from "express";


export const getAllEmployee = async(req : Request, res : Response) =>{
        try {
            
        } catch (error) {
            res.status(500).json({message : "failed to get employeee", success : false})
            
        }
}