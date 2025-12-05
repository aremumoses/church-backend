import express from 'express';
import { uploadFile } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Upload single file
router.post('/file', protect, upload.single('file'), uploadFile);

export default router;
