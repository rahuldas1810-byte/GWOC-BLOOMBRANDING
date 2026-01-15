import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Invalid unsubscribe link.' },
                { status: 400 }
            );
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired unsubscribe link.' },
                { status: 400 }
            );
        }

        const { email } = decoded;

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Invalid token payload.' },
                { status: 400 }
            );
        }

        await connectDB();

        const subscriber = await NewsletterSubscriber.findOne({ email });

        if (!subscriber) {
            // To be safe and idempotent, if we can't find them, we can claim success or say not found.
            // Saying success is generally safer for privacy, but 'Not Found' is honest.
            return NextResponse.json(
                { success: false, message: 'Subscriber not found.' },
                { status: 404 }
            );
        }

        if (subscriber.status === 'unsubscribed') {
            return NextResponse.json(
                { success: true, message: 'You have already unsubscribed.' },
                { status: 200 }
            );
        }

        subscriber.status = 'unsubscribed';
        await subscriber.save();

        return NextResponse.json(
            { success: true, message: 'You have been successfully unsubscribed.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Unsubscribe Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error.' },
            { status: 500 }
        );
    }
}
