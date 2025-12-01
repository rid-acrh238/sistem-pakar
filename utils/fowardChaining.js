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
 * @param {Array<string>} gejalaUser - array kode gejala yang dipilih user (contoh: ['D01', 'D02', 'A01'])
 * @param {boolean} debug - aktifkan log debug
 * @returns {Promise<string>} hasil diagnosa
 */
export async function forwardChaining(gejalaUser, debug = false) {
    try {
        if (debug) {
            writeLog('\n🧩 [DEBUG MODE] Forward-Chaining Engine Aktif');
            writeLog('🧠 Gejala User: ' + gejalaUser.join(', '));
        }

        // 1. CEK DATABASE (PRIORITAS TINGGI / RED FLAGS)
        // Kita cek apakah ada rule "sakti" di database yang cocok 100%
        const [rules] = await pool.query('SELECT * FROM aturan');
        
        let hasilDiagnosa = null;
        let ruleTerpakai = null;

        for (const rule of rules) {
            const kondisiRules = rule.kondisi.split(',').map((k) => k.trim());
            
            // Cek apakah semua kondisi rule terpenuhi oleh gejala user
            const isMatch = kondisiRules.every((kode) => gejalaUser.includes(kode));

            if (isMatch) {
                hasilDiagnosa = rule.hasil;
                ruleTerpakai = `Rule ID ${rule.id} (DB)`;
                if (debug) writeLog(`🎯 Match Database Rule: ${rule.hasil}`);
                
                // Jika ketemu rule "BAHAYA" (misal D09 Bunuh Diri), langsung return, abaikan hitungan lain
                if (rule.hasil.includes('BAHAYA') || rule.hasil.includes('Sangat Berat')) {
                    return hasilDiagnosa;
                }
                // Jika rule biasa, kita simpan dulu, tapi tetap jalankan evaluasi dinamis untuk kelengkapan
                break; 
            }
        }

        // 2. JIKA TIDAK ADA MATCH DATABASE (ATAU TIDAK KRITIS), JALANKAN LOGIKA DSM-5
        // Ini menangani logika "5 dari 9 gejala", "3 gejala fisik", dsb.
        if (!hasilDiagnosa || !hasilDiagnosa.includes('BAHAYA')) {
            const hasilDinamis = evaluasiDinamis(gejalaUser, debug);
            
            // Jika database kosong, pakai hasil dinamis. 
            // Jika database ada hasil tapi dinamis juga ada hasil (komorbid), gabungkan.
            if (hasilDinamis) {
                hasilDiagnosa = hasilDiagnosa ? `${hasilDiagnosa} | ${hasilDinamis}` : hasilDinamis;
                ruleTerpakai = ruleTerpakai ? `${ruleTerpakai} + Algoritma DSM-5` : 'Algoritma DSM-5';
            }
        }

        // Default jika sehat walafiat
        if (!hasilDiagnosa) {
            hasilDiagnosa = 'Tidak ditemukan indikasi gangguan mental klinis. Kesehatan mental Anda tampak stabil.';
        }

        if (debug) {
            writeLog(`📝 Hasil Akhir: ${hasilDiagnosa}`);
            writeLog('----------------------------------------\n');
        }

        return hasilDiagnosa;

    } catch (error) {
        writeLog(`❌ Error forwardChaining: ${error.message}`);
        return 'Terjadi kesalahan sistem saat melakukan diagnosa.';
    }
}

/**
 * Logika Hitungan DSM-5 (Mayor Depresi, GAD, Burnout)
 */
function evaluasiDinamis(gejalaUser, debug) {
    const diagnosaList = [];

    // Filter gejala berdasarkan kategori
    const gDepresi = gejalaUser.filter(k => k.startsWith('D')); // D01-D09
    const gCemas = gejalaUser.filter(k => k.startsWith('A'));   // A01-A08
    const gBurnout = gejalaUser.filter(k => k.startsWith('B')); // B01-B03

    // --- 1. DEPRESI MAYOR (Major Depressive Disorder) ---
    // Kriteria A: Minimal 5 gejala dalam 2 minggu
    // Salah satu gejala HARUS D01 (Mood Depresi) atau D02 (Anhedonia)
    const hasCoreDepression = gejalaUser.includes('D01') || gejalaUser.includes('D02');
    const countDepression = gDepresi.length;

    if (hasCoreDepression) {
        if (countDepression >= 5) {
            diagnosaList.push('Depresi Mayor (Indikasi Kuat)');
        } else if (countDepression >= 2) {
            diagnosaList.push('Depresi Ringan - Sedang (Gejala belum memenuhi kriteria penuh)');
        }
    } else if (countDepression >= 3) {
        // Ada banyak gejala tapi tanpa mood sedih/hilang minat -> Mungkin gangguan lain
        diagnosaList.push('Gangguan Mood Tidak Spesifik (Other Specified Depressive Disorder)');
    }

    // --- 2. GANGGUAN CEMAS MENYELURUH (GAD) ---
    // Kriteria: Kecemasan berlebih (A01) DAN Sulit kontrol (A02)
    // PLUS minimal 3 gejala fisik (A03-A08)
    const hasCoreAnxiety = gejalaUser.includes('A01') && gejalaUser.includes('A02');
    const countPhysicalAnxiety = gCemas.filter(k => ['A03','A04','A05','A06','A07','A08'].includes(k)).length;

    if (hasCoreAnxiety && countPhysicalAnxiety >= 3) {
        diagnosaList.push('Gangguan Kecemasan Menyeluruh (GAD)');
    } else if (hasCoreAnxiety || countPhysicalAnxiety >= 3) {
        diagnosaList.push('Gejala Kecemasan (Belum memenuhi kriteria penuh GAD)');
    }

    // --- 3. BURNOUT (Occupational Phenomenon) ---
    // Kriteria: Dominan gejala B (biasanya semua 3 dimensi terpenuhi)
    // Burnout murni biasanya terjadi jika kriteria Depresi/Cemas TIDAK terpenuhi
    const countBurnout = gBurnout.length;
    const isDepressed = diagnosaList.some(d => d.includes('Depresi'));

    if (countBurnout >= 3 && !isDepressed) {
        diagnosaList.push('Burnout (Sindrom Stres Akibat Pekerjaan)');
    } else if (countBurnout >= 1 && isDepressed) {
        diagnosaList.push('Gejala Burnout (Komorbid dengan Depresi)');
    }

    if (debug) {
        writeLog(`   📊 Analisis: Depresi=${countDepression} (Inti:${hasCoreDepression}), Cemas=${countPhysicalAnxiety} (Inti:${hasCoreAnxiety}), Burnout=${countBurnout}`);
    }

    return diagnosaList.join(' DAN ');
}


