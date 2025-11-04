// ✅ src/models/adminModel.js
import { pool } from '../config/db.js';

export const findUserByIdentifier = async (identifier) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );
  return rows;
};

export const insertUser = async (username, email, password, nama_lengkap, role) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, nama_lengkap, role) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, nama_lengkap, role]
  );
  return result;
};

export const getAllAdmins = async () => {
  const [rows] = await pool.query(
    "SELECT id, username, email, nama_lengkap, role, created_at FROM users WHERE role IN ('admin','super-admin')"
  );
  return rows;
};

export const deleteAdminById = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result;
};

// ✅ Update data admin (nama_lengkap, email)
export const updateAdminById = async (id, nama_lengkap, email) => {
  const [result] = await pool.query(
    'UPDATE users SET nama_lengkap = ?, email = ? WHERE id = ?',
    [nama_lengkap, email, id]
  );
  return result;
};

// ✅ Ambil admin berdasarkan ID
export const getAdminById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};