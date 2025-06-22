"use client"
import { useGetEmployeeFromSession } from '@/lib/hooks/tanstack/query-hook/employee/useGetEmployeeFromSession'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function EmployeeWrapperLayout({children} : {children : React.ReactNode}) {
  const {data : employee, isLoading : employeeLoading} = useGetEmployeeFromSession();
  const router = useRouter();
  
  
  useEffect(()=>{
    if(!employeeLoading){
      if(!employee) {
        router.push("/login");
        return;
      }
      if(employee && employee.userRole !== "employee"){
        const path = employee.userRole ?  `${employee.userRole}/dashboard` : "/"
        router.push(path);
        return;
      }
    } 
  }, [employee, employeeLoading, router]) 
  
  if (employeeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!employee || employee.userRole !== "employee") {
    return null;
  }
  
  return (
    <div>
      {children}
    </div>
  )
}

export default EmployeeWrapperLayout