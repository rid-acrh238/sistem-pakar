import express from 'express';
import {
  getGejalaDiagnosis,
  submitDiagnosis,
  getHasilDiagnosis,
  deleteHasilDiagnosis,
  getHistory
} from '../controllers/diagnosisController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/gejala', getGejalaDiagnosis);
router.post('/submit', submitDiagnosis);
router.get('/hasil', getHasilDiagnosis);
router.delete('/hasil/:id', verifyToken, deleteHasilDiagnosis);
router.get('/hasil', getHistory);



// tambahan endpoint untuk laporan dashboard
router.get('/hasil', (req, res) => {
    db.pool('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC', (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil hasil' });
        res.json(results);
    });
});

export default router;


// import express from 'express';
// import { getGejalaDiagnosis, prosesDiagnosis, getHasilDiagnosis } from '../controllers/diagnosisController.js';

// const router = express.Router();

// router.get('/gejala', getGejalaDiagnosis);
// router.post('/diagnosis', prosesDiagnosis);
// router.get('/hasil', getHasilDiagnosis); // ✅ tambahkan ini

// // tambahan endpoint untuk laporan dashboard
// router.get('/hasil', (req, res) => {
//     db.pool('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC', (err, results) => {
//         if (err) return res.status(500).json({ message: 'Gagal mengambil hasil' });
//         res.json(results);
//     });
// });

// export default router;
