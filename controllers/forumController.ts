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
   
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getPaginatedComments,
  getPaginatedPosts
} from '../models/forumModel';

export const createForumPost = async (req: AuthRequest, res: Response) => {
  const { title, content, category } = req.body;
  const userId =  (req.user!.id);  
  const role = req.user!.role;

  const status = role === 'admin' || role === 'superadmin' ? 'active' : 'pending';

  const post = await createPost({ title, content, category, userId, status });
  res.status(201).json(post);
};

export const getApprovedPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  if (isNaN(page) || isNaN(limit)) {
    return res.status(400).json({ message: 'Page and limit must be numbers' });
  }

  try {
    console.log('Getting posts with:', { page, limit });
    const data = await getPaginatedPosts(page, limit);
    res.json(data);
  } catch (err) {
    console.error('Pagination error:', err);
    res.status(500).json({ message: 'Server error while paginating posts' });
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
  const postId =  (req.params.id);
  const userId =  (req.user!.id);  

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
  const postId =  (req.params.postId);
  const { content } = req.body;
    const userId =  (req.user!.id);
  const comment = await addComment(postId, userId, content);
  res.status(201).json(comment);
};

 
export const getPostComments = async (req: Request, res: Response) => {
  const postId =  (req.params.postId);
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  if ( (!postId) || isNaN(page) || isNaN(limit)) {
    return res.status(400).json({ message: 'Invalid query parameters' });
  }

  try {
    const data = await getPaginatedComments(postId, page, limit);
    res.json(data);
  } catch (err) {
    console.error('Pagination error (comments):', err);
    res.status(500).json({ message: 'Server error while paginating comments' });
  }
};



export const editComment = async (req: AuthRequest, res: Response) => {
  const commentId =  (req.params.commentId);
  const { content } = req.body;
//    const postId =  (req.params.id);
  const userId =  (req.user!.id);  

  await updateComment(commentId, userId, content);
  res.json({ message: 'Comment updated' });
};

export const removeComment = async (req: AuthRequest, res: Response) => {
  const commentId =  (req.params.commentId);
  const userId =  (req.user!.id);  


  await deleteComment(commentId, userId);
  res.json({ message: 'Comment deleted' });
};
