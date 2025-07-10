import db from '../config/db';

export const getChurchInfo = async () => {
  const [rows] = await db.execute('SELECT * FROM church_info LIMIT 1');
  return (rows as any[])[0]; // returns the first record
};

export const updateChurchInfo = async (data: {
  history?: string;
  mission?: string;
  vision?: string;
  doctrines?: string;
  leadership?: string;
}) => {
  const { history, mission, vision, doctrines, leadership } = data;
  return await db.execute(
    `UPDATE church_info SET history=?, mission=?, vision=?, doctrines=?, leadership=? WHERE id=1`,
    [history, mission, vision, doctrines, leadership]
  );
};
