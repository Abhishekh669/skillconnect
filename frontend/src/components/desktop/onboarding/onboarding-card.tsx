"use client"

import { useEffect, useState } from "react"
import { UserTypeStep } from "./steps/user-type-step"
import { CompletionStep } from "./steps/completion-step"
import { OnboardingData } from "@/lib/types/onboarding/types/types"
import { BasicInfoStep } from "./steps/basic-info-steps"
import { EmployeeProfileStep } from "./steps/employee-profile"
import { Session } from "next-auth"
import { useGetUserById } from "@/lib/hooks/tanstack/query-hook/user/get-user-by-id"
import { redirect } from "next/navigation"

export default function OnboardingFlow({user} : {user : Session}) {
  if(!user || !user.user  || !user.user.id) return redirect("/")
  const {data : userData , isLoading : userDataLoading}  = useGetUserById(user.user.id);
console.log(userData)
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    username: "",
    phoneNumber: "",
    location: {
      address: "",
      coordinate: [0, 0],
    },
    userType: "customer",
    employeeProfile: null,
  })


  useEffect(()=>{
    if(userDataLoading)return;
    if(userData && userData.user){
      return redirect(`/${userData.user.userRole}/dashboard`);

    }
  },[userDataLoading, userData])

  

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={onboardingData} updateData={updateData} onNext={nextStep} />
      case 2:
        return <UserTypeStep data={onboardingData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case 3:
        if (onboardingData.userType === "employee") {
          return (
            <EmployeeProfileStep data={onboardingData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )
        } else {
          return <CompletionStep data={onboardingData} onBack={prevStep} />
        }
      case 4:
        return <CompletionStep data={onboardingData} onBack={prevStep} />
      default:
        return null
    }
  } 

  if(userDataLoading){
    return <div>...loading</div>
  }

  return (
    <div className="max-w-[500px] bg-[#242626] border-none text-white text-shadow-emerald-600 w-[500px] h-[auto] shadow-emerald-600 p-10 rounded-lg">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">
              Step {currentStep} of {onboardingData.userType === "employee" ? 4 : 3}
            </span>
            <span className="text-sm text-white">
              {Math.round((currentStep / (onboardingData.userType === "employee" ? 4 : 3)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / (onboardingData.userType === "employee" ? 4 : 3)) * 100}%`,
              }}
            />
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}









// "use client"
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Session } from 'next-auth'

// import React, { useRef, useState } from 'react'

// function OnboardingCard({ user }: { user: Session }) {
//     const [step, setStep] = useState(1)
//     const [avatar, setAvatar] = useState(user.user?.image || '')
//     const [name, setName] = useState(user.user?.name || '')
//   const [username, setUsername] = useState('')
//   const [phone, setPhone] = useState('')
//   const [address, setAddress] = useState('')
//   const [lat, setLat] = useState<number | null>(null)
//   const [lon, setLon] = useState<number | null>(null)
//   const [role, setRole] = useState('customer')
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleAvatarClick = () => {
//     fileInputRef.current?.click()
//   }

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (ev) => {
//         setAvatar(ev.target?.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleUseLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setLat(pos.coords.latitude)
//         setLon(pos.coords.longitude)
//         // TODO: Reverse geocode to address if needed
//       })
//     }
//   }

//   return (
//     <Card className='max-w-[500px] bg-[#242626] border-none text-white text-shadow-emerald-600 w-[500px] h-[auto] shadow-emerald-600'>
//       <CardHeader>
//         <CardTitle className='text-center text-xl text-white'>User Information</CardTitle>
//       </CardHeader>
//       <CardContent>
        
//         {step === 1 && (
//           <div className='flex flex-col items-center gap-4'>
//             {/* Avatar */}
//             <div className='relative'>
//               <img
//                 src={avatar || '/default-avatar.png'}
//                 alt='User Avatar'
//                 className='w-24 h-24 rounded-full object-cover border-2 border-emerald-500 cursor-pointer bg-[#1a1a1a]'
//                 onClick={handleAvatarClick}
//               />
//               <input
//                 type='file'
//                 accept='image/*'
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleAvatarChange}
//               />
//             </div>
//             {/* Name */}
//             <input
//               className='w-full p-2 rounded bg-[#1a1a1a] text-white border border-emerald-700 placeholder-emerald-400'
//               placeholder='Name'
//               value={name}
//               onChange={e => setName(e.target.value)}
//             />
//             {/* Username */}
//             <input
//               className='w-full p-2 rounded bg-[#1a1a1a] text-white border border-emerald-700 placeholder-emerald-400'
//               placeholder='Username'
//               value={username}
//               onChange={e => setUsername(e.target.value)}
//             />
//             {/* Phone */}
//             <input
//               className='w-full p-2 rounded bg-[#1a1a1a] text-white border border-emerald-700 placeholder-emerald-400'
//               placeholder='Phone Number'
//               value={phone}
//               onChange={e => setPhone(e.target.value)}
//             />
//             {/* Address */}
//             <input
//               className='w-full p-2 rounded bg-[#1a1a1a] text-white border border-emerald-700 placeholder-emerald-400'
//               placeholder='Address'
//               value={address}
//               onChange={e => setAddress(e.target.value)}
//             />
//             <button
//               className='mt-2 px-3 py-1 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition'
//               onClick={handleUseLocation}
//               type='button'
//             >
//               Use Current Location
//             </button>
//             {lat && lon && (
//               <div className='text-xs text-emerald-400'>
//                 <span className='text-white'>Lat:</span> {lat.toFixed(5)}, <span className='text-white'>Lon:</span> {lon.toFixed(5)}
//               </div>
//             )}
//             <button
//               className='mt-4 px-4 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition w-full'
//               onClick={() => setStep(2)}
//               type='button'
//             >
//               Next
//             </button>
//           </div>
//         )}
//         {step === 2 && (
//           <div className='flex flex-col items-center gap-4'>
//             <div className='w-full'>
//               <div className='text-center mb-2 text-white'>Select your role:</div>
//               <div className='flex justify-around'>
//                 {['customer', 'employee', 'admin'].map(r => (
//                   <label key={r} className={`cursor-pointer px-3 py-2 rounded ${role === r ? 'bg-emerald-600 text-white' : 'bg-[#1a1a1a] text-emerald-400'}`}>
//                     <input
//                       type='radio'
//                       name='role'
//                       value={r}
//                       checked={role === r}
//                       onChange={() => setRole(r)}
//                       className='hidden'
//                     />
//                     {r.charAt(0).toUpperCase() + r.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             {/* TODO: Show additional UI based on role */}
//             <div className='flex gap-2 w-full mt-4'>
//               <button
//                 className='flex-1 px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-800 transition border border-white'
//                 onClick={() => setStep(1)}
//                 type='button'
//               >
//                 Back
//               </button>
//               <button
//                 className='flex-1 px-4 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition'
//                 type='button'
//               >
//                 Finish
//               </button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default OnboardingCard
