import OnboardingFlow from '@/components/desktop/onboarding/onboarding-card';
import { auth} from '@/lib/actions/auth/auth'
import { handleLogOut } from '@/lib/actions/auth/log-out';
import { redirect } from 'next/navigation';
import React from 'react'




async function OnboardingPage() {
  const user = await auth();
  if(!user || !user?.user || !user?.user.id ){
    await handleLogOut();
    return redirect("/login")
  }
  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center bg-[#161717] '>
      <OnboardingFlow user={user} />
    </div>
  )
}

export default OnboardingPage
