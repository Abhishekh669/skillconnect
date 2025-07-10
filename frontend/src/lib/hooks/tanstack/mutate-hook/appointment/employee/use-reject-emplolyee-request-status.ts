import { rejectCustomerRequestStatus } from "@/lib/actions/appointment/employee/put/reject-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRejectAppointmentRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectCustomerRequestStatus,
    onSuccess: (res) => {
        if(res.success && res.message){
            queryClient.invalidateQueries({ queryKey: ["get-appointmnet-of-employee"] })
        } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}