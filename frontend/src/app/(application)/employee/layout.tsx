import EmployeeWrapperLayout from '@/components/common/employee-wraper-layout'
import { EmployeeHeader } from '@/components/desktop/employee/header/employee-header'

import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <EmployeeWrapperLayout>
      <div className="h-screen flex flex-col bg-[#161717]">
        <header>
          <EmployeeHeader />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </EmployeeWrapperLayout>
  )
}

export default layout
