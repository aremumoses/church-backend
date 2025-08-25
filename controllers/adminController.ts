import { Request, Response } from 'express';
import User from '../models/userModel';

// Admin → see all users' details
export const adminGetAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};