"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ✅ Existing endpoints
router.post('/send', authMiddleware_1.protect, chatController_1.sendChatMessage);
router.get('/conversations', authMiddleware_1.protect, chatController_1.fetchConversationsList);
router.get('/conversation/:userId', authMiddleware_1.protect, chatController_1.fetchConversation);
router.get('/history', chatController_1.fetchChatHistory);
// 📝 New endpoints with proper controllers:
// Message management
router.put('/message/:messageId', authMiddleware_1.protect, chatController_1.editChatMessage); // Edit message
router.delete('/message/:messageId', authMiddleware_1.protect, chatController_1.deleteChatMessage); // Delete message
router.post('/message/:messageId/read', authMiddleware_1.protect, chatController_1.markMessageAsRead); // Mark single message as read
// Search and filtering
router.get('/conversation/:userId/search', authMiddleware_1.protect, chatController_1.searchChatMessages); // Search messages in conversation
router.get('/unread-count', authMiddleware_1.protect, chatController_1.getUnreadCount); // Get total unread message count
// User management
router.post('/block/:userId', authMiddleware_1.protect, chatController_1.blockChatUser); // Block a user
router.delete('/block/:userId', authMiddleware_1.protect, chatController_1.unblockChatUser); // Unblock a user
router.get('/blocked-users', authMiddleware_1.protect, chatController_1.fetchBlockedUsers); // Get list of blocked users
// Moderation
router.post('/message/:messageId/report', authMiddleware_1.protect, chatController_1.reportChatMessage); // Report inappropriate message
// Message features
router.post('/message/:messageId/pin', authMiddleware_1.protect, chatController_1.pinChatMessage); // Pin important messages
router.delete('/message/:messageId/pin', authMiddleware_1.protect, chatController_1.unpinChatMessage); // Unpin message
router.get('/conversation/:userId/pinned', authMiddleware_1.protect, chatController_1.fetchPinnedMessages); // Get pinned messages
exports.default = router;
