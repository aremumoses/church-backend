import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Adjust path as needed
import { getChurchInfo, updateChurchInfo } from '../services/churchInfoService';

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
