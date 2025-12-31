import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function seedBanners() {
  try {
    console.log('🔄 Starting banner seeding...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Banner } = await import('../models/Banner')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check if banners already exist
    const existingCount = await Banner.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing banners.`)
      console.log('Adding more banners...')
    }

    // Dummy banners with different types
    const dummyBanners = [
      {
        type: 'hero' as const,
        title: 'We Craft Brand Identities That Resonate',
        subtitle: 'Bringing synergy of aesthetics and expertise',
        text: 'Bloom Branding is a strategic branding agency focused on helping modern companies build confident, clear brand identities.',
        image: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop',
        },
        order: 1,
        isActive: true,
      },
      {
        type: 'section' as const,
        title: 'Our Approach',
        subtitle: 'Strategic Branding Solutions',
        text: 'We combine creative vision with strategic thinking to deliver brands that stand out and connect with audiences.',
        image: {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop',
        },
        order: 2,
        isActive: true,
      },
      {
        type: 'section' as const,
        title: 'Trusted by Leading Brands',
        subtitle: 'Partners in Growth',
        text: 'We work with ambitious companies to build brands that drive real business results.',
        image: {
          url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop',
        },
        order: 3,
        isActive: true,
      },
      {
        type: 'background' as const,
        title: '',
        subtitle: '',
        text: '',
        image: {
          url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop',
        },
        order: 4,
        isActive: true,
      },
      {
        type: 'hero' as const,
        title: 'Transform Your Brand Today',
        subtitle: 'Let\'s Build Something Remarkable',
        text: 'Ready to elevate your brand? Get in touch and let\'s discuss how we can help your brand bloom.',
        image: {
          url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop',
        },
        order: 5,
        isActive: true,
      },
      {
        type: 'section' as const,
        title: 'Creative Excellence',
        subtitle: 'Design That Makes an Impact',
        text: 'Every project is an opportunity to create something meaningful and memorable.',
        image: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop',
        },
        order: 6,
        isActive: true,
      },
    ]

    // Insert banners
    const results = await Banner.insertMany(dummyBanners)

    console.log(`✅ Successfully created ${results.length} banners!`)
    console.log('\n📋 Created banners by type:')
    const byType = results.reduce((acc: any, banner: any) => {
      const type = banner.type || 'unknown'
      if (!acc[type]) acc[type] = []
      acc[type].push({
        title: banner.title || '(No title)',
        order: banner.order,
      })
      return acc
    }, {})
    
    Object.keys(byType).forEach(type => {
      console.log(`  ${type.toUpperCase()}:`)
      byType[type].forEach((item: any) => {
        console.log(`    - ${item.title} (Order: ${item.order})`)
      })
    })
    
    console.log('\n✨ Banners are now active and will appear on the frontend!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding banners:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('⚠️ Some banners may already exist. This is okay!')
    }
    process.exit(1)
  }
}

seedBanners()



