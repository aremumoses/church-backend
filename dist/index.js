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
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketAuthMiddleware_1 = require("./middleware/socketAuthMiddleware");
const socketHandler_1 = require("./socket/socketHandler");
const db_1 = __importDefault(require("./config/db"));
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const superAdminRoutes_1 = __importDefault(require("./routes/superAdminRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const forumRoutes_1 = __importDefault(require("./routes/forumRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const churchInfoRoutes_1 = __importDefault(require("./routes/churchInfoRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const donationRoutes_1 = __importDefault(require("./routes/donationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const leaderRoutes_1 = __importDefault(require("./routes/leaderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5001;
// const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
// Create HTTP server and Socket.IO instance
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Middleware
app.use((0, cors_1.default)());
app.use('/api/donations/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check routes
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
// Online users endpoint
app.get('/api/online-users', (req, res) => {
    res.json({ onlineUsers: (0, socketHandler_1.getOnlineUsers)() });
});
// API Routes
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
app.use('/api/leaders', leaderRoutes_1.default);
// Static file serving (uncomment if needed)
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});
// Socket.IO setup
io.use(socketAuthMiddleware_1.protectSocket);
(0, socketHandler_1.initializeSocketHandlers)(io);
// Start server
(0, db_1.default)()
    .then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`🔌 Socket.IO is ready for connections`);
    });
})
    .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
});
