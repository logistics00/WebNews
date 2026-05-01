import { revalidatePath } from 'next/cache'
import styles from '../../../styles/Home.module.css'

type PlayList = {
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
  }
}

export default async function PlayList() {
  const channelId = 'UCmTV7vvcur833LVTbKRsnXQ'
  const YOUTUBE_PLAYLISTS_API = 'https://www.googleapis.com/youtube/v3/playlists'
  const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems'

  const res = await fetch(
    `${YOUTUBE_PLAYLISTS_API}?part=snippet&channelId=${channelId}&maxResults=100&key=${
      process.env.YOUTUBE_API_KEY
    }&_=${new Date()}`
    // `${YOUTUBE_PLAYLISTS_API}?part=snippet&mine=true&key=${process.env.YOUTUBE_API_KEY}`
  )

  // console.log('admin/youtube/playlists/page.tsx/PlayList[34]')
  // console.log(res.status)
  // console.log(res.statusText)
  // console.log(res.headers)
  // console.log(res.body)

  // const responseBody = await res.text()
  // console.log('Response Body:')
  // console.log(JSON.parse(responseBody))

  const playLists = (await res.json()).items
  // console.log('admin/youtube/playlists/page.tsx/PlayList[45]')
  // console.log(playLists.length)
  // console.log(playLists[1])

  return (
    <>
      <main>
        <h1>My Playlists ({playLists.length})</h1>
        <ul className={styles.grid}>
          {playLists.map(async (playList: PlayList) => {
            const { id, snippet } = playList
            const { publishedAt, title, thumbnails, channelTitle } = snippet
            const { medium } = thumbnails
            const { url, width, height } = medium

            const videoList = await fetch(
              `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${id}&maxResults=100&key=${process.env.YOUTUBE_API_KEY}`
            )
            const data = await videoList.json()
            const amount = data.items.length

            return (
              <li key={id} className={styles.card}>
                <a href={`/admin/youtube/${id}/videolist`} className="text-yellow-200">
                  <p>
                    VideoList ({amount})
                    {/* <img width={width} height={height} src={url} alt='' /> */}
                  </p>
                </a>
                <br />
                <a href={`/admin/youtube/${id}/playlist-to-webnews`}>
                  <span className='text-blue-600'>{title}</span>
                </a>
                {/* <p>
                  <span className='text-pink-600'>{publishedAt}</span>
                  <br />
                  <span className='text-blue-600'>
                    D: {publishedAt.substring(2, 4)}
                    {publishedAt.substring(5, 7)}
                    {publishedAt.substring(8, 10)}
                    &nbsp;&nbsp;Ch: {channelTitle}
                    &nbsp;&nbsp;Amnt: {amount}
                  </span>
                </p>
                <br/>
                <a href={`/admin/youtube/${id}/delete-playlist`}>
                  <span className='text-pink-600'>{id}</span>
                </a> */}
              </li>
            )
          })}
        </ul>
      </main>
      <footer className={styles.footer}>
        <a
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn
        </a>
        <a
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Examples
        </a>
        <a
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Go to nextjs.org â†’
        </a>
      </footer>
    </>
  )
}
