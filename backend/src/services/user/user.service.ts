import { CreateUserType, UserType } from "../../lib/types/user.type";
import { User } from "../../models/user.model";

export const getusers = async() => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}


export const createUser = async(userData :CreateUserType) =>{
    try {
        const newUser = await User.create({
            userId : userData.userId,
            username : userData.username,
            email : userData.email,
            image : userData.image || "",
            userRole : userData.userRole || "customer",
            location : {
                coordinates : userData.location.coordinate, 
                address : userData.location.address,
                type: "Point", 
            },
            isAdmin : false,
            isOnboarded : true,
        });
        if(!newUser){
           return null;
        }
        return newUser;
    } catch (error) {
        console.error("Error creating user in user service:", error);
        return null;
        
    }
}