import { Request, Response } from 'express';
import {
  uploadMedia,
  getAllMedia,
  searchMedia,
  filterMediaByType,
  getMediaByCategory,
  deleteMediaById,
  addMediaComment,
  getMediaComments,
  updateMediaComment,
  deleteMediaComment,
  incrementMediaViews,
  updateMedia,
  toggleMediaLike,
  toggleCommentLike,
  getCommentReplies,
} from '../models/mediaModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const uploadMediaFile = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { title, description, type, url, thumbnail, duration, category } = req.body;

  try {
    await uploadMedia({
      title,
      description,
      type,
      url,
      thumbnail,
      duration,
      category,
      uploaded_by: (req.user!.id),
    });

    res.status(201).json({ message: 'Media uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload media' });
  }
};

export const getMediaList = async (req: Request, res: Response) => {
  try {
    const media = await getAllMedia();
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch media' });
  }
};

export const searchMediaFiles = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Search query is required' });

  try {
    const results = await searchMedia(q as string);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search media' });
  }
};

export const filterMedia = async (req: Request, res: Response) => {
  const { type } = req.params;

  try {
    const results = await filterMediaByType(type);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to filter media' });
  }
};

export const getCategoryMedia = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const results = await getMediaByCategory(category);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category media' });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response) => {
  const id =  (req.params.id);

  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    await deleteMediaById(id);
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete media' });
  }
};

// Comment Controllers
export const addComment = async (req: AuthRequest, res: Response) => {
  const { mediaId, content } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const comment = await addMediaComment({
      mediaId,
      userId: req.user.id,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { mediaId } = req.params;

  try {
    const comments = await getMediaComments(mediaId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const { commentId } = req.params;

  try {
    await deleteMediaComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

export const addView = async (req: Request, res: Response) => {
  const { mediaId } = req.params;

  try {
    const media = await incrementMediaViews(mediaId);
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment views' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const comment = await updateMediaComment(commentId, content);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

export const updateMediaItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, thumbnail, duration, category } = req.body;

  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const media = await updateMedia(id, { title, description, thumbnail, duration, category });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update media' });
  }
};

export const likeMedia = async (req: AuthRequest, res: Response) => {
  const { mediaId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const media = await toggleMediaLike(mediaId, req.user.id);
    res.json({ likes: media?.likes?.length || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

export const likeComment = async (req: AuthRequest, res: Response) => {
  const { commentId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const comment = await toggleCommentLike(commentId, req.user.id);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

export const getReplies = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const replies = await getCommentReplies(commentId);
    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch replies' });
  }
};
