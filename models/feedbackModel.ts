import db from '../config/db';

export const createFeedback = async (userId: number, subject: string, message: string) => {
  if (!userId || !subject || !message) {
    throw new Error('Missing required fields for feedback');
  }

  await db.execute(
    'INSERT INTO feedback (user_id, subject, message) VALUES (?, ?, ?)',
    [userId, subject, message]
  );
};


export const getAllFeedbackEntries = async () => {
  const [rows] = await db.execute(
    `SELECT f.*, u.name AS submitted_by 
     FROM feedback f JOIN users u ON f.user_id = u.id 
     ORDER BY f.created_at DESC`
  );
  return rows;
};

export const updateFeedbackStatusById = async (id: string, status: string) => {
  await db.execute('UPDATE feedback SET status = ? WHERE id = ?', [status, id]);
};
