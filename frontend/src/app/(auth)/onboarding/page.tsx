import OnboardingFlow from '@/components/desktop/onboarding/onboarding-card';
import { auth } from '@/lib/actions/auth/auth'
import { getUserById } from '@/lib/actions/user/get/user.action';
import { redirect } from 'next/navigation';
import React from 'react'

const getUrl  = (userType : "employee" | "customer") =>{
   if(userType === "employee") return "/employee/dashboard"
   else if(userType === "customer") return "/customer/dashboard"
   else return "/"
}


async function OnboardingPage() {
  const user = await auth();
  if(!user || !user?.user || !user?.user.id )return  redirect('/login');
  const userFromServer = await getUserById(user?.user?.id);
  if(userFromServer) return  redirect(getUrl(userFromServer.user.userRole)); 
  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center bg-[#161717] '>
      <OnboardingFlow />
    </div>
  )
}

export default OnboardingPage
