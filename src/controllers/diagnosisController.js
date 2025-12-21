import { pool } from '../config/db.js';

import { forwardChaining } from '../../utils/forwardChaining.js';
import { getAllGejala, insertHasilDiagnosis, getAllHasilDiagnosis, deleteHasilDiagnosisById } from '../models/diagnosisModel.js';
import { findUserByEmail, insertUser } from '../models/penggunaModel.js';

export const getGejalaDiagnosis = async (req, res) => {
  try {
    const rows = await getAllGejala();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data gejala' });
  }
};


export const submitDiagnosis = async (req, res) => {
    try {
        const { jawaban, nama, email, umur, keluhan } = req.body;

        // 1. Jalankan Perhitungan
        const hasil = await forwardChaining(jawaban);

        // 2. Siapkan Data untuk Database
        // Tabel 'hasil_diagnosa' 
        const query = `
            INSERT INTO hasil_diagnosa 
            (nama_pasien, email, umur, keluhan, hasil_penyakit, detail_gejala, persentase) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // detail_gejala diisi list fakta (misal: "C1,C2")
        const gejalaString = hasil.fakta.join(','); 

        // 3. Eksekusi Simpan
        await pool.query(query, [
            nama, 
            email, 
            umur, 
            keluhan, 
            hasil.diagnosis, // Masuk ke kolom hasil_penyakit 
            gejalaString,    // Masuk ke kolom detail_gejala 
            hasil.persentase // Masuk ke kolom persentase 
        ]);

        // 4. Kirim Response ke Frontend
        res.json({
            success: true,
            kategori: hasil.diagnosis,
            score: hasil.skor,
            deskripsi: hasil.saran,
            rekomendasi: [hasil.saran]
        });

    } catch (error) {
        console.error('Submit Error:', error);
        res.status(500).json({ success: false, message: 'Gagal diagnosa' });
    }
};

// export const submitDiagnosis = async (req, res) => {
//     try {
//         const { jawaban, nama, email, umur, keluhan } = req.body;

//         if (!jawaban || Object.keys(jawaban).length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Jawaban kuesioner kosong'
//             });
//         }

//         const hasilFC = await forwardChaining(jawaban);

//         const detailGejala = JSON.stringify(jawaban);

//         // persentase dari PHQ-9 (max 27)
//         const persentase = Math.round((hasilFC.skor / 27) * 100);

//         if (!hasilFC || !hasilFC.diagnosis) {
//     throw new Error('Hasil diagnosis tidak ditemukan (forward chaining gagal)');
// }

// console.log('HASIL FORWARD CHAINING:', hasilFC);


//         await pool.query(
//             `INSERT INTO hasil_diagnosa
//             (nama_pasien, email, umur, keluhan, hasil_penyakit, detail_gejala, persentase, tanggal)
//             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
//             [
//                 nama || 'Anonim',
//                 email || null,
//                 umur || null,
//                 keluhan || null,
//             hasilFC.diagnosis || hasilFC.hasil || '-',
//                 detailGejala,
//                 persentase
//             ]
//         );

//         res.json({
//             success: true,
//             kategori: hasilFC.diagnosis,
//             score: hasilFC.skor,
//             deskripsi: hasilFC.saran,
//           rekomendasi: Array.isArray(hasilFC.rekomendasi) ? hasilFC.rekomendasi : [hasilFC.saran],
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };


// export async function submitDiagnosis(req, res) {
//   try {
//     const { jawaban, demografi, identitas } = req.body;

//     if (!jawaban) {
//       return res.status(400).json({ success: false, message: 'Jawaban kosong' });
//     }

//     // 🔹 hitung diagnosis
//     const hasil = await forwardChaining(jawaban);
//     const persentase = Math.round((hasil.skor / 27) * 100);

//     // 🔹 SIMPAN VIA MODEL (gunakan data yang dikirim dari frontend)
//     await insertHasilDiagnosis({
//       nama_pasien: identitas?.nama || 'Anonim',
//       email: identitas?.email || null,
//       umur: demografi?.umur || null,
//       keluhan: req.body.keluhan || null,
//       hasil_penyakit: hasil.hasil,
//       detail_gejala: JSON.stringify(jawaban),
//       persentase
//     });

//     // 🔹 RESPONSE KE FRONTEND
//     res.json({
//       success: true,
//       score: hasil.skor,
//       kategori: hasil.hasil,
//       deskripsi: hasil.saran,
//       rekomendasi: [hasil.saran],
//       krisis: hasil.hasil.includes('PERHATIAN')
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }



// ... import dan submitDiagnosis ...

export const getHistory = async (req, res) => {
    try {
        const data = await getAllHasilDiagnosis();
        
        // Bungkus data dalam object { success: true, data: [...] }
        res.status(200).json({ 
            success: true, 
            data: data 
        });

    } catch (error) {
        // INI PENTING: Log error asli ke terminal agar terlihat
        console.error("🔥 [ERROR SQL] Gagal ambil history:", error.message);
        
        res.status(500).json({ 
            success: false, 
            message: "Gagal mengambil data hasil diagnosa",
            error: error.message 
        });
    }
};

// export const prosesDiagnosis = async (req, res) => {
//   try {
//     const { nama_pasien, email, umur, alasan, gejala_dipilih, total_skor, kategori } = req.body;
//     console.log("Data masuk:", req.body)

//     if (!nama_pasien || !kategori) {
//       return res.status(400).json({ message: 'Data tidak lengkap.' });
//     }

//     await pool.query(
//       'INSERT INTO hasil_diagnosa (nama_pasien, email, umur, alasan, gejala_dipilih, hasil_penyakit, persentase) VALUES (?, ?, ?, ?, ?, ?, ?)',
//       [nama_pasien, email || null, kategori, total_skor]
//     );

//     res.status(200).json({ message: 'Hasil diagnosa berhasil disimpan.' });
//   } catch (err) {
//     console.error('🔥 prosesDiagnosis error:', err.message);
//     res.status(500).json({ message: 'Kesalahan server.' });
//   }
// };

export const getHasilDiagnosis = async (req, res) => {
  try {
    const rows = await getAllHasilDiagnosis();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data hasil diagnosa' });
  }
};

export const deleteHasilDiagnosis = async (req, res) => {
  try {
    const result = await deleteHasilDiagnosisById(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Data hasil diagnosa tidak ditemukan' });
    res.status(200).json({ message: 'Data hasil diagnosa berhasil dihapus' });
  } catch (err) {
    console.error('🔥 deleteHasilDiagnosis error:', err.message);
    res.status(500).json({ message: 'Gagal menghapus hasil diagnosa' });
  }
};

