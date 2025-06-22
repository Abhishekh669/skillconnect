'use server'
import { OnboardingData } from "@/lib/types/onboarding/types/types";
import axios from "axios";
import { auth } from "../../auth/auth";


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
        if(!data.success){
            throw new Error();
        }
        return {
            message : "successfully creeated user",
            success : true,
        }
    } catch (error) {
        console.log("Error creating user in fe:", error);
        return {
            error : "failed to create user",
            success  : false,
        }
    }
}