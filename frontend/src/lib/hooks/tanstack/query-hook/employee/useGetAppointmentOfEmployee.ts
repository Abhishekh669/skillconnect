import { getEmployeesAppointMent } from "@/lib/actions/appointment/employee/get/appointment.employee.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchAppointmentFromEmployee = async() =>{
    const response = await getEmployeesAppointMent();
    return response;
}

export const useGetAppointmentOfEmployee = () =>{
    return useQuery({
        queryKey : ["get-appointmnet-of-employee"],
        queryFn : () => fetchAppointmentFromEmployee(),
    })
}