'use server'

import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";
import { cookies } from "next/headers";

export const getUserById = async (userId: string) => {
    try {
        if (!userId) return null;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}`);

        const data = await res.data || null;
        
        if (!data || !data.token|| !data.success || !data.user) {
            throw new Error("Failed to get token from backend");
        }
        console.log("data for checking euser : ",data)
        const cookieStore = await cookies();
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        console.log('fine till here')

        cookieStore.set("user_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: sevenDaysFromNow,
            path: "/",
        });

        return data;

    } catch (error) {
        console.log(error)
        return null;

    }
}


export const getUserByIdInServer = async(userId : string) =>{
    const user_token = await get_cookies("user_token")
    if(!user_token){
        return null;
    }
    try {

        if (!userId) return null;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}/logged`,{
            withCredentials : true, 
            headers : {
                Cookie : `user_token=${user_token};`
            }
        });

        

        const data = await res.data || null;
        if (!data ||  !data.success || !data.user) {
            throw new Error("Failed to get token from backend");
        }
       
        return data;

    } catch (error) {
        console.log(error)
        return null;

    }
}