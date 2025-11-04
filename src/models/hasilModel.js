import { pool } from '../config/db.js';

export const getAllHasil = async () => {
  const [rows] = await pool.query('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC');
  return rows;
};

export const getHasilById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM hasil_diagnosa WHERE id_hasil = ?', [id]);
  return rows[0];
};
