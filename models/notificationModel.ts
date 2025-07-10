import db from '../config/db';

export const createNotification = async (senderId: number, receiverId: number, message: string) => {
  await db.execute(
    'INSERT INTO notifications (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [senderId, receiverId, message]
  );
};

export const getUnreadNotifications = async (userId: number) => {
  const [rows] = await db.execute(
    'SELECT * FROM notifications WHERE receiver_id = ? AND is_read = FALSE ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

export const markNotificationsAsRead = async (userId: number) => {
  await db.execute(
    'UPDATE notifications SET is_read = TRUE WHERE receiver_id = ?',
    [userId]
  );
};
