"use client"
import { useGetCustomerFromSession } from '@/lib/hooks/tanstack/query-hook/customer/useGetCustomerFromSession'
import { useCustomerStore } from '@/lib/store/customer/use-customer-store';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

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

    return <div>{children}</div>;
}

export default CustomerWrapperLayout;