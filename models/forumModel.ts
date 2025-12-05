import mongoose from 'mongoose';

// ---------------------
// Post Schema
// ---------------------
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: String,
    image: String,
    status: { type: String, enum: ['active', 'pending', 'deleted'], default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Post = mongoose.model('Post', postSchema);

// ---------------------
// Like Schema
// ---------------------
const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const PostLike = mongoose.model('PostLike', likeSchema);

// ---------------------
// Comment Schema
// ---------------------
const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);
const Comment = mongoose.model('Comment', commentSchema);

// ---------------------
// Comment Like Schema
// ---------------------
const commentLikeSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const CommentLike = mongoose.model('CommentLike', commentLikeSchema);

// ---------------------
// Post Functions
// ---------------------

export interface CreatePostInput {
  title: string;
  content: string;
  category?: string;
  image?: string;
  userId: string;
  status: 'active' | 'pending';
}

export const createPost = async ({ title, content, category, image, userId, status }: CreatePostInput) => {
  const post = new Post({ title, content, category, image, userId, status });
  await post.save();
  return post;
};

export const getAllApprovedPosts = async (userId: string) => {
  const posts = await Post.find({ status: 'active' })
    .sort({ created_at: -1 })
    .populate('userId', 'name');

  const postIds = posts.map((post) => post._id);
  const likes = await PostLike.find({ postId: { $in: postIds } });
  const comments = await Comment.find({ postId: { $in: postIds } });

  const likedByUser = await PostLike.find({ userId, postId: { $in: postIds } });

  return posts.map((post) => {
    const postId = post._id.toString();
    const likeCount = likes.filter((like) => like.postId.toString() === postId).length;
    const repliesCount = comments.filter((comment) => comment.postId.toString() === postId).length;
    const liked = likedByUser.some((like) => like.postId.toString() === postId);
    return {
      ...post.toObject(),
      likes_count: likeCount,
      replies_count: repliesCount,
      liked_by_user: liked,
      author: (post as any).userId?.name || 'Unknown',
    };
  });
};

export const getPostById = async (id: string) => {
  return await Post.findById(id);
};

export const approvePost = async (id: string) => {
  await Post.findByIdAndUpdate(id, { status: 'active' });
};

export const updatePost = async (id: string, updates: { title?: string; content?: string; category?: string; image?: string }) => {
  return await Post.findByIdAndUpdate(id, updates, { new: true });
};

export const deletePost = async (id: string) => {
  await Post.findByIdAndUpdate(id, { status: 'deleted' });
};

export const likePost = async (postId: string, userId: string) => {
  await PostLike.create({ postId, userId });
};

export const unlikePost = async (postId: string, userId: string) => {
  await PostLike.deleteOne({ postId, userId });
};

export const hasUserLikedPost = async (postId: string, userId: string) => {
  const liked = await PostLike.exists({ postId, userId });
  return !!liked;
};

export const getAllPendingPosts = async () => {
  return await Post.find({ status: 'pending' }).sort({ created_at: -1 });
};

export const incrementPostViews = async (postId: string) => {
  await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
};

// ---------------------
// Comments
// ---------------------

export const addComment = async (postId: string, userId: string, content: string) => {
  const comment = new Comment({ postId, userId, content });
  await comment.save();
  return comment;
};

export const getCommentsByPost = async (postId: string, userId?: string) => {
  const comments = await Comment.find({ postId }).sort({ created_at: 1 }).populate('userId', 'name');
  
  const commentIds = comments.map((comment) => comment._id);
  const likes = await CommentLike.find({ commentId: { $in: commentIds } });
  const likedByUser = userId ? await CommentLike.find({ userId, commentId: { $in: commentIds } }) : [];

  return comments.map((comment) => {
    const commentId = comment._id.toString();
    const likeCount = likes.filter((like) => like.commentId.toString() === commentId).length;
    const liked = userId ? likedByUser.some((like) => like.commentId.toString() === commentId) : false;
    
    return {
      ...comment.toObject(),
      likes_count: likeCount,
      liked_by_user: liked,
    };
  });
};

export const updateComment = async (commentId: string, userId: string, content: string) => {
  await Comment.findOneAndUpdate({ _id: commentId, userId }, { content });
};

export const deleteComment = async (commentId: string, userId: string) => {
  await Comment.findOneAndDelete({ _id: commentId, userId });
};

export const deleteCommentByAdmin = async (commentId: string) => {
  await Comment.findByIdAndDelete(commentId);
};

export const getCommentById = async (commentId: string) => {
  return await Comment.findById(commentId).populate('userId', 'name');
};

// ---------------------
// Comment Likes
// ---------------------

export const likeComment = async (commentId: string, userId: string) => {
  await CommentLike.create({ commentId, userId });
};

export const unlikeComment = async (commentId: string, userId: string) => {
  await CommentLike.deleteOne({ commentId, userId });
};

export const hasUserLikedComment = async (commentId: string, userId: string) => {
  const liked = await CommentLike.exists({ commentId, userId });
  return !!liked;
};

export const getCommentLikesCount = async (commentId: string) => {
  return await CommentLike.countDocuments({ commentId });
};

// ---------------------
// Pagination
// ---------------------

export const getPaginatedPosts = async (page: number, limit: number, userId?: string) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find({ status: 'active' })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name'),
    Post.countDocuments({ status: 'active' }),
  ]);

  const postIds = posts.map((post) => post._id);
  const likes = await PostLike.find({ postId: { $in: postIds } });
  const comments = await Comment.find({ postId: { $in: postIds } });
  const likedByUser = userId ? await PostLike.find({ userId, postId: { $in: postIds } }) : [];

  return {
    posts: posts.map((post) => {
      const postId = post._id.toString();
      const likeCount = likes.filter((like) => like.postId.toString() === postId).length;
      const repliesCount = comments.filter((comment) => comment.postId.toString() === postId).length;
      const liked = userId ? likedByUser.some((like) => like.postId.toString() === postId) : false;
      
      return {
        ...post.toObject(),
        likes_count: likeCount,
        replies_count: repliesCount,
        liked_by_user: liked,
        author: (post as any).userId?.name || 'Unknown',
      };
    }),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getPaginatedComments = async (postId: string, page: number, limit: number, userId?: string) => {
  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    Comment.find({ postId }).sort({ created_at: 1 }).skip(skip).limit(limit).populate('userId', 'name'),
    Comment.countDocuments({ postId }),
  ]);

  const commentIds = comments.map((comment) => comment._id);
  const likes = await CommentLike.find({ commentId: { $in: commentIds } });
  const likedByUser = userId ? await CommentLike.find({ userId, commentId: { $in: commentIds } }) : [];

  return {
    comments: comments.map((comment) => {
      const commentId = comment._id.toString();
      const likeCount = likes.filter((like) => like.commentId.toString() === commentId).length;
      const liked = userId ? likedByUser.some((like) => like.commentId.toString() === commentId) : false;
      
      return {
        ...comment.toObject(),
        author: (comment as any).userId?.name || 'Unknown',
        likes_count: likeCount,
        liked_by_user: liked,
      };
    }),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
