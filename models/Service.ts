import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IService extends Document {
  title: string
  description: string
  details: string[] // Array of bullet points
  images: {
    url: string
    mediaId?: string
  }[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: {
          type: String,
          default: '',
        },
        mediaId: {
          type: Schema.Types.ObjectId,
          ref: 'Media',
        },
      },
    ],
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
    collection: 'services',
  }
)

ServiceSchema.index({ order: 1, isActive: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Service: Model<IService>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Service) {
  Service = mongoose.models.Service as Model<IService>
} else if (typeof mongoose !== 'undefined') {
  Service = mongoose.model<IService>('Service', ServiceSchema)
} else {
  Service = null as any
}

export default Service

