import { RegistrationForm } from './registrationForm'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { schema } from './schema'
import db from '@/db/db'
import logging from '@/lib/logging'

/**
 * This function renders a page to update the webnews records for a given type.
 * It takes a string parameter "id" which is type for which all webnews records
 * should be updated.
 *
 * The component renders a RegistrationForm component which submits a form to the
 * onFormAction function.
 *
 * The onFormAction function processes the submitted form data and
 * updates the webnews records in the database.
 *
 * If the form data is invalid, the onFormAction function returns an object
 * with a message and an array of issues. The RegistrationForm component displays
 * this message and the issues in an error message.
 *
 * If the form data is valid, the onFormAction function redirects to the /admin/webnews/[page]/display
 * page.
 *
 * @param {{ params: { id: string } }} props - The id parameter is a string containing
 * the id of the section for which all web news records should be displayed.
 */
export default async function WebNewsUpdateType({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[id]/update-type/page.tsx[9]', func: 'WebNewsUpdateType' })

  const onFormAction = async (
    prevState: {
      message: string
      update?: z.infer<typeof schema>
      issues?: string[]
    },
    formData: FormData
  ) => {
    'use server'
    const data = Object.fromEntries(formData)
    const parsed = await schema.safeParseAsync(data)
    if (parsed.success) {
      const updatePageData = parsed.data

      await db.$transaction(async (tx) => {
        await tx.webNews.updateMany({
          where: { page: id },
          data: { page: updatePageData.page },
        })
        const pageRow = await tx.page.findUnique({ where: { name: id } })
        if (pageRow) {
          await tx.page.update({
            where: { name: id },
            data: { name: updatePageData.page },
          })
        }
      })

      redirect(`/admin/webnews/${updatePageData.page}/display`)
    } else {
      return {
        message: 'Invalid data',
        issues: parsed.error.issues.map((issue) => issue.message),
      }
    }
  }

  return (
    <div className='mx-auto max-w-xl'>
      <RegistrationForm onFormAction={onFormAction} />
    </div>
  )
}
