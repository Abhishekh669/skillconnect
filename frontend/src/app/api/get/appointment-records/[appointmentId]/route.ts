
'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { appointmentId: string } }) {

    try {
        const { appointmentId } = await params;
        if (!appointmentId) {
            return NextResponse.json(
                { error: "Appointment ID is required", success: false },
                { status: 400 }
            );
        }

        const user_token = await get_cookies('user_token')
        if (!user_token) {
            return NextResponse.json(
                { error: "session not found", success: false },
                { status: 400 }
            );
        }

        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/appointment/employee/get/records/${appointmentId}`, {
            withCredentials: true,
            headers: {
                Cookie: `user_token=${user_token};`
            }
        })

        const data = res.data;

        if (!data.success) {
            throw new Error("failed to get record");
        }
        console.log("this is the data :",data)
        return NextResponse.json({
            appointment: data.appointment,
            userData : data.userData,
            success: data.success,

        }, { status: 200 })


    } catch (error) {
        error = getErrorMessage(error);
        console.log("this ish terror : ",error)
        return NextResponse.json({ error, success: false }, { status: 401 })

    }
}