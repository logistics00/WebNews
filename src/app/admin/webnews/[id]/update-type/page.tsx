import { RegistrationForm } from './registrationForm'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { schema } from './schema'
import db from '@/db/db'
import logging from '@/lib/logging'

/**
 * This function moves the records within a type to a new page/type/column combination.
 * The new position is determined by the data in the form.
 * @param {{ params: { id: string } }} props - The id parameter is a string
 * containing the new page, type and column of the webnews records.
 * The format is "page%2Ctype%2Ccolumn".
 * @returns {JSX.Element} A registration form
 */
export default async function WebNewsUpdateType({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[id]/update-type/page.tsx[10]', func: 'WebNewsUpdateType' })

  const [page, type, column] = id.split('%2C')

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
      const updateTypeData = parsed.data

      updateTypeData.page === '' && (updateTypeData.page = page)
      updateTypeData.type === '' && (updateTypeData.type = type)
      updateTypeData.column === '' && (updateTypeData.column = column)

      // Get the records which must be removed
      const data = await db.webNews.findMany({
        where: {
          page: page,
          type: type,
          column: parseInt(column),
        },
      })

      const amountRest = data.length % 50
      const restData = amountRest > 0 ? data.slice(0, amountRest) : data.slice(0, 50)

      // Move the records to the new position
      restData.map(async (dat) => {
        dat.page = updateTypeData.page
        dat.type = updateTypeData.type
        dat.column = parseInt(updateTypeData.column)
        await db.webNews.update({
          where: {
            id: dat.id,
          },
          data: dat,
        })
      })

      redirect(`/admin/webnews/${updateTypeData.page}/display`)
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
