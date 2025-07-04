"use client"
import { useGetCustomerFromSession } from '@/lib/hooks/tanstack/query-hook/customer/useGetCustomerFromSession'
import { useCustomerStore } from '@/lib/store/customer/use-customer-store';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import { custom } from 'zod';

function CustomerWrapperLayout({ children }: { children: React.ReactNode }) {
    const { data: customerData, isLoading: customerDataLoading } = useGetCustomerFromSession();
    const { user, setUser } = useCustomerStore();

    useEffect(() => {
        if (customerDataLoading) return; 
        if(customerData){
           if(customerData.userRole  != "customer") return redirect("/")
            setUser(customerData)
        }
    }, [customerDataLoading, customerData, user, setUser]);

    if(customerDataLoading){
        return <div>loading....</div>
    }

    if(!customerData){
        return null;
    }

    return <div>{children}</div>;
}


export default CustomerWrapperLayout;