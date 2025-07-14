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
exports.markMessagesAsRead = exports.getChatHistory = exports.getConversationList = exports.getConversationWithUser = exports.sendMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
// Send a new message
const sendMessage = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = new chatModel_1.default({ senderId, receiverId, message });
    yield msg.save();
});
exports.sendMessage = sendMessage;
// Get full chat between two users (by time ascending)
const getConversationWithUser = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatModel_1.default.find({
        $or: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
        ],
    }).sort({ created_at: 1 });
});
exports.getConversationWithUser = getConversationWithUser;
// Get recent conversations for a user, grouped by contact
const getConversationList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(userId);
    const pipeline = [
        {
            $match: {
                $or: [
                    { senderId: objectId },
                    { receiverId: objectId },
                ],
            },
        },
        {
            $sort: { created_at: -1 },
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$senderId', objectId] },
                        '$receiverId',
                        '$senderId',
                    ],
                },
                lastMessage: { $first: '$message' },
                createdAt: { $first: '$created_at' },
            },
        },
        {
            $lookup: {
                from: 'users', // must match your MongoDB collection name exactly
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $project: {
                userId: '$_id',
                name: '$user.name',
                email: '$user.email',
                message: '$lastMessage',
                created_at: '$createdAt',
            },
        },
        {
            $sort: { created_at: -1 },
        },
    ];
    return yield chatModel_1.default.aggregate(pipeline);
});
exports.getConversationList = getConversationList;
// Get all messages with a specific user (alias for clarity)
exports.getChatHistory = exports.getConversationWithUser;
// Mark messages from sender to receiver as "read"
const markMessagesAsRead = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    yield chatModel_1.default.updateMany({
        senderId: new mongoose_1.default.Types.ObjectId(senderId),
        receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
        status: { $ne: 'read' },
    }, {
        $set: { status: 'read' },
    });
});
exports.markMessagesAsRead = markMessagesAsRead;
