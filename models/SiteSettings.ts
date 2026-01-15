import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface ISiteSettings extends Document {
  // Experience Section Stats
  experienceStats: {
    years: number
    clients: number
    projects: number
  }
  // Impact Stats (Clients page)
  impactStats: {
    brandsCollaborated: number
    successfulLaunches: number
    industriesServed: number
    yearsExperience: number
  }
  // Client Approach Section
  clientApproach: {
    eyebrow: string
    title: string
    statements: string[]
  }
  // Services Page Hero
  servicesHero: {
    label: string
    title: string
    description: string
  }
  // Clients Page Hero
  clientsHero: {
    label: string
    title: string
    description: string
    subtitle: string
    socialLabel: string
  }
  // Homepage Section Labels
  homepageSections: {
    clientsLabel: string
    clientsTitle: string
  }
  // Our Story Page Additional Content
  ourStoryAdditional: {
    whoWeAreLabel: string
    additionalParagraph: string
  }
  // Contact Page Labels
  contactLabels: {
    heroSubtitle: string
    formLabel: string
    formTitle: string
    formDescription: string
  }
  // Testimonials Page Hero
  testimonialsHero: {
    label: string
    title: string
    description: string
    buttonText: string
  }
  useGoogleReviews: boolean
  // Social Links
  socialLinks: {
    instagram: string
    linkedin: string
    facebook: string
  }
  googleMapsUrl: string
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    experienceStats: {
      years: {
        type: Number,
        default: 4,
      },
      clients: {
        type: Number,
        default: 75,
      },
      projects: {
        type: Number,
        default: 100,
      },
    },
    impactStats: {
      brandsCollaborated: {
        type: Number,
        default: 20,
      },
      successfulLaunches: {
        type: Number,
        default: 10,
      },
      industriesServed: {
        type: Number,
        default: 4,
      },
      yearsExperience: {
        type: Number,
        default: 2,
      },
    },
    clientApproach: {
      eyebrow: {
        type: String,
        default: 'Our Approach',
      },
      title: {
        type: String,
        default: 'Design meaningful connections.',
      },
      statements: {
        type: [String],
        default: [
          'We partner directly with founders.',
          'We prioritize clarity over trends.',
          'We build brands that are ready to scale.',
        ],
      },
    },
    servicesHero: {
      label: {
        type: String,
        default: 'What We Do',
      },
      title: {
        type: String,
        default: 'Our Services',
      },
      description: {
        type: String,
        default: 'Strategic branding services designed for companies ready to make an impact.',
      },
    },
    clientsHero: {
      label: {
        type: String,
        default: 'Our Clients',
      },
      title: {
        type: String,
        default: 'Brands Who Trusted Us',
      },
      description: {
        type: String,
        default: 'Each collaboration reflects our approach to building clear, confident brand identities.',
      },
      subtitle: {
        type: String,
        default: 'Trusted by founders, startups, and growing D2C brands.',
      },
      socialLabel: {
        type: String,
        default: 'Trusted by growing brands',
      },
    },
    homepageSections: {
      clientsLabel: {
        type: String,
        default: 'Our Clients',
      },
      clientsTitle: {
        type: String,
        default: 'Trusted By',
      },
    },
    ourStoryAdditional: {
      whoWeAreLabel: {
        type: String,
        default: 'Who We Are',
      },
      additionalParagraph: {
        type: String,
        default: 'We work with startups, D2C brands, and creators who are ready to make a real impact. Our team combines strategic thinking with clean, confident design. We don\'t chase trends. We build brands that stand the test of time.',
      },
    },
    contactLabels: {
      heroSubtitle: {
        type: String,
        default: 'Projects • Collaborations • Brand Enquiries',
      },
      formLabel: {
        type: String,
        default: 'Contact',
      },
      formTitle: {
        type: String,
        default: 'Send us a message.',
      },
      formDescription: {
        type: String,
        default: 'Tell us about your project and we\'ll get back to you within 24 hours.',
      },
    },
    testimonialsHero: {
      label: {
        type: String,
        default: 'Our Partners',
      },
      title: {
        type: String,
        default: 'Testimonials',
      },
      description: {
        type: String,
        default: 'Hear from companies who have worked with us to build their brand identity.',
      },
      buttonText: {
        type: String,
        default: 'Client Stories',
      },
    },
    useGoogleReviews: {
      type: Boolean,
      default: true,
    },
    socialLinks: {
      instagram: {
        type: String,
        default: 'https://www.instagram.com/bloom.branding_/',
      },
      linkedin: {
        type: String,
        default: 'https://in.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency',
      },
      facebook: {
        type: String,
        default: 'https://www.facebook.com/hello.bloombranding/',
      },
    },
    googleMapsUrl: {
      type: String,
      default: 'https://www.google.com/maps/search/?api=1&query=Bloom+Branding+Studio+Surat+Gujarat',
    },
  },
  {
    timestamps: true,
    collection: 'sitesettings',
  }
)

// Ensure only one site settings document exists
SiteSettingsSchema.index({ _id: 1 }, { unique: true })

// ✅ NEXT.JS SAFE MODEL EXPORT
let SiteSettings: Model<ISiteSettings>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.SiteSettings) {
  SiteSettings = mongoose.models.SiteSettings as Model<ISiteSettings>
} else if (typeof mongoose !== 'undefined') {
  SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
} else {
  SiteSettings = null as any
}

export default SiteSettings

