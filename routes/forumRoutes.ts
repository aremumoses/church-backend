import express from 'express';
import {
  createForumPost,
  getApprovedPosts,
  likeForumPost,
  approveForumPost,
  deleteForumPost,
  createComment,
  getPostComments,
  editComment,
  removeComment
} from '../controllers/forumController';
 
import { protect } from '../middleware/authMiddleware';
import { adminOnly, superAdminOnly } from '../middleware/roleMiddleware';
import { getPendingPosts } from '../controllers/forumController';

const router = express.Router();

router.post('/posts', protect, createForumPost);
router.get('/posts', getApprovedPosts);
router.patch('/posts/approve/:id', protect, adminOnly, approveForumPost);
router.delete('/posts/:id', protect, adminOnly, deleteForumPost);
router.patch('/posts/like/:id', protect, likeForumPost);
router.get('/posts/pending', protect, getPendingPosts);  

router.post('/posts/:postId/comments', protect, createComment);
router.get('/posts/:postId/comments', getPostComments);
router.patch('/comments/:commentId', protect, editComment);
router.delete('/comments/:commentId', protect, removeComment);

export default router;
