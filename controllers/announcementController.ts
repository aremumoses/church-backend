import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createAnnouncement, deleteAnnouncement, getAllActiveAnnouncements, updateAnnouncement } from '../services/announcementService';
 

export const fetchAnnouncements = async (req: Request, res: Response) => {
  try {
    console.log('📢 Fetching announcements...');
    const announcements = await getAllActiveAnnouncements();
    console.log(`✅ Found ${announcements.length} announcements`);
    res.json(announcements);
  } catch (err) {
    console.error('❌ Failed to fetch announcements:', err);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};

export const postAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, image } = req.body;
    console.log('➕ Creating announcement:', title, 'by', req.user?.email);
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    await createAnnouncement(title, content, req.user!.id, image);
    console.log('✅ Announcement created successfully');
    res.status(201).json({ message: 'Announcement created' });
  } catch (err) {
    console.error('❌ Failed to create announcement:', err);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
};

export const putAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, image } = req.body;
    const { id } = req.params;
    console.log('✏️ Updating announcement:', id, 'by', req.user?.email);
    await updateAnnouncement((id), title, content, image);
    console.log('✅ Announcement updated successfully');
    res.json({ message: 'Announcement updated' });
  } catch (err) {
    console.error('❌ Failed to update announcement:', err);
    res.status(500).json({ message: 'Failed to update announcement' });
  }
};

export const removeAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting announcement:', id, 'by', req.user?.email);
    await deleteAnnouncement(id);
    console.log('✅ Announcement deleted successfully');
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error('❌ Failed to delete announcement:', err);
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
};
