import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router.post('/register', catchAsync(register));
router.post('/login', catchAsync(login));
router.get('/me', protect, catchAsync(getCurrentUser));
router.post('/forgot-password', catchAsync(forgotPassword));
router.post('/reset-password', catchAsync(resetPassword));

router.patch('/update-password', protect, catchAsync(updatePassword));

export default router;
