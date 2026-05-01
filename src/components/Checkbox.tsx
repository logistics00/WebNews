import React, { useState } from 'react'

type Input = { label?: string; checked: boolean; onChange: () => void }}

const Checkbox = ({ label, checked, onChange }: Input)  => {
  return (
    <label className='flex items-center space-x-2 cursor-pointer'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
      />
      {label && <span className='text-gray-700'>{label}</span>}
    </label>
  )
}

export default Checkbox
