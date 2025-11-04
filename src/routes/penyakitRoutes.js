import express from 'express';
import {
  getPenyakitList,
  getPenyakitDetail,
  addPenyakit,
  editPenyakit,
  removePenyakit
} from '../controllers/penyakitController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getPenyakitList);
router.get('/:id', verifyToken, getPenyakitDetail);
router.post('/', verifyToken, addPenyakit);
router.put('/:id', verifyToken, editPenyakit);
router.delete('/:id', verifyToken, removePenyakit);

export default router;
