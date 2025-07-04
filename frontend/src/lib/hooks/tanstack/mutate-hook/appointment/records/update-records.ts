import { updateEmployeeStatus } from "@/lib/actions/appointment/employee/get/appointment.employee.get";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateAppointmentSTatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployeeStatus,
    onSuccess: (res) => {
        if(res.success && res.message){
            queryClient.invalidateQueries({ queryKey: ["get-employee-appointment-record-by-id"] })
        } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}