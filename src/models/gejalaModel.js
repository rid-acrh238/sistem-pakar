import { pool } from '../config/db.js';

export const getAllGejala = async () => {
  const [rows] = await pool.query('SELECT * FROM gejala');
  return rows;
};

export const getGejalaById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM gejala WHERE id_gejala = ?', [id]);
  return rows[0];
};

export const insertGejala = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)',
    [data.kode_gejala, data.nama_gejala]
  );
  return result;
};

export const updateGejala = async (id, data) => {
  const [result] = await pool.query(
    'UPDATE gejala SET kode_gejala=?, nama_gejala=? WHERE id_gejala=?',
    [data.kode_gejala, data.nama_gejala, id]
  );
  return result;
};

export const deleteGejala = async (id) => {
  const [result] = await pool.query('DELETE FROM gejala WHERE id_gejala=?', [id]);
  return result;
};
