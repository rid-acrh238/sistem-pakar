import express from 'express';
import { prosesDiagnosis } from '../controllers/diagnosisController.js';

const router = express.Router();

// === Endpoint publik untuk pengguna tanpa login ===
router.post('/diagnosis', prosesDiagnosis);

export default router;
