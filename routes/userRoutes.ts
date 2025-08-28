// src/routes/userRoutes.ts
import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import { listUsersByRole } from '../controllers/userController';

const router = express.Router();

router.get('/role/:role', protect, listUsersByRole);

export default router;
