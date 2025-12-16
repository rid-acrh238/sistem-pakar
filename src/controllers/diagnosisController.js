import { pool } from '../config/db.js';

import { forwardChaining } from '../../utils/fowardChaining.js';
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

// === PROSES DIAGNOSIS PUBLIK ===

// export const submitDiagnosis = async (req, res) => {
//     try {
//         const { nama_pasien, email, umur, alasan, gejala_dipilih, total_skor, kategori } = req.body;

//         console.log("📥 Data Masuk:", req.body);

//         let persentase = (total_skor / 27) * 100;
        
//         persentase = parseFloat(persentase.toFixed(1))

//         // Panggil fungsi insert dari Model
//         const id = await insertHasilDiagnosis({
//             nama_pasien,
//             email,
//             umur,
//             alasan,
//             total_skor,
//             persentase,
//             kategori,
//             gejala_dipilih
//         });

//         res.status(201).json({
//             success: true,
//             message: "Diagnosa berhasil disimpan",
//             data: { id, kategori, total_skor, persentase }
//         });

//     } catch (error) {
//         console.error("Error save diagnosis:", error);
//         res.status(500).json({ success: false, message: "Gagal menyimpan data server." });
//     }
// };

export const submitDiagnosis = (req, res) => {
  try {
    const { jawaban, demografi } = req.body;

    if (!jawaban || typeof jawaban !== "object") {
      return res.status(400).json({
        success: false,
        message: "Jawaban kuesioner tidak valid"
      });
    }

    // ==========================
    // 1. HITUNG SKOR TOTAL PHQ-9
    // ==========================
    let totalScore = 0;
    let fakta = [];

    for (const kode in jawaban) {
      const nilai = Number(jawaban[kode]);
      totalScore += nilai;

      // Forward chaining: ubah jawaban jadi fakta
      if (nilai >= 2) {
        fakta.push(kode);
      }
    }

    // ==========================
    // 2. RULE BASE (DSM-5 / PHQ-9)
    // ==========================
    let kategori = "";
    let deskripsi = "";
    let rekomendasi = [];

    if (totalScore <= 4) {
      kategori = "Minimal / Tidak Depresi";
      deskripsi = "Tidak ditemukan indikasi signifikan depresi mayor.";
      rekomendasi = ["Pertahankan pola hidup sehat", "Lakukan self-care rutin"];
    }
    else if (totalScore <= 9) {
      kategori = "Depresi Ringan";
      deskripsi = "Terdapat gejala depresi ringan.";
      rekomendasi = ["Monitoring mandiri", "Olahraga ringan", "Jurnal emosi"];
    }
    else if (totalScore <= 14) {
      kategori = "Depresi Sedang";
      deskripsi = "Gejala cukup mengganggu aktivitas harian.";
      rekomendasi = ["Konsultasi psikolog", "Dukungan sosial"];
    }
    else if (totalScore <= 19) {
      kategori = "Depresi Sedang–Berat";
      deskripsi = "Gejala signifikan dan berisiko memburuk.";
      rekomendasi = ["Konsultasi profesional segera", "Evaluasi klinis"];
    }
    else {
      kategori = "Depresi Berat";
      deskripsi = "Indikasi kuat depresi mayor.";
      rekomendasi = ["Rujukan psikiater", "Pendampingan intensif"];
    }

    // ==========================
    // 3. KRISIS CHECK (C9)
    // ==========================
    const krisis = jawaban.C9 >= 1;

    // ==========================
    // 4. RESPONSE JSON (WAJIB JSON)
    // ==========================
    return res.json({
      success: true,
      score: totalScore,
      kategori,
      deskripsi,
      rekomendasi,
      krisis
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Kesalahan server"
    });
  }
};

// export const submitDiagnosis = async (req, res) => {
//     try {
//         console.log("📥 Data Masuk:", req.body);

//         const { jawaban, demografi } = req.body;

//         // 1. Validasi
//         if (!jawaban || !demografi) {
//             return res.status(400).json({ success: false, message: "Data tidak lengkap." });
//         }

//         // 2. PROSES HITUNG (Forward Chaining)
//         const hasilAnalisa = await forwardChaining(jawaban);
//         // hasilAnalisa = { skor: 15, hasil: "Depresi Sedang", saran: "..." }

//         // 3. HITUNG PERSENTASE
//         let persentase = (hasilAnalisa.skor / 27) * 100;
//         persentase = parseFloat(persentase.toFixed(2)); // Ambil 2 desimal biar rapi

//         // 4. PERSIAPAN DATA KE DATABASE (Mapping Variable)
//         const dataUntukDisimpan = {
//             nama_pasien: demografi.nama_pasien,
//             email: demografi.email || null,     // Boleh NULL sesuai PDF 
//             umur: parseInt(demografi.umur) || null,
//             keluhan: demografi.alasan,          // Input 'alasan' masuk ke kolom 'keluhan'
//             hasil_penyakit: hasilAnalisa.hasil, // Hasil diagnosa masuk ke 'hasil_penyakit'
//             detail_gejala: JSON.stringify(jawaban), // Simpan jawaban mentah sebagai text
//             persentase: persentase
//         };

//         // 5. EKSEKUSI SIMPAN
//         const idBaru = await insertHasilDiagnosis(dataUntukDisimpan);

//         // 6. KIRIM RESPON KE FRONTEND
//         res.status(201).json({
//             success: true,
//             message: "Diagnosa berhasil disimpan",
//             data: { 
//                 id: idBaru,
//                 nama: dataUntukDisimpan.nama_pasien,
//                 total_skor: hasilAnalisa.skor, 
//                 kategori: hasilAnalisa.hasil, 
//                 persentase: persentase,
//                 saran: hasilAnalisa.saran 
//             }
//         });

//     } catch (error) {
//         console.error("Error save diagnosis:", error);
//         res.status(500).json({ success: false, message: "Gagal menyimpan data ke server." });
//     }
// };

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

