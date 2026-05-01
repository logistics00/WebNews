import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Check credentials
    if (
      username === process.env.ADMIN_USERNAME &&
      hashPassword(password) === process.env.HASHED_ADMIN_PASSWORD
    ) {
      // Login succesvol - set een cookie of session
      const response = NextResponse.json({ success: true })
      
      // Simpele cookie voor admin sessie (verbeteren voor productie!)
      response.cookies.set('admin_logged_in', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 24 uur
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}