import express from 'express';
import { getAllLaporan, getLaporanByTanggal } from '../controllers/laporanController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { onlyAdmin } from '../middleware/roleMiddlewareArsip.js';

const router = express.Router();

// Semua endpoint laporan hanya bisa diakses oleh admin yang sudah login
router.get('/', verifyToken, getAllLaporan);
router.get('/filter', verifyToken, getLaporanByTanggal);

export default router;

// import db from "../config/db.js";
// import express from "express";

// const router = express.Router();

// // ambil semua hasil diagnosis untuk laporan admin
// router.get("/", (req, res) => {
//   db.pool("SELECT * FROM hasil_diagnosa_diagnosa ORDER BY tanggal DESC", (err, results) => {
//     if (err) return res.status(500).json({ message: "Gagal memuat laporan" });
//     res.json(results);
//   });
// });

// export default router;
