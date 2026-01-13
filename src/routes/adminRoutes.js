// src/routes/adminRoutes.js
import express from 'express';
import {
  // loginAdmin,     
  requestLoginOTP, 
  verifyLoginOTP,
  magicLogin,
  registerAdmin,
  getAllAdminList,
  getAllAdmin,
  deleteAdmin,
  getProfile,
  updatePassword,
  updatePasswordById,
  updateAdmin,
  updateProfil
} from '../controllers/adminController.js';
import { verifyToken, verifyTokenOptional } from '../middleware/authMiddleware.js';
import { onlyAdmin } from '../middleware/roleMiddlewareArsip.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// --- Auth routes ---
router.get('/', verifyToken, getAllAdminList); // ✅ tambahkan ini
// router.post('/login', loginAdmin);
// router.post('/register', verifyTokenOptional, registerAdmin); // ⬅️ pakai middleware opsional
router.post('/login-request', requestLoginOTP); // Input Email -> Kirim Email
router.post('/login-verify', verifyLoginOTP);   // Input Email + OTP -> Dapat Token

// ✅ Route baru untuk Magic Link (GET karena diklik di browser)
router.get('/magic-login', magicLogin);

// --- Admin-only routes ---
//router.get('/admin', verifyToken, onlyAdmin, getAllAdmin)
router.get('/list', verifyToken, onlyAdmin, getAllAdminList);
router.delete('/delete/:id', verifyToken, deleteAdmin);
router.get('/profile', verifyToken, getProfile);
router.put('/update-password', verifyToken, updatePassword);
router.put('/update-password/:id', verifyToken, updatePasswordById);
router.put('/update/:id', verifyToken, updateAdmin);
router.put('/update-profil', verifyToken, upload.single('foto'), updateProfil);

export default router;
