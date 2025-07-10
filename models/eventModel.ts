import db from '../config/db';

export const createEvent = async (title: string, description: string, date: string, location: string, createdBy: number) => {
  await db.execute(
    'INSERT INTO events (title, description, date, location, created_by) VALUES (?, ?, ?, ?, ?)',
    [title, description, date, location, createdBy]
  );
};

export const getUpcomingEvents = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC'
  );
  return rows;
};

export const updateEvent = async (id: number, title: string, description: string, date: string, location: string) => {
  await db.execute(
    'UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?',
    [title, description, date, location, id]
  );
};

export const deleteEvent = async (id: number) => {
  await db.execute('DELETE FROM events WHERE id = ?', [id]);
};
