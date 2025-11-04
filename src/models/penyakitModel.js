import { pool } from '../config/db.js';

// GET all penyakit
export const getAllPenyakit = async () => {
  const [rows] = await pool.query('SELECT * FROM penyakit ORDER BY id ASC');
  return rows;
};

// GET penyakit by ID
export const getPenyakitById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM penyakit WHERE id = ?', [id]);
  return rows[0];
};

// CREATE penyakit
export const createPenyakit = async (kode_penyakit, nama_penyakit, deskripsi) => {
  const [result] = await pool.query(
    'INSERT INTO penyakit (kode_penyakit, nama_penyakit, deskripsi) VALUES (?, ?, ?)',
    [kode_penyakit, nama_penyakit, deskripsi]
  );
  return result;
};

// UPDATE penyakit
export const updatePenyakit = async (id, kode_penyakit, nama_penyakit, deskripsi) => {
  const [result] = await pool.query(
    'UPDATE penyakit SET kode_penyakit = ?, nama_penyakit = ?, deskripsi = ? WHERE id = ?',
    [kode_penyakit, nama_penyakit, deskripsi, id]
  );
  return result;
};

// DELETE penyakit
export const deletePenyakit = async (id) => {
  const [result] = await pool.query('DELETE FROM penyakit WHERE id = ?', [id]);
  return result;
};
