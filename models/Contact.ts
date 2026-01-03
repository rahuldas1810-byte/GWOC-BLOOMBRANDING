import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IContact extends Document {
  heroLabel: string
  heroTitle: string
  heroDescription: string
  heroBackgroundImage?: {
    url: string
    mediaId?: string
  }
  formTitle: string
  formDescription: string
  socialLinks: {
    instagram?: string
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  address: {
    line1: string
    line2: string
    line3: string
    line4: string
  }
  email: string
  phone: string
  faqs: {
    question: string
    answer: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    heroLabel: {
      type: String,
      default: "Let's Talk",
    },
    heroTitle: {
      type: String,
      default: 'Get in Touch',
    },
    heroDescription: {
      type: String,
      default: 'Ready to build your brand identity? Let\'s start a conversation.',
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
    formTitle: {
      type: String,
      default: 'Send us a message',
    },
    formDescription: {
      type: String,
      default: 'Fill out the form below and we\'ll get back to you as soon as possible.',
    },
    socialLinks: {
      instagram: {
        type: String,
        default: '',
      },
      linkedin: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      facebook: {
        type: String,
        default: '',
      },
    },
    address: {
      line1: {
        type: String,
        default: 'Bloom Branding, Solarium',
      },
      line2: {
        type: String,
        default: 'Business Centre, 515,',
      },
      line3: {
        type: String,
        default: 'beside Times Corner, Surat,',
      },
      line4: {
        type: String,
        default: 'Gujarat 395007',
      },
    },
    email: {
      type: String,
      default: 'hello@bloombranding.com',
    },
    phone: {
      type: String,
      default: '+91 1234567890',
    },
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'contact',
  }
)

// Ensure only one contact document exists
ContactSchema.index({ _id: 1 }, { unique: true })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Contact: Model<IContact>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Contact) {
  Contact = mongoose.models.Contact as Model<IContact>
} else if (typeof mongoose !== 'undefined') {
  Contact = mongoose.model<IContact>('Contact', ContactSchema)
} else {
  Contact = null as any
}

export default Contact

