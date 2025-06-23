import { auth } from '@/lib/actions/auth/auth';
import { getUserByIdInServer } from '@/lib/actions/user/get/user.get';
import { redirect } from 'next/navigation';

import React from 'react'

async function MainAppWrapper({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user?.user?.id) return redirect("/login")
  const userData = await getUserByIdInServer(user?.user?.id);
if(!userData?.user) return redirect("/login")
  return (
    <div className='w-full h-full'>
      {children}
    </div>
  )
}

export default MainAppWrapper;
