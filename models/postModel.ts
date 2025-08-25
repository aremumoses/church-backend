import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  category?: string;
  userId: mongoose.Types.ObjectId;
  status: 'active' | 'pending' | 'deleted';
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'deleted'],
      default: 'pending',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// ✅ Safe model creation to avoid OverwriteModelError
const Post = models.Post || model<IPost>('Post', postSchema);

export default Post;
