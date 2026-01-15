import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { sendEmail } from '@/backend/email';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate Admin
        const authResult = await authenticate(req);
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            );
        }

        // 2. Parse Request
        const { subject, message } = await req.json();

        if (!subject || !message) {
            return NextResponse.json(
                { success: false, message: 'Subject and message are required.' },
                { status: 400 }
            );
        }

        await connectDB();

        // 3. Fetch Active Subscribers
        const subscribers = await NewsletterSubscriber.find({ status: 'active' });

        if (subscribers.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No active subscribers found.' },
                { status: 404 }
            );
        }

        // 4. Send Emails
        let sentCount = 0;
        let failedCount = 0;

        // Use sendEmail helper to ensure unsubscribe links are included
        await Promise.allSettled(
            subscribers.map(async (sub) => {
                const success = await sendEmail({
                    to: sub.email,
                    subject: subject,
                    html: `
              <div style="font-family: sans-serif; color: #2c2420; padding: 20px;">
                ${message}
                <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
              </div>
            `,
                    text: message,
                    includeUnsubscribe: true
                });

                if (success) {
                    sentCount++;
                } else {
                    failedCount++;
                }
            })
        );

        return NextResponse.json({
            success: true,
            message: `Newsletter sent to ${sentCount} subscribers. (${failedCount} failed)`,
            data: { sent: sentCount, failed: failedCount }
        });

    } catch (error: any) {
        console.error('Newsletter Broadcast Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error.' },
            { status: 500 }
        );
    }
}

