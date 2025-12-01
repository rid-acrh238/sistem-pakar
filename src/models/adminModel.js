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
    "SELECT id, username, email, nama_lengkap, role, created_at, foto_profil FROM users WHERE role IN ('admin')"
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

// ✅ [BARU] Update User secara Dinamis (Bisa update Foto, Nama, Password, Email sekaligus atau sebagian)
export const updateUserDynamic = async (id, data) => {
  // 1. Ambil key (nama kolom) dan value (isi data) dari object data
  const keys = Object.keys(data);
  const values = Object.values(data);

  // Jika tidak ada data yang dikirim, return null (biar gak error)
  if (keys.length === 0) {
    return null;
  }

  // 2. Susun string query SQL: "nama_lengkap = ?, foto_profil = ?"
  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  // 3. Masukkan ID ke urutan terakhir array values untuk bagian 'WHERE id = ?'
  values.push(id);

  // 4. Eksekusi Query
  const [result] = await pool.query(
    `UPDATE users SET ${setClause} WHERE id = ?`,
    values
  );

  return result;
};