import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
          
        </div>
        <div>
            <UserButton fallbackRedirectUrl='/sign-in' afterSignOutUrl='/'/>
        </div>
       
    </div>
  )
}

export default DashboardHeader