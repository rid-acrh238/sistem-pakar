import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Tambahan untuk cek folder

// Import Routes
import adminRoutes from './routes/adminRoutes.js';
import aturanRoutes from './routes/aturanRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import gejalaRoutes from './routes/gejalaRoutes.js';
import laporanRoutes from './routes/laporanRoutes.js';

const app = express();

// --- Setup Path (Jurus Pamungkas) ---
// process.cwd() = C:\xampp\htdocs\sistem-pakar-nodejs
const rootPath = process.cwd(); 
const uploadsPath = path.join(rootPath, 'uploads');
const publicPath = path.join(rootPath, 'public');

// --- Debugging Wajib (Cek Terminal Nanti) ---
console.log('==================================================');
console.log('🔍 DEBUG PATH SERVER');
console.log('👉 Root Project :', rootPath);
console.log('👉 Folder Uploads :', uploadsPath);
console.log('👉 Cek Folder Ada? :', fs.existsSync(uploadsPath) ? '✅ ADA' : '❌ TIDAK ADA (Buat folder uploads sekarang!)');
console.log('==================================================');

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Static Files ---
// 1. Buka folder uploads (Penting!)
app.use('/uploads', express.static(uploadsPath));

// 2. Buka folder public (css/js/dashboard)
app.use(express.static(publicPath));

// --- Routes API ---
app.use('/api/admin', adminRoutes);
app.use('/api/aturan', aturanRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/gejala', gejalaRoutes);
app.use('/api/laporan', laporanRoutes);

// --- Fallback Route (Untuk SPA) ---
app.get(/^(?!\/api).*/, (_, res) => {
    // Pastikan path ke dashboard.html benar
    res.sendFile(path.join(publicPath, 'dashboard', 'dashboard.html'));
});

export default app;


// import db from './config/db.js';
// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import adminRoutes from './routes/adminRoutes.js';
// import aturanRoutes from './routes/aturanRoutes.js';
// import diagnosisRoutes from './routes/diagnosisRoutes.js';
// import gejalaRoutes from './routes/gejalaRoutes.js';
// import laporanRoutes from './routes/laporanRoutes.js';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const uploadsPath = path.join(__dirname, '../uploads');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '../public')));
// app.use('/uploads', express.static(uploadsPath));

// app.use('/api/admin', adminRoutes);
// app.use('/api/aturan', aturanRoutes);
// app.use('/api/diagnosis', diagnosisRoutes);
// app.use('/api/gejala', gejalaRoutes);
// app.use('/api/laporan', laporanRoutes);
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // 2. Debugging: Cek di terminal, apakah path ini sudah benar mengarah ke root project?
// console.log('📂 Folder Uploads diset ke:', uploadsPath);

// // 3. Daftarkan folder tersebut
// app.use('/uploads', express.static(uploadsPath));

// // ==========================================

// app.get(/^(?!\/api).*/, (_, res) =>
//     res.sendFile(path.join(__dirname, '../public/dashboard/dashboard.html'))
// );

// export default app;
