import mongoose from 'mongoose';
import { Types } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'read'], default: 'sent' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

// ✅ Equivalent to sendMessage in MySQL
export const sendMessage = async (
  senderId: string | Types.ObjectId,
  receiverId: string | Types.ObjectId,
  message: string
) => {
  await Message.create({ senderId, receiverId, message, status: 'sent' });
};

// ✅ Equivalent to getConversationWithUser in MySQL
export const getConversationWithUser = async (
  userId: string | Types.ObjectId,
  otherUserId: string | Types.ObjectId
) => {
  return await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId }
    ]
  }).sort({ created_at: 1 });
};

// ✅ Equivalent to getConversationList in MySQL
export const getConversationList = async (userId: string | Types.ObjectId) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: new mongoose.Types.ObjectId(userId) }, { receiverId: new mongoose.Types.ObjectId(userId) }]
      }
    },
    {
      $sort: { created_at: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
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
};

// ✅ Equivalent to getChatHistory (identical to getConversationWithUser)
export const getChatHistory = getConversationWithUser;

// ✅ Equivalent to markMessagesAsRead
export const markMessagesAsRead = async (
  senderId: string | Types.ObjectId,
  receiverId: string | Types.ObjectId
) => {
  await Message.updateMany(
    { senderId, receiverId, status: { $ne: 'read' } },
    { $set: { status: 'read' } }
  );
};
