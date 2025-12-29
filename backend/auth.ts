import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

if (typeof window !== 'undefined') {
  throw new Error('Auth utilities can only be used on the server');
}

type AuthResult = 
  | { user: any }
  | { error: string; status: number };

export function signToken(userId: string, email: string, role: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token: string): { userId: string; email: string; role: string } {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.verify(token, process.env.JWT_SECRET) as {
    userId: string;
    email: string;
    role: string;
  };
}

// Lightweight auth for middleware (Edge Runtime compatible - no DB lookup)
export function verifyAuthToken(request: NextRequest): { userId: string; email: string; role: string } | null {
  try {
    let token: string | null = null;

    // Try to get token from cookie first
    const cookieToken = request.cookies.get('admin_token')?.value;
    if (cookieToken) {
      token = cookieToken;
    } else {
      // Fallback to Authorization header
      const authHeader = request.headers.get('authorization');
      token = authHeader?.split(' ')[1] || null;
    }

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error: any) {
    return null;
  }
}

// Full authentication with database lookup (Node.js runtime only)
// Lazy imports to avoid Edge Runtime issues
export async function authenticate(request: NextRequest): Promise<AuthResult> {
  try {
    // Lazy import to avoid Edge Runtime issues
    const connectDB = (await import('@/backend/db')).default;
    const Admin = (await import('@/models/Admin')).default;

    let token: string | null = null;

    // Try to get token from cookie first
    const cookieToken = request.cookies.get('admin_token')?.value;
    if (cookieToken) {
      token = cookieToken;
    } else {
      // Fallback to Authorization header
      const authHeader = request.headers.get('authorization');
      token = authHeader?.split(' ')[1] || null;
    }

    if (!token) {
      return { error: 'Authentication required. Please login.', status: 401 };
    }

    const decoded = verifyToken(token);
    await connectDB();
    const user = await Admin.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return { error: 'Invalid or inactive account.', status: 401 };
    }

    return { user };
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return { error: 'Invalid token.', status: 401 };
    }
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired. Please login again.', status: 401 };
    }
    return { error: 'Authentication error.', status: 500 };
  }
}
