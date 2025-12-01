import { pool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';

// Pastikan folder logs ada
const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = path.join(logDir, 'seed.log');

// Fungsi bantu untuk log ke file dan console
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, fullMessage);
    console.log(message);
}

async function seedDatabase() {
    try {
        logMessage('🚀 Memulai seeding database (non-destruktif, auto-update, dengan logging)...');

        // --- 1. DATA GEJALA (Depresi, Kecemasan, Burnout) ---
        // Format: [Kode, Nama Gejala]
        // Kode D = Depresi, A = Anxiety (Cemas), B = Burnout
        const gejalaData = [
            // Depresi (Major Depressive Disorder)
            ['D01', 'Mood depresi / sedih hampir sepanjang hari'],
            ['D02', 'Kehilangan minat atau kesenangan (anhedonia)'],
            ['D03', 'Perubahan berat badan atau nafsu makan yang signifikan'],
            ['D04', 'Gangguan tidur (Insomnia atau Hipersomnia)'],
            ['D05', 'Agitasi atau retardasi psikomotor (gelisah/lamban)'],
            ['D06', 'Kelelahan atau kehilangan energi'],
            ['D07', 'Perasaan tidak berharga atau rasa bersalah berlebihan'],
            ['D08', 'Sulit berkonsentrasi atau keragu-raguan'],
            ['D09', 'Pikiran berulang tentang kematian atau bunuh diri'],

            // Kecemasan (Generalized Anxiety Disorder)
            ['A01', 'Kecemasan dan kekhawatiran berlebihan (6 bulan terakhir)'],
            ['A02', 'Sulit mengendalikan kekhawatiran'],
            ['A03', 'Gelisah atau merasa tegang (keyed up)'],
            ['A04', 'Mudah lelah (terkait cemas)'],
            ['A05', 'Sulit konsentrasi atau pikiran menjadi kosong'],
            ['A06', 'Iritabilitas (mudah tersinggung/marah)'],
            ['A07', 'Ketegangan otot'],
            ['A08', 'Gangguan tidur (sulit tidur/gelisah)'],

            // Burnout (Occupational Phenomenon)
            ['B01', 'Kelelahan emosional atau merasa terkuras energinya'],
            ['B02', 'Depersonalisasi, sinisme, atau jarak mental dari pekerjaan'],
            ['B03', 'Penurunan pencapaian pribadi atau rasa tidak efektif bekerja']
        ];

        logMessage(`📋 Memproses ${gejalaData.length} data gejala...`);

        for (const [kode, nama] of gejalaData) {
            // Cek apakah gejala sudah ada
            const [rows] = await pool.query(
                'SELECT id_gejala, nama_gejala FROM gejala WHERE kode_gejala = ?',
                [kode]
            );

            if (rows.length === 0) {
                // INSERT jika belum ada
                await pool.query('INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)', [
                    kode,
                    nama,
                ]);
                logMessage(`   ✅ Gejala BARU: [${kode}] ${nama}`);
            } else if (rows[0].nama_gejala !== nama) {
                // UPDATE jika nama gejala berubah (misal ada perbaikan teks)
                await pool.query('UPDATE gejala SET nama_gejala = ? WHERE kode_gejala = ?', [
                    nama,
                    kode,
                ]);
                logMessage(`   🔄 Gejala UPDATE: [${kode}] ${nama}`);
            } else {
                // SKIP jika sama persis
                // logMessage(`   ⚙️  Gejala [${kode}] sudah sesuai.`);
            }
        }


        // --- 2. DATA ATURAN (RULES) ---
        // Aturan ini untuk kasus "Red Flag" atau kondisi pasti yang langsung bisa didiagnosa
        // Kasus kompleks lainnya ditangani oleh evaluasiDinamis di forwardChaining.js
        const aturanData = [
            // Rule Bahaya (Prioritas Tinggi)
            ['D09', 'BAHAYA: Risiko Bunuh Diri. Segera hubungi profesional.'],

            // Rule Depresi Berat (Jika semua gejala muncul)
            ['D01,D02,D03,D04,D05,D06,D07,D08', 'Depresi Mayor: Sangat Berat (Segera cari bantuan medis)'],

            // Rule Kecemasan Murni (Gejala inti terpenuhi)
            ['A01,A02', 'Indikasi Gangguan Kecemasan Umum (GAD)'],

            // Rule Burnout Murni
            ['B01,B02,B03', 'Burnout (Sindrom Stres Akibat Pekerjaan)']
        ];

        logMessage(`📋 Memproses ${aturanData.length} aturan diagnosa...`);

        for (const [kondisi, hasil] of aturanData) {
            // Cek apakah aturan dengan kondisi tersebut sudah ada
            const [rows] = await pool.query(
                'SELECT id_aturan, hasil FROM aturan WHERE kondisi = ?',
                [kondisi]
            );

            if (rows.length === 0) {
                await pool.query('INSERT INTO aturan (kondisi, hasil) VALUES (?, ?)', [
                    kondisi,
                    hasil,
                ]);
                logMessage(`   ✅ Aturan BARU: [${kondisi}] -> ${hasil}`);
            } else if (rows[0].hasil !== hasil) {
                await pool.query('UPDATE aturan SET hasil = ? WHERE kondisi = ?', [hasil, kondisi]);
                logMessage(`   🔄 Aturan UPDATE: [${kondisi}] -> ${hasil}`);
            } else {
                // logMessage(`   ⚙️  Aturan [${kondisi}] sudah sesuai.`);
            }
        }

        // --- 3. DATA HASIL DIAGNOSA (Dummy/Contoh Data Historis) ---
        // Hanya tambahkan jika tabel kosong atau untuk keperluan testing awal
        // Anda bisa menonaktifkan blok ini jika tidak ingin data dummy
        /*
        const hasilDummy = [
            ['User Test 1', 'Depresi Mayor (Kemungkinan Tinggi)', 0],
            ['User Test 2', 'Gangguan Cemas Menyeluruh', 0],
        ];

        for (const [nama_pasien, hasil_penyakit, persentase] of hasilDummy) {
             const [rows] = await pool.query(
                'SELECT id FROM hasil_diagnosa WHERE nama_pasien = ? AND hasil_penyakit = ?',
                [nama_pasien, hasil_penyakit]
            );
            
            if (rows.length === 0) {
                await pool.query(
                    'INSERT INTO hasil_diagnosa (nama_pasien, hasil_penyakit, persentase, tanggal_diagnosa) VALUES (?, ?, ?, NOW())',
                    [nama_pasien, hasil_penyakit, persentase]
                );
                logMessage(`   ✅ Data Dummy: ${nama_pasien} -> ${hasil_penyakit}`);
            }
        }
        */

        logMessage('\n🎉 Seeding selesai! Database telah diperbarui dengan kriteria DSM-5.');
        process.exit(0);

    } catch (err) {
        logMessage(`❌ Terjadi kesalahan fatal saat seeding: ${err.message}`);
        process.exit(1);
    }
}

// Jalankan fungsi seeding
seedDatabase();