'use client'

import { useFormStatus } from 'react-dom'

export default function FormSubmit() {
  const status = useFormStatus()

  if (status.pending) {
    return <p>Executing...</p>
  }

  return (
    <>
      <button type='reset'>Reset</button>
      <button>Execute</button>
    </>
  )
}
