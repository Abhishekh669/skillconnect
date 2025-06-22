import { User } from "../../models/user.model";


export const createuser = async(userData : any) =>{
     try {
        const {name, email} = userData;
        if (!name || !email) {
            throw new Error("Name and email are required");
        }

        const user = await User.create({
            name,
            email,
        });
        return user;

     } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
        
     }
}


