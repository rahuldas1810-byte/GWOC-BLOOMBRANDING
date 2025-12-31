import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function seedServices() {
  try {
    console.log('🔄 Starting services seeding...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Service } = await import('../models/Service')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check if services already exist
    const existingCount = await Service.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing services.`)
      console.log('Adding more services...')
    }

    // Dummy services with images and details
    const dummyServices = [
      {
        title: 'Brand Identity',
        description:
          'Complete visual identity systems that define who you are. We create logos, color palettes, typography, and brand guidelines that work together to tell your story.',
        details: [
          'Logo design and variations',
          'Color palette and typography',
          'Brand guidelines document',
          'Visual identity system',
        ],
        images: [
          { url: '/service1.jpeg' },
          { url: '/service2.jpeg' },
          { url: '/service3.jpeg' },
          { url: '/service4.jpeg' },
        ],
        order: 1,
        isActive: true,
      },
      {
        title: 'Visual Design',
        description:
          'Stunning design that communicates your brand story. From web design to print materials, we create visuals that resonate.',
        details: [
          'Web and digital design',
          'Print and packaging design',
          'Marketing materials',
          'Design system creation',
        ],
        images: [
          { url: '/visual1.jpeg' },
          { url: '/visual2.jpeg' },
          { url: '/visual3.jpeg' },
          { url: '/visual4.jpeg' },
        ],
        order: 2,
        isActive: true,
      },
      {
        title: 'Social Media Branding',
        description:
          'Cohesive brand presence across all social platforms. We ensure your brand looks and feels consistent wherever your audience finds you.',
        details: [
          'Social media templates',
          'Content style guides',
          'Profile optimization',
          'Brand consistency audits',
        ],
        images: [
          { url: '/23.jpg' },
          { url: '/24.jpg' },
          { url: '/25.jpg' },
          { url: '/26.jpg' },
        ],
        order: 3,
        isActive: true,
      },
      {
        title: 'Content Strategy',
        description:
          'Strategic messaging that resonates with your audience. We help you find your voice and communicate clearly.',
        details: [
          'Brand messaging framework',
          'Content guidelines',
          'Tone of voice development',
          'Messaging strategy',
        ],
        images: [
          { url: '/content1.jpeg' },
          { url: '/content2.jpeg' },
          { url: '/content3.jpeg' },
          { url: '/content4.jpeg' },
        ],
        order: 4,
        isActive: true,
      },
      {
        title: 'Creative Direction',
        description:
          'End-to-end creative vision for your brand. We guide the entire creative process from concept to execution.',
        details: [
          'Creative strategy',
          'Art direction',
          'Campaign development',
          'Brand evolution planning',
        ],
        images: [
          { url: '/creative1.jpeg' },
          { url: '/creative2.jpeg' },
          { url: '/creative3.jpeg' },
          { url: '/11.jpg' },
        ],
        order: 5,
        isActive: true,
      },
      {
        title: 'Marketing Campaigns',
        description:
          'Data-driven campaigns designed to amplify reach and impact. We create campaigns that connect with your audience and drive results.',
        details: [
          'Campaign strategy',
          'Multi-channel execution',
          'Performance tracking',
          'ROI optimization',
        ],
        images: [
          { url: '/12.jpg' },
          { url: '/19.jpg' },
          { url: '/22.jpg' },
          { url: '/27.jpg' },
        ],
        order: 6,
        isActive: true,
      },
    ]

    // Insert services
    const results = await Service.insertMany(dummyServices)

    console.log(`✅ Successfully created ${results.length} services!`)
    console.log('\n📋 Created services:')
    results.forEach((service: any, index: number) => {
      console.log(`  ${index + 1}. ${service.title}`)
      console.log(`     Description: ${service.description.substring(0, 60)}...`)
      console.log(`     Images: ${service.images.length} images`)
      console.log(`     Details: ${service.details.length} bullet points`)
    })

    console.log('\n✨ Services are now active and will appear on the frontend!')
    console.log('   - Homepage: First 6 services will be displayed')
    console.log('   - Services Page: All services with full details and images')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding services:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('⚠️ Some services may already exist. This is okay!')
    }
    process.exit(1)
  }
}

seedServices()

