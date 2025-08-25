import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access only' });
};

export const superAdminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Superadmin access only' });
};
