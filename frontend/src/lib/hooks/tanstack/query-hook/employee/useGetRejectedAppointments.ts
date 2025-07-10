import { getEmployeeRejectedAppointments } from "@/lib/actions/appointment/employee/get/appointment.employee.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchRejectedAppointmentFromEmployee = async() =>{
    
    const res = await getEmployeeRejectedAppointments();
    return res;
}

export const useGetRejectedAppointments = () =>{
    return useQuery({
        queryKey : ["get-rejected-appointment"],
        queryFn : () => fetchRejectedAppointmentFromEmployee(),
    })
}