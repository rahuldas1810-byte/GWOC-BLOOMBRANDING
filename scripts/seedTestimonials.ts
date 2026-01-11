import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function seedTestimonials() {
  try {
    console.log('🔄 Starting testimonial seeding...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Testimonial } = await import('../models/Testimonial')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check if testimonials already exist
    const existingCount = await Testimonial.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing testimonials.`)
      console.log('Do you want to add more? (This script will add 5 dummy testimonials)')
      // For automation, we'll proceed anyway
    }

    // Dummy testimonials with placeholder images
    const dummyTestimonials = [
      {
        quote: 'Bloom Branding transformed our brand identity completely. Their strategic approach helped us stand out in a crowded market and connect with our audience on a deeper level.',
        clientName: 'Sarah Chen',
        company: 'TechFlow',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        },
        order: 1,
        isActive: true,
      },
      {
        quote: 'Working with Bloom was a game-changer. They understood our vision and created a brand that truly represents who we are. The results exceeded our expectations.',
        clientName: 'Marcus Johnson',
        company: 'GreenLeaf Co',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        },
        order: 2,
        isActive: true,
      },
      {
        quote: 'The team at Bloom Branding delivered beyond our expectations. Our new brand identity has significantly improved our market presence and customer engagement.',
        clientName: 'Emily Rodriguez',
        company: 'Artisan Goods',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        },
        order: 3,
        isActive: true,
      },
      {
        quote: 'Professional, strategic, and results-driven. Bloom Branding helped us build a brand that resonates with our target audience and drives real business growth.',
        clientName: 'David Kim',
        company: 'Nexus Labs',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        },
        order: 4,
        isActive: true,
      },
      {
        quote: 'Bloom Branding took our brand from good to exceptional. Their creative expertise and strategic thinking helped us establish a strong presence in our industry.',
        clientName: 'Lisa Anderson',
        company: 'Creative Solutions',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        },
        order: 5,
        isActive: true,
      },
    ]

    // Insert testimonials
    const results = await Testimonial.insertMany(dummyTestimonials)

    console.log(`✅ Successfully created ${results.length} testimonials!`)
    console.log('\n📋 Created testimonials:')
    results.forEach((testimonial, index) => {
      console.log(`  ${index + 1}. ${testimonial.clientName} from ${testimonial.company}`)
    })
    console.log('\n✨ Testimonials are now active and will appear on the frontend!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding testimonials:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('⚠️ Some testimonials may already exist. This is okay!')
    }
    process.exit(1)
  }
}

seedTestimonials()





















