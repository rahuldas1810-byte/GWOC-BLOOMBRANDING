import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IEnquiry extends Document {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  status: 'new' | 'contacted' | 'resolved' | 'archived'
  notes?: string // Admin notes
  createdAt: Date
  updatedAt: Date
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved', 'archived'],
      default: 'new',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'enquiries',
  }
)

// Indexes
EnquirySchema.index({ status: 1, createdAt: -1 })
EnquirySchema.index({ email: 1 })

// ✅ NEXT.JS SAFE MODEL EXPORT
let Enquiry: Model<IEnquiry>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Enquiry) {
  Enquiry = mongoose.models.Enquiry as Model<IEnquiry>
} else if (typeof mongoose !== 'undefined') {
  Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema)
} else {
  Enquiry = null as any
}

export default Enquiry

