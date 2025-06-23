import MainAppWrapper from '@/components/common/main-app-wrapper'
import React from 'react'

async function MainAppWrapperLayout( {children} : {children : React.ReactNode}) {
  return (
        <MainAppWrapper  >
            {children}
        </MainAppWrapper >
  )
}

export default MainAppWrapperLayout
