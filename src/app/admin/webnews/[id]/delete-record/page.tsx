import logging from '@/lib/logging'
import { webNewsDeleteRecord } from '@/app/admin/_actions/webnews'

/**
 * This function delete the webnews record met id
 * @param {Object} params - URL parameters
 * @param {string} params.id - ID of the record to delete
 * @returns {Promise<void>}
 */
export default async function WebNewsDeleteRecord({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[page]/delete/page.tsx[6]', func: 'WebNewsDeleteRecord' })

  await webNewsDeleteRecord(id)
}
