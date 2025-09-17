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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.BlockedUser = exports.Message = exports.reportMessage = exports.getPinnedMessages = exports.unpinMessage = exports.pinMessage = exports.getBlockedUsers = exports.isUserBlocked = exports.unblockUser = exports.blockUser = exports.getUnreadMessageCount = exports.searchMessages = exports.deleteMessage = exports.editMessage = exports.markMessagesAsRead = exports.getConversationList = exports.getConversationWithUser = exports.sendMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Enhanced message schema
const messageSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    messageType: { type: String, enum: ['text', 'image', 'file', 'voice'], default: 'text' },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    isPinned: { type: Boolean, default: false },
    pinnedAt: { type: Date },
    reactions: [{
            userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            reaction: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
    replyTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Message' }, // For message replies
    metadata: {
        fileUrl: String,
        fileName: String,
        fileSize: Number,
        duration: Number // for voice messages
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
// Block/Report schemas
const blockedUserSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    blockedUserId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const reportSchema = new mongoose_1.default.Schema({
    messageId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Message', required: true },
    reporterId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose_1.default.model('Message', messageSchema);
exports.Message = Message;
const BlockedUser = mongoose_1.default.model('BlockedUser', blockedUserSchema);
exports.BlockedUser = BlockedUser;
const Report = mongoose_1.default.model('Report', reportSchema);
exports.Report = Report;
// ✅ Your existing methods (keep these)
const sendMessage = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield Message.create({ senderId, receiverId, message, status: 'sent' });
});
exports.sendMessage = sendMessage;
const getConversationWithUser = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.find({
        $and: [
            { isDeleted: false }, // Don't return deleted messages
            {
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            }
        ]
    }).sort({ created_at: 1 });
});
exports.getConversationWithUser = getConversationWithUser;
const getConversationList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Your existing implementation - keep as is
    const messages = yield Message.aggregate([
        {
            $match: {
                $and: [
                    { isDeleted: false },
                    {
                        $or: [
                            { senderId: new mongoose_1.default.Types.ObjectId(userId) },
                            { receiverId: new mongoose_1.default.Types.ObjectId(userId) }
                        ]
                    }
                ]
            }
        },
        // ... rest of your existing aggregation
    ]);
    return messages;
});
exports.getConversationList = getConversationList;
const markMessagesAsRead = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Message.updateMany({ senderId, receiverId, status: { $ne: 'read' } }, { $set: { status: 'read' } });
});
exports.markMessagesAsRead = markMessagesAsRead;
// 📝 New methods to implement:
// Edit message
const editMessage = (messageId, newMessage, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Message.findOneAndUpdate({ _id: messageId, senderId: userId, isDeleted: false }, {
        message: newMessage,
        isEdited: true,
        editedAt: new Date()
    }, { new: true });
    return result;
});
exports.editMessage = editMessage;
// Delete message
const deleteMessage = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Message.findOneAndUpdate({ _id: messageId, senderId: userId }, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });
    return result;
});
exports.deleteMessage = deleteMessage;
// Search messages
const searchMessages = (userId_1, otherUserId_1, searchTerm_1, ...args_1) => __awaiter(void 0, [userId_1, otherUserId_1, searchTerm_1, ...args_1], void 0, function* (userId, otherUserId, searchTerm, limit = 50) {
    return yield Message.find({
        $and: [
            { isDeleted: false },
            {
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            { message: { $regex: searchTerm, $options: 'i' } }
        ]
    })
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('senderId', 'name email');
});
exports.searchMessages = searchMessages;
// Get unread message count
const getUnreadMessageCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.countDocuments({
        receiverId: userId,
        status: { $ne: 'read' },
        isDeleted: false
    });
});
exports.getUnreadMessageCount = getUnreadMessageCount;
// Block user
const blockUser = (userId, blockedUserId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    yield BlockedUser.create({ userId, blockedUserId, reason });
});
exports.blockUser = blockUser;
// Unblock user
const unblockUser = (userId, blockedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    yield BlockedUser.deleteOne({ userId, blockedUserId });
});
exports.unblockUser = unblockUser;
// Check if user is blocked
const isUserBlocked = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const blocked = yield BlockedUser.findOne({
        $or: [
            { userId, blockedUserId: otherUserId },
            { userId: otherUserId, blockedUserId: userId }
        ]
    });
    return !!blocked;
});
exports.isUserBlocked = isUserBlocked;
// Get blocked users
const getBlockedUsers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield BlockedUser.find({ userId }).populate('blockedUserId', 'name email');
});
exports.getBlockedUsers = getBlockedUsers;
// Pin message
const pinMessage = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.findOneAndUpdate({
        _id: messageId,
        $or: [{ senderId: userId }, { receiverId: userId }],
        isDeleted: false
    }, { isPinned: true, pinnedAt: new Date() }, { new: true });
});
exports.pinMessage = pinMessage;
// Unpin message
const unpinMessage = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.findOneAndUpdate({
        _id: messageId,
        $or: [{ senderId: userId }, { receiverId: userId }]
    }, { isPinned: false, pinnedAt: null }, { new: true });
});
exports.unpinMessage = unpinMessage;
// Get pinned messages
const getPinnedMessages = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.find({
        $and: [
            { isPinned: true },
            { isDeleted: false },
            {
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            }
        ]
    }).sort({ pinnedAt: -1 });
});
exports.getPinnedMessages = getPinnedMessages;
// Report message
const reportMessage = (messageId, reporterId, reason, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield Report.create({ messageId, reporterId, reason, description });
});
exports.reportMessage = reportMessage;
