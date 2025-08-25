import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User, {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
} from '../models/userModel';

import { generateToken } from '../utils/generateToken';
import { hashPassword, comparePassword } from '../utils/hashUtils';
import { sendForgetOtpToEmail, sendOtpToEmail } from '../middleware/helper';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already created' });
  }
  const hashed = await hashPassword(password);
  const newUser = await User.create({ name, email, password: hashed });
  const token = generateToken({id:newUser._id, role: newUser.role });
  await sendOtpToEmail(email, name)
  return res.status(201).json({ message: 'Registration successful', token });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
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

  const token = generateToken({id:user.id, role: user?.role});
  // console.log('Generated Token:', token);

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
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  user.otpForReset = otp;
  user.otpResetCreatedAt = new Date();
  user.otpVerifiedForReset = false;
  await user.save({ validateBeforeSave: false });
  await sendForgetOtpToEmail(email, user?.name, otp)
  return res.json({ message: 'An otp has been be sent to your mail. kindly check' });
};

export const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  if (!user.otpForReset || user.otpForReset !== otp) {
    return res.status(400).json({ message: 'Invalid otp' });
  }
  const now = Date.now();
  const createdAt = user.otpResetCreatedAt?.getTime() ?? 0;
  const TWO_MINUTES = 2 * 60 * 1000;

  if (now - createdAt > TWO_MINUTES) {
    user.otpForReset = '';
    user.otpResetCreatedAt = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(400).json({ message: 'Otp has expired' });
  }
  user.otpForReset = '';
  user.otpResetCreatedAt = undefined;
  user.otpVerifiedForReset = true;
  await user.save({ validateBeforeSave: false });
  return res.json({ message: 'OTP verified. You can now reset your password.' });
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (!user.otpVerifiedForReset) {
    return res.status(400).json({ message: 'Not authorized, pls verify OTP' });
  }
  const hashed = await hashPassword(newPassword);
  user.password = hashed;
  user.otpVerifiedForReset = false;
  await user.save();
  return res.json({ message: 'Password reset successfully, proceed to login' });
};

