import mongoose from 'mongoose';


if (typeof window !== 'undefined') {
  throw new Error('Database connection can only be used on the server');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  console.log("🧪 [RUNTIME ENV CHECK] START");

  console.log("🧪 NODE_ENV:", process.env.NODE_ENV);
  console.log("🧪 MONGODB_URI:", process.env.MONGODB_URI);
  console.log("🧪 JWT_SECRET:", process.env.JWT_SECRET);
  console.log("🧪 JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
  console.log("🧪 CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("🧪 CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  console.log("🧪 CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

  console.log(
    "🧪 ALL ENV KEYS (filtered):",
    Object.keys(process.env).filter((k) =>
      k.includes("MONGO") ||
      k.includes("JWT") ||
      k.includes("CLOUDINARY")
    )
  );

  console.log("🧪 [RUNTIME ENV CHECK] END");


  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, { bufferCommands: false })
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e.message);

    if (e.message.includes('ECONNREFUSED')) {
      throw new Error(
        'MongoDB connection refused. Please ensure:\n' +
          '1. MONGODB_URI in .env.local is correct\n' +
          '2. MongoDB Atlas Network Access allows your IP\n' +
          '3. You are NOT using localhost accidentally'
      );
    }

    throw e;
  }

  return cached.conn;
}

export default connectDB;
