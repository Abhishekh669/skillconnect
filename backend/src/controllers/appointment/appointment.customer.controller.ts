import { Request, Response } from "express";
import { CreateAppointmentType } from "../../lib/types/appointment";
import { EmployeeProfile } from "../../models/employee-profile.model";
import { createAppointmentForCustomer } from "../../services/appointment/appoint.customer.service";
import { Appointment } from "../../models/employee-appointment.model";



export const createAppointmentForCustomerHandler = async (req: Request, res: Response) => {
    try {
        const appointmentData: CreateAppointmentType = req.body;

        if (!appointmentData.customerId || !appointmentData.employeeProfileId || !appointmentData.employeeId || !appointmentData.actualPrice || !appointmentData.deadline || !appointmentData.timeRequired) {
            res.status(400).json({ error: "invalid data ", success: false })
            return;
        }

        if (appointmentData.offeredPrice < appointmentData.actualPrice) {
            res.status(400).json({ error: "offered price is small then the actual price : ", success: false });
            return;
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const checkAlreadyExists = await Appointment.findOne({
            customerId: appointmentData.customerId,
            employeeProfileId: appointmentData.employeeProfileId,
            requestStatus: "not-responded",
            createdAt: { $lt: sevenDaysAgo }
        });
        if (checkAlreadyExists) {
            const createdDate = new Date(checkAlreadyExists.createdAt);
            const now = new Date();

            const msInDay = 1000 * 60 * 60 * 24;
            const daysPassed = Math.floor((now.getTime() - createdDate.getTime()) / msInDay);

            const daysLeft = 7 - daysPassed;

            res.status(400).json({
                error: `Please wait ${daysLeft} more day${daysLeft > 1 ? 's' : ''}.`
            });
            return;
        }


        const createNewAppointment = await createAppointmentForCustomer(appointmentData);




    } catch (error) {
        res.status(500).json({ error: "failed to create it ", success: false })

    }
}