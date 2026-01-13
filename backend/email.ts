import "server-only";
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create reusable transporter
const createTransporter = () => {

console.log('🧪 SMTP ENV CHECK:', {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD_EXISTS: !!process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
})

  // Check if email is configured
  const emailHost = process.env.SMTP_HOST
  const emailUser = process.env.SMTP_EMAIL
  const emailPass = process.env.SMTP_PASSWORD
  const emailPort = process.env.SMTP_PORT || '587'

  // If no email config, return null (will use console logging fallback)
  if (!emailHost || !emailUser || !emailPass) {
    return null
  }
 
  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    secure: emailPort === '465', // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    // If no email config, log to console (for development)
    if (!transporter) {
  console.error('❌ SMTP not configured properly')
  return false
}

    const mailOptions = {
      from: `"Bloom Branding" <${process.env.SMTP_FROM || process.env.SMTP_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    }

    // Verify connection before sending
    try {
      await transporter.verify()
    } catch (verifyError: any) {
      console.error('❌ SMTP connection verification failed:', verifyError.message)
      console.error('   Please check your SMTP credentials in .env.local')
      return false
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', info.messageId)
    return true
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message)
    if (error.code === 'EAUTH') {
      console.error('   Authentication failed. Check your SMTP_EMAIL and SMTP_PASSWORD')
    } else if (error.code === 'ECONNECTION') {
      console.error('   Connection failed. Check your SMTP_HOST and SMTP_PORT')
    }
    return false
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/admin/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Bloom Branding</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2C4494; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Bloom Branding</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #624A41; margin-top: 0;">Reset Your Password</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password for your Bloom Branding admin account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background-color: #2C4494; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
            ${resetLink}
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Best regards,<br>
            <strong>Bloom Branding Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `

  const text = `
Reset Your Password - Bloom Branding

Hello,

We received a request to reset your password for your Bloom Branding admin account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

Best regards,
Bloom Branding Team
  `

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - Bloom Branding Admin',
    html,
    text,
  })
}


export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP - Bloom Branding</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2C4494; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Bloom Branding</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #624A41; margin-top: 0;">Password Reset OTP</h2>
          
          <p>Hello,</p>
          
          <p>You requested to reset your password. Use the following One-Time Password (OTP) to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f0f0f0; color: #2C4494; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 32px; letter-spacing: 5px; border: 2px dashed #2C4494;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Important:</strong> This OTP will expire in 5 minutes. If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Best regards,<br>
            <strong>Bloom Branding Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `

  const text = `
Password Reset OTP - Bloom Branding

Hello,

You requested to reset your password. Use the following One-Time Password (OTP) to proceed:

${otp}

This OTP will expire in 5 minutes. If you didn't request a password reset, please ignore this email.

Best regards,
Bloom Branding Team
  `

  return await sendEmail({
    to: email,
    subject: 'Password Reset OTP - Bloom Branding Admin',
    html,
    text,
  })
}

export const sendQueryConfirmationEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Query - Bloom Branding</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2C4494; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Bloom Branding</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #624A41; margin-top: 0;">Thank You for Your Query</h2>
          
          <p>Hello ${name},</p>
          
          <p>Thanks for submitting your query. My team will get back to you shortly.</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Bloom Branding Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `

  const text = `
Thank You for Your Query - Bloom Branding

Hello ${name},

Thanks for submitting your query. My team will get back to you shortly.

Best regards,
Bloom Branding Team

This is an automated message. Please do not reply to this email.
  `

  return await sendEmail({
    to: email,
    subject: 'Thank You for Your Query - Bloom Branding',
    html,
    text,
  })
}
