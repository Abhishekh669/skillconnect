import { getCustomerFromSesison } from "@/lib/actions/user/customer/get/user.customer.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchCustomerFromSession = async() =>{
    const response = await getCustomerFromSesison();
    return response;
}

export const useGetCustomerFromSession = () =>{
    return useQuery({
        queryKey : ["get_customer_from_session"],
        queryFn : () => fetchCustomerFromSession(),
    })
}