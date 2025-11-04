import { pool } from '../config/db.js';

export const getAllAturan = async () => {
  const [rows] = await pool.query('SELECT * FROM aturan');
  return rows;
};

export const getAturanById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM aturan WHERE id_aturan = ?', [id]);
  return rows[0];
};

export const insertAturan = async (kondisi, hasil) => {
  const [result] = await pool.query(
    'INSERT INTO aturan (kondisi, hasil) VALUES (?, ?)',
    [kondisi, hasil]
  );
  return result;
};

export const updateAturan = async (id, kondisi, hasil) => {
  const [result] = await pool.query(
    'UPDATE aturan SET kondisi=?, hasil=? WHERE id_aturan=?',
    [kondisi, hasil, id]
  );
  return result;
};

export const deleteAturan = async (id) => {
  const [result] = await pool.query('DELETE FROM aturan WHERE id_aturan=?', [id]);
  return result;
};
