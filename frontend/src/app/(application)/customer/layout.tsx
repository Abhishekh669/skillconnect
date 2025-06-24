import CustomerWrapperLayout from '@/components/common/customer-wrapper-layout'
import { EnhancedSidebarTrigger } from '@/components/common/sidebar/sidebar-trigger-enhanced'
import { CustomerHeader } from '@/components/desktop/customer/header/customer-header'
import { CustomerSidebar } from '@/components/desktop/customer/sidebar/customer-sidebar'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerWrapperLayout>
     <div className="min-h-screen bg-[#161717]">
        <CustomerHeader />
        <main className="w-full h-full bg-[#161717]">{children}</main>
      </div>
    </CustomerWrapperLayout>

  )
}

export default layout
