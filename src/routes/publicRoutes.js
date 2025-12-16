import express from 'express';
import { submitDiagnosis } from '../controllers/diagnosisController.js';

const router = express.Router();

// === Endpoint publik untuk pengguna tanpa login ===
router.post('/submit', submitDiagnosis);

export default router;
