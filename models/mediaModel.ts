import db from '../config/db';

export const uploadMedia = async (media: {
  title: string;
  description: string;
  type: 'video' | 'audio' | 'pdf' | 'image';
  url: string;
  category: string;
  uploaded_by: number;
}) => {
  const { title, description, type, url, category, uploaded_by } = media;
  await db.execute(
    `INSERT INTO media_files (title, description, type, url, category, uploaded_by) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, type, url, category, uploaded_by]
  );
};

export const getAllMedia = async () => {
  const [rows] = await db.execute(`SELECT * FROM media_files ORDER BY created_at DESC`);
  return rows;
};

export const searchMedia = async (query: string) => {
  const [rows] = await db.execute(
    `SELECT * FROM media_files WHERE title LIKE ? OR description LIKE ?`,
    [`%${query}%`, `%${query}%`]
  );
  return rows;
};

export const filterMediaByType = async (type: string) => {
  const [rows] = await db.execute(`SELECT * FROM media_files WHERE type = ?`, [type]);
  return rows;
};

export const getMediaByCategory = async (category: string) => {
  const [rows] = await db.execute(`SELECT * FROM media_files WHERE category = ?`, [category]);
  return rows;
};

export const deleteMediaById = async (id: number) => {
  await db.execute(`DELETE FROM media_files WHERE id = ?`, [id]);
};
