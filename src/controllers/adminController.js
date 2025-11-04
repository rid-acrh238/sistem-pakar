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
  getAdminById
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
  const { username, email, password, nama_lengkap, role } = req.body;
  if (!username || !email || !password || !nama_lengkap)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  try {
    const existing = await findUserByIdentifier(username);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const requesterRole = req.user?.role || null;
    const finalRole =
      requesterRole === 'super-admin' ? role || 'admin' : 'admin';

    await insertUser(username, email, hashedPassword, nama_lengkap, finalRole);

    res.status(201).json({
      message:
        requesterRole === 'super-admin'
          ? `Admin baru berhasil ditambahkan (${finalRole})`
          : 'Akun admin berhasil didaftarkan. Silakan login.',
    });
  } catch (error) {
    console.error('🔥 Register error:', error.message);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// === LOGIN ===
export const loginAdmin = async (req, res) => {
  const { identifier, username, email, password, role } = req.body;
  const userIdentifier = identifier || username || email;
  if (!userIdentifier || !password)
    return res.status(400).json({ message: 'Masukkan username/email dan password' });

  try {
    const results = await findUserByIdentifier(identifier);
    if (results.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah' });
    if (role && user.role !== role)
      return res.status(403).json({ message: 'Role tidak sesuai dengan akun Anda' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const { token, refreshToken } = generateTokens(payload);

    res.status(200).json({
      message: 'Login berhasil',
      token,
      refreshToken,
      admin: user.nama_lengkap,
      role: user.role,
    });
  } catch (err) {
    console.error('🔥 Login error:', err.message);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// === PROFILE ===
export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = rows[0];
    res.status(200).json({
      message: 'Profil ditemukan',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('🔥 Profile error:', err.message);
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

// === GET ALL ADMINS ===
export const getAllAdminList = async (req, res) => {
  try {
    const rows = await getAllAdmins();
    res.status(200).json(rows);
  } catch (err) {
    console.error('🔥 getAllAdminList error:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

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
      'SELECT id, username, nama_lengkap, role, created_at FROM users'
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