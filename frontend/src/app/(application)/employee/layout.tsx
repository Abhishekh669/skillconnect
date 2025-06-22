import EmployeeWrapperLayout from '@/components/common/employee-wraper-layout copy'
import { EnhancedSidebarTrigger } from '@/components/common/sidebar/sidebar-trigger-enhanced'
import { EmployeeSidebar } from '@/components/desktop/employee/sidebar/employee-sidebar'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import React from 'react'

function layout({children} : {children : React.ReactNode}) {
  return (
    <EmployeeWrapperLayout>
       <SidebarProvider>
      <EmployeeSidebar />
      <SidebarInset>
        <header className='bg-[#161717] '>
          <EnhancedSidebarTrigger />
        </header>
        <div className='w-full h-full bg-[#161717] '>
        {children}
        </div>
        </SidebarInset>
    </SidebarProvider>
    </EmployeeWrapperLayout>
  )
}

export default layout
