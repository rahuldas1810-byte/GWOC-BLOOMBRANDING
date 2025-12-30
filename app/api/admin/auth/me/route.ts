import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request)

    if ('error' in authResult) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error,
        },
        { status: authResult.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: authResult.user,
      },
    })
  } catch (error: any) {
    console.error('❌ Get user error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get user information',
      },
      { status: 500 }
    )
  }
}

