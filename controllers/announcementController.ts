import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createAnnouncement,
  getAllActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from '../models/announcementsModel';

export const fetchAnnouncements = async (req: Request, res: Response) => {
  const announcements = await getAllActiveAnnouncements();
  res.json(announcements);
};

export const postAnnouncement = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  await createAnnouncement(title, content, Number(req.user!.id));
  res.status(201).json({ message: 'Announcement created' });
};

export const putAnnouncement = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const { id } = req.params;
  await updateAnnouncement(Number(id), title, content);
  res.json({ message: 'Announcement updated' });
};

export const removeAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteAnnouncement(Number(id));
  res.json({ message: 'Announcement deleted' });
};
