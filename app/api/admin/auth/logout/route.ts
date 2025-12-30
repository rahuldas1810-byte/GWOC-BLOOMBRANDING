import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookie } from '@/backend'

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie by setting it to expire
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear the adminToken cookie
    response.cookies.set('adminToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to logout',
      },
      { status: 500 }
    )
  }
}

