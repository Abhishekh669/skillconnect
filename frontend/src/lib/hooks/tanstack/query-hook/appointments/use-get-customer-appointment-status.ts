import { getCustomerAppointment } from "@/lib/actions/appointment/customer/get/appointment.customer.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchCustomerAppointmentData = async() =>{
    const res = await getCustomerAppointment();
    return res;
}   

export const useGetCustomerAppointmentsRecords = () =>{
    return useQuery({
        queryKey : ["get-customer-appointment-records"],
        queryFn :() => fetchCustomerAppointmentData(),
    })
} 