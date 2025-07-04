'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { get_cookies } from "@/lib/utils/get-token"
import axios from "axios"


export const intiatePaymentAction = async (appointmentId: string) => {
    const user_token = await get_cookies('user_token')
    if (!user_token) return null;
    try {
        const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/payment/employee/${appointmentId}/esewa`, {}, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })
        const data = res.data;
        console.log("thisi s data from the backend : ", data)
        if (!data.success) {
            return {
                error: data.message,
                success: false,

            }
        }

        return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this is the error : ", error)
        return {
            error, success: false,
        }

    }

}


interface verifyPamentStatusType {
    appointmentId: string,
    transaction_code: string,
    signature: string,
}

export const verifyPayment = async (values: verifyPamentStatusType) => {
    const user_token = await get_cookies('user_token')
    if (!user_token) {
        return {
            error: "user not authenticated",
            success: false
        }
    }
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/payment/employee/verify/payment-status/esewa`, values, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })

        const data = response.data;
        if (!data.success) return {

            error: data.error,
            success: false,

        }

        console.log("this is  the payment verification data : ", data)

        return data;
    } catch (error) {
        error = getErrorMessage(error);
        console.log("this is the error in payment verifaiciton : ",error)
        return {
            error, success: false,
        }

    }
}