import express from 'express';
import { fetchAnnouncements, postAnnouncement, putAnnouncement, removeAnnouncement } from '../controllers/announcementController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', fetchAnnouncements);
router.post('/', protect, postAnnouncement);
router.put('/:id', protect, putAnnouncement);
router.delete('/:id', protect, removeAnnouncement);

export default router;
