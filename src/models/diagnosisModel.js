import { pool } from '../config/db.js';

export const getAllGejala = async () => {
  const [rows] = await pool.query('SELECT * FROM gejala');
  return rows;
};

export const insertHasilDiagnosis = async (ide_pengguna, nama_pasien, hasil_penyakit, persentase) => {
  const [result] = await pool.query(
    'INSERT INTO hasil_diagnosa (nama_pasien, hasil_penyakit, persentase) VALUES (?, ?, ?)',
    [ide_pengguna, nama_pasien, hasil_penyakit, persentase]
  );
  return result;
};

export const getAllHasilDiagnosis = async () => {
  const [rows] = await pool.query('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC');
  return rows;
};

export const deleteHasilDiagnosisById = async (id) => {
  const [result] = await pool.query('DELETE FROM hasil_diagnosa WHERE id = ?', [id]);
  return result;
};
