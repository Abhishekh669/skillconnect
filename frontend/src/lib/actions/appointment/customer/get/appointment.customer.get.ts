'use server'

import { getErrorMessage } from "@/lib/utils/get-error";
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";


export const getCustomerAppointment = async () => {
     const user_token = await get_cookies('user_token');
    if (!user_token) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }
    try {
         const  response = await axios.get(`${process.env.BACKEND_URL}/api/v1/appointment/customer/get/appointment-records`,{
        withCredentials : true,
        headers : {
            Cookie : `user_token=${user_token};`
        }
      })
        const data = response.data;
        console.log("this is data of cutomer : ",data)
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        return {
            error, success: false,
        }

    }
}