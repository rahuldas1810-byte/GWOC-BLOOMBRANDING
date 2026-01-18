import type { Testimonial, Client, HomepageContent } from '@/types'

/**
 * Fetch testimonials from API with retry logic
 * Falls back to empty array if API fails (graceful degradation)
 */
export const getTestimonials = async (retries = 3): Promise<Testimonial[]> => {
  try {
    // Use relative path for both server and client
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // 1. Check Site Settings First
    const settings = await getSiteSettings();
    const useGoogleReviews = settings?.useGoogleReviews !== false; // Default to true if undefined

    if (useGoogleReviews) {
      try {
        const googleRes = await fetch(`${baseUrl}/api/google-reviews`, {
          next: { revalidate: 3600 }, // Cache for 1 hour locally
        });
        if (googleRes.ok) {
          const googleData = await googleRes.json();
          if (googleData.success && googleData.data && googleData.data.length > 0) {
            return googleData.data;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch Google Reviews, falling back to CMS", e);
      }
    }

    // 2. Fallback to CMS (Existing Logic)
    const fetchWithRetry = async (attempt: number): Promise<Response> => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${baseUrl}/api/public/testimonials`, {
          next: { revalidate: 300 }, // Cache for 5 minutes
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response
      } catch (error: any) {
        if (attempt < retries && (error.name === 'AbortError' || error.name === 'TypeError' || error.message?.includes('fetch'))) {
          console.warn(`Testimonials fetch attempt ${attempt} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Exponential backoff
          return fetchWithRetry(attempt + 1)
        }
        throw error
      }
    }

    const response = await fetchWithRetry(1)

    if (!response.ok) {
      console.warn('Failed to fetch testimonials from API, returning empty array')
      return []
    }

    const result = await response.json()

    if (result.success && Array.isArray(result.data)) {
      // Transform API response to match frontend interface
      return result.data.map((item: any) => ({
        id: item._id || item.id,
        quote: item.quote,
        clientName: item.clientName,
        company: item.company,
        image: item.profileImage?.url || item.image,
        createdAt: item.createdAt,
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    // Return empty array on error for graceful degradation
    return []
  }
}

/**
 * Fetch clients from API
 * Falls back to empty array if API fails (graceful degradation)
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    // Use relative path for both server and client
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/clients`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch clients from API, returning empty array')
      return []
    }

    const result = await response.json()

    if (result.success && Array.isArray(result.data)) {
      // Transform API response to match frontend interface
      return result.data
        .map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          logo: item.logo?.url || item.logo,
          image: item.logo?.url || item.image,
          category: item.category,
          description: item.description,
          order: item.order || 0,
        }))
        .sort((a: Client, b: Client) => (a.order || 0) - (b.order || 0))
    }

    return []
  } catch (error) {
    console.error('Error fetching clients:', error)
    // Return empty array on error for graceful degradation
    return []
  }
}

/**
 * Fetch homepage content from API with retry logic
 * Falls back to default content if API fails
 */
export const getHomepageContent = async (retries = 3): Promise<HomepageContent> => {
  try {
    // Use relative path for both server and client
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const fetchWithRetry = async (attempt: number): Promise<Response> => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${baseUrl}/api/public/homepage`, {
          next: { revalidate: 300 }, // Cache for 5 minutes
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response
      } catch (error: any) {
        if (attempt < retries && (error.name === 'AbortError' || error.name === 'TypeError' || error.message?.includes('fetch'))) {
          console.warn(`Homepage fetch attempt ${attempt} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Exponential backoff
          return fetchWithRetry(attempt + 1)
        }
        throw error
      }
    }

    const response = await fetchWithRetry(1)

    if (!response.ok) {
      console.warn('Failed to fetch homepage from API, returning default content')
      return getDefaultHomepageContent()
    }

    const result = await response.json()

    if (result.success && result.data) {
      return {
        id: result.data._id || result.data.id || 'homepage',
        heroHeadline: result.data.heroHeadline || '',
        heroSubheading: result.data.heroSubheading || '',
        aboutPreview: result.data.aboutPreview || '',
        servicesPreview: result.data.servicesPreview || [],
        tagline: result.data.tagline || 'Helping Brands Bloom',
        heroVideo: result.data.heroVideo?.url || result.data.heroVideo || null,
        backgroundVideo: result.data.backgroundVideo?.url || result.data.backgroundVideo || null,
        sectionVideo: result.data.sectionVideo?.url || result.data.sectionVideo || null,
        testimonialsLabel: result.data.testimonialsLabel,
        testimonialsHeading: result.data.testimonialsHeading,
        homepageTestimonialIds: result.data.homepageTestimonialIds,
        sections: result.data.sections,
      }
    }

    return getDefaultHomepageContent()
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return getDefaultHomepageContent()
  }
}

/**
 * Default homepage content (fallback)
 */
