import mongoose from 'mongoose';
import Message from '../models/chatModel';

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  message: string
) => {
  const msg = new Message({ senderId, receiverId, message });
  await msg.save();
};

// Get full chat between two users
export const getConversationWithUser = async (
  userId: string,
  otherUserId: string
) => {
  return await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ created_at: 1 }); // ascending by time
};

// Get recent conversations with last message
export const getConversationList = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

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
        from: 'users',
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

// Same as getConversationWithUser (alias for clarity)
export const getChatHistory = getConversationWithUser;

export const markMessagesAsRead = async (
  senderId: string,
  receiverId: string
) => {
  await Message.updateMany(
    {
      senderId,
      receiverId,
      status: { $ne: 'read' },
    },
    {
      $set: { status: 'read' },
    }
  );
};
