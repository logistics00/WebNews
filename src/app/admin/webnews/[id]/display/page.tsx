import { Button } from '@/components/ui/button'
import Link from 'next/link'
import db from '@/db/db'
import logging from '@/lib/logging'
import { WebNewsVertical } from '../../_components/WebNewsDisplay'
import { revalidatePath } from 'next/cache'

/**
 * This function renders a page to display all webnews records from a given page
 *
 * It takes a string parameter "id" which is the page for which all webnews records
 * should be displayed.
 *
 * It returns a JSX element containing a horizontally split section with four
 * vertical columns, each containing all web news records from the given page which
 * have a certain column number.
 *
 * The records are grouped by type and sorted by publishedAt in descending order.
 *
 * The component also shows a header with a link to update the page and a button to
 * add a new webnews record.
 *
 * The component uses the revalidatePath function from "next/cache" to revalidate the
 * page '/webnews' after the component has been rendered.
 *
 * @param {{ params: { id: string } }} props - The "id" parameter is a string containing
 * the page for which all web news records should be displayed.
 */
export default async function DisplayWebnewsPage({ params: { id } }: { params: { id: string } }) {
  logging({ rootPath: 'admin/webnews/page.tsx[13]', func: 'DisplayWebNewsPage' })

  let recordsForColumn = []
  let webNewsRecords
  let types: string[]
  let amountOfRecords = 0

  // Process the columns
  for (let i = 1; i < 5; i++) {
    webNewsRecords = await db.webNews.findMany({
      where: { page: id, column: i },
      orderBy: [{ type: 'asc' }, { publishedAt: 'desc' }],
    })

    // Process the types within the actual column
    let recordsForTypes = []
    amountOfRecords = amountOfRecords + webNewsRecords.length
    types = Array.from(new Set(webNewsRecords.map((record) => record.type)))
    for (let j = 0; j < types.length; j++) {
      recordsForTypes.push(webNewsRecords.filter((record) => record.type === types[j]))
    }

    recordsForColumn.push(recordsForTypes)
  }

  // revalidatePath('/webnews') // Cancelled, not allowed for Next.js 14+

  return (
    <>
      <div className='bg-blue-900'>
        <div className='flex justify-between mx-4'>
          <div className='flex mx-4 gap-2 text-yellow-200'>
            <a href={`/admin/webnews/${id}/update-page`}>U</a>
            <h2>
              {id} ({amountOfRecords})
            </h2>
          </div>
          <Button asChild>
            <Link href='/admin/webnews/new'>Add WebNews</Link>
          </Button>
        </div>
        <section className='horizontal bg-blue-900'>
          <section className='vertical'>
            <WebNewsVertical webnews={recordsForColumn[0]} />
          </section>
          <section className='vertical'>
            <WebNewsVertical webnews={recordsForColumn[1]} />
          </section>
          <section className='vertical'>
            <WebNewsVertical webnews={recordsForColumn[2]} />
          </section>
          <section className='vertical'>
            <WebNewsVertical webnews={recordsForColumn[3]} />
          </section>
        </section>
      </div>
    </>
  )
}