function getDefaultHomepageContent(): HomepageContent {
  return {
    id: 'homepage',
    heroHeadline: 'We craft brand identities that resonate.',
    heroSubheading: 'Bringing synergy of aesthetics and expertise to help your brand bloom.',
    aboutPreview: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
    servicesPreview: [],
    heroVideo: null,
    backgroundVideo: null,
    sectionVideo: null,
    sections: {
      hero: { enabled: true, order: 1 },
      services: { enabled: true, order: 3 },
      clients: { enabled: true, order: 4 },
      about: { enabled: true, order: 2 },
      testimonials: { enabled: true, order: 5 }
    }
  }
}

/**
 * Fetch services from API
 */
export const getServices = async () => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/services`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch services from API')
      return []
    }

    const result = await response.json()
    return result.success && Array.isArray(result.data) ? result.data : []
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

/**
 * Fetch our story content from API
 */
export const getOurStory = async () => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/our-story`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch our story from API')
      return null
    }

    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error fetching our story:', error)
    return null
  }
}

/**
 * Fetch contact content from API
 */
export const getContact = async () => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/contact`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch contact from API')
      return null
    }

    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error fetching contact:', error)
    return null
  }
}

/**
 * Fetch site settings from API
 */
export const getSiteSettings = async () => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/site-settings`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch site settings from API')
      return null
    }

    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Fetch brands from API (public) with retry logic
 */
const FALLBACK_BRANDS = [
  { name: 'Amar Gems', category: 'JEWELLERY', image: '/brands/amar.jpg', order: 1 },
  { name: 'AMBC', category: 'OTHER', image: '/brands/ambc.jpg', order: 2 },
  { name: 'Bafna Marble', category: 'HOME FURNISHING', image: '/brands/bafna-marble.jpg', order: 3 },
  { name: 'Beach', category: 'LIFESTYLE', image: '/brands/beach.jpg', order: 4 },
  { name: 'Binal Patel', category: 'FASHION', image: '/brands/binal-patel.jpg', order: 5 },
  { name: 'BThere', category: 'LIFESTYLE', image: '/brands/bthere.jpg', order: 6 },
  { name: 'Dhruv', category: 'OTHER', image: '/brands/dhruv.jpg', order: 7 },
  { name: 'Fine Decor', category: 'HOME FURNISHING', image: '/brands/fine-decor.jpg', order: 8 },
  { name: 'Kaffyn', category: 'CAFE & RESTAURANTS', image: '/brands/kaffyn.jpg', order: 9 },
  { name: 'Mansi Nagdev', category: 'FASHION', image: '/brands/mansi-nagdev.jpg', order: 10 },
  { name: 'Moire Rugs', category: 'HOME FURNISHING', image: '/brands/moire-rugs.jpg', order: 11 },
  { name: 'The Shop', category: 'LIFESTYLE', image: '/brands/shop.jpg', order: 12 },
  { name: 'The Right Cut', category: 'FASHION', image: '/brands/the-right-cut.jpg', order: 13 },
  { name: 'Thyme', category: 'CAFE & RESTAURANTS', image: '/brands/thyme.jpg', order: 14 },
  { name: 'Vardhaman', category: 'JEWELLERY', image: '/brands/vardhaman.jpg', order: 15 },
];

/**
 * Fetch brands from API (public) with retry logic
 */
export const getBrands = async (category?: string, retries = 3) => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const query = category ? `?category=${category}` : ''

    const fetchWithRetry = async (attempt: number): Promise<Response> => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${baseUrl}/api/public/brands${query}`, {
          next: { revalidate: 300 }, // Cache for 5 minutes
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response
      } catch (error: any) {
        if (attempt < retries && (error.name === 'AbortError' || error.name === 'TypeError' || error.message?.includes('fetch'))) {
          console.warn(`Brands fetch attempt ${attempt} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Exponential backoff
          return fetchWithRetry(attempt + 1)
        }
        throw error
      }
    }

    const response = await fetchWithRetry(1)

    if (!response.ok) {
      console.warn('Failed to fetch brands from API, using fallback')
      return filterFallbackBrands(category)
    }

    const result = await response.json()
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data
    } else {
      // API success but no data (empty DB) -> Return fallback
      return filterFallbackBrands(category)
    }

  } catch (error) {
    console.error('Error fetching brands:', error)
    return filterFallbackBrands(category)
  }
}

// Helper to filter fallback data
function filterFallbackBrands(category?: string) {
  if (!category) return FALLBACK_BRANDS;
  return FALLBACK_BRANDS.filter(b => b.category === category);
}

/**
 * Fetch sectors from API
 */
export const getSectors = async () => {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/sectors`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch sectors from API')
      return []
    }

    const result = await response.json()
    return result.success && Array.isArray(result.data) ? result.data : []
  } catch (error) {
    console.error('Error fetching sectors:', error)
    return []
  }
}

