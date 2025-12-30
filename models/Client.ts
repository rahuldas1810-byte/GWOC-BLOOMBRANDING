import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IClient extends Document {
  name: string
  logo?: {
    url: string
    mediaId?: string // Reference to Media document
  }
  category?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
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
    category: {
      type: String,
      default: '',
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
    collection: 'clients',
  }
)

// Indexes
ClientSchema.index({ isActive: 1, order: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Client: Model<IClient>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Client) {
  Client = mongoose.models.Client as Model<IClient>
} else if (typeof mongoose !== 'undefined') {
  Client = mongoose.model<IClient>('Client', ClientSchema)
} else {
  Client = null as any
}

export default Client

