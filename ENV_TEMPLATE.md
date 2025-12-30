# Environment Variables Template

Copy this template to create your `.env.local` file:

```env
# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Secret (for authentication)
JWT_SECRET=your-jwt-secret-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (SMTP) - See EMAIL_SETUP.md for detailed setup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Bloom Branding" <your-email@gmail.com>

# Base URL (for password reset links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Quick Setup

1. Create `.env.local` file with the template above
2. Replace all `your-*` placeholders with actual values
3. For email setup, see `EMAIL_SETUP.md`
4. Test configuration: `npm run test-db` and `npm run test-email`

