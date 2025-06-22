import { auth } from '@/lib/actions/auth/auth'
import { getUserById } from '@/lib/actions/user/get/user.action'
import { redirect } from 'next/navigation';
import React from 'react'

async function MainAppWrapper({children} : {children : React.ReactNode}) {
    const user = await auth();
    if(!user || !user?.user || !user?.user?.id) return redirect("/login")
    const userFromServer = await getUserById(user?.user?.id);
    if(!userFromServer?.user || !userFromServer?.user?.userId) return redirect("/login");

  return (
    <div className='w-full h-full'>
      {children}
    </div>
  )
}

export default MainAppWrapper;
