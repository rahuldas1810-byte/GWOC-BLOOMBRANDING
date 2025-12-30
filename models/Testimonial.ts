import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface ITestimonial extends Document {
  quote: string
  clientName: string
  company: string
  profileImage?: {
    url: string
    mediaId?: string // Reference to Media document
  }
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    profileImage: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'testimonials',
  }
)

// Indexes
TestimonialSchema.index({ isActive: 1, order: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Testimonial: Model<ITestimonial>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Testimonial) {
  Testimonial = mongoose.models.Testimonial as Model<ITestimonial>
} else if (typeof mongoose !== 'undefined') {
  Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)
} else {
  Testimonial = null as any
}

export default Testimonial

