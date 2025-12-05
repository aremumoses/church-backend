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
    thumbnail: { type: String }, // For video thumbnails
    duration: { type: Number }, // Duration in seconds for videos/audios
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: { type: String },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Media Comment Schema
const mediaCommentSchema = new mongoose.Schema(
  {
    mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaComment', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Media = mongoose.model('Media', mediaSchema);
export const MediaComment = mongoose.model('MediaComment', mediaCommentSchema);

// -----------------------------
// Media Functions
// -----------------------------

export const uploadMedia = async (media: {
  title: string;
  description: string;
  type: 'video' | 'audio' | 'pdf' | 'image';
  url: string;
  thumbnail?: string;
  duration?: number;
  category: string;
  uploaded_by: string;
}) => {
  const newMedia = new Media(media);
  await newMedia.save();
  return newMedia;
};

// Media Comment Functions
export const addMediaComment = async (comment: {
  mediaId: string;
  userId: string;
  content: string;
}) => {
  const newComment = new MediaComment(comment);
  await newComment.save();
  return await MediaComment.findById(newComment._id).populate('userId', 'name profile_image');
};

export const getMediaComments = async (mediaId: string) => {
  return await MediaComment.find({ mediaId })
    .sort({ created_at: -1 })
    .populate('userId', 'name profile_image');
};

export const updateMediaComment = async (commentId: string, content: string) => {
  return await MediaComment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  ).populate('userId', 'name profile_image');
};

export const deleteMediaComment = async (commentId: string) => {
  return await MediaComment.findByIdAndDelete(commentId);
};

export const incrementMediaViews = async (mediaId: string) => {
  return await Media.findByIdAndUpdate(
    mediaId,
    { $inc: { views: 1 } },
    { new: true }
  );
};

export const updateMedia = async (mediaId: string, updates: {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
}) => {
  return await Media.findByIdAndUpdate(
    mediaId,
    updates,
    { new: true }
  ).populate('uploaded_by', 'name');
};

// Like/Unlike Media
export const toggleMediaLike = async (mediaId: string, userId: string) => {
  const media = await Media.findById(mediaId);
  if (!media) throw new Error('Media not found');
  
  const hasLiked = media.likes.includes(userId as any);
  
  if (hasLiked) {
    // Unlike
    return await Media.findByIdAndUpdate(
      mediaId,
      { $pull: { likes: userId } },
      { new: true }
    );
  } else {
    // Like
    return await Media.findByIdAndUpdate(
      mediaId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }
};

// Like/Unlike Comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
  const comment = await MediaComment.findById(commentId);
  if (!comment) throw new Error('Comment not found');
  
  const hasLiked = comment.likes.includes(userId as any);
  
  if (hasLiked) {
    // Unlike
    return await MediaComment.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true }
    ).populate('userId', 'name profile_image');
  } else {
    // Like
    return await MediaComment.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('userId', 'name profile_image');
  }
};

// Get Replies for a Comment
export const getCommentReplies = async (parentId: string) => {
  return await MediaComment.find({ parentId })
    .sort({ created_at: 1 })
    .populate('userId', 'name profile_image');
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
