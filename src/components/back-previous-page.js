'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function BackPreviousPage() {
  const router = useRouter()

  return <button onClick={router.back}>Back</button>
}
