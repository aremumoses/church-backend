import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
} from '../models/userModel';

import { generateToken } from '../utils/generateToken';
import { hashPassword, comparePassword } from '../utils/hashUtils';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password, role } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashed = await hashPassword(password);
  await createUser({ name, email, password: hashed, role });

  return res.status(201).json({ message: 'Registration successful' });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if account is deactivated
  if (user.status === 'inactive') {
    return res.status(403).json({ message: 'Account is deactivated. Please contact admin.' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id, user.role,user.name);
console.log('Generated Token:', token);

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const user = await getUserById(req.user!.id);
  return res.json(user);
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  // TODO: Send actual email in production
  return res.json({ message: 'Password reset link would be sent here (mock).' });
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email, newPassword } = req.body;
  const hashed = await hashPassword(newPassword);
  await updateUserPassword(email, hashed);
  return res.json({ message: 'Password updated successfully' });
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { currentPassword, newPassword } = req.body;

  // 1. Get the current user
  const user = await getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2. Check if current password is correct
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // 3. Hash new password and update
  const hashed = await hashPassword(newPassword);
  await updateUserPassword(user.email, hashed);

  // 4. Return success message
  return res.json({ message: 'Password updated successfully' });
};