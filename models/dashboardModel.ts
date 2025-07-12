import db from '../config/db';

export const getUserStats = async () => {
  const [total] = await db.execute('SELECT COUNT(*) as total FROM users');
  const [active] = await db.execute('SELECT COUNT(*) as active FROM users WHERE status = "active"');
  const [inactive] = await db.execute('SELECT COUNT(*) as inactive FROM users WHERE status = "inactive"');
  return {
    total: (total as any)[0].total,
    active: (active as any)[0].active,
    inactive: (inactive as any)[0].inactive
  };
};

export const getPostStats = async () => {
  const [total] = await db.execute('SELECT COUNT(*) as total FROM posts');
  const [pending] = await db.execute('SELECT COUNT(*) as pending FROM posts WHERE status = "pending"');
  const [approved] = await db.execute('SELECT COUNT(*) as approved FROM posts WHERE status = "active"');
  return {
    total: (total as any)[0].total,
    pending: (pending as any)[0].pending,
    approved: (approved as any)[0].approved
  };
};

export const getDonationStats = async () => {
  const [rows] = await db.execute(`
    SELECT COUNT(*) as successfulCount, SUM(amount) as totalAmount
    FROM donations
    WHERE status = 'success'
  `);
  return (rows as any)[0];
};

export const getMediaCount = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM media_files');
  return (rows as any)[0].count;
};
