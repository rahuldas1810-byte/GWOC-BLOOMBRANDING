import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Sector from '@/models/Sector'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public API: List active sectors
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const sectors = await Sector.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .select('name description icon color order')

        const response = NextResponse.json({
            success: true,
            data: sectors,
        })

        // Disable caching - always return fresh data
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')

        return response
    } catch (error: any) {
        console.error('❌ Get public sectors error:', error)
        return NextResponse.json({
            success: true,
            data: [],
        })
    }
}
