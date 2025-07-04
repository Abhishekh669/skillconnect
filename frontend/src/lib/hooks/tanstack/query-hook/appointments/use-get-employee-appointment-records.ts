import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export  const fetchAppointmentsRecords = async() =>{
    const response = await axios.get(`/api/get/appointment-records`);
    console.log("this is the data hoi guys : ",response.data)
    const data = response.data;
    return data.data;
}

export const useGetEmployeeAppointmentRecords = () =>{
    return useQuery({
        queryKey : ["get-employee-appointment-records"],
        queryFn :() => fetchAppointmentsRecords(),
        staleTime : 5 * 60 * 1000,
    })
} 