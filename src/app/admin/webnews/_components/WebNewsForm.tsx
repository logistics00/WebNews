'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import SubmitButton from '@/components/SubmitButton'
import { Textarea } from '@/components/ui/textarea'
import { addWebNews, updateWebNews } from '../../_actions/webnews'
import { useFormState } from 'react-dom'
import { WebNews } from '@prisma/client'
import logging from '@/lib/logging'
import { usePathname } from 'next/navigation'
import { z } from 'zod'

const FormSchema = z.object({
  type: z.enum(['paper', 'youtube'], {
    required_error: 'You need to select a type.',
  }),
})

/**
 * Present form for new or update webnews record
 *
 * @param {{ webnews?: WebNews | null }} props - The props for this component.
 * @param {WebNews | null} props.webnews - The webnews record to be updated, or null if we are creating a new record.
 * @returns {React.ReactElement} - The form for creating or updating the webnews record.
 */
export function WebNewsForm({ webnews }: { webnews?: WebNews | null }) {
  logging({ rootPath: 'admin/webnews/page.tsx[13]', func: 'DisplayWebNewsPage' })
  const [error, action] = useFormState(webnews == null ? addWebNews : updateWebNews.bind(null, webnews.id), {})

  const [page, type, column] = usePathname().split('/')[3].split(',')

  return (
    <>
      <form action={action} className='ml-10 space-y-6'>
        <div className='flex gap 2'>
          <Label className='w-32' htmlFor='page'>
            Page
          </Label>
          <Input
            className='w-36'
            type='text'
            id='page'
            name='page'
            required
            defaultValue={webnews?.page || page || ''}
          />
          {typeof error === 'object' && error.page && <div className='text-destructive'>{error.page}</div>}
        </div>
        <div className='flex gap 2'>
          <Label className='w-32' htmlFor='type'>
            Type
          </Label>
          <Input
            className='w-36'
            type='text'
            id='type'
            name='type'
            required
            defaultValue={webnews?.type || type || ''}
          />
          {typeof error === 'object' && error.type && <div className='text-destructive'>{error.type}</div>}
        </div>
        <div className='flex gap 2'>
          <Label className='w-32' htmlFor='column'>
            Column
          </Label>
          <Input
            className='w-16'
            type='number'
            id='column'
            name='column'
            required
            defaultValue={webnews?.column || column || 1}
          />
          {typeof error === 'object' && error.column && <div className='text-destructive'>{error.column}</div>}
        </div>
        <div className='flex gap 2'>
          <Label className='w-32' htmlFor='filePath'>
            filePath
          </Label>
          <Textarea className='w-full' id='filePath' name='filePath' required defaultValue={webnews?.filePath || ''} />
          {typeof error === 'object' && error.filePath && <div className='text-destructive'>{error.filePath}</div>}
        </div>
        <div className='flex gap 2 '>
          <Label className='w-32' htmlFor='core'>
            Core
          </Label>
          <Input className='w-full' id='core' name='core' defaultValue={webnews?.core || ''} />
          {typeof error === 'object' && error.core && <div className='text-destructive'>{error.core}</div>}
        </div>
        <div className='flex gap 2 '>
          <div className='flex gap 2 mr-10'>
            <Label className='w-32' htmlFor='writer'>
              WriterShort
            </Label>
            <Input className='w-48' type='text' id='writer' name='writer' defaultValue={webnews?.writer || ''} />
            {typeof error === 'object' && error.writer && <div className='text-destructive'>{error.writer}</div>}
          </div>
          <div className='flex gap 2 w-80'>
            <Label className='w-32' htmlFor='writerFull'>
              WriterFull
            </Label>
            <Input className='w-48' type='text' id='writerFull' name='writerFull' />
            {error.writerFull && <div className='text-destructive'>{error.writerFull}</div>}
          </div>
        </div>
        <div className='flex gap 2 w-84'>
          <Label className='w-32' htmlFor='searchTerms'>
            searchTerms
          </Label>
          <Textarea className='w-1/4' id='searchTerms' name='searchTerms' defaultValue={webnews?.searchTerms || ''} />
          {typeof error === 'object' && error.searchTerms && (
            <div className='text-destructive'>{error.searchTerms}</div>
          )}
        </div>
        <div className='flex gap 2'>
          <Label className='w-32' htmlFor='origin'>
            Origin
          </Label>
          <RadioGroup id='origin' name='origin' defaultValue={webnews?.origin || 'paper'}>
            <div className='flex items-center space-x-2'>
              <Label htmlFor='paper' className='w-20'>
                Paper
              </Label>
              <RadioGroupItem value='paper' id='paper' className='mt-0 ml-0 p-0' />
            </div>
            <div className='flex items-center space-x-2'>
              <Label htmlFor='youtube' className='w-20'>
                Youtube
              </Label>
              <RadioGroupItem value='youtube' id='youtube' className='mt-0 ml-0 p-0' />
            </div>
            <div className='flex items-center space-x-2'>
              <Label htmlFor='read' className='w-20'>
                Read
              </Label>
              <RadioGroupItem value='read' id='read' className='mt-0 ml-0 p-0' />
            </div>
          </RadioGroup>
        </div>
        <div className='flex gap 2'>
          {/* <Checkbox label='Accepteer de voorwaarden' checked={isChecked} onChange={handleCheckboxChange} /> */}

          {/* <label
            htmlFor='copies'
            // className='w-32 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            className='w-32 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Copies?
          </label>
          <Checkbox id='copies' name='copies' className='mt-0 ml-0 p-0' /> */}

          <Label className='w-32' htmlFor='copies'>
            Copies?
          </Label>
          <Input className='w-16' type='text' id='copies' name='copies' defaultValue={'no'} />
          {error.copies && <div className='text-destructive'>{error.copies}</div>}
        </div>
        <SubmitButton />
      </form>
      {/* <script>
        // Dit zet de focus op het 'username' veld wanneer de pagina geladen is
        document.getElementById('filePath').focus();
      </script> */}
    </>
  )
}
