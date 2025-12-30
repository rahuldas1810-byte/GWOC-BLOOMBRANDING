import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IMedia extends Document {
  url: string
  publicId: string // Cloudinary public ID for deletion
  type: 'image' | 'video'
  originalName: string
  altText?: string
  usedIn?: string[] // ['hero', 'banner', 'testimonial', 'service', 'brand', 'client']
  folder?: string
  tags?: string[]
  width?: number
  height?: number
  size?: number // bytes
  format?: string // jpg, png, mp4, webm, etc.
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<IMedia>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: '',
    },
    usedIn: {
      type: [String],
      default: [],
    },
    folder: {
      type: String,
      default: 'bloom-branding',
    },
    tags: {
      type: [String],
      default: [],
    },
    width: Number,
    height: Number,
    size: Number,
    format: String,
  },
  {
    timestamps: true,
    collection: 'media',
  }
)

// Indexes for faster queries
MediaSchema.index({ type: 1 })
MediaSchema.index({ usedIn: 1 })
MediaSchema.index({ folder: 1 })
MediaSchema.index({ tags: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Media: Model<IMedia>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Media) {
  Media = mongoose.models.Media as Model<IMedia>
} else if (typeof mongoose !== 'undefined') {
  Media = mongoose.model<IMedia>('Media', MediaSchema)
} else {
  Media = null as any
}

export default Media

