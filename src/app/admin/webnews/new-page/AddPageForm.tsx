'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/SubmitButton'
import { addPage } from '../../_actions/webnews'

type FieldErrors = Partial<Record<'name' | 'column' | 'row', string[]>>

export function AddPageForm() {
  const [error, action] = useFormState<FieldErrors, FormData>(addPage as any, {})

  return (
    <form action={action} className='ml-10 space-y-6 max-w-md'>
      <div className='flex gap-2 items-center'>
        <Label className='w-32' htmlFor='name'>
          Name
        </Label>
        <Input className='w-64' type='text' id='name' name='name' required />
      </div>
      {error?.name && <div className='ml-32 text-destructive'>{error.name}</div>}

      <div className='flex gap-2 items-center'>
        <Label className='w-32' htmlFor='column'>
          Column (1–5)
        </Label>
        <Input
          className='w-20'
          type='number'
          id='column'
          name='column'
          min={1}
          max={5}
          defaultValue={1}
          required
        />
      </div>
      {error?.column && <div className='ml-32 text-destructive'>{error.column}</div>}

      <div className='flex gap-2 items-center'>
        <Label className='w-32' htmlFor='row'>
          Row (1–7)
        </Label>
        <Input
          className='w-20'
          type='number'
          id='row'
          name='row'
          min={1}
          max={7}
          defaultValue={1}
          required
        />
      </div>
      {error?.row && <div className='ml-32 text-destructive'>{error.row}</div>}

      <div className='flex gap-3'>
        <SubmitButton />
        <Button asChild variant='outline'>
          <Link href='/admin/webnews/newspages'>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
