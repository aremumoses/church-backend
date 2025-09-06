import express from 'express';
import { 
  fetchLeaders, 
  fetchLeaderById, 
  postLeader, 
  putLeader, 
  removeLeader 
} from '../controllers/leaderController';
import { protect } from '../middleware/authMiddleware';
import { superAdminOnly } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes - anyone can access
router.get('/', fetchLeaders);
router.get('/:id', fetchLeaderById);

// Protected routes - only superadmin can access
router.post('/', protect, superAdminOnly, postLeader);
router.put('/:id', protect, superAdminOnly, putLeader);
router.delete('/:id', protect, superAdminOnly, removeLeader);

export default router;