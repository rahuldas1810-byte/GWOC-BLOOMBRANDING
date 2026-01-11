import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function seedClients() {
  try {
    console.log('🔄 Starting client seeding...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Client } = await import('../models/Client')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check if clients already exist
    const existingCount = await Client.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing clients.`)
      console.log('Adding more clients...')
    }

    // Dummy clients with placeholder logos
    const dummyClients = [
      {
        name: 'TechFlow',
        category: 'Technology',
        logo: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
        },
        order: 1,
        isActive: true,
      },
      {
        name: 'GreenLeaf Co',
        category: 'Sustainability',
        logo: {
          url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop',
        },
        order: 2,
        isActive: true,
      },
      {
        name: 'Artisan Goods',
        category: 'Retail',
        logo: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        },
        order: 3,
        isActive: true,
      },
      {
        name: 'Nexus Labs',
        category: 'Technology',
        logo: {
          url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop',
        },
        order: 4,
        isActive: true,
      },
      {
        name: 'Creative Solutions',
        category: 'Design',
        logo: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
        },
        order: 5,
        isActive: true,
      },
      {
        name: 'Urban Dynamics',
        category: 'Real Estate',
        logo: {
          url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
        },
        order: 6,
        isActive: true,
      },
      {
        name: 'Wellness Plus',
        category: 'Health',
        logo: {
          url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
        },
        order: 7,
        isActive: true,
      },
      {
        name: 'Fashion Forward',
        category: 'Fashion',
        logo: {
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        },
        order: 8,
        isActive: true,
      },
      {
        name: 'Culinary Arts',
        category: 'Food & Beverage',
        logo: {
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
        },
        order: 9,
        isActive: true,
      },
      {
        name: 'Home Essentials',
        category: 'Retail',
        logo: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        },
        order: 10,
        isActive: true,
      },
    ]

    // Insert clients
    const results = await Client.insertMany(dummyClients)

    console.log(`✅ Successfully created ${results.length} clients!`)
    console.log('\n📋 Created clients:')
    results.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.name} (${client.category || 'No category'})`)
    })
    console.log('\n✨ Clients are now active and will appear on the frontend!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding clients:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('⚠️ Some clients may already exist. This is okay!')
    }
    process.exit(1)
  }
}

seedClients()























