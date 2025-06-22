import { getEmployeeFromSession } from "@/lib/actions/user/employee/get/user.employee.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchEmployeeFromSession = async() =>{
    const response = await getEmployeeFromSession();
    return response;
}

export const useGetEmployeeFromSession = () =>{
    return useQuery({
        queryKey : ["get_employee_from_session"],
        queryFn : () => fetchEmployeeFromSession(),
    })
}