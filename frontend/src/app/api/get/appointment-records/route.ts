'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { get_cookies } from "@/lib/utils/get-token"
import axios from "axios"
import { NextResponse } from "next/server"


export async function GET(req : Request ){
    try {
      const user_token = await get_cookies('user_token')
      if(!user_token){
        return NextResponse.json({error : "user not authenticated"},{status : 401})
      }
      const  res = await axios.get(`${process.env.BACKEND_URL}/api/v1/appointment/employee/get/records`,{
        withCredentials : true,
        headers : {
            Cookie : `user_token=${user_token};`
        }
      })

      console.log("this isht data of get : ",res.data)

      const data = res.data;
      if(!data.success){
        return NextResponse.json({error : data.message, success : false}, {status : 401})
      }

      return NextResponse.json({data},{status : 200})
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this ishte erorr in get : ",error)
        return NextResponse.json({
            error,
            success : false,
        },{status : 401})
        
    }
}