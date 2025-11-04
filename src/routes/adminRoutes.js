// src/routes/adminRoutes.js
import express from 'express';
import {
  loginAdmin,
  registerAdmin,
  getAllAdminList,
  getAllAdmin,
  deleteAdmin,
  getProfile,
  updatePassword,
  updatePasswordById,
  updateAdmin
} from '../controllers/adminController.js';
import { verifyToken, verifyTokenOptional } from '../middleware/authMiddleware.js';
import { onlyAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// --- Auth routes ---
router.get('/', verifyToken, getAllAdminList); // ✅ tambahkan ini
router.post('/login', loginAdmin);
router.post('/register', verifyTokenOptional, registerAdmin); // ⬅️ pakai middleware opsional

// --- Admin-only routes ---
router.get('/list', verifyToken, onlyAdmin, getAllAdminList);
router.delete('/delete/:id', verifyToken, deleteAdmin);
router.get('/profile', verifyToken, getProfile);
router.put('/update-password', verifyToken, updatePassword);
router.put('/update-password/:id', verifyToken, updatePasswordById);
router.put('/update/:id', verifyToken, updateAdmin);



export default router;
