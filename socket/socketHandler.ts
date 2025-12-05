// src/socket/socketHandler.ts
import { Server, Socket } from 'socket.io';
import { sendMessage, markMessagesAsRead } from '../models/chatModel';
import { createNotification, getUnreadNotifications, markNotificationsAsRead } from '../models/notificationModel';

// Store online users (use string IDs for consistency)
const onlineUsers = new Map<string, { _id: string; name: string; role: string }>();

export const initializeSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    const name = socket.data.name;
    const role = socket.data.role;

    console.log('🔌 User connected:', { id: userId, name, role });

    // Join user-specific room
    socket.join(`user_${userId}`);
    // Store with both _id and id for frontend compatibility
    onlineUsers.set(userId.toString(), { _id: userId.toString(), name, role });

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

// Emit online users list
const emitOnlineUsersList = (io: Server) => {
  io.emit('online_users_list', {
    users: Array.from(onlineUsers.entries()).map(([id, data]) => ({
      _id: id,
      id: id,
      name: data.name,
      role: data.role,
    })),
  });
};

// Handle user connection
const handleUserConnection = async (socket: Socket, userId: number) => {
  try {
    const notifications = await getUnreadNotifications(userId.toString());
    socket.emit('chat_notifications', notifications);
  } catch (error) {
    console.error('💥 Error fetching notifications:', error);
  }
};

// Message event handlers
const registerMessageHandlers = (socket: Socket, io: Server) => {
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      await sendMessage(senderId, receiverId, message);

      const isReceiverOnline = onlineUsers.has(receiverId);

      // ONLY send to receiver, NOT back to sender to prevent duplication
      if (isReceiverOnline) {
        io.to(`user_${receiverId}`).emit('receive_message', {
          senderId,
          receiverId,
          message,
          createdAt: new Date().toISOString(),
        });
      } else {
        await createNotification(senderId, receiverId, message);
      }

      // Notify both users to update their conversation lists
      io.to(`user_${senderId}`).emit('conversation_updated', { userId: receiverId });
      io.to(`user_${receiverId}`).emit('conversation_updated', { userId: senderId });

      // Confirm message sent to sender
      socket.emit('message_sent_confirmation', { 
        senderId, 
        receiverId, 
        message,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
};

// Typing indicator handlers
const registerTypingHandlers = (socket: Socket, io: Server) => {
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(`user_${receiverId}`).emit('user_typing', { senderId });
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    io.to(`user_${receiverId}`).emit('user_stop_typing', { senderId });
  });
};

// Read status handlers
const registerReadStatusHandlers = (socket: Socket, io: Server) => {
  socket.on('mark_as_read', async ({ senderId, receiverId }) => {
    try {
      await markMessagesAsRead(senderId, receiverId);
      io.to(`user_${senderId}`).emit('messages_read_by_receiver', { from: receiverId });
    } catch (error) {
      console.error('💥 Error marking messages as read:', error);
    }
  });
};

// Notification handlers
const registerNotificationHandlers = (socket: Socket, userId: number) => {
  socket.on('mark_notifications_as_read', async () => {
    try {
      await markNotificationsAsRead(userId.toString());
    } catch (error) {
      console.error('💥 Error marking notifications as read:', error);
    }
  });
};

// Disconnect handler
const registerDisconnectHandler = (socket: Socket, io: Server, userId: number) => {
  socket.on('disconnect', () => {
    onlineUsers.delete(userId.toString());
    emitOnlineUsersList(io);
    console.log(`❌ User ${userId} disconnected`);
  });
};

// Export online users getter for REST endpoint
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.entries()).map(([id, data]) => ({
    _id: id,
    id: id,
    name: data.name,
    role: data.role
  }));
};