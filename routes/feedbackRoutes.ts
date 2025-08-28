import express from 'express';
import { submitFeedback, getAllFeedback, updateFeedbackStatus } from '../controllers/feedbackController';
import { authorize, protect } from '../middleware/authMiddleware';

const router = express.Router();

// 📝 User submits feedback
router.post('/', protect, submitFeedback);

// 🔍 Admin/SuperAdmin view all feedback
router.get('/', protect, getAllFeedback);

// 🛠 Admin/SuperAdmin update feedback status
router.patch('/:id/status', protect, updateFeedbackStatus);

export default router;
