import express from 'express';
import {
    getGejala,
    getGejalaDetail,
    createGejala,
    updateGejalaData,
    deleteGejalaData,
} from '../controllers/gejalaController.js';

const router = express.Router();

router.get('/', getGejala);
router.get('/:id', getGejalaDetail);
router.post('/', createGejala);
router.put('/:id', updateGejalaData);
router.delete('/:id', deleteGejalaData);

export default router;
