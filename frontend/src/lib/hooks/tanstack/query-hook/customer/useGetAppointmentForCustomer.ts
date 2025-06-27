import { getAppointMentsForCustomer, getCustomerFromSesison } from "@/lib/actions/user/customer/get/user.customer.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchAppointments = async(id : string) =>{
    const response = await getAppointMentsForCustomer(id);
    return response;
}

export const useGetAppointmentForCustomer = (id : string) =>{
    return useQuery({
        queryKey : ["get-appointment-for-customer", id],
        queryFn : () => fetchAppointments(id),
    })
}