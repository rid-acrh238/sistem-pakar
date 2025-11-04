import { pool } from '../config/db.js';

import { getAllGejala, getGejalaById, insertGejala, updateGejala, deleteGejala } from '../models/gejalaModel.js';

export const getGejala = async (req, res) => {
  try {
    const rows = await getAllGejala();
    res.status(200).json(rows);
  } catch (err) {
    console.error('🔥 getGejala error:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data gejala' });
  }
};

export const getGejalaDetail = async (req, res) => {
  try {
    const row = await getGejalaById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Gejala tidak ditemukan' });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil gejala' });
  }
};

export const createGejala = async (req, res) => {
  const { kode_gejala, nama_gejala } = req.body;
  if (!kode_gejala || !nama_gejala)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  try {
    const result = await insertGejala({ kode_gejala, nama_gejala });
    res.status(201).json({ id_gejala: result.insertId, kode_gejala, nama_gejala });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan gejala' });
  }
};

export const updateGejalaData = async (req, res) => {
  try {
    await updateGejala(req.params.id, req.body);
    res.json({ message: 'Gejala berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui gejala' });
  }
};

export const deleteGejalaData = async (req, res) => {
  try {
    await deleteGejala(req.params.id);
    res.json({ message: 'Gejala berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus gejala' });
  }
};
