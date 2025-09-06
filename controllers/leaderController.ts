// controllers/leaderController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { 
  getAllLeaders, 
  getLeaderById, 
  createLeader, 
  updateLeader, 
  deleteLeader 
} from '../services/leaderService';

export const fetchLeaders = async (req: Request, res: Response) => {
  try {
    const leaders = await getAllLeaders();
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaders' });
  }
};

export const fetchLeaderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const leader = await getLeaderById(id);
    
    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }
    
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leader' });
  }
};

export const postLeader = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, image, bio } = req.body;
    
    if (!name || !role || !image || !bio) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newLeader = await createLeader(name, role, image, bio);
    res.status(201).json({ message: 'Leader created successfully', leader: newLeader });
  } catch (error) {
    res.status(500).json({ message: 'Error creating leader' });
  }
};

export const putLeader = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, image, bio } = req.body;
    const { id } = req.params;
    
    if (!name || !role || !image || !bio) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const updatedLeader = await updateLeader(id, name, role, image, bio);
    
    if (!updatedLeader) {
      return res.status(404).json({ message: 'Leader not found' });
    }
    
    res.json({ message: 'Leader updated successfully', leader: updatedLeader });
  } catch (error) {
    res.status(500).json({ message: 'Error updating leader' });
  }
};

export const removeLeader = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteLeader(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Leader not found' });
    }
    
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leader' });
  }
};
