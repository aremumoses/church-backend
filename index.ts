 
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import superAdminRoutes from './routes/superAdminRoutes';
import profileRoutes from './routes/profileRoutes';
import forumRoutes from './routes/forumRoutes';
import chatRoutes from './routes/chatRoutes';
import { sendMessage, markMessagesAsRead } from './models/chatModel';
import { protectSocket } from './middleware/socketAuthMiddleware';
import { createNotification, getUnreadNotifications, markNotificationsAsRead } from './models/notificationModel';
import churchInfoRoutes from './routes/churchInfoRoutes';
import announcementRoutes from './routes/announcementRoutes';
import eventRoutes from './routes/eventRoutes';
import mediaRoutes from './routes/mediaRoutes';
import donationRoutes from './routes/donationRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import leaderRoutes from './routes/leaderRoutes';
import connectDB from './config/db';
dotenv.config();
 

// Connect to MongoDB
connectDB()
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


const app: Application = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const onlineUsers = new Map<number, { name: string; role: string }>();

app.get('/api/online-users', (req: Request, res: Response) => {
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

io.use(protectSocket);


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
  getUnreadNotifications(userId).then((notifications) => {
    socket.emit('chat_notifications', notifications);
  });

  // Send message
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      await sendMessage(senderId, receiverId, message);

      const isReceiverOnline = onlineUsers.has(receiverId);

      if (isReceiverOnline) {
        io.to(`user_${receiverId}`).emit('receive_message', {
          senderId,
          message,
          createdAt: new Date().toISOString(),
        });
      } else {
        await createNotification(senderId, receiverId, message);
      }
    } catch (error) {
      console.error('💥 Error sending message:', error);
    }
  });

  // Typing indicators
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(`user_${receiverId}`).emit('user_typing', { senderId });
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    io.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
  });

  // Mark messages as read
  socket.on('mark_as_read', async ({ senderId, receiverId }) => {
    try {
      await markMessagesAsRead(senderId, receiverId);
      io.to(`user_${senderId}`).emit('messages_read_by_receiver', { from: receiverId });
    } catch (error) {
      console.error('💥 Error marking messages as read:', error);
    }
  });

  // Mark notifications as read
  socket.on('mark_notifications_as_read', async () => {
    try {
      await markNotificationsAsRead(userId);
    } catch (error) {
      console.error('💥 Error marking notifications as read:', error);
    }
  });

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
