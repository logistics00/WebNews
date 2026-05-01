import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get('accessToken')

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
  }

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

  try {
    const response = await youtube.playlists.list({
      part: ['snippet'],
      mine: true,
      maxResults: 10,
    })

    const playlists = response.data.items
    return NextResponse.json(playlists)
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
  }
}
