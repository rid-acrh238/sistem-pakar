import { pool } from '../config/db.js';

export const getAllHasilDiagnosa = async () => {
  const [rows] = await pool.query('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC');
  return rows;
};

export const getHasilByTanggal = async (dateFrom, dateTo) => {
  const [rows] = await pool.query(
    'SELECT * FROM hasil_diagnosa WHERE DATE(tanggal) BETWEEN ? AND ? ORDER BY tanggal DESC',
    [dateFrom, dateTo]
  );
  return rows;
};
