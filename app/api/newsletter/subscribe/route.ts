import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/db';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';
import { authenticate } from '@/backend';

// SUBSCRIBE
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { message: 'Please provide a valid email address.' },
                { status: 400 }
            );
        }

        await connectDB();

        console.log('[SUBSCRIBE] Incoming email:', email);

        // Check for existing subscription
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });

        if (existingSubscriber) {
            console.log('[SUBSCRIBE] Existing subscriber found:', {
                email: existingSubscriber.email,
                status: existingSubscriber.status,
            });

            if (existingSubscriber.status === 'active') {
                console.log('[SUBSCRIBE] Status is ACTIVE → returning early');
                return NextResponse.json(
                    { message: 'You are already subscribed to our newsletter.' },
                    { status: 409 }
                );
            }

            // status === 'unsubscribed'
            console.log('[SUBSCRIBE] Status is UNSUBSCRIBED → reactivating');

            existingSubscriber.status = 'active';
            await existingSubscriber.save();

            await sendSubscriptionEmail(email, 'welcome_back');

            return NextResponse.json(
                { message: 'Welcome back! Your subscription has been reactivated.' },
                { status: 200 }
            );
        }

        // Create new subscriber
        await NewsletterSubscriber.create({ email });

        // Send New Subscription email
        await sendSubscriptionEmail(email, 'new');

        return NextResponse.json(
            { message: 'Thank you for subscribing!' },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Newsletter Subscription Error:', error);
        return NextResponse.json(
            { message: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

async function sendSubscriptionEmail(email: string, type: 'new' | 'welcome_back') {
    // Only attempt to send if credentials are present
    if (!process.env.SMTP_EMAIL || (!process.env.SMTP_PASS && !process.env.SMTP_PASSWORD)) {
        console.warn('[SUBSCRIBE] Skipping email - missing credentials');
        return;
    }

    try {
        console.log(`[SUBSCRIBE] Attempting to send ${type} email to:`, email);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
            },
        });

        await transporter.verify();
        console.log('[SUBSCRIBE] SMTP transporter verified');



        const isReactivation = type === 'welcome_back';

        const subject = isReactivation
            ? 'Welcome back to Bloom Branding'
            : 'Thanks for subscribing to Bloom Branding';

        const textContent = isReactivation
            ? 'Welcome back to Bloom Branding! You’ve been successfully subscribed again and will now start receiving our latest updates, launches, and insights.'
            : 'Thank you for subscribing to Bloom Branding. You’ll now receive our latest updates, launches, and insights.';

        const htmlContent = `
            <div style="font-family: sans-serif; color: #2c2420; padding: 20px;">
              <h1 style="font-family: serif;">${isReactivation ? 'Welcome back to Bloom Branding' : 'Welcome to Bloom Branding'}</h1>
              <p>${isReactivation ? 'Welcome back to Bloom Branding!' : 'Thank you for subscribing to Bloom Branding.'}</p>
              <p>You’ve been successfully subscribed ${isReactivation ? 'again ' : ''}and will now start receiving our latest updates, launches, and insights.</p>
              <br/>
              <p>Best regards,</p>
              <p>The Bloom Branding Team</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Bloom Branding" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: subject,
            text: textContent,
            html: htmlContent,
        });
        console.log('[SUBSCRIBE] Welcome back email SENT');

        console.log(`[SUBSCRIBE] ${type} email sent successfully`);
    } catch (emailError: any) {
        console.error('Failed to send confirmation email:', emailError);
        // We don't fail the request if email sending fails
    }
}

// ADMIN: GET SUBSCRIBERS
export async function GET(req: NextRequest) {
    try {
        const authResult = await authenticate(req);
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            );
        }

        await connectDB();
        const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });

        return NextResponse.json({ success: true, data: subscribers });
    } catch (error: any) {
        console.error('Failed to fetch subscribers:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch subscribers' },
            { status: 500 }
        );
    }
}
