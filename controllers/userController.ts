// src/controllers/userController.ts
import { Request, Response } from 'express';
import { getUsersByRole } from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const listUsersByRole = async (req: AuthRequest, res: Response) => {
  const roleParam = req.params.role.toLowerCase();
  const requesterRole = req.user?.role;

  // Admins can only request 'user' list
  if (requesterRole === 'admin' && roleParam !== 'user') {
    return res.status(403).json({ message: 'Admins can only view regular users' });
  }

  // Only superadmin can access other roles
  if (requesterRole === 'user') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const users = await getUsersByRole(roleParam);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users by role' });
  }
};