// import { pool } from '../src/config/db.js';
// import fs from 'fs';
// import path from 'path';

// /**
//  * Fungsi bantu: menulis log ke file dan terminal
//  */
// function writeLog(message) {
//     const logDir = path.resolve('logs');
//     if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

//     const logFile = path.join(logDir, 'forward.log');
//     const timestamp = new Date().toISOString();
//     const fullMsg = `[${timestamp}] ${message}\n`;
//     fs.appendFileSync(logFile, fullMsg);
//     console.log(message);
// }

// /**
//  * Fungsi utama inferensi forward chaining.
//  * @param {Array<string>} gejalaUser - daftar kode gejala yang dipilih user
//  * @param {boolean} debug - aktifkan log debug & simpan ke file
//  * @returns {Promise<string>} hasil diagnosa
//  */
// export async function forwardChaining(gejalaUser, debug = false) {
//     try {
//         if (debug) {
//             writeLog('\n🧩 [DEBUG MODE] Forward-Chaining Engine Aktif');
//             writeLog('🧠 Gejala yang dipilih user: ' + gejalaUser.join(', '));
//         }

//         // Ambil aturan dari database
//         const [rules] = await pool.query('SELECT * FROM aturan');

//         let hasilDiagnosa = null;
//         let ruleTerpakai = null;

//         // 🔁 Periksa setiap rule
//         for (const rule of rules) {
//             const kondisi = rule.kondisi.split(',').map((k) => k.trim());
//             const cocok = kondisi.every((kode) => gejalaUser.includes(kode));

//             if (debug) {
//                 writeLog(`🔍 Mengecek aturan: [${kondisi.join(', ')}] → ${rule.hasil}`);
//                 writeLog(`   → Status: ${cocok ? '✅ Cocok' : '❌ Tidak cocok'}`);
//             }

//             if (cocok) {
//                 hasilDiagnosa = rule.hasil;
//                 ruleTerpakai = rule.kondisi;
//                 if (debug) writeLog(`🎯 Aturan cocok ditemukan → ${rule.hasil}`);
//                 break;
//             }
//         }

//         // 🔧 Jika tidak ada aturan cocok → fallback ke evaluasi dinamis
//         if (!hasilDiagnosa) {
//             hasilDiagnosa = evaluasiDinamis(gejalaUser, debug);
//             ruleTerpakai = 'Evaluasi Dinamis (Fallback)';
//         }

//         if (debug) {
//             writeLog(`\n🔎 Hasil akhir: ${hasilDiagnosa}`);
//             writeLog(`🧩 Rule terpakai: ${ruleTerpakai}`);
//             writeLog('----------------------------------------\n');
//         }

//         return hasilDiagnosa;
//     } catch (error) {
//         writeLog(`❌ Error dalam forwardChaining: ${error.message}`);
//         return 'Terjadi kesalahan dalam proses diagnosa.';
//     }
// }

// /**
//  * Evaluasi dinamis berdasarkan jumlah gejala (jika tidak ada rule yang cocok)
//  */
// function evaluasiDinamis(gejalaUser, debug = false) {
//     const jumlah = gejalaUser.length;
//     const adaGejalaUtama = gejalaUser.includes('C1') || gejalaUser.includes('C2');
//     let hasil;

//     if (jumlah >= 5 && adaGejalaUtama) {
//         hasil = 'Depresi Mayor (Kemungkinan Tinggi)';
//     } else if (jumlah >= 3 && adaGejalaUtama) {
//         hasil = 'Depresi Ringan–Sedang (Kemungkinan Sedang)';
//     } else if (jumlah >= 3 && !adaGejalaUtama) {
//         hasil = 'Gangguan Emosional Umum (Kemungkinan Rendah)';
//     } else {
//         hasil = 'Tidak terindikasi depresi mayor.';
//     }

//     if (debug) {
//         writeLog('\n⚙️  Evaluasi Dinamis Aktif');
//         writeLog(`   → Jumlah gejala: ${jumlah}`);
//         writeLog(`   → Ada gejala utama (C1/C2): ${adaGejalaUtama ? 'Ya' : 'Tidak'}`);
//         writeLog(`   → Kesimpulan: ${hasil}`);
//     }

//     return hasil;
// }
