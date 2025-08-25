import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getUserById, updateUserProfile ,getUserPublicProfileById, updateUserStatus} from '../models/userModel';
import { updateUserRole } from '../models/userModel';

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  const user = await getUserById(req.user!.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  const { name, phone, gender, birthday, profile_pic } = req.body;
  await updateUserProfile(req.user!.id, { name, phone, gender, birthday, profile_pic });
  res.json({ message: 'Profile updated successfully' });
};


export const getUserPublicProfile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await getUserPublicProfileById(id);  
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};

 

export const adminUpdateUserProfile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, phone, gender, birthday, profile_pic, role } = req.body;

  const targetUser = await getUserById(id);
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Admins can only update users, not admins/superadmins
  if (req.user?.role === 'admin' && targetUser.role !== 'user') {
    return res.status(403).json({ message: 'Admins can only update user profiles' });
  }

  // Superadmins cannot update another superadmin
  if (req.user?.role === 'superadmin' && targetUser.role === 'superadmin') {
    return res.status(403).json({ message: 'Superadmins cannot update another superadmin' });
  }

  // Only superadmin can update roles
  if (role && req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only superadmin can update role' });
  }

  const updates: any = { name, phone, gender, birthday, profile_pic };
  if (req.user?.role === 'superadmin' && role) updates.role = role;

  await updateUserProfile(id, updates);

  return res.json({ message: 'User profile updated successfully' });
};


export const updateUserRoleController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be "user" or "admin"' });
  }

  const targetUser = await getUserById(id);
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (targetUser.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot change role of another superadmin' });
  }

  await updateUserRole(id, role);
  return res.json({ message: `User role updated to ${role}` });
};


export const updateUserStatusController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Status must be "active" or "inactive"' });
  }

  const targetUser = await getUserById(id);
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (targetUser.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot deactivate or reactivate another superadmin' });
  }

  await updateUserStatus(id, status);
  res.json({ message: `User status updated to ${status}` });
};



