import db from '../config/db';

export const createAnnouncement = async (title: string, content: string, createdBy: number) => {
  await db.execute(
    'INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)',
    [title, content, createdBy]
  );
};

export const getAllActiveAnnouncements = async () => {
  const [rows] = await db.execute('SELECT * FROM announcements WHERE status = "active" ORDER BY created_at DESC');
  return rows;
};

export const updateAnnouncement = async (id: number, title: string, content: string) => {
  await db.execute(
    'UPDATE announcements SET title = ?, content = ? WHERE id = ?',
    [title, content, id]
  );
};

export const deleteAnnouncement = async (id: number) => {
  await db.execute('DELETE FROM announcements WHERE id = ?', [id]);
};
