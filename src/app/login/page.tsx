'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGoogleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
    const scope = 'https://www.googleapis.com/auth/youtube.readonly'

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`

    window.location.href = authUrl
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        // Login succesvol - redirect naar hoofdpagina
        router.push('/admin') // of waar je naartoe wilt
      } else {
        setError('Ongeldige gebruikersnaam of wachtwoord')
      }
    } catch (err) {
      setError('Er ging iets mis')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ color: '#4285f4', marginBottom: '2rem' }}>Login with Google</h1>
      
      <button 
        onClick={handleGoogleAuth}
        style={{
          backgroundColor: '#0f9d58',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
          marginBottom: '1rem'
        }}
      >
        Login
      </button>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button 
          onClick={() => setShowAdminLogin(!showAdminLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#4285f4',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {showAdminLogin ? 'Verberg admin login' : 'Of login als admin'}
        </button>
      </div>

      {showAdminLogin && (
        <form onSubmit={handleAdminLogin} style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: 'black'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: 'black'
              }}
              required
            />
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            Login als Admin
          </button>
        </form>
      )}
    </div>
  )
}