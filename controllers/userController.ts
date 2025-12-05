// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { getUsersByRole } from '../models/userModel';
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

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📋 Fetching all users...');
    const currentUserId = req.user!.id;
    
    // Fetch all users (including inactive) but exclude current user
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      'id name email phone profile_pic role status created_at updated_at'
    ).sort({ name: 1 });
    
    console.log(`✅ Found ${users.length} users (excluding current user)`);
    console.log('👥 User roles breakdown:', {
      superadmins: users.filter(u => u.role === 'superadmin').length,
      admins: users.filter(u => u.role === 'admin').length,
      users: users.filter(u => u.role === 'user').length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
    });
    
    res.json(users);
  } catch (err) {
    console.error('❌ Get all users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
