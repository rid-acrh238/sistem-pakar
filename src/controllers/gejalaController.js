import { pool } from '../config/db.js';

import {
  getAllGejala,
  getGejalaById,
  insertGejala,
  updateGejala,
  deleteGejala
} from '../models/gejalaModel.js';

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
  const { nama_gejala } = req.body;
  if (!nama_gejala)
    return res.status(400).json({ message: 'Nama gejala wajib diisi' });

  try {
    const insert = await insertGejala(nama_gejala);

    res.status(201).json({
      id_gejala: insert.insertId,
      kode_gejala: insert.kode_gejala,
      nama_gejala,
    });
  } catch (err) {
    console.error(err);
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


// import { pool } from '../config/db.js';

// import { getAllGejala, getGejalaById, insertGejala, updateGejala, deleteGejala } from '../models/gejalaModel.js';

// export const getGejala = async (req, res) => {
//   try {
//     const rows = await getAllGejala();
//     res.status(200).json(rows);
//   } catch (err) {
//     console.error('🔥 getGejala error:', err.message);
//     res.status(500).json({ message: 'Gagal mengambil data gejala' });
//   }
// };

// export const getGejalaDetail = async (req, res) => {
//   try {
//     const row = await getGejalaById(req.params.id);
//     if (!row) return res.status(404).json({ message: 'Gejala tidak ditemukan' });
//     res.status(200).json(row);
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil gejala' });
//   }
// };

// export const createGejala = async (req, res) => {
//   const { nama_gejala } = req.body;
//   if (!nama_gejala)
//     return res.status(400).json({ message: 'Nama gejala wajib diisi' });

//   try {
//     // Ambil ID terakhir
//     const [rows] = await pool.query(`SELECT MAX(id_gejala) AS maxId FROM gejala`);
//     const nextId = (rows[0].maxId || 0) + 1;

//     // Generate kode gejala otomatis
//     const kode_gejala = `C${String(nextId)}`;

//     const result = await insertGejala({ kode_gejala, nama_gejala });

//     res.status(201).json({
//       id_gejala: result.insertId,
//       kode_gejala,
//       nama_gejala
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Gagal menambahkan gejala' });
//   }
// };


// export const updateGejalaData = async (req, res) => {
//   try {
//     await updateGejala(req.params.id, req.body);
//     res.json({ message: 'Gejala berhasil diperbarui' });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal memperbarui gejala' });
//   }
// };

// export const deleteGejalaData = async (req, res) => {
//   try {
//     await deleteGejala(req.params.id);
//     res.json({ message: 'Gejala berhasil dihapus' });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal menghapus gejala' });
//   }
// };
