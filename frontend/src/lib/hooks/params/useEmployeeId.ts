import { useParams } from "next/navigation";

export const useEmployeeId = () =>{
    const params = useParams<{employeeId : string}>();
    return params.employeeId;
}