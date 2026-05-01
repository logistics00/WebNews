'use client'
import { useFormState } from 'react-dom'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { schema } from './schema'

export const RegistrationForm = ({
  onFormAction,
}: {
  onFormAction: (
    prevState: {
      message: string
      update?: z.infer<typeof schema>
      issues?: string[]
    },
    data: FormData
  ) => Promise<{
    message: string
    update?: z.infer<typeof schema>
    issues?: string[]
  }>
}) => {
  const [state, formAction] = useFormState(onFormAction, { message: '' })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      page: '',
      type: '',
      column: '',
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Form {...form}>
      <div>{state?.message}</div>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => formRef?.current?.submit())}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='page'
          render={({ field }) => (
            <FormItem>
              <div className='flex gap-2'>
                <FormLabel className='w-96'>The Page</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <div className='flex gap-2'>
                <FormLabel className='w-96'>The Type</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='column'
          render={({ field }) => (
            <FormItem>
              <div className='flex gap-2'>
                <FormLabel className='w-96'>The Column</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
