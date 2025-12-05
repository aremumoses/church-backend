import express from 'express';
import {
  uploadMediaFile,
  getMediaList,
  searchMediaFiles,
  filterMedia,
  getCategoryMedia,
  deleteMedia,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  addView,
  updateMediaItem,
  likeMedia,
  likeComment,
  getReplies
} from '../controllers/mediaController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/upload', protect, uploadMediaFile);
router.get('/', getMediaList);
router.get('/search', searchMediaFiles);
router.get('/type/:type', filterMedia);
router.get('/category/:category', getCategoryMedia);
router.delete('/:id', protect, deleteMedia);
router.put('/:id', protect, updateMediaItem);

// Comment routes
router.post('/comments', protect, addComment);
router.get('/comments/:mediaId', getComments);
router.put('/comments/:commentId', protect, updateComment);
router.delete('/comments/:commentId', protect, deleteComment);

// Replies routes
router.get('/comments/:commentId/replies', getReplies);

// Likes routes
router.post('/like/:mediaId', protect, likeMedia);
router.post('/comments/:commentId/like', protect, likeComment);

// Views route
router.post('/views/:mediaId', addView);

export default router;
