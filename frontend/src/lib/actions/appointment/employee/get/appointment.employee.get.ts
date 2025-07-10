'use server'

import { getErrorMessage } from "@/lib/utils/get-error";
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";
import { revalidatePath } from "next/cache";


export const getEmployeesAppointMent = async () => {
    const user_token = await get_cookies('user_token');
    if (!user_token) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }
    try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/appointment/employee/get`, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token}`
            }
        })
        const data = res.data;
        console.log("this is data : ", data)

        return {
            success: true,
            appointments: data.appointments || []
        }
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error)
        }

    }
}


interface UpdateStatusType {
    status: "pending" | "done" | "progress",
    appointmentId: string
}
export const updateEmployeeStatus = async (values: UpdateStatusType) => {
    const user_token = await get_cookies('user_token');
    if (!user_token) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }


    try {
        console.log("this ishte values : ", values)
        const res = await axios.put(`${process.env.BACKEND_URL}/api/v1/appointment/employee/records/update-status`, values, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })
        const data = res.data;
        console.log("this is data : ", data)
        if (!data.success) {
            return {
                success: false,
                error: "failed to update status"
            }
        }
        revalidatePath(`/employee/appointments/records${values.appointmentId}`)
        return {
            success: data.success,
            message: data.message
        }
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this ishte eror : ", error)
        return {
            success: false,
            error
        }

    }

}


export const getEmployeeRejectedAppointments = async () => {
     const user_token = await get_cookies('user_token');
    if (!user_token) {
        return {
            success: false,
            error: "failed to create appointent"
        }
    }
    try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/v1/appointment/employee/get/records-rejected`, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })
        const data = response.data;
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        return {
            error, success: false,
        }

    }
}