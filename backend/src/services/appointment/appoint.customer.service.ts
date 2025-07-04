import { CreateAppointmentType } from "../../lib/types/appointment";
import { Appointment } from "../../models/employee-appointment.model";

export const createAppointmentForCustomer = async(data : CreateAppointmentType) =>{
    try {
        const newAppointment = await Appointment.create({
            ...data,
            companyCommissionPrice : 0.2 * data.offeredPrice,
        });
        if(!newAppointment){
            return null;
        }
        return newAppointment;
    } catch (error) {
        return null;
        
    }
}