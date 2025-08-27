import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Adjust path as needed
import { getChurchInfo, updateChurchInfo } from '../services/churchInfoService';
import ChurchInfo from '../models/churchInfoModel';

// Fetch church info (public for all users)
export const fetchChurchInfo = async (req: AuthRequest, res: Response) => {
  try {
    const info = await getChurchInfo();
    res.json(info);
    
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch church info' });
  }
};

// Edit church info (admin/superadmin only)
export const editChurchInfo = async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    await updateChurchInfo(req.body);
    res.json({ message: 'Church info updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update church info' });
  }
};

export const createChurchInfo = async (req: AuthRequest, res: Response) => {
  const role = req.user?.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // Check if church info already exists (assuming one record)
    const existingInfo = await ChurchInfo.findOne(); 
    if (existingInfo) {
      return res.status(400).json({ message: 'Church info already exists. Please edit instead.' });
    }

    const { name, mission, vision, history, doctrines } = req.body;

    if (!name || !mission || !vision) {
      return res.status(400).json({ message: 'Name, mission, and vision are required.' });
    }

    const newInfo = new ChurchInfo({
      name,
      mission,
      vision,
      history: history || '',
      doctrines: doctrines || []
    });

    await newInfo.save();

    res.status(201).json({ message: 'Church info created successfully', data: newInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create church info' });
  }
};
