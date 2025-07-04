import { useParams } from "next/navigation";

export const useAppointmentId = () =>{
    const params = useParams<{appointmentId : string}>();
    return params.appointmentId;
}