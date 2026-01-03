import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  findUserByIdentifier,
  insertUser,
  getAllAdmins,
  deleteAdminById,
  updateAdminById,
  getAdminById,
  updateUserDynamic
} from '../models/adminModel.js';

dotenv.config();

// === Helper: Generate access & refresh tokens ===
function generateTokens(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { token, refreshToken };
}

// === REFRESH TOKEN ===
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token tidak ditemukan' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    console.error('❌ Refresh token error:', err.message);
    res.status(403).json({ message: 'Refresh token tidak valid atau kadaluarsa' });
  }
};

// === REGISTER (async/await style) ===
export const registerAdmin = async (req, res) => {
  const { username, email, password, nama_lengkap } = req.body;
  if (!username || !email || !password || !nama_lengkap)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  try {
    const existing = await findUserByIdentifier(username);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const requesterRole = req.user?.role || null;
    const finalRole = 'admin';

    await insertUser(username, email, hashedPassword, nama_lengkap, finalRole);

    res.status(201).json({
      message:
        requesterRole === 'admin'
          ? `Admin baru berhasil ditambahkan (${finalRole})`
          : 'Akun admin berhasil didaftarkan. Silakan login.',
    });
  } catch (error) {
    console.error('🔥 Register error:', error.message);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// === LOGIN ===
// ✅ src/controllers/adminController.js

// ... import pool dan model di atas ...

// 1️⃣ UPDATE BAGIAN LOGIN (Supaya frontend tau foto pas login)
export const loginAdmin = async (req, res) => {
  const { identifier, username, email, password } = req.body;
  const userIdentifier = identifier || username || email;
  if (!userIdentifier || !password)
    return res.status(400).json({ message: 'Masukkan username/email dan password' });

  try {
    const results = await findUserByIdentifier(userIdentifier);
    if (results.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah' });

    const payload = { id: user.id, username: user.username, role: 'admin' };
    const { token, refreshToken } = generateTokens(payload);

    res.status(200).json({
      message: 'Login berhasil',
      token,
      refreshToken,
      // ✅ Kirim object user lengkap biar frontend bisa langsung render avatar
      user: {
          nama_lengkap: user.nama_lengkap,
          foto_profil: user.foto_profil, // <--- PENTING
          username: user.username
      }
    });
  } catch (err) {
    console.error('🔥 Login error:', err.message);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// 2️⃣ UPDATE BAGIAN LIST ADMIN (Kelola Admin)
// Hapus kebingungan antara getAllAdminList dan getAllAdmin. Pakai satu ini saja:
export const getAllAdminList = async (req, res) => {
  try {
    // Query langsung di sini biar aman & pasti kolomnya benar
    const [rows] = await pool.query(
      "SELECT id, username, email, nama_lengkap, role, created_at, foto_profil FROM users WHERE role IN ('admin', 'super-admin')"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('🔥 getAllAdminList error:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

// 3️⃣ UPDATE BAGIAN UPDATE PROFIL (Pastikan ID diambil dari Token)
export const updateProfil = async (req, res) => {
    try {
        // Ambil ID dari Token (req.user.id) karena lebih aman
        // req.user ada karena kita sudah pasang verifyToken di route
        const id = req.user?.id; 
        
        if (!id) return res.status(401).json({ message: 'Unauthorized' });

        const { nama_lengkap, email } = req.body;
        let dataToUpdate = {};

        if (nama_lengkap) dataToUpdate.nama_lengkap = nama_lengkap;
        if (email) dataToUpdate.email = email;

        // Cek file foto
        if (req.file) {
            console.log("✅ Foto baru diterima:", req.file.path);
            dataToUpdate.foto_profil = req.file.path;
        }

        // Update DB
        const result = await updateUserDynamic(id, dataToUpdate);

        if (result) {
            res.status(200).json({ 
                success: true, 
                message: 'Profil berhasil diperbarui',
                // Kirim balik nama file baru biar frontend bisa update tampilan langsung
                foto_baru: dataToUpdate.foto_profil 
            });
        } else {
            res.status(400).json({ success: false, message: 'Gagal update database' });
        }

    } catch (error) {
        console.error("🔥 Error Update Profil:", error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

// ... sisa fungsi lain (delete, register, dll) biarkan saja ...

// === DELETE ADMIN ===
export const deleteAdmin = async (req, res) => {
  try {
    const result = await deleteAdminById(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    res.status(200).json({ message: 'Admin berhasil dihapus' });
  } catch (err) {
    console.error('🔥 deleteAdmin error:', err.message);
    res.status(500).json({ message: 'Gagal menghapus admin' });
  }
};

// === GET ALL ADMIN (for dashboard) ===
export const getAllAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, nama_lengkap, role, created_at, foto_profil FROM users'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ DB error (getAllAdmin):', err.message);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: 'Isi password lama dan baru' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Password lama salah' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.status(200).json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error('🔥 Update password error:', err.message);
    res.status(500).json({ message: 'Gagal memperbarui password' });
  }
};

export const updatePasswordById = async (req, res) => {
  const { newPassword } = req.body;
  const targetId = req.params.id;

  if (!newPassword)
    return res.status(400).json({ message: 'Password baru wajib diisi' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [targetId]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, targetId]);

    res.status(200).json({ message: `Password user ID ${targetId} berhasil diperbarui` });
  } catch (err) {
    console.error('🔥 updatePasswordById error:', err.message);
    res.status(500).json({ message: 'Gagal memperbarui password' });
  }
};
// === UPDATE ADMIN (nama & email) ===
export const updateAdmin = async (req, res) => {
  const { nama_lengkap, email } = req.body;
  const { id } = req.params;

  if (!nama_lengkap || !email) {
    return res.status(400).json({ message: 'Nama lengkap dan email wajib diisi' });
  }

  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin)
      return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const result = await updateAdminById(id, nama_lengkap, email);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Gagal memperbarui admin' });

    res.status(200).json({ message: 'Data admin berhasil diperbarui' });
  } catch (err) {
    console.error('🔥 updateAdmin error:', err.message);
    res.status(500).json({ message: 'Gagal memperbarui data admin' });
  }
};

// === PROFILE (Tambahkan ini jika hilang) ===
export const getProfile = async (req, res) => {
  try {
    // Kita ambil data user berdasarkan ID dari token (req.user.id)
    const [rows] = await pool.query(
      'SELECT id, username, email, nama_lengkap, role, foto_profil, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = rows[0];

    // Kirim response
    res.status(200).json({
      message: 'Profil ditemukan',
      user: user // Kirim object user lengkap
    });
  } catch (err) {
    console.error('🔥 Profile error:', err.message);
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

// ... import model admin dll

// export const updateProfil = async (req, res) => {
//     try {
//         // Pastikan ID ada. Kalau req.user undefined, script akan stop di catch block.
//         const id = req.user?.id || req.body.id; 
        
//         const { nama_lengkap, email } = req.body;
//         let dataToUpdate = {};

//         // Masukkan data teks jika ada
//         if (nama_lengkap) dataToUpdate.nama_lengkap = nama_lengkap;
//         if (email) dataToUpdate.email = email;

//         // Cek file
//         if (req.file) {
//             console.log("✅ Foto baru diterima:", req.file.filename);
//             dataToUpdate.foto_profil = req.file.filename;
//         } else {
//             console.log("⚠️ Tidak ada foto yang diterima controller.");
//         }

//         // Panggil fungsi model
//         const result = await updateUserDynamic(id, dataToUpdate);

//         // LOGIKA RESPONSE YANG LEBIH BAIK
//         // Jika result ada, kita anggap sukses meskipun affectedRows 0 
//         // (karena affectedRows 0 bisa berarti user klik simpan tanpa ganti apa-apa)
//         if (result) {
//             res.status(200).json({ 
//                 success: true, 
//                 message: 'Profil berhasil diperbarui',
//                 debug_info: {
//                     file_received: !!req.file, // true jika file masuk
//                     affected_rows: result.affectedRows
//                 }
//             });
//         } else {
//             res.status(400).json({ success: false, message: 'Gagal update database' });
//         }

//     } catch (error) {
//         console.error("🔥 Error Update Profil:", error);
//         res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
//     }
// };