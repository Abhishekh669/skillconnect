'use server'
import { OnboardingData } from "@/lib/types/onboarding/types/types";
import axios from "axios";
import { auth } from "../../auth/auth";
import { cookies } from "next/headers";


export const createUser = async(values : OnboardingData) =>{
    try {
        const user = await auth();
        if(!user || !user?.user?.id || !user?.user?.email){
            return {
                error : "User not authenticated",
                success : false,
            }
        }

        let newValues = {
            ...values,
            userId : user.user.id,
            email : user.user.email,
            userRole : values.userType,
            image : user.user.image,
        }
        const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/user/create`,newValues);
        const data = res.data;
         if (!data || !data.token) {
            throw new Error("Failed to get token from backend");
        }
        console.log("this is the data : ",data)
        const cookieStore = await cookies();
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        cookieStore.set("user_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: sevenDaysFromNow,
            path: "/",
        });

        return {
            message : "successfully creeated user",
            success : true,
            user : data.user,
        }
    } catch (error) {
        console.log("Error creating user in fe:", error);
        return {
            error : "failed to create user",
            success  : false,
        }
    }
}



