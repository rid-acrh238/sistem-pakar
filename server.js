import chalk from 'chalk';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


import adminRoutes from './src/routes/adminRoutes.js';
import diagnosisRoutes from './src/routes/diagnosisRoutes.js';
import gejalaRoutes from './src/routes/gejalaRoutes.js';
import penyakitRoutes from './src/routes/penyakitRoutes.js'
import aturanRoutes from './src/routes/aturanRoutes.js';
import laporanRoutes from './src/routes/laporanRoutes.js';
import { verifyToken } from './src/middleware/authMiddleware.js';
import publicRoutes from './src/routes/publicRoutes.js';  // tambahkan ini di atas

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE DASAR ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === LOGGER (warna-warni) ===
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

// === HELPER PATH ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === ROUTE API ===
app.use('/api/public', publicRoutes);
console.log(chalk.magentaBright('🧩 Route /api/public loaded'));

app.use('/api/admin', adminRoutes);
console.log(chalk.magentaBright('🧩 Route /api/admin loaded'));

app.use('/api/gejala', gejalaRoutes);
console.log(chalk.magentaBright('🧩 Route /api/gejala loaded'));

app.use('/api/penyakit', penyakitRoutes);
console.log(chalk.magentaBright('🧩 Route /api/gejala loaded'));

app.use('/api/diagnosis', diagnosisRoutes);
console.log(chalk.magentaBright('🧩 Route /api/diagnosis loaded'));

app.use('/api/aturan', aturanRoutes);
console.log(chalk.magentaBright('🧩 Route /api/aturan loaded'));

app.use('/api/laporan', laporanRoutes);
console.log(chalk.magentaBright('🧩 Route /api/laporan loaded'));

app.use(express.static('public'));

// === ERROR HANDLER UMUM ===
app.use((err, req, res, next) => {
    console.error(chalk.redBright('🔥 ERROR:'), err.message);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
});

// === FILE FRONTEND (STATIC) ===
app.use(express.static(path.join(__dirname, 'public')));

// === ROUTE AUTH ===
app.get('/auth/login', (_, res) =>
  res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'))
);
app.get('/auth/register', (_, res) =>
  res.sendFile(path.join(__dirname, 'public', 'auth', 'register.html'))
);

// === ROUTE DASHBOARD (HANYA SATU FILE SPA) ===
app.get('/dashboard', verifyToken, (_, res) =>
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'dashboard.html'))
);

// === DEFAULT ROOT ===
app.get('/', (_, res) => {
  res.redirect('/auth/login.html');
});


// === START SERVER ===
app.listen(PORT, () => {
    console.log(chalk.greenBright(`🚀 SP Depresi berjalan di http://localhost:${PORT}`));
});

// import chalk from "chalk";
// import morgan from "morgan";
// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import adminRoutes from "./src/routes/adminRoutes.js";
// import diagnosisRoutes from "./src/routes/diagnosisRoutes.js";
// import gejalaRoutes from "./src/routes/gejalaRoutes.js";
// import aturanRoutes from "./src/routes/aturanRoutes.js"

// const app = express();
// const PORT = 3000;

// // Middleware dasar
// app.use(cors());
// app.use(express.json());

// const statusEmoji = (status) => {
//   if (status >= 500) return "🔥";
//   if (status >= 400) return "⚠️";
//   if (status >= 300) return "🔁";
//   if (status >= 200) return "✅";
//   return "🚀";
// };

// // ✅ Tambahan logger warna-warni
// app.use(
//   morgan(function (tokens, req, res) {
//     return [
//       chalk.gray(`[${new Date().toLocaleTimeString("id-ID")}]`),
//       chalk.cyan(tokens.method(req, res)),
//       chalk.yellow(tokens.url(req, res)),
//       chalk.green(tokens.status(req, res)),
//       chalk.white(tokens["response-time"](req, res) + " ms")
//     ].join(" ");
//   })
// );

// // Helper path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // === ROUTE API ===
// app.use("/api/admin", adminRoutes);
// console.log(chalk.magentaBright("🧩 Route /api/admin loaded"));

// app.use("/api/gejala", gejalaRoutes);
// console.log(chalk.magentaBright("🧩 Route /api/gejala loaded"));

// app.use("/api/diagnosis", diagnosisRoutes);
// console.log(chalk.magentaBright("🧩 Route /api/diagnosis loaded"));

// app.use("/api/aturan", aturanRoutes);
// console.log(chalk.magentaBright("🧩 Route /api/aturan loaded"))

// app.use((err, req, res, next) => {
//   console.error(chalk.redBright("🔥 ERROR:"), err.message);
//   res.status(500).json({ message: "Terjadi kesalahan server." });
// });

// // === FILE FRONTEND ===
// app.use(express.static(path.join(__dirname, "public")));

// // Route Auth (Login/Register)
// app.get("/login", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "auth", "login.html"))
// );
// app.get("/register", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "auth", "register.html"))
// );

// // Route Dashboard
// app.get("/dashboard", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "dashboard", "dashboard.html"))
// );
// app.get("/dashboard/gejala", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "dashboard", "gejala.html"))
// );
// app.get("/dashboard/aturan", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "dashboard", "aturan.html"))
// );
// app.get("/dashboard/laporan", (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "dashboard", "laporan.html"))
// );

// // === FALLBACK UNTUK NON-API ROUTE ===
// app.get(/^(?!\/api).*/, (_, res) =>
//   res.sendFile(path.join(__dirname, "public", "auth", "login.html"))
// );

// //app.use("/api/gejala", gejalaRoutes);

// // === START SERVER ===
// app.listen(PORT, () =>
//   console.log(chalk.greenBright(`🚀 SP Depresi berjalan di http://localhost:${PORT}`))
// );
