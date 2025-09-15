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
  fetchPinnedMessages
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// ✅ Existing endpoints
router.post('/send', protect, sendChatMessage);
router.get('/conversations', protect, fetchConversationsList);
router.get('/conversation/:userId', protect, fetchConversation);
router.get('/history', fetchChatHistory);

// 📝 New endpoints with proper controllers:

// Message management
router.put('/message/:messageId', protect, editChatMessage);           // Edit message
router.delete('/message/:messageId', protect, deleteChatMessage);     // Delete message
router.post('/message/:messageId/read', protect, markMessageAsRead); // Mark single message as read

// Search and filtering
router.get('/conversation/:userId/search', protect, searchChatMessages); // Search messages in conversation
router.get('/unread-count', protect, getUnreadCount);              // Get total unread message count

// User management
router.post('/block/:userId', protect, blockChatUser);                // Block a user
router.delete('/block/:userId', protect, unblockChatUser);            // Unblock a user
router.get('/blocked-users', protect, fetchBlockedUsers);           // Get list of blocked users

// Moderation
router.post('/message/:messageId/report', protect, reportChatMessage); // Report inappropriate message

// Message features
router.post('/message/:messageId/pin', protect, pinChatMessage);      // Pin important messages
router.delete('/message/:messageId/pin', protect, unpinChatMessage);  // Unpin message
router.get('/conversation/:userId/pinned', protect, fetchPinnedMessages); // Get pinned messages

export default router;