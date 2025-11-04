import {
  getAllPenyakit,
  getPenyakitById,
  createPenyakit,
  updatePenyakit,
  deletePenyakit
} from '../models/penyakitModel.js';

// GET all
export const getPenyakitList = async (req, res) => {
  try {
    const rows = await getAllPenyakit();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data penyakit' });
  }
};

// GET detail by ID
export const getPenyakitDetail = async (req, res) => {
  try {
    const row = await getPenyakitById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail penyakit' });
  }
};

// CREATE new penyakit
export const addPenyakit = async (req, res) => {
  const { kode_penyakit, nama_penyakit, deskripsi } = req.body;
  if (!kode_penyakit || !nama_penyakit)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  try {
    const result = await createPenyakit(kode_penyakit, nama_penyakit, deskripsi);
    res.status(201).json({ message: 'Penyakit berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan penyakit' });
  }
};

// UPDATE penyakit
export const editPenyakit = async (req, res) => {
  const { kode_penyakit, nama_penyakit, deskripsi } = req.body;
  try {
    const result = await updatePenyakit(
      req.params.id,
      kode_penyakit,
      nama_penyakit,
      deskripsi
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    res.status(200).json({ message: 'Penyakit berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui penyakit' });
  }
};

// DELETE penyakit
export const removePenyakit = async (req, res) => {
  try {
    const result = await deletePenyakit(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Penyakit tidak ditemukan' });
    res.status(200).json({ message: 'Penyakit berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus penyakit' });
  }
};
