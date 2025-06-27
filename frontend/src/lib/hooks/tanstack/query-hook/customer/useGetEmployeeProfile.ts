import { getCustomerFromSesison, getEmployeeData } from "@/lib/actions/user/customer/get/user.customer.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchEmployeeProfile = async(userId : string) =>{
    const response = await getEmployeeData(userId);
    return response;
}

export const useGetEmployeeProfile = (userId : string) =>{
    return useQuery({
        queryKey : ["get-employee-profile", userId],
        queryFn : () => fetchEmployeeProfile(userId),
    })
}