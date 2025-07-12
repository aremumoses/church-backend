 

import db from '../config/db';

// 1. Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  profile_pic?: string;
  created_at?: string;
}
 
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE role = ?', [role]);
  return rows as User[];
};

// 2. Create a user
export const createUser = async (user: Partial<User>) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password, user.role || 'user']
  );
  return result;
};

// 3. Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

// 4. Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

// 5. Update user password
export const updateUserPassword = async (email: string, newHashedPassword: string) => {
  const [result] = await db.execute(
    'UPDATE users SET password = ? WHERE email = ?',
    [newHashedPassword, email]
  );
  return result;
};

export const updateUserProfile = async (
  id: string,
  updates: Partial<User>
) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  await db.execute(sql, values);
};

export const getUserPublicProfileById = async (id: string): Promise<Partial<User> | null> => {
  const [rows] = await db.execute(
    'SELECT id, name, role, profile_pic FROM users WHERE id = ?',
    [id]
  );
  const users = rows as Partial<User>[];
  return users.length > 0 ? users[0] : null;
};

export const updateUserRole = async (id: string, role: 'user' | 'admin') => {
  const sql = 'UPDATE users SET role = ? WHERE id = ?';
  await db.execute(sql, [role, id]);
};

export const updateUserStatus = async (id: string, status: 'active' | 'inactive') => {
  const sql = 'UPDATE users SET status = ? WHERE id = ?';
  await db.execute(sql, [status, id]);
};
