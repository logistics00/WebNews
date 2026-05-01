'use client'

import { useState } from 'react'

export default function DeletePlaylistPage() {
  const [accessToken, setAccessToken] = useState('')
  const [playlistId, setPlaylistId] = useState('')
  const [message, setMessage] = useState('')

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/delete-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, playlistId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.success)
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      setMessage('Error deleting playlist')
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>Delete YouTube Playlist</h1>
      <input
        type='text'
        placeholder='Access Token'
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
      />
      <input type='text' placeholder='Playlist ID' value={playlistId} onChange={(e) => setPlaylistId(e.target.value)} />
      <button onClick={handleDelete}>Delete Playlist</button>
      {message && <p>{message}</p>}
    </div>
  )
}
