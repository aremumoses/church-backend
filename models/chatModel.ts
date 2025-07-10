import db from '../config/db';

// export const sendMessage = async (senderId: number, receiverId: number, message: string) => {
//   await db.execute(
//     'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
//     [senderId, receiverId, message]
//   );
// };

export const sendMessage = async (senderId: number, receiverId: number, message: string) => {
  await db.execute(
    'INSERT INTO messages (sender_id, receiver_id, message, status) VALUES (?, ?, ?, ?)',
    [senderId, receiverId, message, 'sent']
  );
};


export const getConversationWithUser = async (userId: number, otherUserId: number) => {
  const [rows] = await db.query(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [userId, otherUserId, otherUserId, userId]
  );
  return rows;
};

export const getConversationList = async (userId: number) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, m.message, m.created_at
     FROM (
       SELECT 
         CASE 
           WHEN sender_id = ? THEN receiver_id
           ELSE sender_id
         END AS user_id,
         MAX(created_at) AS last_message_time
       FROM messages
       WHERE sender_id = ? OR receiver_id = ?
       GROUP BY user_id
     ) AS conv
     JOIN users u ON u.id = conv.user_id
     JOIN messages m ON (
       (m.sender_id = ? AND m.receiver_id = conv.user_id) 
       OR (m.sender_id = conv.user_id AND m.receiver_id = ?)
     ) AND m.created_at = conv.last_message_time
     ORDER BY m.created_at DESC`,
    [userId, userId, userId, userId, userId]
  );
  return rows;
};


export const getChatHistory = async (user1: number, user2: number) => {
  const [rows] = await db.execute(
    `SELECT * FROM messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [user1, user2, user2, user1]
  );

  return rows;
};

export const markMessagesAsRead = async (senderId: number, receiverId: number) => {
  await db.execute(
    `UPDATE messages
     SET status = 'read'
     WHERE sender_id = ? AND receiver_id = ? AND status != 'read'`,
    [senderId, receiverId]
  );
};
