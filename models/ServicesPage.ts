import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IServicesPage extends Document {
    hero: {
        text: string
        video?: {
            url: string
            mediaId?: mongoose.Types.ObjectId
        }
    }
    backgroundImage: {
        url: string
        mediaId?: mongoose.Types.ObjectId
    }
    statementA: {
        text: string
    }
    statementB: {
        text: string
    }
    newsletter: {
        title: string
        description: string
    }
    createdAt: Date
    updatedAt: Date
}

const ServicesPageSchema = new Schema<IServicesPage>(
    {
        hero: {
            text: { type: String, default: '' },
            video: {
                url: String,
                mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
            },
        },
        backgroundImage: {
            url: String,
            mediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
        },
        statementA: {
            text: { type: String, default: '' },
        },
        statementB: {
            text: { type: String, default: '' },
        },
        newsletter: {
            title: { type: String, default: 'Join the conversation.' },
            description: { type: String, default: 'Get the latest insights.' },
        },
    },
    {
        timestamps: true,
        collection: 'services_page_content',
    }
)

let ServicesPage: Model<IServicesPage>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.ServicesPage) {
    ServicesPage = mongoose.models.ServicesPage as Model<IServicesPage>
} else if (typeof mongoose !== 'undefined') {
    ServicesPage = mongoose.model<IServicesPage>('ServicesPage', ServicesPageSchema)
} else {
    ServicesPage = null as any
}

export default ServicesPage
