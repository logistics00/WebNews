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

type WebNews = {
  page: string
  type: string
  column: number
  filePath: string
  core: string
  core1: string
  writer: string
  publishedAt: string
  origin: string
}

export default function VideoList({ params: { id } }: { params: { id: string } }) {
  async function createPost(formData: any): Promise<any> {
    'use server'
    const page = formData.get('page')
    const type = formData.get('type')
    const column = formData.get('column')

    const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems'

    const videoList = await fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${id}&maxResults=50&key=${
        process.env.YOUTUBE_API_KEY
      }&_=${new Date()}`
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

      console.log('admin/youtube/[id]/videolist/page.tsx/VideoList[48]')
      console.log(videoData)
      console.log(videoData.items[0].snippet.channelTitle)

      const data = {
        page: page,
        type: type,
        column: column,
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

  const [state, formAction] = useActionState(createPost, {})

  return (
    <>
      <h1>Add videos of a playlist to WebNews</h1>
      <form action={formAction} className='ml-10 space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='page'>Page</Label>
          <Input type='text' id='page' name='page' required />
        </div>
        <div className='space-y-2 w-60'>
          <Label htmlFor='type'>Type</Label>
          <Input type='text' id='type' name='type' required />
        </div>
        <div className='space-y-2 w-15'>
          <Label htmlFor='column'>Column</Label>
          <Input type='number' id='column' name='column' required />
        </div>
        <FormSubmit />
      </form>
      {/* <script>
        // Dit zet de focus op het 'username' veld wanneer de pagina geladen is
        document.getElementById('filePath').focus();
      </script> */}
    </>
  )
}
