import express from 'express';
import { fetchConversation, fetchConversationsList, sendChatMessage } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { fetchChatHistory } from '../controllers/chatController';
const router = express.Router();

router.post('/send', protect, sendChatMessage);
router.get('/conversations', protect, fetchConversationsList);
router.get('/conversation/:userId', protect, fetchConversation);
router.get('/history', fetchChatHistory);
export default router;
