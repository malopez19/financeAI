import React from 'react'
import CashList from './_components/CashList'

function Cash() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>Mi Dinero</h2>
      <CashList/>
    </div>
  )
}

export default Cash