import express from 'express';
import { fetchEvents, postEvent, putEvent, removeEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', fetchEvents);
router.post('/', protect, postEvent);
router.put('/:id', protect, putEvent);
router.delete('/:id', protect, removeEvent);

export default router;
