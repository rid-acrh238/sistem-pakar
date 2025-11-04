import { pool } from '../config/db.js';

// 🔹 Cari user berdasarkan email
export const findUserByEmail = async (email) => {
  if (!email) return null;
  const [rows] = await pool.query('SELECT * FROM pengguna_diagnosa WHERE email = ?', [email]);
  return rows[0] || null;
};

// 🔹 Tambah user baru
export const insertUser = async (nama, email, google_id = null) => {
  const [result] = await pool.query(
    'INSERT INTO pengguna_diagnosa (nama, email, google_id) VALUES (?, ?, ?)',
    [nama, email, google_id]
  );
  return result.insertId;
};

// 🔹 Dapatkan semua pengguna (opsional untuk admin dashboard)
export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM pengguna_diagnosa ORDER BY created_at DESC');
  return rows;
};
