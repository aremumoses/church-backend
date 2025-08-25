import express from 'express';
import {
  uploadMediaFile,
  getMediaList,
  searchMediaFiles,
  filterMedia,
  getCategoryMedia,
  deleteMedia
} from '../controllers/mediaController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/upload', protect, uploadMediaFile);
router.get('/', getMediaList);
router.get('/search', searchMediaFiles);
router.get('/type/:type', filterMedia);
router.get('/category/:category', getCategoryMedia);
router.delete('/:id', protect, deleteMedia);

export default router;
