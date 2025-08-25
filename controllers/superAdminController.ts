import { Request, Response } from 'express';
import User from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { log } from 'node:console';
export const toggleUserAdmin = async (req: Request, res: Response) => {
  const { userId, adminPost } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'admin') {
    // Revert admin to normal user
    user.role = 'user';
    user.adminPost = undefined;
    await user.save();
    return res.json({ message: 'User reverted back to normal user', user });
  } else {
    // Promote user to admin
    user.role = 'admin';
    user.adminPost = adminPost || 'Granted by superadmin';
    await user.save();
    return res.json({ message: 'User upgraded to admin successfully', user });
  }
};


// Superadmin → get all admins
export const getAllAdmins = async (req: Request, res: Response) => {
  const admins = await User.find({ role: 'admin' });
  res.json(admins);
};

// Superadmin → get all users (excluding admins & superadmin)
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: 'user' });
  res.json(users);
};

export const toggleUserActiveStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  console.log(user);
  
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.status = user.status === 'active' ? 'inactive' : 'active';
  await user.save();

  res.json({
    message: `User account ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`,
    user,
  });
};
export const getSuperadminDetails = async (req: AuthRequest, res: Response) => {
  const superadminId = req.user?.id;

  const superadmin = await User.findById(superadminId).select('-password');
  if (!superadmin) return res.status(404).json({ message: 'Superadmin not found' });

  res.json({ message: 'Superadmin details fetched successfully', superadmin });
};




