"use client"
import { useGetEmployeeFromSession } from '@/lib/hooks/tanstack/query-hook/employee/useGetEmployeeFromSession'
import { useEmployeeStore } from '@/lib/store/employee/use-employee-store';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function EmployeeWrapperLayout({children} : {children : React.ReactNode}) {
  const {data : employee, isLoading : employeeLoading} = useGetEmployeeFromSession();
  const {user, setUser} = useEmployeeStore();
console.log("this is the employee data : ",employee)

  useEffect(()=>{
    if(employeeLoading) return;
    if(employee){
      if(employee.userRole != "employee")return redirect("/")
      setUser(employee)
    }
  },[employeeLoading, employee, user, setUser])
  

  
  if (employeeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }
  
  if(!employee)return null;
 
  
  return (
    <div>
      {children}
    </div>
  )
}

export default EmployeeWrapperLayout