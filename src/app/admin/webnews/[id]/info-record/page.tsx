import db from '@/db/db'
import React from 'react'

type recordType = {
  page: string
  type: string
  column: number
  filePath: string
  core: string
}

export default async function ExistingPage({ params: { id } }: { params: { id: string } }) {
  const record = await db.webNews.findUnique({
    where: { id: id },
  })

  const { page, type, column, filePath, core } = record as recordType

  const fileId = filePath.split('v=')[1]

  const YOUTUBE_VIDEO_API = 'https://www.googleapis.com/youtube/v3/videos'
  const video = await fetch(
    `${YOUTUBE_VIDEO_API}?part=snippet,localizations&id=${fileId}&key=${process.env.YOUTUBE_API_KEY}`
  )
  const videoData = await video.json()

  console.log('admin/webnews/[id]/info-reord/page.tsx/[27]videoData')
  console.log(videoData)

  let description

  if (videoData.items.length > 0 && videoData.items[0].localizations) {
    description = videoData.items[0].localizations.nl
      ? videoData.items[0].localizations.nl.description
      : videoData.items[0].localizations['nl-NL']
      ? videoData.items[0].localizations['nl-NL'].description
      : videoData.items[0].snippet.title
  }

  return (
    <>
      <div className='flex basis-full justify-center text-6xl text-yellow-200'>Description</div>
      {/* <div className='flex flex-col gap-2 ml-80 text-yellow-200'> */}
      <p className='text-xl mx-96'>{description}</p>
      {/* </div> */}
    </>
  )
}
