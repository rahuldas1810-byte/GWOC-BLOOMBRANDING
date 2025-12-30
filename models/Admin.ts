import mongoose, { Schema, Document, Model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
  email: string
  password: string
  name: string
  role: 'admin' | 'superadmin'
  isActive: boolean
  resetPasswordToken?: string
  resetPasswordExpiry?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: 'adminusers', // ✅ preserves existing collection
  }
)

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password)
}

AdminSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

// ✅ NEXT.JS SAFE MODEL EXPORT - prevents hot reload issues
// ✅ EDGE RUNTIME SAFE - handles cases where models might not exist
let Admin: Model<IAdmin>

if (typeof mongoose !== 'undefined' && mongoose.models && mongoose.models.Admin) {
  Admin = mongoose.models.Admin as Model<IAdmin>
} else if (typeof mongoose !== 'undefined') {
  Admin = mongoose.model<IAdmin>('Admin', AdminSchema)
} else {
  // Edge Runtime fallback - will throw if actually used in Edge Runtime
  // This prevents the error during module evaluation
  Admin = null as any
}

export default Admin
