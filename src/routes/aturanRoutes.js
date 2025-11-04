import express from 'express';
import {
    getAturanList,
    getAturanDetail,
    createAturan,
    updateAturanData,
    deleteAturanData,
} from '../controllers/aturanController.js';

const router = express.Router();

router.get('/', getAturanList);
router.get('/:id', getAturanDetail);
router.post('/', createAturan);
router.put('/:id', updateAturanData);
router.delete('/:id', deleteAturanData);

export default router;
