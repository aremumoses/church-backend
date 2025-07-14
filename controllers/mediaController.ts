import { Request, Response } from 'express';
import {
  uploadMedia,
  getAllMedia,
  searchMedia,
  filterMediaByType,
  getMediaByCategory,
  deleteMediaById,
} from '../models/mediaModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const uploadMediaFile = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { title, description, type, url, category } = req.body;

  try {
    await uploadMedia({
      title,
      description,
      type,
      url,
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
