import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createEvent,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
} from '../models/eventModel';

export const fetchEvents = async (req: Request, res: Response) => {
  const events = await getUpcomingEvents();
  res.json(events);
};

export const postEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, date, location } = req.body;
  await createEvent(title, description, date, location, (req.user!.id));
  res.status(201).json({ message: 'Event created' });
};

export const putEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, date, location } = req.body;
  const { id } = req.params;
  await updateEvent((id), title, description, date, location);
  res.json({ message: 'Event updated' });
};

export const removeEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteEvent((id));
  res.json({ message: 'Event deleted' });
};
