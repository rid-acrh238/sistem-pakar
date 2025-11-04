import { pool } from '../config/db.js';
import { getAllAturan, getAturanById, insertAturan, updateAturan, deleteAturan } from '../models/aturanModels.js';

export const getAturanList = async (req, res) => {
  try {
    const rows = await getAllAturan();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data aturan' });
  }
};

export const getAturanDetail = async (req, res) => {
  try {
    const rows = await getAturanById(req.params.id);
    if (!rows) return res.status(404).json({ message: 'Aturan tidak ditemukan' });
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil aturan' });
  }
};

export const createAturan = async (req, res) => {
  const { kondisi, hasil } = req.body;
  if (!kondisi || !hasil) return res.status(400).json({ message: 'Kondisi dan hasil wajib diisi' });

  try {
    const result = await insertAturan(kondisi, hasil);
    res.status(201).json({ id_aturan: result.insertId, kondisi, hasil });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan aturan' });
  }
};

export const updateAturanData = async (req, res) => {
  const { id } = req.params;
  const { kondisi, hasil } = req.body;
  try {
    await updateAturan(id, kondisi, hasil);
    res.json({ message: 'Aturan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui aturan' });
  }
};

export const deleteAturanData = async (req, res) => {
  try {
    await deleteAturan(req.params.id);
    res.json({ message: 'Aturan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus aturan' });
  }
};
