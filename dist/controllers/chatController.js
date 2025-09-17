"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPinnedMessages = exports.unpinChatMessage = exports.pinChatMessage = exports.reportChatMessage = exports.fetchBlockedUsers = exports.unblockChatUser = exports.blockChatUser = exports.getUnreadCount = exports.searchChatMessages = exports.markMessageAsRead = exports.deleteChatMessage = exports.editChatMessage = exports.fetchChatHistory = exports.fetchConversationsList = exports.fetchConversation = exports.sendChatMessage = void 0;
const chatModel_1 = require("../models/chatModel");
// ✅ Your existing controllers
const sendChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;
    if (!receiverId || !message) {
        return res.status(400).json({ message: 'receiverId and message are required' });
    }
    try {
        yield (0, chatModel_1.sendMessage)(senderId, receiverId, message);
        res.status(201).json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Send chat error:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});
exports.sendChatMessage = sendChatMessage;
const fetchConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.id;
    const receiverId = req.params.userId;
    try {
        const messages = yield (0, chatModel_1.getConversationWithUser)(senderId, receiverId);
        res.json(messages);
    }
    catch (err) {
        console.error('Fetch chat error:', err);
        res.status(500).json({ message: 'Failed to fetch conversation' });
    }
});
exports.fetchConversation = fetchConversation;
const fetchConversationsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const list = yield (0, chatModel_1.getConversationList)(userId);
        res.json(list);
    }
    catch (err) {
        console.error('Conversation list error:', err);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
});
exports.fetchConversationsList = fetchConversationsList;
const fetchChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
        return res.status(400).json({ message: 'Both user1 and user2 are required' });
    }
    try {
        const messages = yield (0, chatModel_1.getConversationWithUser)(user1, user2);
        res.json(messages);
    }
    catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ message: 'Server error fetching chat history' });
    }
});
exports.fetchChatHistory = fetchChatHistory;
// 📝 New controller functions
const editChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const { message: newMessage } = req.body;
    const userId = req.user.id;
    if (!newMessage) {
        return res.status(400).json({ message: 'New message content is required' });
    }
    try {
        const updatedMessage = yield (0, chatModel_1.editMessage)(messageId, newMessage, userId);
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found or unauthorized' });
        }
        res.json({ message: 'Message updated successfully', data: updatedMessage });
    }
    catch (error) {
        console.error('Edit message error:', error);
        res.status(500).json({ message: 'Failed to edit message' });
    }
});
exports.editChatMessage = editChatMessage;
const deleteChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const userId = req.user.id;
    try {
        const deletedMessage = yield (0, chatModel_1.deleteMessage)(messageId, userId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found or unauthorized' });
        }
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});
exports.deleteChatMessage = deleteChatMessage;
const markMessageAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.body;
    try {
        yield (0, chatModel_1.markMessagesAsRead)(senderId, receiverId);
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Failed to mark messages as read' });
    }
});
exports.markMessageAsRead = markMessageAsRead;
const searchChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { q: searchTerm, limit } = req.query;
    const currentUserId = req.user.id;
    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required' });
    }
    try {
        const messages = yield (0, chatModel_1.searchMessages)(currentUserId, userId, searchTerm, limit ? parseInt(limit) : 50);
        res.json(messages);
    }
    catch (error) {
        console.error('Search messages error:', error);
        res.status(500).json({ message: 'Failed to search messages' });
    }
});
exports.searchChatMessages = searchChatMessages;
const getUnreadCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const count = yield (0, chatModel_1.getUnreadMessageCount)(userId);
        res.json({ unreadCount: count });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Failed to get unread count' });
    }
});
exports.getUnreadCount = getUnreadCount;
const blockChatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: blockedUserId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    try {
        yield (0, chatModel_1.blockUser)(userId, blockedUserId, reason);
        res.json({ message: 'User blocked successfully' });
    }
    catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ message: 'Failed to block user' });
    }
});
exports.blockChatUser = blockChatUser;
const unblockChatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: blockedUserId } = req.params;
    const userId = req.user.id;
    try {
        yield (0, chatModel_1.unblockUser)(userId, blockedUserId);
        res.json({ message: 'User unblocked successfully' });
    }
    catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({ message: 'Failed to unblock user' });
    }
});
exports.unblockChatUser = unblockChatUser;
const fetchBlockedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const blockedUsers = yield (0, chatModel_1.getBlockedUsers)(userId);
        res.json(blockedUsers);
    }
    catch (error) {
        console.error('Get blocked users error:', error);
        res.status(500).json({ message: 'Failed to get blocked users' });
    }
});
exports.fetchBlockedUsers = fetchBlockedUsers;
const reportChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const { reason, description } = req.body;
    const reporterId = req.user.id;
    if (!reason) {
        return res.status(400).json({ message: 'Reason is required' });
    }
    try {
        yield (0, chatModel_1.reportMessage)(messageId, reporterId, reason, description);
        res.json({ message: 'Message reported successfully' });
    }
    catch (error) {
        console.error('Report message error:', error);
        res.status(500).json({ message: 'Failed to report message' });
    }
});
exports.reportChatMessage = reportChatMessage;
const pinChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const userId = req.user.id;
    try {
        const pinnedMessage = yield (0, chatModel_1.pinMessage)(messageId, userId);
        if (!pinnedMessage) {
            return res.status(404).json({ message: 'Message not found or unauthorized' });
        }
        res.json({ message: 'Message pinned successfully', data: pinnedMessage });
    }
    catch (error) {
        console.error('Pin message error:', error);
        res.status(500).json({ message: 'Failed to pin message' });
    }
});
exports.pinChatMessage = pinChatMessage;
const unpinChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const userId = req.user.id;
    try {
        const unpinnedMessage = yield (0, chatModel_1.unpinMessage)(messageId, userId);
        if (!unpinnedMessage) {
            return res.status(404).json({ message: 'Message not found or unauthorized' });
        }
        res.json({ message: 'Message unpinned successfully', data: unpinnedMessage });
    }
    catch (error) {
        console.error('Unpin message error:', error);
        res.status(500).json({ message: 'Failed to unpin message' });
    }
});
exports.unpinChatMessage = unpinChatMessage;
const fetchPinnedMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: otherUserId } = req.params;
    const userId = req.user.id;
    try {
        const pinnedMessages = yield (0, chatModel_1.getPinnedMessages)(userId, otherUserId);
        res.json(pinnedMessages);
    }
    catch (error) {
        console.error('Get pinned messages error:', error);
        res.status(500).json({ message: 'Failed to get pinned messages' });
    }
});
exports.fetchPinnedMessages = fetchPinnedMessages;
