import styles from '../../../../styles/Home.module.css'

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
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=${id}&maxResults=100&key=${process.env.YOUTUBE_API_KEY}`
  )
  const data = await videoList.json()

  return (
    <>
      <main>
        <h1>Videos in Playlist: ({data.items.length})</h1>
        <ul className={styles.grid}>
          {data.items.map((item: Item) => {
            const { id, snippet } = item
            const { title, publishedAt, thumbnails, resourceId, channelTitle } = snippet
            const { medium } = thumbnails
            const { url, width, height } = medium
            const { videoId } = resourceId

            return (
              <li key={id} className={styles.card}>
                <a href={`https://www.youtube.com/watch?v=${videoId}`}>
                  <p>
                    <img width={width} height={height} src={url} alt='' />
                  </p>
                </a>
                <p>
                  <span className='text-pink-600'>{title}</span><br />
                  <span className='text-blue-600'>
                    D: {publishedAt.substring(2, 4)}
                    {publishedAt.substring(5, 7)}
                    {publishedAt.substring(8, 10)}
                    &nbsp;&nbsp;Ch: {channelTitle}
                  </span>
                </p>
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
          Go to nextjs.org →
        </a>
      </footer>
    </>
  )
}
