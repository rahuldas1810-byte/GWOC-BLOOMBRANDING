export interface Testimonial {
  id: string
  quote: string
  clientName: string
  company: string
  createdAt?: any
}

export interface Client {
  id: string
  name: string
  logo?: string
  order?: number
}

export interface HomepageContent {
  id: string
  heroHeadline: string
  heroSubheading: string
  aboutPreview: string
  servicesPreview: string[]
}

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  company?: string
  message: string
  createdAt?: any
}

