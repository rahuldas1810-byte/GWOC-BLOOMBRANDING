import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import ServicesPage from '@/models/ServicesPage'

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

        let content = await ServicesPage.findOne()

        if (!content) {
            // Create default if not exists
            content = await ServicesPage.create({})
        }

        return NextResponse.json({
            success: true,
            data: content,
        })
    } catch (error: any) {
        console.error('❌ Get services page content error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to fetch content',
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
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

        // Find and update the single document, or create if missing (upsert behavior)
        // We use findOneAndUpdate with upsert: true options for safety, but usually findOne + save is fine too.
        // Given the structure, let's find the first one.

        let content = await ServicesPage.findOne()

        if (!content) {
            content = await ServicesPage.create(body)
        } else {
            // Update fields using Object.assign or direct set to ensure validation runs if needed
            // Ideally Mongoose's findOneAndUpdate is efficient.
            content = await ServicesPage.findOneAndUpdate({}, { $set: body }, { new: true, runValidators: true, upsert: true })
        }

        return NextResponse.json({
            success: true,
            message: 'Services page content updated successfully',
            data: content,
        })
    } catch (error: any) {
        console.error('❌ Update services page content error:', error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to update content',
            },
            { status: 500 }
        )
    }
}
