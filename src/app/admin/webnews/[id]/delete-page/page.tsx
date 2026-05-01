import { webNewsDeletePage } from '@/app/admin/_actions/webnews'
import logging from '@/lib/logging'

/**
 * This function deletes all webnews records from the specified page.
 *
 * The id parameter should contain the page for which all webnews records should be deleted.
 *
 * This function is called from the webnews/[id]/delete/page.tsx page.
 *
 * @param {{ params: { id: string } }} - Parameters passed to the function.
 * @param {string} params.id - The page for which all web news records should be deleted.
 */

export default async function WebNewsDeletePage({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[id]/delete/page.tsx[8]', func: 'WebNewsDeletePage' })

  await webNewsDeletePage(id)
}
