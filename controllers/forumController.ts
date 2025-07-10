import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createPost,
  getAllApprovedPosts,
  getPostById,
  likePost,
  unlikePost,
  hasUserLikedPost,
  approvePost,
  deletePost,
  getAllApprovedPostsWithLikeInfo,
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} from '../models/forumModel';

export const createForumPost = async (req: AuthRequest, res: Response) => {
  const { title, content, category } = req.body;
  const userId = Number(req.user!.id);  
  const role = req.user!.role;

  const status = role === 'admin' || role === 'superadmin' ? 'active' : 'pending';

  const post = await createPost({ title, content, category, userId, status });
  res.status(201).json(post);
};


// export const getApprovedPosts = async (_req: Request, res: Response) => {
//   const posts = await getAllApprovedPosts();
//   res.json(posts);
// };

 
export const getApprovedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? Number(req.user.id) : 0; // 👈 fallback to 0 if not logged in

    const posts = await getAllApprovedPostsWithLikeInfo(userId); // 👈 always pass a number

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const approveForumPost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await approvePost(id);
  res.json({ message: 'Post approved' });
};

export const deleteForumPost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deletePost(id);
  res.json({ message: 'Post deleted' });
};

export const likeForumPost = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.id);
  const userId = Number(req.user!.id);  

  const liked = await hasUserLikedPost(postId, userId);
  if (liked) {
    await unlikePost(postId, userId);
    return res.json({ message: 'Post unliked' });
  }

  await likePost(postId, userId);
  return res.json({ message: 'Post liked' });
};


import { getAllPendingPosts } from '../models/forumModel'; // make sure it's imported

export const getPendingPosts = async (req: AuthRequest, res: Response) => {
  const role = req.user!.role;

  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Only admin or superadmin can view pending posts.' });
  }

  const posts = await getAllPendingPosts();
  res.json(posts);
};


export const createComment = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.postId);
  const { content } = req.body;
    const userId = Number(req.user!.id);
  const comment = await addComment(postId, userId, content);
  res.status(201).json(comment);
};

export const getPostComments = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const comments = await getCommentsByPost(postId);
  res.json(comments);
};

export const editComment = async (req: AuthRequest, res: Response) => {
  const commentId = Number(req.params.commentId);
  const { content } = req.body;
//    const postId = Number(req.params.id);
  const userId = Number(req.user!.id);  

  await updateComment(commentId, userId, content);
  res.json({ message: 'Comment updated' });
};

export const removeComment = async (req: AuthRequest, res: Response) => {
  const commentId = Number(req.params.commentId);
  const userId = Number(req.user!.id);  


  await deleteComment(commentId, userId);
  res.json({ message: 'Comment deleted' });
};
