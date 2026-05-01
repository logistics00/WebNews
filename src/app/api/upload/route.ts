import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Papa from 'papaparse'
import db from '@/db/db'

const prisma = new PrismaClient()

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

function splitCore(data: any): any {
  const coreParts = data.core.split('#').filter((part: string) => part.trim() !== '')
  const maxLength = 7
  let indexShift
  {
    data.core[0].startsWith('#') ? (indexShift = 2) : (indexShift = 1)
  }

  return coreParts.reduce((result: Record<string, string | null>, part: string, index: number) => {
    const key = `core${index + indexShift}`
    result[key] = part
    return result
  }, {} as Record<string, string | null>)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const text = await file.text()
    const parsedData = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const webnews = parsedData.data.map((row: any) => ({
      page: row.page,
      type: row.type,
      column: parseInt(row.column, 10),
      filePath: row.filePath,
      searchTerms: row.searchTerms,
      writer: row.writer,
      core: row.core,
      core1: row.core1,
      core2: row.core1,
      core3: row.core1,
      core4: row.core1,
      core5: row.core1,
      core6: row.core1,
      core7: row.core1,
      core8: row.core1,
    }))

    for (let i = 0; i < webnews.length; i++) {
      await wait(100)
      let data = splitCore(webnews[i])

      await db.webNews.create({
        data: data,
      })
    }

    return NextResponse.json({ message: 'WebNews imported successfully!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process the file' }, { status: 500 })
  }
}
