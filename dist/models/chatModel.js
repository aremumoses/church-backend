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
const messageSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'read'], default: 'sent' },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Message = mongoose_1.default.model('Message', messageSchema);
exports.default = Message;
// ✅ Equivalent to sendMessage in MySQL
const sendMessage = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield Message.create({ senderId, receiverId, message, status: 'sent' });
});
exports.sendMessage = sendMessage;
// ✅ Equivalent to getConversationWithUser in MySQL
const getConversationWithUser = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message.find({
        $or: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId }
        ]
    }).sort({ created_at: 1 });
});
exports.getConversationWithUser = getConversationWithUser;
// ✅ Equivalent to getConversationList in MySQL
const getConversationList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message.aggregate([
        {
            $match: {
                $or: [{ senderId: new mongoose_1.default.Types.ObjectId(userId) }, { receiverId: new mongoose_1.default.Types.ObjectId(userId) }]
            }
        },
        {
            $sort: { created_at: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$senderId', new mongoose_1.default.Types.ObjectId(userId)] },
                        '$receiverId',
                        '$senderId'
                    ]
                },
                lastMessage: { $first: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                userId: '$_id',
                name: '$user.name',
                email: '$user.email',
                message: '$lastMessage.message',
                created_at: '$lastMessage.created_at'
            }
        },
        { $sort: { created_at: -1 } }
    ]);
    return messages;
});
exports.getConversationList = getConversationList;
// ✅ Equivalent to getChatHistory (identical to getConversationWithUser)
exports.getChatHistory = exports.getConversationWithUser;
// ✅ Equivalent to markMessagesAsRead
const markMessagesAsRead = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Message.updateMany({ senderId, receiverId, status: { $ne: 'read' } }, { $set: { status: 'read' } });
});
exports.markMessagesAsRead = markMessagesAsRead;
