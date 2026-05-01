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

/**
 * This component renders a form with a single field for the user to enter a new
 * page for the webnews records. The form submits to the onFormAction
 * function, passing the current state of the form and the form data. If the
 * form data is invalid, the onFormAction function should return an object with
 * a message and an array of issues. The RegistrationForm component will display
 * this message and the issues in an error message.
 *
 * If the form data is valid, the onFormAction function should redirect to the
 * /admin/webnews/[page]/display page.
 *
 * @param {{ onFormAction: (state: { message: string, update?: z.infer<typeof schema>, issues?: string[] }, data: FormData) => Promise<{ message: string, update?: z.infer<typeof schema>, issues?: string[] }> }} props - The props of the component.
 * @returns {React.ReactElement} The component
 */
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
