import express from 'express';
import { 
  fetchConversation, 
  fetchConversationsList, 
  sendChatMessage,
  fetchChatHistory,
  // New controllers
  editChatMessage,
  deleteChatMessage,
  markMessageAsRead,
  searchChatMessages,
  getUnreadCount,
  blockChatUser,
  unblockChatUser,
  fetchBlockedUsers,
  reportChatMessage,
  pinChatMessage,
  unpinChatMessage,
  fetchPinnedMessages,
  getOrCreateConversation
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// ✅ Existing endpoints
router.post('/send', protect, catchAsync(sendChatMessage));
router.get('/conversations', protect, catchAsync(fetchConversationsList));
router.get('/conversation/:userId', protect, catchAsync(fetchConversation));
router.get('/conversation/:userId/init', protect, catchAsync(getOrCreateConversation)); // Get or create conversation
router.get('/history', catchAsync(fetchChatHistory));

// 📝 New endpoints with proper controllers:

// Message management
router.put('/message/:messageId', protect, catchAsync(editChatMessage));           // Edit message
router.delete('/message/:messageId', protect, catchAsync(deleteChatMessage));     // Delete message
router.post('/mark-as-read', protect, catchAsync(markMessageAsRead)); // Mark messages as read

// Search and filtering
router.get('/conversation/:userId/search', protect, catchAsync(searchChatMessages)); // Search messages in conversation
router.get('/unread-count', protect, catchAsync(getUnreadCount));              // Get total unread message count

// User management
router.post('/block/:userId', protect, catchAsync(blockChatUser));                // Block a user
router.delete('/block/:userId', protect, catchAsync(unblockChatUser));            // Unblock a user
router.get('/blocked-users', protect, catchAsync(fetchBlockedUsers));           // Get list of blocked users

// Moderation
router.post('/message/:messageId/report', protect, catchAsync(reportChatMessage)); // Report inappropriate message

// Message features
router.post('/message/:messageId/pin', protect, catchAsync(pinChatMessage));      // Pin important messages
router.delete('/message/:messageId/pin', protect, catchAsync(unpinChatMessage));  // Unpin message
router.get('/conversation/:userId/pinned', protect, catchAsync(fetchPinnedMessages)); // Get pinned messages

export default router;