export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Testimonial from '@/models/Testimonial'

// Force dynamic rendering - disable caching
export const revalidate = 0

// GET - Public API: List active testimonials (read-only)
export async function GET() {
  try {
    await connectDB();

    const testimonials = await Testimonial.find({
      $or: [
        { isActive: true },
        { isActive: { $exists: false } } // 🔑 FIX
      ]
    })
      .sort({ order: 1, createdAt: -1 })
      .select("quote clientName company image createdAt");

    return NextResponse.json({
      success: true,
      data: Array.isArray(testimonials) ? testimonials : [],
    });
  } catch (error) {
    console.error("Public testimonials fetch error:", error);

    return NextResponse.json({
      success: false,
      data: [], // 🔑 NEVER break UI
    });
  }
}


