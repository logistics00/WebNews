import db from '@/db/db'
import { redirect } from 'next/navigation'
import React from 'react'

type recordType = {
  page: string
  type: string
  column: number
  filePath: string
  core: string
}

/**
 * This function is the Next.js page for the /admin/webnews/[id]/translate-record page.
 *
 * It takes a string parameter "id" which is the id of the webnews record for which
 * the title should be translated.
 *
 * It fetches the YouTube video with the given id and tries to translate the title of
 * the video to Dutch using the YouTube API.
 *
 * It then updates the webnews record in the database with the translated title.
 *
 * After the record is updated, it redirects to the /admin/webnews/[page]/display
 * page.
 */
export default async function ExistingPage({ params: { id } }: { params: { id: string } }) {
  let record = await db.webNews.findUnique({
    where: { id: id },
  })

  const { page, type, column, filePath, core } = record as recordType

  const fileId = filePath.split('v=')[1]

  const YOUTUBE_VIDEO_API = 'https://www.googleapis.com/youtube/v3/videos'
  const video = await fetch(
    `${YOUTUBE_VIDEO_API}?part=snippet,localizations&id=${fileId}&key=${process.env.YOUTUBE_API_KEY}`
  )
  const videoData = await video.json()

  // console.log('admin/webnews/[id]/translate-reord/page.tsx/[42]videoData')
  // console.log(videoData)
  // console.log('admin/webnews/[id]/translate-reord/page.tsx/[44]videoData.items[0].localizations')
  // console.log(videoData.items[0].localizations)
  // console.log('admin/webnews/[id]/translate-record/page.tsx/[46]videoData.items[0].localizations.nl')
  // console.log(videoData.items[0].localizations.nl)
  // console.log('admin/webnews/[id]/translate-reord/page.tsx/[48]videoData.items[0].snippet')
  // console.log(videoData.items[0].snippet)
  // console.log('admin/webnews/[id]/translate-reord/page.tsx/[50]videoData.items[0].snippet.channelTitle')
  // console.log(videoData.items[0].snippet.channelTitle)
  // console.log('admin/webnews/[id]/translate-reord/page.tsx/[2]videoData.items[0].snippet.title')
  // console.log(videoData.items[0].snippet.title)

  let title = videoData.items[0].snippet.title
  if (videoData.items.length > 0 && videoData.items[0].localizations) {
    title = videoData.items[0].localizations.nl
      ? videoData.items[0].localizations.nl.title
      : videoData.items[0].localizations['nl-NL']
      ? videoData.items[0].localizations['nl-NL'].title
      : videoData.items[0].snippet.title
  }

  console.log(title)

  if (record) {
    record.core = title
    record.core1 = title
    record.core2 = ''
    record.core3 = ''
    record.core4 = ''
    record.core5 = ''
    record.core6 = ''
    record.core7 = ''
    record.core8 = ''

    await db.webNews.update({
      where: { id: record.id },
      data: record,
    })

    redirect(`/admin/webnews/${record.page}/display`)
  }
}
