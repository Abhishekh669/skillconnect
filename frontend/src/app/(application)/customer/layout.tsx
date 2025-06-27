import CustomerWrapperLayout from '@/components/common/customer-wrapper-layout'
import { CustomerHeader } from '@/components/desktop/customer/header/customer-header'

import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerWrapperLayout>
      <div className="h-screen flex flex-col bg-[#161717]">
        <header>
          <CustomerHeader />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </CustomerWrapperLayout>
  )
}

export default layout
