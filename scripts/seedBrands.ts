import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
})

async function seedBrands() {
  try {
    console.log('🔄 Starting brand seeding...')

    // 🔥 CRITICAL: dynamic imports AFTER dotenv
    const { default: connectDB } = await import('../backend/db')
    const { default: Brand } = await import('../models/Brand')

    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check if brands already exist
    const existingCount = await Brand.countDocuments()
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing brands.`)
      console.log('Adding more brands...')
    }

    // Dummy brands with placeholder images and different categories
    const dummyBrands = [
      {
        name: 'Diamond Elegance',
        category: 'JEWELLERY',
        description: 'Luxury diamond jewelry collection',
        image: {
          url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
        },
        order: 1,
        isActive: true,
      },
      {
        name: 'Gold Heritage',
        category: 'JEWELLERY',
        description: 'Traditional gold jewelry designs',
        image: {
          url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
        },
        order: 2,
        isActive: true,
      },
      {
        name: 'Fashion Forward',
        category: 'FASHION',
        description: 'Contemporary fashion brand',
        image: {
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        },
        order: 3,
        isActive: true,
      },
      {
        name: 'Urban Style',
        category: 'FASHION',
        description: 'Streetwear and urban fashion',
        image: {
          url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
        },
        order: 4,
        isActive: true,
      },
      {
        name: 'Café Mocha',
        category: 'CAFE & RESTAURANTS',
        description: 'Artisan coffee and pastries',
        image: {
          url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
        },
        order: 5,
        isActive: true,
      },
      {
        name: 'Bistro Delight',
        category: 'CAFE & RESTAURANTS',
        description: 'Fine dining experience',
        image: {
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        },
        order: 6,
        isActive: true,
      },
      {
        name: 'Modern Living',
        category: 'HOME FURNISHING',
        description: 'Contemporary home decor',
        image: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        },
        order: 7,
        isActive: true,
      },
      {
        name: 'Cozy Home',
        category: 'HOME FURNISHING',
        description: 'Comfortable and stylish furnishings',
        image: {
          url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
        },
        order: 8,
        isActive: true,
      },
      {
        name: 'Wellness Plus',
        category: 'LIFESTYLE',
        description: 'Health and wellness products',
        image: {
          url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
        },
        order: 9,
        isActive: true,
      },
      {
        name: 'Active Life',
        category: 'LIFESTYLE',
        description: 'Fitness and active lifestyle brand',
        image: {
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        },
        order: 10,
        isActive: true,
      },
      {
        name: 'Tech Innovations',
        category: 'OTHER',
        description: 'Cutting-edge technology solutions',
        image: {
          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        },
        order: 11,
        isActive: true,
      },
      {
        name: 'Creative Studio',
        category: 'OTHER',
        description: 'Design and creative services',
        image: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        },
        order: 12,
        isActive: true,
      },
    ]

    // Insert brands
    const results = await Brand.insertMany(dummyBrands)

    console.log(`✅ Successfully created ${results.length} brands!`)
    console.log('\n📋 Created brands by category:')
    const byCategory = results.reduce((acc: any, brand: any) => {
      const cat = brand.category || 'OTHER'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(brand.name)
      return acc
    }, {})
    
    Object.keys(byCategory).forEach(category => {
      console.log(`  ${category}:`)
      byCategory[category].forEach((name: string) => {
        console.log(`    - ${name}`)
      })
    })
    
    console.log('\n✨ Brands are now active and will appear on the frontend!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding brands:')
    console.error(error.message)
    if (error.code === 11000) {
      console.error('⚠️ Some brands may already exist. This is okay!')
    }
    process.exit(1)
  }
}

seedBrands()






















