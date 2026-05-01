"use client"

export default function LoginPage() {
  const handleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
    const scope = 'https://www.googleapis.com/auth/youtube.readonly'

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`

    window.location.href = authUrl
  }
  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleAuth}>Login</button>
    </div>
  )
}
