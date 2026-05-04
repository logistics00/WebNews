import db from '@/db/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NewsPagesPage = async () => {
  const [pages, webnews] = await Promise.all([
    db.page.findMany({ orderBy: [{ column: 'asc' }, { row: 'asc' }] }),
    db.webNews.findMany({ select: { page: true, type: true } }),
  ])

  const maxRow = pages.reduce((m, p) => Math.max(m, p.row), 7)
  const numColumns = 5

  // cells[col-1][row-1] = Page | null
  const cells: (typeof pages[number] | null)[][] = Array.from({ length: numColumns }, () =>
    Array.from({ length: maxRow }, () => null)
  )
  for (const p of pages) {
    if (p.column >= 1 && p.column <= numColumns && p.row >= 1 && p.row <= maxRow) {
      cells[p.column - 1][p.row - 1] = p
    }
  }

  return (
    <div className='mt-5 mx-20 bg-blue-600 newspage'>
      <div className='flex justify-end mx-10 pt-3'>
        <Button asChild>
          <Link href='/admin/webnews/new-page'>Add Page</Link>
        </Button>
      </div>
      <div
        className='mt-5 mx-10 grid grid-cols-5 grid-flow-col gap-x-6 gap-y-2'
        style={{ gridTemplateRows: `repeat(${maxRow}, minmax(0, auto))` }}
      >
        {Array.from({ length: numColumns }, (_, colIdx) =>
          Array.from({ length: maxRow }, (_, rowIdx) => {
            const cell = cells[colIdx][rowIdx]
            const key = `${colIdx}-${rowIdx}`
            if (!cell) return <p key={key}></p>
            return (
              <a key={key} href={`/admin/webnews/${cell.name}/display`}>
                {cell.name} <br />
                <span className='text-xs text-black'>{getTypesPerPage(webnews, cell.name)}</span>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}

export default NewsPagesPage

function getTypesPerPage(webnews: { page: string; type: string }[], pageName: string) {
  const types = webnews.filter((obj) => obj.page === pageName && obj.type)
  const array = Array.from(new Set(types.map((record) => record.type)))

  let res = ''
  for (let i = 0; i < array.length; i++) res = res + ', ' + array[i]
  return res.substring(1)
}
