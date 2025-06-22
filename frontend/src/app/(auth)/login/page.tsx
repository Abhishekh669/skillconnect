import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/actions/auth/auth'
import { login } from '@/lib/actions/auth/login'
import { redirect } from 'next/navigation'
import React from 'react'

async function LoginPage() {
  const session = await auth();
  if(session) return redirect("/onboarding") 
  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center bg-gray-50'>
        <Card className='max-w-[350px] w-[350px] h-[200px] shadow-md'>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Please login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className='w-full' onClick={login}>Login with google</Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default LoginPage
