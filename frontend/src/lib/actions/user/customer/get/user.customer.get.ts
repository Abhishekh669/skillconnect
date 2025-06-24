'use server'

import { auth } from "@/lib/actions/auth/auth";
import { get_cookies } from "@/lib/utils/get-token";
import axios from "axios";

export const getCustomerFromSesison = async () => {
    try {
        const session = await auth();
        if (!session || !session?.user || !session?.user?.id) throw new Error();
        const userId = session.user.id;
        const res = await axios.get(`${process.env.BACKEND_URL}/api/v1/user/get/${userId}/customer`);
        const { user } = res.data;
        return user || null;
    } catch (error) {
        console.log(error);
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
  jobTitle: string;
  hourlyRate: number;
  rating: number;
  profileImage: string;
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

        console.log("thisi shte url params : ",urlWithParams)
        const res = await axios.get(urlWithParams,
            {
                withCredentials: true,
                headers: {
                    Cookie: `user_token=${user_token};`
                }
            }
        );
       
        const data = res.data;

        console.log("this is the data from pagination : ",data)
        return data.employeeRecords ;
    } catch (error) {
        return null;
    }



}