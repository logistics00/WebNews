'use server'

import db from '@/db/db'
import { z } from 'zod'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import logging from '@/lib/logging'
import { ChevronsLeftIcon } from 'lucide-react'

const youtubeSchema = z.object({
  page: z.string().min(1),
  type: z.string().min(1),
  column: z.coerce.number().int().min(1),
  filePath: z.string().min(1),
  searchTerms: z.string().optional(),
  core: z.string().optional(),
  writer: z.string().optional(),
  writerFull: z.string().optional(),
  origin: z.string().min(1),
  copies: z.boolean().optional(),
})

const paperSchema = z.object({
  page: z.string().min(1),
  type: z.string().min(1),
  column: z.coerce.number().int().min(1),
  filePath: z.string().min(1),
  searchTerms: z.string().optional(),
  core: z.string().min(1),
  writer: z.string().optional(),
  writerFull: z.string().optional(),
  origin: z.string().min(1),
  copies: z.string().optional(),
})

export async function addWebNews(prevState: unknown, formData: FormData) {
  logging({ rootPath: 'admin/_actions/webnews.ts[20]', func: 'addWebNews' })

  // Get the input without validity-check
  const input = Object.fromEntries(formData.entries())

  // console.log('admin/_actions/webnews.ts/addWebNews[42]input.copies')
  // console.log(input.copies)

  // If no copies are allowed, then check if record is already in webNews
  let record
  if (input.copies === 'no') {
    // if (input.copies === undefined) {
    // Get record(s) in webNews with the same filePath
    record = await db.webNews.findMany({
      where: {
        filePath: input.filePath.toString(),
      },
    })

    if (record.length > 0) {
      // console.log(`Het item bestaat reeds als: ${record[0].page}/${record[0].type}/${record[0].column}`)
      redirect(`/admin/webnews/${record[0].id}/existing`)
    }
  }

  // console.log('admin/_actions/webnews.ts/addWebNews[62]input.copies')

  // Remove unnecessary fields from input
  delete input.copies
  delete input.writerFull

  const page = input.page
  let completeData = {}

  const origin = input.filePath.toString().split('?v=')[0]
  if (origin === 'https://www.youtube.com/watch') {
    input.origin = "youtube"
  }

  // Is the new record a youtube video or a paper?
  if (input.origin === 'youtube') {
    const parsedFormData = youtubeSchema.safeParse(input)
    if (!parsedFormData.success) return parsedFormData.error.formErrors.fieldErrors

    const id = input.filePath.toString().split('?v=')[1]
    const YOUTUBE_VIDEO_API = 'https://www.googleapis.com/youtube/v3/videos'
    const video = await fetch(
      `${YOUTUBE_VIDEO_API}?part=snippet,localizations&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    )
    const videoData = await video.json()

    // console.log('admin/_actions/webnews.ts/addWebNews[83]videoData')
    // console.log(videoData)
    // console.log('admin/_actions/webnews.ts/addWebNews[85]videoData.items[0].localizations')
    // console.log(videoData.items[0].localizations)
    // console.log('admin/_actions/webnews.ts/addWebNews[87]videoData.items[0].localizations.nl')
    // console.log(videoData.items[0].localizations.nl)
    // console.log('admin/_actions/webnews.ts/addWebNews[89]videoData.items[0].snippet')
    // console.log(videoData.items[0].snippet)
    // console.log('admin/_actions/webnews.ts/addWebNews[91]videoData.items[0].snippet.channelTitle')
    // console.log(videoData.items[0].snippet.channelTitle)
    // console.log('admin/_actions/webnews.ts/addWebNews[93]videoData.items[0].snippet.title')
    // console.log(videoData.items[0].snippet.title)

    let title = videoData.items[0].snippet.title
    if (videoData.items.length > 0 && videoData.items[0].localizations) {
      title = videoData.items[0].localizations.nl
        ? videoData.items[0].localizations.nl.title
        : videoData.items[0].localizations['nl-NL']
        ? videoData.items[0].localizations['nl-NL'].title
        : videoData.items[0].snippet.title
    }

    const data = parsedFormData.data

    const completeData = {
      ...data,
      column: +data.column,
      writer: videoData.items[0].snippet.channelTitle,
      core: title,
      publishedAt: videoData.items[0].snippet.publishedAt,
      ...splitCore(title),
    }

    // console.log('admin/_actions/webnews.ts/addWebNews[116]completeData')
    // console.log(completeData)

    const created = await db.webNews.create({ data: completeData })
  } else {
    const parsedFormData = paperSchema.safeParse(input)
    if (!parsedFormData.success) return parsedFormData.error.formErrors.fieldErrors

    const data = parsedFormData.data

    const completeData = {
      ...data,
      column: +data.column,
      publishedAt: new Date(),
      ...splitCore(parsedFormData.data.core),
    }

    // console.log('admin/_actions/webnews.ts/addWebNews[133]completeData')
    // console.log(completeData)

    const created = await db.webNews.create({ data: completeData })
  }

  revalidatePath('/')
  revalidatePath('/webnews')

  redirect(`/admin/webnews/${page}/display`)
}

export async function updateWebNews(id: string, _prevState: unknown, formData: FormData) {
  logging({ rootPath: 'admin/_actions/webnews.ts[43]', func: 'updateWebNews' })
  const webNews = await db.webNews.findUnique({ where: { id } })
  if (webNews == null) return notFound()

  if (webNews.origin === "youtube") {
    const id = webNews.filePath.toString().split('?v=')[1]
    const YOUTUBE_VIDEO_API = 'https://www.googleapis.com/youtube/v3/videos'
    const video = await fetch(
      `${YOUTUBE_VIDEO_API}?part=snippet,localizations&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
    )
    const videoData = await video.json()

    // console.log('admin/_actions/webnews.ts/addWebNews[158]videoData')
    // console.log(videoData)
    // console.log('admin/_actions/webnews.ts/addWebNews[160]videoData.items[0].localizations')
    // console.log(videoData.items[0].localizations)
    // console.log('admin/_actions/webnews.ts/addWebNews[162]videoData.items[0].localizations.nl')
    // console.log(videoData.items[0].localizations.nl)
    // console.log('admin/_actions/webnews.ts/addWebNews[164]videoData.items[0].snippet')
    // console.log(videoData.items[0].snippet)
    // console.log('admin/_actions/webnews.ts/addWebNews[166]videoData.items[0].snippet.channelTitle')
    // console.log(videoData.items[0].snippet.channelTitle)
    // console.log('admin/_actions/webnews.ts/addWebNews[168]videoData.items[0].snippet.title')
    // console.log(videoData.items[0].snippet.title)
  }

  // Get the input without validity-check and remove unnecessary fields, followed by validity-check
  const input = Object.fromEntries(formData.entries())
  delete input.copies
  delete input.writerFull
  const parsedFormData = paperSchema.safeParse(input)
  if (!parsedFormData.success) return parsedFormData.error.formErrors.fieldErrors

  // construct record coresRecord with elements core1 ... core8
  const coresRecord: Record<string, null> = {}
  for (let i = 1; i < 9; i++) {
    const key = `core${i}`
    coresRecord[key] = null
  }

  const data = parsedFormData.data

  let completeWebNews = {
    ...webNews,
    ...data,
    column: +data.column,
    ...coresRecord,
    ...splitCore(data.core),
  }

  // console.log('admin/_actions/webnews.ts/updateWebNews[137]')
  // console.log(completeWebNews)

  await db.webNews.update({
    where: { id },
    data: completeWebNews,
  })

  revalidatePath('/')
  revalidatePath('/webnews')

  redirect(`/admin/webnews/${completeWebNews.page}/display`)
}

