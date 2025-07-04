import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export  const fetchAppointmentsRecordByID = async(appointmentId : string) =>{
    console.log('hello ',appointmentId)
    const response = await axios.get(`/api/get/appointment-records/${appointmentId}`);
    const data = response.data;
    console.log("this isthe data form the server : ",data)
    return data;
}   

export const useGetEmployeeAppointmentRecordById = (appointmentId : string) =>{
    return useQuery({
        queryKey : ["get-employee-appointment-record-by-id", appointmentId],
        queryFn :() => fetchAppointmentsRecordByID(appointmentId),
    })
} 