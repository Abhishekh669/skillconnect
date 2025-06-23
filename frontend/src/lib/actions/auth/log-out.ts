'use server'

import { cookies } from "next/headers"
import { signOut } from "./auth"


export const handleLogOut = async () => {
    const cookieStore = await cookies();

    cookieStore.set("user_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0),   // Set expiry in the past to delete
        path: "/",
    });
    
    await signOut({
        redirectTo: "/"
    })

    

}