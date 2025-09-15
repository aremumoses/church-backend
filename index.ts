// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { protectSocket } from './middleware/socketAuthMiddleware';
import { initializeSocketHandlers, getOnlineUsers } from './socket/socketHandler';
import connectDB from './config/db';

// Import routes
import authRoutes from './routes/authRoutes';
import superAdminRoutes from './routes/superAdminRoutes';
import profileRoutes from './routes/profileRoutes';
import forumRoutes from './routes/forumRoutes';
import chatRoutes from './routes/chatRoutes';
import churchInfoRoutes from './routes/churchInfoRoutes';
import announcementRoutes from './routes/announcementRoutes';
import eventRoutes from './routes/eventRoutes';
import mediaRoutes from './routes/mediaRoutes';
import donationRoutes from './routes/donationRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import leaderRoutes from './routes/leaderRoutes';

dotenv.config();

const app: Application = express();
const PORT = 5001;
// const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes
app.get('/', (req: Request, res: Response) => {
  res.send('✅ Church App API is running 2...');
});

app.get('/api/db-test', async (req, res) => {
  const mongoose = require('mongoose');
  const connection = mongoose.connection;
  res.json({
    status: connection.readyState === 1 ? 'connected' : 'not connected',
    dbName: connection.name,
  });
});

// Online users endpoint
app.get('/api/online-users', (req: Request, res: Response) => {
  res.json({ onlineUsers: getOnlineUsers() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/church-info', churchInfoRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/leaders', leaderRoutes);

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
io.use(protectSocket);
initializeSocketHandlers(io);

// Start server
connectDB()
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