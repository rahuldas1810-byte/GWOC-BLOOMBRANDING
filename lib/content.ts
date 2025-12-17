import { testimonials } from '@/content/testimonials'
import { clients } from '@/content/clients'
import type { Testimonial, Client } from '@/types'

export const getTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate async for consistency with previous API
  return Promise.resolve(testimonials)
}

export const getClients = async (): Promise<Client[]> => {
  // Simulate async for consistency with previous API
  return Promise.resolve(clients.sort((a, b) => (a.order || 0) - (b.order || 0)))
}

