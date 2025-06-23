"use login"

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const userData = await req.json();
    if (!userData.email || !userData.userId || !userData.username || !userData.userRole) {
        return NextResponse.json({ error: "login data missing", }, { status: 400 });
    }

    try {
        const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/user/create`, userData);
        const data = await res.data;
         if (!data || !data.token) {
            return NextResponse.json({ error: "failed to login" }, { status: 500 });
        }
        console.log('this is data  in the api', data.token)

        const response = NextResponse.json({
            message: "logged in successfully",
            success: true,
        });

        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        response.cookies.set("user_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // Changed to strict for better security
            expires: sevenDaysFromNow,
            path: "/",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });

    }
}