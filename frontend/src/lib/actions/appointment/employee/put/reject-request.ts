'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";
import { revalidatePath } from "next/cache";


export const rejectCustomerRequestStatus = async (appointmentId: string) => {
    const user_token = await get_cookies('user_token');
    if (!user_token || !appointmentId) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }

    try {
        const res = await axios.delete(`${process.env.BACKEND_URL}/api/v1/appointment/employee/reject/request/${appointmentId}`,{
            withCredentials : true,
            headers : {
                Cookie : `user_token=${user_token};`
            }
        })

        const data = res.data;

        if(!data.success){
            return {
                error  :"failed to reject appintment",
                success : false,
            }
        }
        revalidatePath("/employee/appointments");
        return {
            message  : data.message,
            success : data.success
        }
        
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this is the error : ",error)
        return {
            error, success: false,
        }

    }
}