import { Request, Response } from "express";
import { CreateAppointmentType } from "../../lib/types/appointment";
import { createAppointmentForCustomer } from "../../services/appointment/appoint.customer.service";
import { Appointment } from "../../models/employee-appointment.model";
import { EmployeeProfile } from "../../models/employee-profile.model";



export const createAppointmentForCustomerHandler = async (req: Request, res: Response) => {
    
    try {
        const appointmentData: CreateAppointmentType = req.body;
        console.log("appointment data : ",appointmentData)

        if (
            appointmentData.customerId === undefined ||
            appointmentData.employeeProfileId === undefined ||
            appointmentData.employeeId === undefined ||
            appointmentData.actualPrice === undefined ||
            appointmentData.deadline === undefined ||
            appointmentData.timeRequired === undefined
        ) {
            res.status(400).json({ error: "Invalid data", success: false });
            return 
        }


        if ( appointmentData.offeredPrice !== undefined &&
            appointmentData.offeredPrice < appointmentData.actualPrice) {
            res.status(400).json({ error: "offered price is small then the actual price : ", success: false });
            return;
        }

        const checkIsEmployeeActive = await EmployeeProfile.findById(appointmentData.employeeProfileId);
        
        if(!checkIsEmployeeActive?.workerStatus){
            res.status(400).json({
                error : "employee is not active now ",
                success : false,
            })
            return;
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const checkAlreadyExists = await Appointment.findOne({
            customerId: appointmentData.customerId,
            employeeProfileId: appointmentData.employeeProfileId,
            requestStatus: "not-responded",
            // createdAt: { $lt: sevenDaysAgo }
        });

        console.log("already exist : ",checkAlreadyExists)
        if (checkAlreadyExists) {
            const createdDate = new Date(checkAlreadyExists.createdAt);
            const now = new Date();

            const msInDay = 1000 * 60 * 60 * 24;
            const daysPassed = Math.floor((now.getTime() - createdDate.getTime()) / msInDay);

            
            if (daysPassed < 8) {
                const daysLeft = 7 - daysPassed;
                res.status(400).json({
                    error: `Please wait ${daysLeft} more day${daysLeft > 1 ? 's' : ''}.`,
                    success : false
                });
                return;
            }

            const updateExistingAppointment = await Appointment.findOneAndUpdate({_id : checkAlreadyExists._id},{
                actualPrice : appointmentData.actualPrice,
                offeredPrice : appointmentData.offeredPrice,
                timeRequired : appointmentData.timeRequired,
                deadline : appointmentData.deadline,
                description : appointmentData.description,
                createdAt : Date.now(),
                updatedAt : Date.now()
            }, {new : true})

            if(!updateExistingAppointment){
                res.status(400).json({
                    error : 'failed to create appointment',
                    success : false,
                })
            }

            res.status(200).json({
                message : "successfully created appointmnet",
                success : true,
            })
            return;
            
        }

        const createNewAppointment = await createAppointmentForCustomer(appointmentData);
        if (!createNewAppointment) {
            res.status(400).json({
                error: "failed to create appointment",
                success: false,
            })
            return;
        }

        res.status(200).json({
            message: "created successfully",
            success: true,
        })
    } catch (error) {
        console.log("this is the error  in appointmnet : ",error)
        res.status(500).json({ error: "failed to create it ", success: false })

    }
}