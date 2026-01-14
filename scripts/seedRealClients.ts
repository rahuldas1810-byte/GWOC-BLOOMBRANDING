import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
    path: path.resolve(process.cwd(), '.env.local'),
})

async function seedRealClients() {
    try {
        console.log('🔄 Starting real client seeding...')

        const { default: connectDB } = await import('../backend/db')
        const { default: Client } = await import('../models/Client')

        await connectDB()
        console.log('✅ Connected to MongoDB')

        // Clean up existing clients to ensure we see the changes
        await Client.deleteMany({})
        console.log('🗑️ Cleared existing clients.')

        const realClients = [
            {
                name: 'Bloom Studio',
                category: 'D2C • Branding',
                description: 'We helped shape a bold and confident brand identity.',
                logo: { url: '/clients/elegant.jpeg' },
                order: 1,
                isActive: true,
            },
            {
                name: 'Nova Labs',
                category: 'Startup • Strategy',
                description: 'Positioned for clarity and early-stage growth.',
                logo: { url: '/clients/minimal.png' },
                order: 2,
                isActive: true,
            },
            {
                name: 'Echo Creators',
                category: 'Creator • Identity',
                description: 'Built a strong personal brand with consistency.',
                logo: { url: '/clients/techy.png' },
                order: 3,
                isActive: true,
            },
            {
                name: 'Pulse Tech',
                category: 'SaaS • Rebrand',
                description: 'Led a complete rebrand for a modern SaaS product.',
                logo: { url: '/clients/creativity.png' },
                order: 4,
                isActive: true,
            },
            {
                name: 'Urban D2C',
                category: 'Ecommerce • Launch',
                description: 'Supported a clean and confident product launch.',
                logo: { url: '/clients/urban.jpg' },
                order: 5,
                isActive: true,
            },
        ]

        const results = await Client.insertMany(realClients)
        console.log(`✅ Successfully created ${results.length} clients!`)
        process.exit(0)
    } catch (error: any) {
        console.error('❌ Error seeding clients:', error.message)
        process.exit(1)
    }
}

seedRealClients()
