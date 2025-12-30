# Email Configuration Guide

This guide explains how to set up email functionality for password reset emails in the Bloom Branding admin panel.

## Email Service Options

You can use any SMTP-compatible email service. Here are some popular options:

### 1. Gmail (for development/testing)
- **Host**: `smtp.gmail.com`
- **Port**: `587` (TLS) or `465` (SSL)
- **Note**: Requires an "App Password" instead of your regular password

### 2. SendGrid (Recommended for production)
- **Host**: `smtp.sendgrid.net`
- **Port**: `587`
- **User**: `apikey`
- **Password**: Your SendGrid API key

### 3. AWS SES (Amazon Simple Email Service)
- **Host**: Varies by region (e.g., `email-smtp.us-east-1.amazonaws.com`)
- **Port**: `587`
- **User**: Your AWS Access Key ID
- **Password**: Your AWS Secret Access Key

### 4. Mailgun
- **Host**: `smtp.mailgun.org`
- **Port**: `587`
- **User**: Your Mailgun SMTP username
- **Password**: Your Mailgun SMTP password

### 5. Other SMTP Services
Any SMTP-compatible service will work. Just use the appropriate host, port, and credentials.

## Environment Variables

Add these variables to your `.env.local` file (see `ENV_TEMPLATE.md` for complete template):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Bloom Branding" <your-email@gmail.com>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Gmail Setup (Development)

1. Enable 2-Step Verification on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password for "Mail"
4. Use this app password as `SMTP_PASSWORD` (not your regular Gmail password)

## SendGrid Setup (Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Use these settings:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_FROM="Bloom Branding" <noreply@yourdomain.com>
   ```

## Testing Email

### Test Your Email Configuration

We've included a test script to verify your email setup:

```bash
npm run test-email
```

This will:
- Check if email is configured in `.env.local`
- Send a test email to verify SMTP settings
- Show helpful error messages if something is wrong

You can also specify a test email address:
```bash
npm run test-email your-test@email.com
```

### Without Email Configuration
If email is not configured, the system will:
- Log the email content to the console
- Still return success (for security)
- Allow you to test the flow without setting up email
- Show helpful messages about configuring email

### With Email Configuration
Once configured, password reset emails will be sent automatically when users request a password reset.

## Email Template

The password reset email includes:
- Professional HTML template with Bloom Branding branding
- Reset link with token
- Plain text fallback
- Security information (1-hour expiry)

## Troubleshooting

### Email not sending?
1. Check your SMTP credentials are correct
2. Verify your email service allows SMTP connections
3. Check firewall/network settings
4. Review server logs for error messages

### Development Mode
In development, emails are logged to the console if SMTP is not configured. This allows you to:
- Test the password reset flow
- See the reset link in console logs
- Copy the link manually to test

## Security Notes

- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32-byte random)
- The system returns generic success messages to prevent email enumeration
- Tokens are cleared from the database after successful password reset

