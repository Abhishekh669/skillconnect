'use server'

import { CreateAppointmentType } from "@/lib/types/appointment/appointment.types"
import { getErrorMessage } from "@/lib/utils/get-error"
import { get_cookies } from "@/lib/utils/get-token"
import axios from "axios"
import { _success } from "zod/v4/core"


export const createCustomerAppointment = async (values: CreateAppointmentType) => {
    const user_token = await get_cookies('user_token');
    if (!user_token) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }
    try {



        const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/appointment/customer/create`, values, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })
        const data = res.data;

        if(!data.success){
            throw new Error(data.error)
        }

        return {
            success: true,
            message: data.message
        }


    } catch (error) {
        console.log("this is hte rror : ",error)
        return {
            success: false,
            error : getErrorMessage(error)
        }

    }

}