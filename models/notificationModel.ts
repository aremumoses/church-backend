import mongoose from 'mongoose';

// -----------------------------
// Notification Schema
// -----------------------------
const notificationSchema = new mongoose.Schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

// -----------------------------
// Notification Functions
// -----------------------------

/**
 * Create a new notification
 */
export const createNotification = async (
  senderId: string,
  receiverId: string,
  message: string
) => {
  const notification = new Notification({ sender_id: senderId, receiver_id: receiverId, message });
  await notification.save();
  return notification;
};

/**
 * Get all unread notifications for a user
 */
export const getUnreadNotifications = async (userId: string) => {
  return await Notification.find({
    receiver_id: userId,
    is_read: false,
  })
    .sort({ created_at: -1 })
    .populate('sender_id', 'name');
};

/**
 * Mark all notifications as read for a user
 */
export const markNotificationsAsRead = async (userId: string) => {
  await Notification.updateMany({ receiver_id: userId, is_read: false }, { is_read: true });
};

export default Notification;
