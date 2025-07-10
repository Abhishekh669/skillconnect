import { Response } from "express";
import { Appointment } from "../../models/employee-appointment.model";
import { AuthRequest } from "../../lib/types/auth-request";
import { Auth } from "mongodb";
import { RejectedAppointments } from "../../models/rejected-appointment.model";
import mongoose from "mongoose";
import { User } from "../../models/user.model";
import { resolveSoa } from "dns";



export const getAppointsOfEmployeeHandler = async (req: AuthRequest, res: Response) => {

    try {
        const { userId, userDataId } = req;
        console.log("userid and userdataid : ", userId, userDataId)
        if (!userId || !userDataId) {
            res.status(400).json({
                message: "invalid user data",
                success: false,
            })
            return;
        }
        const appointments = await Appointment.find({
            employeeId: userId,
            requestStatus: "not-responded"
        }).sort({ createdAt: 1 })
        console.log("this is appointmentd ata : ", appointments)
        res.status(200).json({
            appointments,
            success: true
        })
    } catch (message) {
        console.log("this is hte message in getting appointments: ", message)
        res.status(401).json({
            message: "something went wrong",
            success: false,
        })
    }
}


export const acceptTheAppointmentRequest = async (req: AuthRequest, res: Response) => {
    try {
        const appointMentId = req.params.appointmentId;
        if (!appointMentId) {
            res.status(401).json({
                message: "invalid id ",
                success: false,
            })
            return;
        }
        const appointmentData = await Appointment.findById(appointMentId);
        if (!appointmentData) {
            res.status(401).json({
                message: "appointment not found",
                success: false,
            })
            return;
        }

        if (appointmentData.commissionStatus) {
            res.status
        }


    } catch (message) {
        console.log("this is hte message in getting appointments: ", message)
        res.status(401).json({
            message: "something went wrong",
            success: false,
        })

    }
}




export const appointmentRecordsForEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const employeeId = req.userId;
        if (!employeeId) {
            res.status(401).json({
                message: "invalid id",
                success: false,
            })
            return;
        }
        const appointments = await Appointment.find({
            employeeId,
            commissionStatus : true,
        })

        res.status(200).json({
            appointments,
            success: true,
        })

    } catch (message) {
        res.status(401).json({
            message: "something went wrong",
            success: false,
        })


    }
}

export const rejectAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        if (!appointmentId) {
            res.status(400).json({
                message: "invalid id ",
                success: false,

            })
            return;
        }
        console.log("i am for deleting the  apopintment id : ",appointmentId)

        const appointmentData = await Appointment.findById(appointmentId);
        if (!appointmentData) {
            res.status(401).json({
                message: "no such appoint exists",
                success: false,
            })
            return;
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Promise.all([
                Appointment.findByIdAndDelete(appointmentId).session(session),
                RejectedAppointments.create([{
                    employeeId: appointmentData.employeeId,
                    customerId: appointmentData.customerId,
                    offeredPrice: appointmentData.offeredPrice,
                }], { session })
            ]);

            await session.commitTransaction();

             res.status(200).json({
                message: "Successfully rejected appointment",
                success: true,
            });
        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.log("this is error :",error)
        res.status(400).json({
            message: "failed to reject appointment",
            status: false,
        })

    }
}


export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
    console.log('i am here hoi tw ')
    try {
        const employeeId = req.userId;
        const { status, appointmentId } = req.body;
        const workStatus = ['pending', 'progress', 'done']
        const checkStatus = workStatus.includes(status);
        console.log("fine till here")
        if (!checkStatus) {
            res.status(401).json({
                message: "invalid status",
                success: false,
            })
            return;
        }
        if (!employeeId) {
            res.status(400).json({
                message: "invalid id",
                success: false,
            })
            return
        }

        await Appointment.updateOne(
            { appointmentId: employeeId, _id : appointmentId},
            {
                $set: {
                    workStatus: status,
                }
            }
        )
        res.status(200).json({
            message: "updated successfully",
            success: true,
        })
    } catch (message) {
        res.status(401).json({
            message: "something went wrong",
            success: false,
        })

    }
}

export const getEmployeeAppointmentRecordById  = async(req : AuthRequest, res : Response) =>{
    try {
        const appoinmentId = req.params.appointmentId;
        const userId = req.userId;

        if(!appoinmentId || !userId){
            res.status(401).json({
                message : "invalid id ",
                success : false,
            })
            return
        }

        const appointmentData = await Appointment.findOne({
            _id : appoinmentId,
            employeeId : userId
        })
        const customerData = await User.findOne({userId : appointmentData?.customerId});
        console.log("this is ucotemr data : ",customerData)

        res.status(200).json({
            appointment : appointmentData,
            userData : customerData,
            success : true
        })

    } catch (error) {
        res.status(400).json({
            message  : "failed to get appointment ",
            success : false,
        })
        
    }
}


export const getRejectedData = async (req: AuthRequest, res: Response) =>{
    try {
        const employeeId = req.userId;
        console.log("this is hemplyee id : ",employeeId)
        if(!employeeId){
            res.status(400).json({
                error : "invalid data",
                success : false,
            })
            return;
        }        
        const rejectedAppointments = await RejectedAppointments.find({
            employeeId,
        })

        console.log("this is rejected data ",rejectedAppointments)

        res.status(200).json({
            message  :"successfully got data",
            success : true,
            rejectedAppointments
        })
    } catch (error) {
        res.status(400).json({
            error   : "failed to get data",
            success : false,
        })
        
    }
}