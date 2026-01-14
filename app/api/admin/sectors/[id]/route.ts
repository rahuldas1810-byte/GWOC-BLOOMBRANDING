import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import Sector from '@/models/Sector'

// GET - Get single sector
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authenticate(request)
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            )
        }

        await connectDB()

        const sector = await Sector.findById(params.id)
        if (!sector) {
            return NextResponse.json(
                { success: false, message: 'Sector not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: sector,
        })
    } catch (error: any) {
        console.error('❌ Get sector error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to fetch sector',
            },
            { status: 500 }
        )
    }
}

// PUT - Update sector
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (icon !== undefined) updateData.icon = icon
        if (color !== undefined) updateData.color = color
        if (order !== undefined) updateData.order = order
        if (isActive !== undefined) updateData.isActive = isActive

        const sector = await Sector.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!sector) {
            return NextResponse.json(
                { success: false, message: 'Sector not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Sector updated successfully',
            data: sector,
        })
    } catch (error: any) {
        console.error('❌ Update sector error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to update sector',
            },
            { status: 500 }
        )
    }
}

// DELETE - Delete sector
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authenticate(request)
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            )
        }

        await connectDB()

        const sector = await Sector.findByIdAndDelete(params.id)
        if (!sector) {
            return NextResponse.json(
                { success: false, message: 'Sector not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Sector deleted successfully',
        })
    } catch (error: any) {
        console.error('❌ Delete sector error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to delete sector',
            },
            { status: 500 }
        )
    }
}
