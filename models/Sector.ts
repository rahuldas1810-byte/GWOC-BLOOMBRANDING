import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface ISector extends Document {
    name: string
    description: string
    icon: string // Lucide icon name
    color: string // Tailwind bg class
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const SectorSchema = new Schema<ISector>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: 'Gem',
        },
        color: {
            type: String,
            default: 'bg-[#C5CBB4]',
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'sectors',
    }
)

// Indexes
SectorSchema.index({ isActive: 1, order: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Sector: Model<ISector>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Sector) {
    Sector = mongoose.models.Sector as Model<ISector>
} else if (typeof mongoose !== 'undefined') {
    Sector = mongoose.model<ISector>('Sector', SectorSchema)
} else {
    Sector = null as any
}

export default Sector
