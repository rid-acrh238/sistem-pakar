import { pool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';

/**
 * Fungsi bantu: menulis log ke file dan terminal
 */
function writeLog(message) {
    const logDir = path.resolve('logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const logFile = path.join(logDir, 'forward.log');
    const timestamp = new Date().toISOString();
    const fullMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, fullMsg);
    console.log(message);
}

/**
 * Fungsi utama inferensi forward chaining.
 * @param {Array<string>} gejalaUser - daftar kode gejala yang dipilih user
 * @param {boolean} debug - aktifkan log debug & simpan ke file
 * @returns {Promise<string>} hasil diagnosa
 */
export async function forwardChaining(gejalaUser, debug = false) {
    try {
        if (debug) {
            writeLog('\n🧩 [DEBUG MODE] Forward-Chaining Engine Aktif');
            writeLog('🧠 Gejala yang dipilih user: ' + gejalaUser.join(', '));
        }

        // Ambil aturan dari database
        const [rules] = await pool.query('SELECT * FROM aturan');

        let hasilDiagnosa = null;
        let ruleTerpakai = null;

        // 🔁 Periksa setiap rule
        for (const rule of rules) {
            const kondisi = rule.kondisi.split(',').map((k) => k.trim());
            const cocok = kondisi.every((kode) => gejalaUser.includes(kode));

            if (debug) {
                writeLog(`🔍 Mengecek aturan: [${kondisi.join(', ')}] → ${rule.hasil}`);
                writeLog(`   → Status: ${cocok ? '✅ Cocok' : '❌ Tidak cocok'}`);
            }

            if (cocok) {
                hasilDiagnosa = rule.hasil;
                ruleTerpakai = rule.kondisi;
                if (debug) writeLog(`🎯 Aturan cocok ditemukan → ${rule.hasil}`);
                break;
            }
        }

        // 🔧 Jika tidak ada aturan cocok → fallback ke evaluasi dinamis
        if (!hasilDiagnosa) {
            hasilDiagnosa = evaluasiDinamis(gejalaUser, debug);
            ruleTerpakai = 'Evaluasi Dinamis (Fallback)';
        }

        if (debug) {
            writeLog(`\n🔎 Hasil akhir: ${hasilDiagnosa}`);
            writeLog(`🧩 Rule terpakai: ${ruleTerpakai}`);
            writeLog('----------------------------------------\n');
        }

        return hasilDiagnosa;
    } catch (error) {
        writeLog(`❌ Error dalam forwardChaining: ${error.message}`);
        return 'Terjadi kesalahan dalam proses diagnosa.';
    }
}

/**
 * Evaluasi dinamis berdasarkan jumlah gejala (jika tidak ada rule yang cocok)
 */
function evaluasiDinamis(gejalaUser, debug = false) {
    const jumlah = gejalaUser.length;
    const adaGejalaUtama = gejalaUser.includes('C1') || gejalaUser.includes('C2');
    let hasil;

    if (jumlah >= 5 && adaGejalaUtama) {
        hasil = 'Depresi Mayor (Kemungkinan Tinggi)';
    } else if (jumlah >= 3 && adaGejalaUtama) {
        hasil = 'Depresi Ringan–Sedang (Kemungkinan Sedang)';
    } else if (jumlah >= 3 && !adaGejalaUtama) {
        hasil = 'Gangguan Emosional Umum (Kemungkinan Rendah)';
    } else {
        hasil = 'Tidak terindikasi depresi mayor.';
    }

    if (debug) {
        writeLog('\n⚙️  Evaluasi Dinamis Aktif');
        writeLog(`   → Jumlah gejala: ${jumlah}`);
        writeLog(`   → Ada gejala utama (C1/C2): ${adaGejalaUtama ? 'Ya' : 'Tidak'}`);
        writeLog(`   → Kesimpulan: ${hasil}`);
    }

    return hasil;
}
