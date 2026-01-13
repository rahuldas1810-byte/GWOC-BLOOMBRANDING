import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed';
}

const NewsletterSubscriberSchema: Schema<INewsletterSubscriber> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Prevent model overwrite during hot reload
const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);

export default NewsletterSubscriber;
