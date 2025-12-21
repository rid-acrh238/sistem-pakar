import { pool } from '../src/config/db.js';

export async function forwardChaining(jawabanUser) {
    try {
        // 1. OLAH INPUT USER
        const fakta = [];
        let skorPHQ9 = 0;
        let adaNiatBunuhDiri = false;
        let gejalaUtama = 0;

        for (const [kode, skor] of Object.entries(jawabanUser)) {
            const nilai = parseInt(skor);
            skorPHQ9 += nilai;

            if (nilai > 0) {
                fakta.push(kode);
                if (kode === 'C1' || kode === 'C2') gejalaUtama++;
                if (kode === 'C9') adaNiatBunuhDiri = true;
            }
        }

        // 2. CEK DATABASE ATURAN
        const [dbRules] = await pool.query('SELECT * FROM aturan');
        
        let diagnosisDb = null;
        let ruleMatched = null;

        for (const rule of dbRules) {
            const syarat = rule.kondisi.split(',').map(s => s.trim());
            const isMatch = syarat.every(g => fakta.includes(g));

            if (isMatch) {
                diagnosisDb = rule.hasil;
                ruleMatched = syarat;
                break; 
            }
        }

        // 3. TENTUKAN HASIL AKHIR & SARAN
        let finalResult = '';
        
        // Default saran (Jaga-jaga biar gak kosong)
        let saran = 'Silakan konsultasi dengan profesional kesehatan mental untuk evaluasi lebih lanjut.'; 
        let persentase = 0;

        if (diagnosisDb) {
            // === JIKA KETEMU DI DATABASE (Rule Base) ===
            finalResult = diagnosisDb;
            persentase = 100;

            // Debugging: Cek apa isi text yang mau di-lowercase
            console.log("DEBUG DB RESULT:", finalResult); 

            const hasilLower = finalResult.toLowerCase();

            // Logika Interpretasi (Pastikan keyword sesuai isi Database)
            if (hasilLower.includes('bunuh diri')) {
                saran = '⚠️ KRITIS: Terdeteksi risiko menyakiti diri. Segera hubungi layanan darurat (119) atau pergi ke IGD terdekat.';
            } 
            else if (hasilLower.includes('berat') || hasilLower.includes('severe')) {
                saran = 'Gejala Anda tergolong berat. Sangat disarankan untuk segera melakukan konsultasi tatap muka dengan Psikiater atau Psikolog Klinis.';
            } 
            else if (hasilLower.includes('sedang') || hasilLower.includes('moderate')) {
                saran = 'Gejala mulai mengganggu aktivitas harian. Disarankan melakukan konseling untuk mencegah kondisi memburuk.';
            } 
            else if (hasilLower.includes('ringan') || hasilLower.includes('mild')) {
                saran = 'Anda mungkin mengalami stres ringan. Cobalah perbaiki pola tidur, rutin berolahraga, dan lakukan teknik relaksasi.';
            } 
            else if (hasilLower.includes('normal') || hasilLower.includes('minimal')) {
                saran = 'Kondisi kesehatan mental Anda tampak stabil. Pertahankan gaya hidup sehat dan pola pikir positif.';
            }
            // Jika tidak masuk if manapun, dia akan pakai kalimat 'Default saran' di atas.

        } else {
            // === JIKA TIDAK KETEMU DI DB (Pakai Skor PHQ-9) ===
            persentase = (skorPHQ9 / 27) * 100;

            if (adaNiatBunuhDiri) {
                finalResult = 'Depresi Berat + Risiko Bunuh Diri';
                saran = '⚠️ KRITIS: Terdeteksi risiko menyakiti diri. Segera hubungi layanan darurat.';
            } else if (skorPHQ9 >= 20) {
                finalResult = 'Depresi Berat (Severe)';
                saran = 'Kondisi ini membutuhkan penanganan medis serius. Segera hubungi Psikiater.';
            } else if (skorPHQ9 >= 15) {
                finalResult = 'Depresi Agak Berat (Moderately Severe)';
                saran = 'Gejala cukup signifikan. Disarankan terapi dengan Psikolog Klinis.';
            } else if (skorPHQ9 >= 10) {
                finalResult = 'Depresi Sedang (Moderate)';
                saran = 'Sebaiknya konsultasikan kondisi Anda jika mulai mengganggu produktivitas.';
            } else if (skorPHQ9 >= 5) {
                finalResult = 'Depresi Ringan (Mild)';
                saran = 'Lakukan pemantauan mandiri (self-monitoring) dan kurangi stres.';
            } else {
                finalResult = 'Normal / Minimal';
                saran = 'Tidak terdeteksi gejala depresi yang signifikan.';
            }
        }

        return {
            skor: skorPHQ9,
            diagnosis: finalResult,
            saran: saran, // Ini yang dikirim ke deskripsi & rekomendasi
            fakta: fakta,
            persentase: persentase.toFixed(2)
        };

    } catch (err) {
        console.error('FC Error:', err);
        throw err;
    }
}


