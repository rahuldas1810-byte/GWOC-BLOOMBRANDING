import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/auth';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import connectDB from '@/lib/db';

export async function PATCH(request: NextRequest) {
    // 1. Authenticate
    const authResult = await authenticate(request);
    if ('error' in authResult) {
        return NextResponse.json(
            { success: false, message: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        const { email, action } = await request.json();

        // 2. Validate
        if (!email || !action || !['deactivate', 'reactivate'].includes(action)) {
            return NextResponse.json(
                { success: false, message: 'Invalid request parameters' },
                { status: 400 }
            );
        }

        await connectDB();

        // 3. Find Subscriber
        const subscriber = await NewsletterSubscriber.findOne({ email });

        if (!subscriber) {
            return NextResponse.json(
                { success: false, message: 'Subscriber not found' },
                { status: 404 }
            );
        }

        // 4. Update Status
        if (action === 'deactivate') {
            subscriber.status = 'unsubscribed';
        } else if (action === 'reactivate') {
            subscriber.status = 'active';
        }

        await subscriber.save();

        return NextResponse.json({
            success: true,
            message: `Subscriber ${action === 'deactivate' ? 'unsubscribed' : 'reactivated'} successfully`,
            data: subscriber,
        });

    } catch (error: any) {
        console.error('Manage newsletter error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
