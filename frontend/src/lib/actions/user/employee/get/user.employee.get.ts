'use server'

import { auth } from "@/lib/actions/auth/auth";
import { getErrorMessage } from "@/lib/utils/get-error";
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";

export const 
getEmployeeFromSession = async() =>{
    const user_token = await get_cookies('user_token')
    if(!user_token)return null;
    try {
        const session = await auth();
        if(!session || !session?.user || !session?.user?.id) throw new Error();
        const userId = session.user.id;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}/employee`,{
            withCredentials : true,
            headers : {
                Cookie : `user_token=${user_token}`
            }
        });
        console.log("this is hte response data : ",res.data)
        const {user} = res.data;
        return user || null;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error im emeployeee : ",error);
        return null;
        
    }
}



