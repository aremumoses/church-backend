import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Event from '../models/eventModel';
import {
  createEvent,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
} from '../models/eventModel';

export const fetchEvents = async (req: Request, res: Response) => {
  try {
    console.log('📅 Fetching all events...');
    const events = await Event.find().populate('createdBy', 'name email').sort({ date: -1 });
    console.log(`✅ Found ${events.length} events`);
    res.json(events);
  } catch (err) {
    console.error('❌ Failed to fetch events:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

export const fetchUpcomingEvents = async (req: Request, res: Response) => {
  try {
    console.log('📅 Fetching upcoming events...');
    const events = await getUpcomingEvents();
    console.log(`✅ Found ${events.length} upcoming events`);
    res.json(events);
  } catch (err) {
    console.error('❌ Failed to fetch upcoming events:', err);
    res.status(500).json({ message: 'Failed to fetch upcoming events' });
  }
};

export const postEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location, image } = req.body;
    console.log('➕ Creating event:', title, 'by', req.user?.email);
    
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }
    
    await createEvent(title, description, date, location, (req.user!.id), image);
    console.log('✅ Event created successfully');
    res.status(201).json({ message: 'Event created' });
  } catch (err) {
    console.error('❌ Failed to create event:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

export const putEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location, image } = req.body;
    const { id } = req.params;
    console.log('✏️ Updating event:', id, 'by', req.user?.email);
    await updateEvent((id), title, description, date, location, image);
    console.log('✅ Event updated successfully');
    res.json({ message: 'Event updated' });
  } catch (err) {
    console.error('❌ Failed to update event:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

export const removeEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting event:', id, 'by', req.user?.email);
    await deleteEvent((id));
    console.log('✅ Event deleted successfully');
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('❌ Failed to delete event:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};
