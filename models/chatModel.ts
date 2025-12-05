import mongoose from 'mongoose';
import { Types } from 'mongoose';

// Enhanced message schema
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    messageType: { type: String, enum: ['text', 'image', 'file', 'voice'], default: 'text' },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    isPinned: { type: Boolean, default: false },
    pinnedAt: { type: Date },
    reactions: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reaction: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // For message replies
    metadata: {
      fileUrl: String,
      fileName: String,
      fileSize: Number,
      duration: Number // for voice messages
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Block/Report schemas
const blockedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blockedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);
const Report = mongoose.model('Report', reportSchema);

// ✅ Your existing methods (keep these)
export const sendMessage = async (
  senderId: string | Types.ObjectId,
  receiverId: string | Types.ObjectId,
  message: string
) => {
  await Message.create({ senderId, receiverId, message, status: 'sent' });
};

export const getConversationWithUser = async (
  userId: string | Types.ObjectId,
  otherUserId: string | Types.ObjectId
) => {
  return await Message.find({
    $and: [
      { isDeleted: false }, // Don't return deleted messages
      {
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      }
    ]
  }).sort({ created_at: 1 });
};

export const getConversationList = async (userId: string | Types.ObjectId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  const conversations = await Message.aggregate([
    {
      $match: {
        $and: [
          { isDeleted: false },
          {
            $or: [
              { senderId: userObjectId }, 
              { receiverId: userObjectId }
            ]
          }
        ]
      }
    },
    {
      $sort: { created_at: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', userObjectId] },
            '$receiverId',
            '$senderId'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiverId', userObjectId] },
                  { $ne: ['$status', 'read'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'otherUser'
      }
    },
    {
      $unwind: '$otherUser'
    },
    {
      $project: {
        _id: 1,
        otherUser: {
          _id: '$otherUser._id',
          id: '$otherUser._id',
          name: '$otherUser.name',
          email: '$otherUser.email',
          profile_pic: '$otherUser.profile_pic',
          role: '$otherUser.role'
        },
        lastMessage: {
          message: '$lastMessage.message',
          created_at: '$lastMessage.created_at',
          senderId: '$lastMessage.senderId'
        },
        unreadCount: 1
      }
    },
    {
      $sort: { 'lastMessage.created_at': -1 }
    }
  ]);
  
  return conversations;
};

export const markMessagesAsRead = async (
  senderId: string | Types.ObjectId,
  receiverId: string | Types.ObjectId
) => {
  await Message.updateMany(
    { senderId, receiverId, status: { $ne: 'read' } },
    { $set: { status: 'read' } }
  );
};

// 📝 New methods to implement:

// Edit message
export const editMessage = async (messageId: string, newMessage: string, userId: string) => {
  const result = await Message.findOneAndUpdate(
    { _id: messageId, senderId: userId, isDeleted: false },
    { 
      message: newMessage, 
      isEdited: true, 
      editedAt: new Date() 
    },
    { new: true }
  );
  return result;
};

// Delete message
export const deleteMessage = async (messageId: string, userId: string) => {
  const result = await Message.findOneAndUpdate(
    { _id: messageId, senderId: userId },
    { 
      isDeleted: true, 
      deletedAt: new Date() 
    },
    { new: true }
  );
  return result;
};

// Search messages
export const searchMessages = async (
  userId: string,
  otherUserId: string,
  searchTerm: string,
  limit: number = 50
) => {
  return await Message.find({
    $and: [
      { isDeleted: false },
      {
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      { message: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .sort({ created_at: -1 })
  .limit(limit)
  .populate('senderId', 'name email');
};

// Get unread message count
export const getUnreadMessageCount = async (userId: string) => {
  return await Message.countDocuments({
    receiverId: userId,
    status: { $ne: 'read' },
    isDeleted: false
  });
};

// Block user
export const blockUser = async (userId: string, blockedUserId: string, reason?: string) => {
  await BlockedUser.create({ userId, blockedUserId, reason });
};

// Unblock user
export const unblockUser = async (userId: string, blockedUserId: string) => {
  await BlockedUser.deleteOne({ userId, blockedUserId });
};

// Check if user is blocked
export const isUserBlocked = async (userId: string, otherUserId: string) => {
  const blocked = await BlockedUser.findOne({
    $or: [
      { userId, blockedUserId: otherUserId },
      { userId: otherUserId, blockedUserId: userId }
    ]
  });
  return !!blocked;
};

// Get blocked users
export const getBlockedUsers = async (userId: string) => {
  return await BlockedUser.find({ userId }).populate('blockedUserId', 'name email');
};

// Pin message
export const pinMessage = async (messageId: string, userId: string) => {
  return await Message.findOneAndUpdate(
    { 
      _id: messageId, 
      $or: [{ senderId: userId }, { receiverId: userId }],
      isDeleted: false 
    },
    { isPinned: true, pinnedAt: new Date() },
    { new: true }
  );
};

// Unpin message
export const unpinMessage = async (messageId: string, userId: string) => {
  return await Message.findOneAndUpdate(
    { 
      _id: messageId, 
      $or: [{ senderId: userId }, { receiverId: userId }] 
    },
    { isPinned: false, pinnedAt: null },
    { new: true }
  );
};

// Get pinned messages
export const getPinnedMessages = async (userId: string, otherUserId: string) => {
  return await Message.find({
    $and: [
      { isPinned: true },
      { isDeleted: false },
      {
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      }
    ]
  }).sort({ pinnedAt: -1 });
};

// Report message
export const reportMessage = async (
  messageId: string, 
  reporterId: string, 
  reason: string, 
  description?: string
) => {
  await Report.create({ messageId, reporterId, reason, description });
};

export { Message, BlockedUser, Report };