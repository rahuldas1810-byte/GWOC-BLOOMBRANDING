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
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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

