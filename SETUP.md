# Complete Setup Guide

This guide will help you set up the Bloom Branding CMS from scratch.

## Prerequisites

- Node.js 18+ installed
- MongoDB account (free MongoDB Atlas recommended)
- Cloudinary account (free tier available)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended - Free)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Create" → Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Clusters" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `bloom_branding_local_dev` (or your preferred name)

### Option B: Local MongoDB

1. **Install MongoDB:**
   - Download from https://www.mongodb.com/try/download/community
   - Install with default settings
   - MongoDB will start automatically as a service

2. **Connection String:**
   - Use: `mongodb://localhost:27017/bloom_branding_local_dev`

---

## Step 3: Set Up Cloudinary

1. **Create Account:**
   - Go to https://cloudinary.com/
   - Sign up for a free account

2. **Get Credentials:**
   - Go to Dashboard
   - Copy your:
     - Cloud Name
     - API Key
     - API Secret

---

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloom_branding_local_dev?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_123456789
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:**
- Replace all placeholder values with your actual credentials
- `JWT_SECRET` must be at least 32 characters long
- Never commit `.env.local` to version control (it's already in `.gitignore`)

---

## Step 5: Test MongoDB Connection

```bash
npm run test-db
```

**Expected output:**
```
🔄 Testing MongoDB connection...
MONGODB_URI: ✅ Set
✅ MongoDB connected successfully!
✅ You can now create an admin user and login.
```

**If you see an error:**
- Check your `MONGODB_URI` in `.env.local`
- Verify MongoDB Atlas network access is configured
- Ensure database user credentials are correct
- For local MongoDB, ensure the service is running

---

## Step 6: Create Admin User

```bash
npm run create-admin
```

**Expected output:**
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@bloombranding.com
   Password: password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  IMPORTANT: Change this password after first login!

🚀 You can now login at: http://localhost:3000/admin/login
```

**If admin already exists:**
- Use the existing credentials
- Or delete the user in MongoDB and run the command again

---

## Step 7: Start Development Server

```bash
npm run dev
```

The application will start at:
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login

---

## Step 8: Login to Admin Panel

1. Go to http://localhost:3000/admin/login
2. Enter credentials:
   - **Email:** `admin@bloombranding.com`
   - **Password:** `password123`
3. Click "Login"

You should now be logged in and see the admin dashboard! 🎉

---

## Troubleshooting

### "Database connection failed" Error

1. **Test connection:**
   ```bash
   npm run test-db
   ```

2. **Check `.env.local`:**
   - Ensure `MONGODB_URI` is correct
   - No extra spaces or quotes
   - Password is URL-encoded if it contains special characters

3. **MongoDB Atlas:**
   - Network Access allows your IP (or "Allow Access from Anywhere")
   - Database user exists and password is correct
   - Cluster is running (not paused)

4. **Local MongoDB:**
   - Service is running: `Get-Service MongoDB` (Windows)
   - Port 27017 is not blocked by firewall

### "Cannot find module 'tsx'" Error

```bash
npm install -D tsx
```

### Admin User Already Exists

- Use existing credentials
- Or connect to MongoDB and delete the user:
  ```javascript
  use bloom_branding_local_dev
  db.adminusers.deleteOne({ email: "admin@bloombranding.com" })
  ```
- Then run `npm run create-admin` again

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in package.json
```

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test-db` - Test MongoDB connection
- `npm run create-admin` - Create admin user

---

## Security Notes

- **Change default password** after first login
- **Never commit** `.env.local` to version control
- **Use strong JWT_SECRET** (at least 32 characters)
- **Use different credentials** for production
- **Restrict MongoDB network access** in production
- **Enable MongoDB authentication** in production

---

## Next Steps

After successful setup:

1. ✅ Login to admin panel
2. ✅ Change admin password
3. ✅ Upload media to Cloudinary via admin panel
4. ✅ Create brands, testimonials, and other content
5. ✅ Test all admin features
6. ✅ Deploy to production

---

## Need Help?

1. Check terminal logs for error messages
2. Verify all environment variables are set correctly
3. Test MongoDB connection: `npm run test-db`
4. Check browser console for client-side errors
5. Ensure all dependencies are installed: `npm install`

---

**You're all set!** 🚀

