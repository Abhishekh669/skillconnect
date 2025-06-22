import CustomerWrapperLayout from '@/components/common/customer-wrapper-layout'
import { EnhancedSidebarTrigger } from '@/components/common/sidebar/sidebar-trigger-enhanced'
import { CustomerSidebar } from '@/components/desktop/customer/sidebar/customer-sidebar'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerWrapperLayout>
      <SidebarProvider>
        <CustomerSidebar />
        <SidebarInset>
          <header className='bg-[#161717] '>
            <EnhancedSidebarTrigger />
          </header>
          <div className='w-full h-full bg-[#161717] '>
            {children}
          </div>
        </SidebarInset>

      </SidebarProvider>
    </CustomerWrapperLayout>

  )
}

export default layout