// // file: utils/forwardChaining.js


// import { pool } from '../src/config/db.js';

// export async function forwardChaining(jawabanUser) {
//     try {
//         // --- 1. OLAH INPUT USER ---
//         const fakta = [];
//         let skorPHQ9 = 0;
//         let adaNiatBunuhDiri = false;
//         let gejalaUtama = 0; 

//         // Mapping jawaban (C1..C9)
//         for (const [kode, skor] of Object.entries(jawabanUser)) {
//             const nilai = parseInt(skor);
//             skorPHQ9 += nilai;

//             if (nilai > 0) {
//                 fakta.push(kode); 
//                 if (kode === 'C1' || kode === 'C2') gejalaUtama++;
//                 if (kode === 'C9') adaNiatBunuhDiri = true;
//             }
//         }

//         // --- 2. AMBIL ATURAN DARI DATABASE ---
//         // Sesuai tabel 'aturan' di PDF Page 1 [cite: 3, 5]
//         const [dbRules] = await pool.query('SELECT * FROM aturan');
        
//         let diagnosisDb = null;
//         let ruleMatched = null;

//         for (const rule of dbRules) {
//             // Kolom 'kondisi' tipe TEXT  -> "C1,C2,C3"
//             const syarat = rule.kondisi.split(',').map(s => s.trim());
            
//             // Cek apakah user punya SEMUA gejala di rule ini
//             const isMatch = syarat.every(g => fakta.includes(g));

//             if (isMatch) {
//                 // Kolom 'hasil' tipe VARCHAR 
//                 diagnosisDb = rule.hasil; 
//                 ruleMatched = syarat;
//                 break; // Prioritas: match pertama yang diambil
//             }
//         }

//         // --- 3. TENTUKAN HASIL AKHIR ---
//         let finalResult = '';
//         let saran = '';
//         let persentase = 0; // Default untuk kolom 'persentase' di tabel hasil 

//         if (diagnosisDb) {
//             // JIKA KETEMU DI DB
//             finalResult = diagnosisDb;
//             persentase = 100; // Karena match rule 100%
//             // saran = 'Diagnosa berdasarkan pola spesifik (Rule Base). Segera konsultasi.';
//             const hasilLower = finalResult.toLowerCase();

//         } else {
//             // JIKA GAK KETEMU -> FALLBACK PHQ-9 SCORE
//             // Hitung persentase kasar: (skor / max_skor_27) * 100
//             persentase = (skorPHQ9 / 27) * 100; 

//             if (finalResult.includes('Bunuh Diri')) {
//                 saran = '⚠️ BAHAYA: Terdeteksi risiko menyakiti diri. Segera hubungi 119 atau pergi ke IGD terdekat. Jangan sendirian.';
//             } else if (finalResult.includes('Berat')) {
//                 saran = 'Kondisi serius. Sangat disarankan konsultasi tatap muka dengan Psikiater untuk penanganan medis.';
//             } else if (finalResult.includes('Sedang')) {
//                 saran = 'Gejala mulai mengganggu produktivitas. Disarankan konseling dengan Psikolog Klinis.';
//             } else if (finalResult.includes('Ringan')) {
//                 saran = 'Lakukan self-care, perbaiki pola tidur, olahraga ringan, dan curhat ke teman dekat.';
//             } else {
//                 saran = 'Kondisi mental stabil. Pertahankan pola hidup sehat.';
//             }
//         }

//         return {
//             skor: skorPHQ9,
//             diagnosis: finalResult,
//             saran: saran,
//             fakta: fakta,
//             persentase: persentase.toFixed(2)
//         };

//     } catch (err) {
//         console.error('FC Error:', err);
//         throw err;
//     }
// }