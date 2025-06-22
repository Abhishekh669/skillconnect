'use server'

import { auth } from "@/lib/actions/auth/auth";
import axios from "axios";

export const getEmployeeFromSession = async() =>{
    try {
        const session = await auth();
        if(!session || !session?.user || !session?.user?.id) throw new Error();
        const userId = session.user.id;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}/employee`);
        const {user} = res.data;
        return user || null;
    } catch (error) {
        console.log(error);
        return null;
        
    }
}