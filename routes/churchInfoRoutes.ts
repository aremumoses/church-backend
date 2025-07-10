import express from 'express';
import { fetchChurchInfo, editChurchInfo } from '../controllers/churchInfoController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', fetchChurchInfo);
router.put('/edit', protect, editChurchInfo);

export default router;
