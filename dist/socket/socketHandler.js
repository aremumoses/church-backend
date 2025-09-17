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
exports.getOnlineUsers = exports.initializeSocketHandlers = void 0;
const chatModel_1 = require("../models/chatModel");
const notificationModel_1 = require("../models/notificationModel");
// Store online users
const onlineUsers = new Map();
const initializeSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        const name = socket.data.name;
        const role = socket.data.role;
        console.log('🔌 User connected:', { id: userId, name, role });
        // Join user-specific room
        socket.join(`user_${userId}`);
        onlineUsers.set(userId, { name, role });
        // Emit online users list to all clients
        emitOnlineUsersList(io);
        // Send unread notifications on connect
        handleUserConnection(socket, userId);
        // Register all event handlers
        registerMessageHandlers(socket, io);
        registerTypingHandlers(socket, io);
        registerReadStatusHandlers(socket, io);
        registerNotificationHandlers(socket, userId);
        registerDisconnectHandler(socket, io, userId);
    });
};
exports.initializeSocketHandlers = initializeSocketHandlers;
// Emit online users list
const emitOnlineUsersList = (io) => {
    io.emit('online_users_list', {
        users: Array.from(onlineUsers.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            role: data.role,
        })),
    });
};
// Handle user connection
const handleUserConnection = (socket, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield (0, notificationModel_1.getUnreadNotifications)(userId.toString());
        socket.emit('chat_notifications', notifications);
    }
    catch (error) {
        console.error('💥 Error fetching notifications:', error);
    }
});
// Message event handlers
const registerMessageHandlers = (socket, io) => {
    socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, receiverId, message } = data;
        try {
            yield (0, chatModel_1.sendMessage)(senderId, receiverId, message);
            const isReceiverOnline = onlineUsers.has(receiverId);
            if (isReceiverOnline) {
                io.to(`user_${receiverId}`).emit('receive_message', {
                    senderId,
                    message,
                    createdAt: new Date().toISOString(),
                });
            }
            else {
                yield (0, notificationModel_1.createNotification)(senderId, receiverId, message);
            }
            // Confirm message sent to sender
            socket.emit('message_sent_confirmation', {
                senderId,
                receiverId,
                message,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('💥 Error sending message:', error);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    }));
};
// Typing indicator handlers
const registerTypingHandlers = (socket, io) => {
    socket.on('typing', ({ senderId, receiverId }) => {
        io.to(`user_${receiverId}`).emit('user_typing', { senderId });
    });
    socket.on('stop_typing', ({ senderId, receiverId }) => {
        io.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
    });
};
// Read status handlers
const registerReadStatusHandlers = (socket, io) => {
    socket.on('mark_as_read', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId }) {
        try {
            yield (0, chatModel_1.markMessagesAsRead)(senderId, receiverId);
            io.to(`user_${senderId}`).emit('messages_read_by_receiver', { from: receiverId });
        }
        catch (error) {
            console.error('💥 Error marking messages as read:', error);
        }
    }));
};
// Notification handlers
const registerNotificationHandlers = (socket, userId) => {
    socket.on('mark_notifications_as_read', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, notificationModel_1.markNotificationsAsRead)(userId.toString());
        }
        catch (error) {
            console.error('💥 Error marking notifications as read:', error);
        }
    }));
};
// Disconnect handler
const registerDisconnectHandler = (socket, io, userId) => {
    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        emitOnlineUsersList(io);
        console.log(`❌ User ${userId} disconnected`);
    });
};
// Export online users getter for REST endpoint
const getOnlineUsers = () => {
    return Array.from(onlineUsers.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        role: data.role
    }));
};
exports.getOnlineUsers = getOnlineUsers;
