'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Playlist = {
  id: string
  snippet: {
    title: string
    channelTitle: string
  }
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) return

      try {
        const response = await fetch(`/api/get-playlists?accessToken=${accessToken}`)
        if (!response.ok) {
          throw new Error('Failed to fetch playlists')
        }
        const data = await response.json()
        setPlaylists(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }

    fetchPlaylists()
  }, [accessToken])

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <h1>Your YouTube Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <a href={`https://www.youtube.com/playlist?list=${playlist.id}`} target='_blank' rel='noopener noreferrer'>
              {playlist.snippet.title} by {playlist.snippet.channelTitle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
