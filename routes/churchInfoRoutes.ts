import express from 'express';
import { fetchChurchInfo, editChurchInfo, createChurchInfo } from '../controllers/churchInfoController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Fetch church info (public)
router.get('/', fetchChurchInfo);

// Create church info (admin/superadmin only)
router.post('/create', protect, createChurchInfo);

// Edit church info (admin/superadmin only)
router.put('/edit', protect, editChurchInfo);

export default router;
