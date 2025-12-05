// src/routes/userRoutes.ts
import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import { listUsersByRole, getAllUsers } from '../controllers/userController';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router.get('/role/:role', protect, catchAsync(listUsersByRole));
router.get('/all', protect, catchAsync(getAllUsers));
router.get('/', protect, catchAsync(getAllUsers));

export default router;
