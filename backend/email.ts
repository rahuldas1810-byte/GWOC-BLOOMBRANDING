import "server-only";
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

// Initialize Resend with API key
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is missing in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender identity
const DEFAULT_SENDER = process.env.EMAIL_FROM || 'Bloom Branding <hello@bloombranding.com>';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  includeUnsubscribe?: boolean;
}

/**
 * Generates a signed unsubscribe link for a given email.
 */
export const generateUnsubscribeLink = (email: string): string => {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
  return `${BASE_URL}/api/newsletter/unsubscribe?token=${token}`;
};

/**
 * Sends an email using Resend API
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const { to, subject, html, text, includeUnsubscribe } = options;

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Cannot send email: RESEND_API_KEY is not configured');
      return false;
    }

    let finalHtml = html;
    let finalText = text || '';

    if (includeUnsubscribe) {
      const unsubscribeLink = generateUnsubscribeLink(to);
      const unsubscribeHtml = `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
          <p>
            You received this email because you are subscribed to Bloom Branding updates.
            <br>
            <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
          </p>
        </div>
      `;
      const unsubscribeText = `\n\nTo unsubscribe, visit: ${unsubscribeLink}`;

      // Append to HTML (before closing body if present, else just append)
      if (finalHtml.includes('</body>')) {
        finalHtml = finalHtml.replace('</body>', `${unsubscribeHtml}</body>`);
      } else {
        finalHtml += unsubscribeHtml;
      }

      finalText += unsubscribeText;
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: to,
      subject: subject,
      html: finalHtml,
      text: finalText,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return false;
    }

    // specific success log for tracking but less verbose than before
    // console.log('✅ Email sent successfully via Resend:', data?.id); 
    return true;
  } catch (error: any) {
    console.error('❌ Unexpected error sending email:', error.message);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  const resetLink = `${BASE_URL}/admin/reset-password?token=${resetToken}`;

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
  `;

  const text = `
Reset Your Password - Bloom Branding

Hello,

We received a request to reset your password for your Bloom Branding admin account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

Best regards,
Bloom Branding Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - Bloom Branding Admin',
    html,
    text,
  });
};


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
  `;

  const text = `
Password Reset OTP - Bloom Branding

Hello,

You requested to reset your password. Use the following One-Time Password (OTP) to proceed:

${otp}

This OTP will expire in 5 minutes. If you didn't request a password reset, please ignore this email.

Best regards,
Bloom Branding Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset OTP - Bloom Branding Admin',
    html,
    text,
  });
};

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
  `;

  const text = `
Thank You for Your Query - Bloom Branding

Hello ${name},

Thanks for submitting your query. My team will get back to you shortly.

Best regards,
Bloom Branding Team

This is an automated message. Please do not reply to this email.
  `;

  return await sendEmail({
    to: email,
    subject: 'Thank You for Your Query - Bloom Branding',
    html,
    text,
  });
};
