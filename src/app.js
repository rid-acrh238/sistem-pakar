import db from './config/db.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from './routes/adminRoutes.js';
import aturanRoutes from './routes/aturanRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import gejalaRoutes from './routes/gejalaRoutes.js';
import laporanRoutes from './routes/laporanRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/admin', adminRoutes);
app.use('/api/aturan', aturanRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/gejala', gejalaRoutes);
app.use('/api/laporan', laporanRoutes);

app.get(/^(?!\/api).*/, (_, res) =>
    res.sendFile(path.join(__dirname, '../public/dashboard/dashboard.html'))
);

export default app;
