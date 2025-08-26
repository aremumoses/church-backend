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
exports.markNotificationsAsRead = exports.getUnreadNotifications = exports.createNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// -----------------------------
// Notification Schema
// -----------------------------
const notificationSchema = new mongoose_1.default.Schema({
    sender_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Notification = mongoose_1.default.model('Notification', notificationSchema);
// -----------------------------
// Notification Functions
// -----------------------------
/**
 * Create a new notification
 */
const createNotification = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new Notification({ sender_id: senderId, receiver_id: receiverId, message });
    yield notification.save();
    return notification;
});
exports.createNotification = createNotification;
/**
 * Get all unread notifications for a user
 */
const getUnreadNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Notification.find({
        receiver_id: userId,
        is_read: false,
    })
        .sort({ created_at: -1 })
        .populate('sender_id', 'name');
});
exports.getUnreadNotifications = getUnreadNotifications;
/**
 * Mark all notifications as read for a user
 */
const markNotificationsAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Notification.updateMany({ receiver_id: userId, is_read: false }, { is_read: true });
});
exports.markNotificationsAsRead = markNotificationsAsRead;
exports.default = Notification;
