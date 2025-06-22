'use server'

import axios from "axios";

export const getUserById = async(userId : string) =>{
    try {
        if(!userId) return null;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}`);

        const data = await res.data || null;
        return data;
        
    } catch (error) {
        console.log(error)
        return null;
        
    }
}