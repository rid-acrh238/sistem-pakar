// ✅ src/controllers/laporanController.js
import { pool } from '../config/db.js';
import { getAllHasilDiagnosa, getHasilByTanggal } from '../models/laporanModel.js';

export const getAllLaporan = async (req, res) => {
  try {
    const rows = await getAllHasilDiagnosa();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat data laporan' });
  }
};

export const getLaporanByTanggal = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to)
    return res.status(400).json({ message: 'Parameter tanggal tidak lengkap' });

  try {
    const rows = await getHasilByTanggal(from, to);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat laporan berdasarkan tanggal' });
  }
};
