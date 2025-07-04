'use server'

import { auth } from "@/lib/actions/auth/auth";
import { getErrorMessage } from "@/lib/utils/get-error";
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";

export const getCustomerFromSesison = async () => {
    const user_token = await get_cookies('user_token')
    if(!user_token) return null;
    try {
        const session = await auth();
        if (!session || !session?.user || !session?.user?.id) throw new Error();
        const userId = session.user.id;
        console.log("this is the backend url : ",process.env.BACKEND_URL)
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}/customer`,
                        {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );
        const { user } = res.data;
        console.log('this is user data iin app of customer: ',user)
        return user || null;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this isht e actual error : ",error);
        return null;

    }
}


export const getEmployeesForCustomer = async () => {
    console.log("i am called")
    const user_token = await get_cookies('user_token')
    if (!user_token) return [];
    try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/customer/getemployees`,
            {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );
        console.log('this is the data : ",res.data')
        const data = res.data;
        return data || [];
    } catch (error) {
        return [];

    }
}

export interface Employee {
    _id: string;
    name: string;
    profileId: string,
    jobTitle: string;
    hourlyRate: number;
    rating: number;
    image: string;
    location: {
        address: string;
    };
    jobCategory: string;
}

export interface GetEmployeesResponse {
    employees: Employee[];
    totalPages: number;
    totalEmployees: number;
}

export type GetEmployeesOptions = {
    page?: number,
    limit?: number,
    search?: string,
    minHourRate?: number,
    maxHourRate?: number,
    minRating?: number,
    address?: string,
    radius?: number,
    jobCategory?: string,
}

export const getEmployees = async (options: GetEmployeesOptions = {}): Promise<GetEmployeesResponse | null> => {

    const user_token = await get_cookies('user_token')
    if (!user_token) return null;

    const queryParams = new URLSearchParams();

    // Add each option to query params if it exists
    if (options.page !== undefined) {
        queryParams.append('page', options.page.toString());
    }
    if (options.limit !== undefined) {
        queryParams.append('limit', options.limit.toString());
    }
    if (options.search && options.search.trim() !== '') {
        queryParams.append('search', options.search.trim());
    }
    if (options.minHourRate !== undefined) {
        queryParams.append('minHourRate', options.minHourRate.toString());
    }
    if (options.maxHourRate !== undefined) {
        queryParams.append('maxHourRate', options.maxHourRate.toString());
    }
    if (options.minRating !== undefined) {
        queryParams.append('minRating', options.minRating.toString());
    }
    if (options.address && options.address.trim() !== '') {
        queryParams.append('address', options.address.trim());
    }
    if (options.radius !== undefined) {
        queryParams.append('radius', options.radius.toString());
    }
    if (options.jobCategory && options.jobCategory.trim() !== '') {
        queryParams.append('jobCategory', options.jobCategory.trim());
    }

    const baseUrl = `${process.env.BACKEND_URL}/api/v1/user/get/customer/getemployees`;
    const urlWithParams = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;



    try {

        console.log("thisi shte url params : ", urlWithParams)
        const res = await axios.get(urlWithParams,
            {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );

        const data = res.data;

        console.log("this is the data from pagination : ", data)
        return data.employeeRecords;
    } catch (error) {
        return null;
    }

}


export const getEmployeeData = async (profileId: string) => {
    const user_token = await get_cookies('user_token')
    console.log("this is user id : ", profileId, user_token)
    if (!user_token || !profileId) return null;
    try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/customer/employee/${profileId}`,
            {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );

        console.log("this is hte reponse : ", res)

        const data = res.data;

        return data.employeeData;

    } catch (error) {
        console.log("this ish e error man : ", error)

        return null;
    }
}


export const getAppointMentsForCustomer = async (profileId: string) => {
    const user_token = await get_cookies('user_token')
    if (!user_token || !profileId) return null;
    try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/customer/employee/${profileId}/appointments`,
            {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );

        const data = res.data;
        console.log("this is data from backend : ",data)
        if (!data.success) return null;
        return data.appointmentData;
    } catch (error) {
        return null;

    }

}