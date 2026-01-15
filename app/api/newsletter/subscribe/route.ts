import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/backend/email';
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



        // Check for existing subscription
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });

        if (existingSubscriber) {


            if (existingSubscriber.status === 'active') {
                return NextResponse.json(
                    { message: 'You are already subscribed to our newsletter.' },
                    { status: 409 }
                );
            }

            // status === 'unsubscribed' → reactivating
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
    if (!process.env.RESEND_API_KEY) {
        return;
    }

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

    // Use the central helper with unsubscribe link enabled
    const success = await sendEmail({
        to: email,
        subject: subject,
        html: htmlContent,
        text: textContent,
        includeUnsubscribe: true
    });

    if (!success) {
        console.error(`[SUBSCRIBE] Failed to send ${type} email.`);
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
