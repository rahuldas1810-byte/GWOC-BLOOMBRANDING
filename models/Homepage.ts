import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IHomepage extends Document {
  heroHeadline: string
  heroSubheading: string
  heroImage?: {
    url: string
    mediaId?: string
  }
  heroVideo?: {
    url: string
    mediaId?: string
  }
  backgroundVideo?: {
    url: string
    mediaId?: string
  }
  sectionVideo?: {
    url: string
    mediaId?: string
  }
  aboutPreview: string
  tagline: string
  servicesPreview: string[] // Array of service descriptions
  sections: {
    hero: { enabled: boolean; order: number }
    about: { enabled: boolean; order: number }
    services: { enabled: boolean; order: number }
    clients: { enabled: boolean; order: number }
    testimonials: { enabled: boolean; order: number }
  }
  createdAt: Date
  updatedAt: Date
}

const HomepageSchema = new Schema<IHomepage>(
  {
    heroHeadline: {
      type: String,
      default: 'We craft brand identities that resonate.',
    },
    heroSubheading: {
      type: String,
      default: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
    },
    heroImage: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    heroVideo: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    backgroundVideo: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    sectionVideo: {
      url: {
        type: String,
        default: '',
      },
      mediaId: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    },
    aboutPreview: {
      type: String,
      default: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
    },
    tagline: {
      type: String,
      default: 'Helping Brands Bloom',
    },
    servicesPreview: {
      type: [String],
      default: [],
    },
    sections: {
      hero: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 1 } },
      about: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 2 } },
      services: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 3 } },
      clients: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 4 } },
      testimonials: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 5 } },
    },
  },
  {
    timestamps: true,
    collection: 'homepage',
  }
)

// Ensure only one homepage document exists
HomepageSchema.index({ _id: 1 }, { unique: true })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Homepage: Model<IHomepage>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Homepage) {
  Homepage = mongoose.models.Homepage as Model<IHomepage>
} else if (typeof mongoose !== 'undefined') {
  Homepage = mongoose.model<IHomepage>('Homepage', HomepageSchema)
} else {
  Homepage = null as any
}

export default Homepage

