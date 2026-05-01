import db from '@/db/db'
import styles from '../../../../styles/Home.module.css'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useActionState } from 'react'
import FormSubmit from '@/components/form-submit'

type Item = {
  id: string
  snippet: {
    title: string
    publishedAt: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    resourceId: {
      videoId: string
    }
    channelTitle: string
  }
}

export default async function VideoList({ params: { id } }: { params: { id: string } }) {
  const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems'

  const videoList = await fetch(
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${id}&key=${
      process.env.YOUTUBE_API_KEY
    }&_=${new Date()}`
    // `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${id}&maxResults=50&key=${
    //   process.env.YOUTUBE_API_KEY
    // }&_=${new Date()}`
  )
  const data = await videoList.json()

  // console.log('admin/youtube/[id]/videolist/page.tsx/VideoList[31]')
  // console.log(data)

  data.items.map(async (item: Item, index: number) => {
    const { id, snippet } = item
    const { title, publishedAt, thumbnails, resourceId, channelTitle } = snippet
    const { medium } = thumbnails
    const { url, width, height } = medium
    const { videoId } = resourceId

    // console.log('admin/youtube/[id]/videolist/page.tsx/VideoList[41]')
    // console.log(videoId)

    const YOUTUBE_VIDEO_API = 'https://www.googleapis.com/youtube/v3/videos'
    const video = await fetch(`${YOUTUBE_VIDEO_API}?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`)
    const videoData = await video.json()

    // console.log('admin/youtube/[id]/videolist/page.tsx/VideoList[48]')
    // console.log(videoData)
    // console.log(videoData.items[0].snippet.channelTitle)

    const data = {
      page: 'EtenDrinken',
      type: 'Eten',
      column: 1,
      filePath: 'https://www.youtube.com/watch?v=' + videoId,
      core: videoData.items[0].snippet.title,
      core1: videoData.items[0].snippet.title,
      writer: videoData.items[0].snippet.channelTitle,
      publishedAt: videoData.items[0].snippet.publishedAt,
      origin: 'youtube',
    }

    const result = await db.webNews.create({ data: data })
  })
}
