import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import nodemailer from 'nodemailer';

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

        console.log('[ADMIN EMAIL ENV CHECK]', {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_EMAIL: process.env.SMTP_EMAIL,
            SMTP_PASS_EXISTS: !!process.env.SMTP_PASS,
            SMTP_PASSWORD_EXISTS: !!process.env.SMTP_PASSWORD,
        });

        // 4. Send Emails (Batched or Looped)
        if (!process.env.SMTP_EMAIL || (!process.env.SMTP_PASS && !process.env.SMTP_PASSWORD)) {
            return NextResponse.json(
                { success: false, message: 'Server email configuration is missing.' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE == 'true',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
            },
        });

        let sentCount = 0;
        let failedCount = 0;

        // Send individually to avoid exposing other emails (no CC/BCC)
        // In production, use a bulk email service or a queue. 
        // For small scale, `Promise.all` or sequential loop works.
        await Promise.allSettled(
            subscribers.map(async (sub) => {
                try {
                    await transporter.sendMail({
                        from: `"Bloom Branding" <${process.env.SMTP_EMAIL}>`,
                        to: sub.email,
                        subject: subject,
                        // Convert simple message to HTML (very basic)
                        html: `
              <div style="font-family: sans-serif; color: #2c2420; padding: 20px;">
                ${message}
                <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
                <p style="font-size: 12px; color: #888;">
                  You received this email because you are subscribed to Bloom Branding updates.
                  <a href="#" style="color: #666; text-decoration: underline;">Unsubscribe</a>
                </p>
              </div>
            `,
                        text: message // Fallback
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send to ${sub.email}:`, err);
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
