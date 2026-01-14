export interface Testimonial {
  id: string
  quote: string
  clientName: string
  company: string
  image?: string
  createdAt?: any
}

export interface Client {
  id: string
  name: string
  logo?: string
  category?: string
  description?: string
  order?: number
  image?: string
}

export interface HomepageContent {
  id: string
  heroHeadline: string
  heroSubheading: string
  aboutPreview: string
  servicesPreview: string[]
  tagline?: string
  heroVideo?: string | { url: string; mediaId?: string } | null
  backgroundVideo?: string | { url: string; mediaId?: string } | null
  sectionVideo?: string | { url: string; mediaId?: string } | null
  testimonialsLabel?: string
  testimonialsHeading?: string
  homepageTestimonialIds?: string[]
}

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  company?: string
  message: string
  createdAt?: any
}

export interface ShowcaseClient {
  name: string
  type: string
  review: string
  image: string
}

export interface Sector {
  id?: string
  _id?: string
  name: string
  description: string
  icon: string
  color: string
  order: number
  isActive: boolean
}
