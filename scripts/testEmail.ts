/**
 * Test Email Configuration Script
 * 
 * This script tests your email configuration by sending a test email.
 * Run with: tsx --env-file .env.local scripts/testEmail.ts
 */

import path from 'path'
import dotenv from 'dotenv'
import { sendEmail } from '../backend/email'

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n')

  // Check if email is configured
  const emailHost = process.env.SMTP_HOST
  const emailUser = process.env.SMTP_USER
  const emailPass = process.env.SMTP_PASSWORD

  if (!emailHost || !emailUser || !emailPass) {
    console.log('⚠️  Email not configured in .env.local')
    console.log('\n📝 Required environment variables:')
    console.log('   - SMTP_HOST')
    console.log('   - SMTP_USER')
    console.log('   - SMTP_PASSWORD')
    console.log('   - SMTP_PORT (optional, defaults to 587)')
    console.log('   - SMTP_FROM (optional)')
    console.log('\n📖 See EMAIL_SETUP.md for configuration instructions')
    console.log('\n💡 In development mode, emails will be logged to console')
    return
  }

  console.log('✅ Email configuration found:')
  console.log(`   Host: ${emailHost}`)
  console.log(`   Port: ${process.env.SMTP_PORT || '587'}`)
  console.log(`   User: ${emailUser}`)
  console.log(`   From: ${process.env.SMTP_FROM || emailUser}`)
  console.log('')

  // Get test email from command line or use the configured user email
  const testEmailAddress = process.argv[2] || emailUser

  console.log(`📧 Sending test email to: ${testEmailAddress}\n`)

  const testEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2C4494; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Bloom Branding</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #624A41; margin-top: 0;">Test Email</h2>
          
          <p>Hello,</p>
          
          <p>This is a test email from your Bloom Branding admin panel email configuration.</p>
          
          <p>If you received this email, your SMTP configuration is working correctly! ✅</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Bloom Branding Team</strong>
          </p>
        </div>
      </body>
    </html>
  `

  const testEmailText = `
Test Email - Bloom Branding

Hello,

This is a test email from your Bloom Branding admin panel email configuration.

If you received this email, your SMTP configuration is working correctly!

Best regards,
Bloom Branding Team
  `

  try {
    const result = await sendEmail({
      to: testEmailAddress,
      subject: 'Test Email - Bloom Branding Admin Panel',
      html: testEmailHtml,
      text: testEmailText,
    })

    if (result) {
      console.log('✅ Test email sent successfully!')
      console.log(`📬 Check your inbox at: ${testEmailAddress}`)
    } else {
      console.log('❌ Failed to send test email')
      console.log('   Check your SMTP credentials and try again')
    }
  } catch (error: any) {
    console.error('❌ Error sending test email:', error.message)
    console.log('\n💡 Common issues:')
    console.log('   1. Incorrect SMTP credentials')
    console.log('   2. Firewall blocking SMTP port')
    console.log('   3. Email service requires app password (Gmail)')
    console.log('   4. Email service not allowing SMTP connections')
  }
}

// Run the test
testEmail()
  .then(() => {
    console.log('\n✨ Test complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })

