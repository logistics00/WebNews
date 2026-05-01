// import SubmitButton from '@/components/SubmitButton'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import db from '@/db/db'
import { redirect } from 'next/navigation'

export default async function UpdatePrisma() {

    const data = await db.webNews.findMany({
      where: {
        page: "JavaScript",
        // type: "JS-Testing/Debugging",
        // column: 2,
        // writer: "actualWriter",
      },
    })

    data.map(async (dat) => {
      dat.page = 'JavaScript-React'
      // dat.type = "TestDebug"
      // dat.column = 2
      // dat.writer = "newWriter"
      await db.webNews.update({
        where: {
          id: dat.id,
        },
        data: dat,
      })
    })

    redirect('/admin/webnews/CSS-HTML-HTTP/display')
  }