function splitCore(data: string): Record<string, string> {
  const coreParts = data.split('#').filter((part: string) => part.trim() !== '')
  const maxLength = 7
  let indexShift
  {
    data.startsWith('#') ? (indexShift = 2) : (indexShift = 1)
  }
  return coreParts.reduce((result: Record<string, string>, part: string, index: number) => {
    const key = `core${index + indexShift}`
    result[key] = part
    return result
  }, {})
}

export async function webNewsDeleteRecord(id: string) {
  logging({ rootPath: 'admin/_actions/webnews.ts[158]', func: 'webNewsDeleteRecord' })
  const webNews = await db.webNews.findUnique({ where: { id: id } })
  if (webNews === null) return notFound()

  const deleted = await db.webNews.delete({ where: { id: id } })

  revalidatePath('/')
  revalidatePath('/webnews')

  redirect(`/admin/webnews/${deleted.page}/display`)
}

export async function webNewsDeleteType(page: string, type: string) {
  logging({ rootPath: 'admin/_actions/webnews.ts[171]', func: 'webNewsDeleteType' })
  const webNews = await db.webNews.findMany({ where: { page: page, type: type } })
  if (webNews === null) return notFound()

  const deleted = await db.webNews.deleteMany({ where: { page: page, type: type } })

  revalidatePath('/')
  revalidatePath('/webnews')

  redirect(`/admin/webnews/${page}/display`)
}

export async function webNewsDeletePage(page: string) {
  logging({ rootPath: 'admin/_actions/webnews.ts[184]', func: 'webNewsDeletePage' })
  const webNews = await db.webNews.findMany({ where: { page: page } })
  if (webNews === null) return notFound()

  const deleted = await db.webNews.deleteMany({ where: { page: page } })

  revalidatePath('/')
  revalidatePath('/webnews')

  redirect(`/admin/webnews/${page}/display`)
}

const updateSchema = z.object({
  actualPage: z.string().optional(),
  actualType: z.string().optional(),
  actualColumn: z.coerce.number().int().optional(),
  actualWriter: z.string().optional(),
  newPage: z.string().optional(),
  newType: z.string().optional(),
  newColumn: z.coerce.number().int().optional(),
  newWriter: z.string().optional(),
})

type FormState = {
  message: string
}

export async function deleteSectionsWebNews(prevState: FormState, formData: FormData) {
  logging({ rootPath: 'admin/_actions/webnews.ts[215]', func: 'deleteSectionsWebNews' })
  // Get the input without validity-check
  const input = Object.fromEntries(formData.entries())

  const parsedFormData = updateSchema.safeParse(input)
  if (!parsedFormData.success) return parsedFormData.error.formErrors.fieldErrors

  console.log('admin/_actions/webnews.ts/deleteSectionsWebNews[223]')
  console.log(input.actualPage.toString())
  console.log(input.actualType.toString())
  console.log(parseInt(input.actualColumn.toString()))
  console.log(input.actualWriter.toString())

  // const data = await db.webNews.deleteMany({
  //   where: {
  //     page: input.actualPage.toString(),
  //     type: input.actualType.toString(),
  //     column: parseInt(input.actualColumn.toString()),
  //     writer: input.actualWriter.toString(),
  //   },
  // })
}
