import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IOurStory extends Document {
  heroLabel: string
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage?: {
    url: string
    mediaId?: string
  }
  purposeTitle: string
  purposeDescription: string
  purposeImage?: {
    url: string
    mediaId?: string
  }
  purposeStats: {
    brandsBuilt: number
    satisfaction: number
  }
  philosophyTitle: string
  philosophyDescription: string
  philosophyCards: {
    id: string
    title: string
    description: string
    icon?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const OurStorySchema = new Schema<IOurStory>(
  {
    heroLabel: {
      type: String,
      default: 'Established 2024',
    },
    heroTitle: {
      type: String,
      default: 'OUR STORY',
    },
    heroSubtitle: {
      type: String,
      default: 'Building brands that leave a legacy through clarity, confidence, and craft.',
    },
    heroBackgroundImage: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    purposeTitle: {
      type: String,
      default: 'A studio built on clarity.',
    },
    purposeDescription: {
      type: String,
      default: 'Bloom Branding is a strategic branding agency for those ready to make a noise.',
    },
    purposeImage: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    purposeStats: {
      brandsBuilt: {
        type: Number,
        default: 30,
      },
      satisfaction: {
        type: Number,
        default: 100,
      },
    },
    philosophyTitle: {
      type: String,
      default: 'Our Philosophy',
    },
    philosophyDescription: {
      type: String,
      default: 'We believe in building brands that stand the test of time.',
    },
    philosophyCards: [
      {
        id: {
          type: String,
          default: '',
        },
        title: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          default: '',
        },
        icon: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'ourstory',
  }
)

// Ensure only one our story document exists
OurStorySchema.index({ _id: 1 }, { unique: true })

// ✅ NEXT.JS SAFE MODEL EXPORT
let OurStory: Model<IOurStory>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.OurStory) {
  OurStory = mongoose.models.OurStory as Model<IOurStory>
} else if (typeof mongoose !== 'undefined') {
  OurStory = mongoose.model<IOurStory>('OurStory', OurStorySchema)
} else {
  OurStory = null as any
}

export default OurStory

