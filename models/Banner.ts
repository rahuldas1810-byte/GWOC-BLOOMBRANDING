import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IBanner extends Document {
  type: 'hero' | 'section' | 'background'
  title?: string
  subtitle?: string
  text?: string
  image?: {
    url: string
    mediaId?: string // Reference to Media document
  }
  video?: {
    url: string
    mediaId?: string
  }
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const BannerSchema = new Schema<IBanner>(
  {
    type: {
      type: String,
      enum: ['hero', 'section', 'background'],
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
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
    video: {
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
    collection: 'banners',
  }
)

// Indexes
BannerSchema.index({ type: 1, isActive: 1, order: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Banner: Model<IBanner>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Banner) {
  Banner = mongoose.models.Banner as Model<IBanner>
} else if (typeof mongoose !== 'undefined') {
  Banner = mongoose.model<IBanner>('Banner', BannerSchema)
} else {
  Banner = null as any
}

export default Banner

