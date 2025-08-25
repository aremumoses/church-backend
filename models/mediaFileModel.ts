import mongoose from 'mongoose';

// ----------------------
// 1. Media File Schema
// ----------------------
const mediaFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    type: { type: String, enum: ['audio', 'video', 'image', 'pdf', 'document'], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const MediaFile = mongoose.model('MediaFile', mediaFileSchema);

// ----------------------
// 2. Media File Functions
// ----------------------

/**
 * Upload a new media file
 */
export const uploadMediaFile = async (filename: string, type: string, uploadedBy: string) => {
  const file = new MediaFile({ filename, type, uploadedBy });
  await file.save();
  return file;
};

/**
 * Get all media files (optional: filter by type)
 */
export const getMediaFiles = async (type?: string) => {
  const query = type ? { type } : {};
  return await MediaFile.find(query).sort({ created_at: -1 }).populate('uploadedBy', 'name');
};

/**
 * Get media file by ID
 */
export const getMediaFileById = async (id: string) => {
  return await MediaFile.findById(id).populate('uploadedBy', 'name');
};

/**
 * Delete a media file
 */
export const deleteMediaFile = async (id: string) => {
  return await MediaFile.findByIdAndDelete(id);
};

/**
 * Get media file count (for dashboard stats)
 */
export const getMediaCount = async () => {
  return await MediaFile.countDocuments();
};

export default MediaFile;
