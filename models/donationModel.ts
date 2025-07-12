import db from '../config/db';

export const createDonation = async (userId: number, categoryId: number, amount: number, reference: string) => {
  await db.execute(
    'INSERT INTO donations (user_id, category_id, amount, reference, status) VALUES (?, ?, ?, ?, ?)',
    [userId, categoryId, amount, reference, 'pending']
  );
};

export const updateDonationStatus = async (reference: string, status: string) => {
  await db.execute('UPDATE donations SET status = ? WHERE reference = ?', [status, reference]);
};

export const getUserDonations = async (userId: number) => {
  const [rows] = await db.execute(
    `SELECT donations.*, donation_categories.name as category_name 
     FROM donations 
     LEFT JOIN donation_categories ON donations.category_id = donation_categories.id 
     WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllDonations = async () => {
  const [rows] = await db.execute(
    `SELECT donations.*, users.name as donor_name, donation_categories.name as category_name 
     FROM donations 
     LEFT JOIN users ON donations.user_id = users.id 
     LEFT JOIN donation_categories ON donations.category_id = donation_categories.id 
     ORDER BY created_at DESC`
  );
  return rows;
};

export const createDonationCategory = async (name: string, description: string) => {
  await db.execute(
    'INSERT INTO donation_categories (name, description) VALUES (?, ?)',
    [name, description]
  );
};

export const getDonationCategories = async () => {
  const [rows] = await db.execute('SELECT * FROM donation_categories ORDER BY name');
  return rows;
};

export const updateDonationStatusByReference = async (reference: string, status: string) => {
  await db.execute(
    'UPDATE donations SET status = ? WHERE reference = ?',
    [status, reference]
  );
};

export const getDonationStats = async () => {
  const [rows]: any = await db.execute(`
    SELECT COUNT(*) AS totalDonations, SUM(amount) AS totalAmount
    FROM donations
    WHERE status = 'success'
  `);
  return rows[0];
};

export const getDonationsByCategory = async () => {
  const [rows] = await db.execute(`
    SELECT category, COUNT(*) AS count, SUM(amount) AS total
    FROM donations
    WHERE status = 'success'
    GROUP BY category
  `);
  return rows;
};

export const getMonthlyDonations = async () => {
  const [rows] = await db.execute(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
           COUNT(*) AS count,
           SUM(amount) AS total
    FROM donations
    WHERE status = 'success'
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `);
  return rows;
};
