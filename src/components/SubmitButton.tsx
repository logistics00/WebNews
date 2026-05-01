import logging from '@/lib/logging'
import { Button } from './ui/button'
import { useFormStatus } from 'react-dom'

export default function SubmitButton() {
  logging({ rootPath: '/components/SubmitButton.tsx[4]', func: 'SubmitButton' })
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}
