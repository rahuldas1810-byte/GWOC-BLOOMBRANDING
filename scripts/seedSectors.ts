import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
    path: path.resolve(process.cwd(), '.env.local'),
})

async function seedSectors() {
    try {
        console.log('🔄 Starting sector seeding...')

        const { default: connectDB } = await import('../backend/db')
        const { default: Sector } = await import('../models/Sector')

        await connectDB()
        console.log('✅ Connected to MongoDB')

        // Clean up existing sectors
        await Sector.deleteMany({})
        console.log('🗑️ Cleared existing sectors.')

        const initialSectors = [
            {
                name: 'Fashion',
                description: 'Defining modern luxury.',
                icon: 'Gem',
                color: 'bg-[#C5CBB4]',
                order: 1,
                isActive: true,
            },
            {
                name: 'Tech',
                description: 'Humanizing digital experiences.',
                icon: 'Cpu',
                color: 'bg-[#D8D4CC]',
                order: 2,
                isActive: true,
            },
            {
                name: 'Wellness',
                description: 'Cultivating balance.',
                icon: 'Leaf',
                color: 'bg-[#D4C5B8]',
                order: 3,
                isActive: true,
            },
            {
                name: 'Finance',
                description: 'Building trust.',
                icon: 'TrendingUp',
                color: 'bg-[#B8C0C4]',
                order: 4,
                isActive: true,
            },
            {
                name: 'Hospitality',
                description: 'Crafting memorable stays.',
                icon: 'Armchair',
                color: 'bg-[#CDC7B6]',
                order: 5,
                isActive: true,
            },
        ]

        const results = await Sector.insertMany(initialSectors)
        console.log(`✅ Successfully created ${results.length} sectors!`)
        process.exit(0)
    } catch (error: any) {
        console.error('❌ Error seeding sectors:', error.message)
        process.exit(1)
    }
}

seedSectors()
