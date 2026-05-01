import db from '@/db/db'
import { PageHeader } from '../../../_components/PageHeader'
import { WebNewsForm } from '../../_components/WebNewsForm'
import logging from '@/lib/logging'

/**
 * This function updates the webnews record with the specified ID.
 * @param {Object} params - URL parameters
 * @param {string} params.id - ID of the record to delete
 * @returns {Promise<void>}
 */
export default async function UpdateWebNewsPage({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[id]/update]/page.tsx[7]', func: 'UpdateWebNewsPage' })
  const webnews = await db.webNews.findUnique({ where: { id } })

  return (
    <>
      <PageHeader>Edit WebNews</PageHeader>
      <WebNewsForm webnews={webnews} />
    </>
  )
}
