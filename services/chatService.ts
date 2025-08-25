import mongoose, { PipelineStage } from 'mongoose';
import Message from '../models/chatModel';

// Send a new message
export const sendMessage = async (
  senderId: string,
  receiverId: string,
  message: string
) => {
  const msg = new Message({ senderId, receiverId, message });
  await msg.save();
};

// Get full chat between two users (by time ascending)
export const getConversationWithUser = async (
  userId: string,
  otherUserId: string
) => {
  return await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ created_at: 1 });
};

// Get recent conversations for a user, grouped by contact
export const getConversationList = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const pipeline: PipelineStage[] = [
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

  return await Message.aggregate(pipeline);
};

// Get all messages with a specific user (alias for clarity)
export const getChatHistory = getConversationWithUser;

// Mark messages from sender to receiver as "read"
export const markMessagesAsRead = async (
  senderId: string,
  receiverId: string
) => {
  await Message.updateMany(
    {
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      status: { $ne: 'read' },
    },
    {
      $set: { status: 'read' },
    }
  );
};
