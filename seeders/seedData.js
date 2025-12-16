import { pool } from '../src/config/db.js'



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



        // --- Data Gejala ---

        const gejalaData = [

            ['C1', 'Suasana hati sedih hampir setiap hari'],

            ['C2', 'Kehilangan minat akan segala sesuatu'],

            ['C3', 'Perubahan berat badan atau nafsu makan secara signifikan'],

            ['C4', 'Insomnia atau hypersomnia'],

            ['C5', 'Perubahan psikomotor (lamban atau gelisah)'],

            ['C6', 'Kelelahan atau kehilangan energi'],

            ['C7', 'Perasaan tidak berharga atau rasa bersalah berlebihan'],

            ['C8', 'Sulit konsentrasi atau sulit dalam mengambil keputusan'],

            ['C9', 'Dorongan pikiran akan kematian atau bunuh diri'],

        ];



        for (const [kode, nama] of gejalaData) {

            const [rows] = await pool.query(

                'SELECT id_gejala, nama_gejala FROM gejala WHERE kode_gejala = ?',

                [kode]

            );



            if (rows.length === 0) {

                await pool.query('INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)', [

                    kode,

                    nama,

                ]);

                logMessage(`✅ Gejala ${kode} ditambahkan`);

            } else if (rows[0].nama_gejala !== nama) {

                await pool.query('UPDATE gejala SET nama_gejala = ? WHERE kode_gejala = ?', [

                    nama,

                    kode,

                ]);

                logMessage(`🔄 Gejala ${kode} diperbarui`);

            } else {

                logMessage(`⚙️  Gejala ${kode} sudah sesuai, dilewati`);

            }

        }



        // --- Data Aturan ---

        const aturanData = [

            ['C1,C2,C3', 'Depresi Ringan'],

            ['C1,C2,C3,C4,C6', 'Depresi Sedang'],

            ['C1,C2,C3,C4,C5,C6,C7,C8,C9', 'Depresi Mayor Berat'],

        ];



        for (const [kondisi, hasil] of aturanData) {

            const [rows] = await pool.query(

                'SELECT id_aturan, hasil FROM aturan WHERE kondisi = ?',

                [kondisi]

            );



            if (rows.length === 0) {

                await pool.query('INSERT INTO aturan (kondisi, hasil) VALUES (?, ?)', [

                    kondisi,

                    hasil,

                ]);

                logMessage(`✅ Aturan baru (${hasil}) ditambahkan`);

            } else if (rows[0].hasil !== hasil) {

                await pool.query('UPDATE aturan SET hasil = ? WHERE kondisi = ?', [hasil, kondisi]);

                logMessage(`🔄 Aturan (${kondisi}) diperbarui menjadi '${hasil}'`);

            } else {

                logMessage(`⚙️  Aturan (${hasil}) sudah sesuai, dilewati`);

            }

        }



        // --- Data Hasil Diagnosa (Dummy) ---

        const hasilDummy = [

            ['Dummy A', 'Depresi Ringan', 35.6],

            ['Dummy B', 'Depresi Sedang', 67.8],

            ['Dummy C', 'Depresi Berat', 89.4],

        ];



        for (const [nama_pasien, hasil_penyakit, persentase] of hasilDummy) {

            const [rows] = await pool.query(

                'SELECT id FROM hasil_diagnosa WHERE nama_pasien = ? AND hasil_penyakit = ?',

                [nama_pasien, hasil_penyakit]

            );



            if (rows.length === 0) {

                await pool.query(

                    'INSERT INTO hasil_diagnosa (nama_pasien, hasil_penyakit, persentase) VALUES (?, ?, ?)',

                    [nama_pasien, hasil_penyakit, persentase]

                );

                logMessage(`✅ Data hasil_diagnosa untuk ${nama_pasien} (${hasil_penyakit}) ditambahkan`);

            } else {

                logMessage(`⚙️  Data hasil_diagnosa untuk ${nama_pasien} sudah ada, dilewati`);

            }

        }



        logMessage('🎉 Seeding selesai tanpa duplikasi & sinkronisasi sukses!');

        process.exit(0);

    } catch (err) {

        logMessage(`❌ Terjadi kesalahan saat seeding: ${err.message}`);

        process.exit(1);

    }

}



seedDatabase();