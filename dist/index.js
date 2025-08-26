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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const superAdminRoutes_1 = __importDefault(require("./routes/superAdminRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const forumRoutes_1 = __importDefault(require("./routes/forumRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const chatModel_1 = require("./models/chatModel");
const socketAuthMiddleware_1 = require("./middleware/socketAuthMiddleware");
const notificationModel_1 = require("./models/notificationModel");
const churchInfoRoutes_1 = __importDefault(require("./routes/churchInfoRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const donationRoutes_1 = __importDefault(require("./routes/donationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)()
    .then(() => {
    // Start the server only after DB connection is successful
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1); // Exit if DB connection fails
});
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use('/api/donations/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('✅ Church App API is running 2...');
});
app.get('/api/db-test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoose = require('mongoose');
    const connection = mongoose.connection;
    res.json({
        status: connection.readyState === 1 ? 'connected' : 'not connected',
        dbName: connection.name,
    });
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/superadmin', superAdminRoutes_1.default);
app.use('/api/profile', profileRoutes_1.default);
app.use('/api/forum', forumRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/church-info', churchInfoRoutes_1.default);
app.use('/api/announcements', announcementRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/media', mediaRoutes_1.default);
app.use('/api/donations', donationRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/feedback', feedbackRoutes_1.default);
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const onlineUsers = new Map();
app.get('/api/online-users', (req, res) => {
    const users = Array.from(onlineUsers.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        role: data.role
    }));
    res.json({ onlineUsers: users });
});
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});
io.use(socketAuthMiddleware_1.protectSocket);
io.on('connection', (socket) => {
    const userId = socket.data.userId;
    const name = socket.data.name;
    const role = socket.data.role;
    console.log('Decoded Socket Data:', { id: userId, name, role });
    socket.join(`user_${userId}`);
    onlineUsers.set(userId, { name, role });
    // Emit online users list
    io.emit('online_users_list', {
        users: Array.from(onlineUsers.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            role: data.role,
        })),
    });
    // Send any unread notifications on connect
    (0, notificationModel_1.getUnreadNotifications)(userId).then((notifications) => {
        socket.emit('chat_notifications', notifications);
    });
    // Send message
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
        }
        catch (error) {
            console.error('💥 Error sending message:', error);
        }
    }));
    // Typing indicators
    socket.on('typing', ({ senderId, receiverId }) => {
        io.to(`user_${receiverId}`).emit('user_typing', { senderId });
    });
    socket.on('stop_typing', ({ senderId, receiverId }) => {
        io.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
    });
    // Mark messages as read
    socket.on('mark_as_read', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId }) {
        try {
            yield (0, chatModel_1.markMessagesAsRead)(senderId, receiverId);
            io.to(`user_${senderId}`).emit('messages_read_by_receiver', { from: receiverId });
        }
        catch (error) {
            console.error('💥 Error marking messages as read:', error);
        }
    }));
    // Mark notifications as read
    socket.on('mark_notifications_as_read', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, notificationModel_1.markNotificationsAsRead)(userId);
        }
        catch (error) {
            console.error('💥 Error marking notifications as read:', error);
        }
    }));
    // Handle disconnect
    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        io.emit('online_users_list', {
            users: Array.from(onlineUsers.entries()).map(([id, data]) => ({
                id,
                name: data.name,
                role: data.role,
            })),
        });
        console.log(`❌ User ${userId} disconnected`);
    });
});
