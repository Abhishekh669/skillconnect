import { getUserById } from "@/lib/actions/user/get/user.get";
import { useQuery } from "@tanstack/react-query";

export  const fetchUserData = async(id : string) =>{
    const response = await getUserById(id);
    return response;
}

export const useGetUserById = (id : string) =>{
    return useQuery({
        queryKey : ["get_user_from_session"],
        queryFn : () => fetchUserData(id),
    })
}