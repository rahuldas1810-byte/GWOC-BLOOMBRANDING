import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Sector from '@/models/Sector'

// GET - List all sectors (admin)
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticate(request)
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            )
        }

        await connectDB()

        const sectors = await Sector.find().sort({ order: 1, createdAt: -1 })

        return NextResponse.json({
            success: true,
            data: sectors,
        })
    } catch (error: any) {
        console.error('❌ Get sectors error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to fetch sectors',
            },
            { status: 500 }
        )
    }
}

// POST - Create sector
export async function POST(request: NextRequest) {
    try {
        const authResult = await authenticate(request)
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            )
        }

        await connectDB()

        const body = await request.json()
        const { name, description, icon, color, order, isActive } = body

        if (!name || !description) {
            return NextResponse.json(
                { success: false, message: 'Name and description are required' },
                { status: 400 }
            )
        }

        const sector = await Sector.create({
            name,
            description,
            icon: icon || 'Gem',
            color: color || 'bg-[#C5CBB4]',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
        })

        return NextResponse.json({
            success: true,
            message: 'Sector created successfully',
            data: sector,
        })
    } catch (error: any) {
        console.error('❌ Create sector error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to create sector',
            },
            { status: 500 }
        )
    }
}
