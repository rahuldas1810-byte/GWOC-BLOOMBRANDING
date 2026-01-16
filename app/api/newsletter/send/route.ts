import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/backend'
import connectDB from '@/lib/db'
import NewsletterSubscriber from '@/models/NewsletterSubscriber'
import { sendEmail } from '@/backend/email'

export async function POST(req: NextRequest) {
    try {
        // 1️⃣ Authenticate Admin
        const authResult = await authenticate(req)
        if ('error' in authResult) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: authResult.status }
            )
        }

        // 2️⃣ Parse Request Body
        const { subject, message } = await req.json()

        if (!subject || !message) {
            return NextResponse.json(
                { success: false, message: 'Subject and message are required.' },
                { status: 400 }
            )
        }

        // 3️⃣ Connect DB
        await connectDB()

        // 4️⃣ Fetch ACTIVE Subscribers (NO LIMITS)
        const subscribers = await NewsletterSubscriber.find({
            status: 'active'
        })

        if (!subscribers.length) {
            return NextResponse.json(
                { success: false, message: 'No active subscribers found.' },
                { status: 404 }
            )
        }

        // 5️⃣ Send Emails (SEQUENTIAL + SMTP SAFE)
        let sentCount = 0
        let failedCount = 0

        for (const sub of subscribers) {
            try {
                const success = await sendEmail({
                    to: sub.email,
                    subject,
                    html: `
            <div style="font-family: sans-serif; color: #2c2420; padding: 20px;">
              ${message}
              <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
            </div>
          `,
                    text: message,
                    includeUnsubscribe: true
                })

                if (success) {
                    sentCount++
                } else {
                    failedCount++
                }

                // ⏳ Cooldown to prevent SMTP rate-limit
                await new Promise(resolve => setTimeout(resolve, 800))

            } catch (err) {
                failedCount++
                console.error(`Newsletter failed for ${sub.email}`, err)
            }
        }

        // 6️⃣ Return Accurate Result
        return NextResponse.json({
            success: true,
            message: `Newsletter sent to ${sentCount} subscribers.`,
            data: {
                sent: sentCount,
                failed: failedCount,
                total: subscribers.length
            }
        })

    } catch (error) {
        console.error('Newsletter Broadcast Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error.' },
            { status: 500 }
        )
    }
}
