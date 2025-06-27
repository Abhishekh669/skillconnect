import CustomerEmployeeIdCompo from '@/components/desktop/customer/search-employee/CustomerEmployeeIdCompo'
import { auth } from '@/lib/actions/auth/auth'
import { redirect } from 'next/navigation'
import React from 'react'

async function CustomerEmployeeIdPage() {
    const session = await auth()
    if(!session?.user?.id)return redirect("/")
  return (
    <div>
        <CustomerEmployeeIdCompo />
    </div>
  )
}

export default CustomerEmployeeIdPage
