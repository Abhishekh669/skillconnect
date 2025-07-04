import { createCustomerAppointment } from "@/lib/actions/appointment/customer/post/appointment.customer.post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateAppointmentForCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomerAppointment,
    onSuccess: (res) => {
        if(res.success && res.message){
            queryClient.invalidateQueries({ queryKey: ["get-appointment-for-customer"] })
        } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}