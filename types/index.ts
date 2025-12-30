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
  heroVideo?: { url: string; mediaId?: string } | null
  backgroundVideo?: { url: string; mediaId?: string } | null
  sectionVideo?: { url: string; mediaId?: string } | null
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
