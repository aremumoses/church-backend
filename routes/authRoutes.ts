import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  updatePassword,
  verifyOtp,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router.post('/register', catchAsync(register));
router.post('/login', catchAsync(login));
router.get('/me', protect, catchAsync(getCurrentUser));
router.post('/forgot-password', catchAsync(forgotPassword));
router.post('/verify-password', catchAsync(verifyOtp));
router.patch('/update-password', catchAsync(updatePassword));


export default router;
