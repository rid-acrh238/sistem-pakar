import { pool } from '../config/db.js';

import { forwardChaining } from '../../utils/fowardChaining.js';
import { getAllGejala, insertHasilDiagnosis, getAllHasilDiagnosis, deleteHasilDiagnosisById } from '../models/diagnosisModel.js';
import { findUserByEmail, insertUser } from '../models/penggunaModel.js';

export const getGejalaDiagnosis = async (req, res) => {
  try {
    const rows = await getAllGejala();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data gejala' });
  }
};

// === PROSES DIAGNOSIS PUBLIK ===
export const prosesDiagnosis = async (req, res) => {
  try {
    const { nama_pasien, email, total_skor, kategori } = req.body;

    if (!nama_pasien || !kategori) {
      return res.status(400).json({ message: 'Data tidak lengkap.' });
    }

    await pool.query(
      'INSERT INTO hasil_diagnosa (nama_pasien, email, hasil_penyakit, persentase) VALUES (?, ?, ?, ?)',
      [nama_pasien, email || null, kategori, total_skor]
    );

    res.status(200).json({ message: 'Hasil diagnosa berhasil disimpan.' });
  } catch (err) {
    console.error('🔥 prosesDiagnosis error:', err.message);
    res.status(500).json({ message: 'Kesalahan server.' });
  }
};

export const getHasilDiagnosis = async (req, res) => {
  try {
    const rows = await getAllHasilDiagnosis();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data hasil diagnosa' });
  }
};

export const deleteHasilDiagnosis = async (req, res) => {
  try {
    const result = await deleteHasilDiagnosisById(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Data hasil diagnosa tidak ditemukan' });
    res.status(200).json({ message: 'Data hasil diagnosa berhasil dihapus' });
  } catch (err) {
    console.error('🔥 deleteHasilDiagnosis error:', err.message);
    res.status(500).json({ message: 'Gagal menghapus hasil diagnosa' });
  }
};

