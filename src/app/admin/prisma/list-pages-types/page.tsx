import db from '@/db/db'

export default async function ListPagesTypesPrisma() {

  let webnews = await db.webNews.findMany({
    // where: {
    //   page: 'Hobby',
    //   type: 'Android',
    // },
    select: {
      page: true,
      type: true,
    },
    orderBy: [{ page: 'asc' }, { type: 'asc' }],
  })

  const uniqueWebNews = webnews.filter(
    (obj, index, self) => index === self.findIndex((o) => o.page === obj.page && o.type === obj.type)
  )

  console.log('admin/prisma/list-pages-types/pages.tsx/ListPagesTypesPrisma[21]')
  console.log(webnews)
  console.log('admin/prisma/list-pages-types/pages.tsx/ListPagesTypesPrisma[23]')
  console.log(uniqueWebNews)

// return (
//   <>
//     {webnews.map((webnew) => {

//         <div>
//           <p>{page}</p>
//           <p>{type}</p>
//         </div>
//       })}
//     </>
//   )
}
