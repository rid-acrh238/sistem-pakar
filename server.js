import chalk from 'chalk';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// --- Import Routes (Sesuaikan path ke folder src) ---
import adminRoutes from './src/routes/adminRoutes.js';
import diagnosisRoutes from './src/routes/diagnosisRoutes.js';
import gejalaRoutes from './src/routes/gejalaRoutes.js';
import penyakitRoutes from './src/routes/penyakitRoutes.js';
import aturanRoutes from './src/routes/aturanRoutes.js';
import laporanRoutes from './src/routes/laporanRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';

// --- Konfigurasi Awal ---
dotenv.config();
const app = express();
const PORT = process.env.PORT ||3000;

// --- Setup Path Folder (JURUS PAMUNGKAS) ---
// Kita gunakan process.cwd() agar path selalu benar dari root project
const rootPath = process.cwd();
const uploadsPath = path.join(rootPath, 'uploads');
const publicPath = path.join(rootPath, 'public');

// --- Cek Folder (Debugging) ---
console.log(chalk.blue('=================================================='));
console.log(chalk.yellow('🔍 DEBUG PATH SERVER'));
console.log(`👉 Root Project  : ${chalk.white(rootPath)}`);
console.log(`👉 Folder Uploads: ${chalk.white(uploadsPath)}`);
console.log(`👉 Status Folder : ${fs.existsSync(uploadsPath) ? chalk.green('✅ ADA') : chalk.red('❌ TIDAK ADA (Segera buat folder uploads!)')}`);
console.log(chalk.blue('=================================================='));

// --- Middleware Dasar ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logger Cantik (Morgan + Chalk) ---
app.use(
    morgan(function (tokens, req, res) {
        return [
            chalk.gray(`[${new Date().toLocaleTimeString('id-ID')}]`),
            chalk.cyan(tokens.method(req, res)),
            chalk.yellow(tokens.url(req, res)),
            chalk.green(tokens.status(req, res)),
            chalk.white(tokens['response-time'](req, res) + ' ms'),
        ].join(' ');
    })
);

// ==========================================
// ✅ KONFIGURASI STATIC FILES (PENTING!)
// ==========================================

// 1. Buka akses folder uploads (agar gambar bisa dibuka di browser)
app.use('/uploads', express.static(uploadsPath));

// 2. Buka akses folder public (css, js, html)
app.use(express.static(publicPath));


// ==========================================
// 🔗 ROUTING API
// ==========================================
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/gejala', gejalaRoutes);
app.use('/api/penyakit', penyakitRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/aturan', aturanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use("/api/public/diagnosis", publicRoutes);

// Log status route
console.log(chalk.magentaBright('🧩 Semua Route API Berhasil Dimuat'));


// ==========================================
// 🌐 HALAMAN & FALLBACK
// ==========================================

// Route spesifik Auth
app.get('/auth/login', (_, res) =>
    res.sendFile(path.join(publicPath, 'auth', 'login.html'))
);
app.get('/auth/register', (_, res) =>
    res.sendFile(path.join(publicPath, 'auth', 'register.html'))
);

// Fallback Route:
// Jika user membuka halaman selain API (misal /dashboard, /profil),
// kirimkan file dashboard.html (SPA logic)
app.get(/^(?!\/api).*/, (_, res) => {
    res.sendFile(path.join(publicPath, 'dashboard', 'dashboard.html'));
});

// Error Handler Global
app.use((err, req, res, next) => {
    console.error(chalk.redBright('🔥 ERROR SERVER:'), err.message);
    res.status(500).json({ message: 'Terjadi kesalahan internal server.' });
});

// === START SERVER ===
app.listen(PORT, '0.0.0.0', () => {
    console.log(chalk.greenBright(`🚀 Server Berjalan di http://localhost:${PORT}`));
    console.log(chalk.cyanBright(`📁 Menggunakan satu file server.js (Terpusat)`));
});


