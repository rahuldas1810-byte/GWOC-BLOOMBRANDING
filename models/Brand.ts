import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IBrand extends Document {
  name: string
  category?: string
  description?: string
  logo?: {
    url: string
    mediaId?: string // Reference to Media document
  }
  image?: {
    url: string
    mediaId?: string
  }
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    image: {
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
    collection: 'brands',
  }
)

// Indexes
BrandSchema.index({ isActive: 1, order: 1 })
BrandSchema.index({ category: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Brand: Model<IBrand>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Brand) {
  Brand = mongoose.models.Brand as Model<IBrand>
} else if (typeof mongoose !== 'undefined') {
  Brand = mongoose.model<IBrand>('Brand', BrandSchema)
} else {
  Brand = null as any
}

export default Brand

