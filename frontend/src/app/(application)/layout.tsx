import MainAppWrapper from '@/components/common/main-app-wrapper'
import React from 'react'

function MainAppWrapperLayout( {children} : {children : React.ReactNode}) {
  return (
        <MainAppWrapper >
            {children}
        </MainAppWrapper >
  )
}

export default MainAppWrapperLayout
