import mongoose from 'mongoose';

// -----------------------------
// Media Schema
// -----------------------------
const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['video', 'audio', 'pdf', 'image'],
      required: true,
    },
    url: { type: String, required: true },
    category: { type: String },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Media = mongoose.model('Media', mediaSchema);

// -----------------------------
// Media Functions
// -----------------------------

export const uploadMedia = async (media: {
  title: string;
  description: string;
  type: 'video' | 'audio' | 'pdf' | 'image';
  url: string;
  category: string;
  uploaded_by: string;
}) => {
  const newMedia = new Media(media);
  await newMedia.save();
  return newMedia;
};

export const getAllMedia = async () => {
  return await Media.find().sort({ created_at: -1 }).populate('uploaded_by', 'name');
};

export const searchMedia = async (query: string) => {
  return await Media.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  }).sort({ created_at: -1 });
};

export const filterMediaByType = async (type: string) => {
  return await Media.find({ type }).sort({ created_at: -1 });
};

export const getMediaByCategory = async (category: string) => {
  return await Media.find({ category }).sort({ created_at: -1 });
};

export const deleteMediaById = async (id: string) => {
  return await Media.findByIdAndDelete(id);
};

export const getMediaCount = async () => {
  return await Media.countDocuments();
};

export default Media;
