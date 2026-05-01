import { webNewsDeleteType } from '@/app/admin/_actions/webnews'
import logging from '@/lib/logging'

/**
 * This function deletes all webnews records for the page/type combination
 * as given by the id parameter. It redirects to the /admin/webnews/[page]/display
 * page afterwards.
 * @param {{ params: { id: string } }} props - The id parameter is a string
 * containing the page and type of the webnews records to be deleted.
 * The format is "page%2Ctype".
 */
export default async function WebNewsDeleteType({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/[page]/delete/page.tsx[8]', func: 'WebNewsDeleteType' })

  const [page, type] = id.split('%2C')

  await webNewsDeleteType(page, type)
}
