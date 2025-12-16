import { pool } from '../config/db.js';

// 1. Ambil Semua Gejala
export async function getAllGejala() {
    try {
        // Asumsi tabel gejala pakai id_gejala (sesuai PDF) atau id biasa
        const query = 'SELECT * FROM gejala';
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// 2. Simpan Hasil Diagnosa (Create)
export const insertHasilDiagnosis = async (data) => {
    // Mapping data dari Controller ke Kolom Database (sesuai PDF hal 1)
    const { 
        nama_pasien, 
        email, 
        umur, 
        keluhan,         // Di form namanya 'alasan', di DB namanya 'keluhan'
        hasil_penyakit,  // Di controller 'kategori', di DB 'hasil_penyakit'
        detail_gejala,   // Di controller 'gejala_dipilih'
        persentase 
    } = data;

    const query = `
        INSERT INTO hasil_diagnosa 
        (nama_pasien, email, umur, keluhan, hasil_penyakit, detail_gejala, persentase) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        nama_pasien, 
        email, 
        umur, 
        keluhan, 
        hasil_penyakit, 
        detail_gejala, 
        persentase
    ];

    const [result] = await pool.execute(query, values);
    return result.insertId;
};
// export async function insertHasilDiagnosis(data) {
//     try {
//         const { nama_pasien, email, umur, alasan, total_skor, persentase, kategori, gejala_dipilih } = data;
//         const gejalaString = JSON.stringify(gejala_dipilih); 

//         // PERBAIKAN: Menggunakan kolom 'tanggal' (bukan tanggal_diagnosa)
//         const query = `
//             INSERT INTO hasil_diagnosa 
//             (nama_pasien, email, umur, keluhan, total_skor, persentase, hasil_penyakit, detail_gejala, tanggal) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ? NOW())
//         `;
        
//         const [result] = await pool.execute(query, [
//             nama_pasien, 
//             email || '-', 
//             umur || 0, 
//             alasan || '-', 
//             total_skor,
//             persentase, 
//             kategori, 
//             gejalaString
//         ]);
        
//         return result.insertId;
//     } catch (error) {
//         throw error;
//     }
// }

// 3. Ambil History (Read)
export async function getAllHasilDiagnosis() {
    try {
        // PERBAIKAN: Order by 'tanggal' dan SELECT semua
        const query = `SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// 4. Hapus Data (Delete)
export async function deleteHasilDiagnosisById(id) {
    try {
        // PERBAIKAN: WHERE id_hasil = ? (Sesuai database kamu)
        const query = `DELETE FROM hasil_diagnosa WHERE id_hasil = ?`;
        const [result] = await pool.execute(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

// import { pool } from '../config/db.js';

// // 1. Ambil Daftar Gejala (INI YANG TADI HILANG)
// export async function getAllGejala() {
//     try {
//         const query = 'SELECT * FROM gejala';
//         const [rows] = await pool.query(query);
//         return rows;
//     } catch (error) {
//         throw error;
//     }
// }

// // 1. Simpan Hasil Diagnosa (Create)
// // Kita ubah namanya jadi 'insertHasilDiagnosis' biar cocok sama Controller
// export async function insertHasilDiagnosis(data) {
//     try {
//         // Destructure data
//         const { nama_pasien, email, umur, alasan, total_skor, kategori, gejala_dipilih } = data;
        
//         // Ubah array gejala jadi string JSON
//         const gejalaString = JSON.stringify(gejala_dipilih); 

//         // Query Insert
//         const query = `
//             INSERT INTO hasil_diagnosa 
//             (nama_pasien, email, umur, keluhan, total_skor, hasil_penyakit, detail_gejala, tanggal_diagnosa) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//         `;
        
//         const [result] = await pool.execute(query, [
//             nama_pasien, 
//             email || '-', 
//             umur || 0, 
//             alasan || '-', 
//             total_skor, 
//             kategori, 
//             gejalaString
//         ]);
        
//         return result.insertId;
//     } catch (error) {
//         throw error;
//     }
// }

// // 2. Ambil Semua Data (Read)
// // Kita ubah namanya jadi 'getAllHasilDiagnosis' biar cocok sama Controller
// export async function getAllHasilDiagnosis() {
//     try {
//         const query = `SELECT * FROM hasil_diagnosa ORDER BY tanggal_diagnosa DESC`;
//         const [rows] = await pool.query(query);
//         return rows;
//     } catch (error) {
//         throw error;
//     }
// }

// // 3. Hapus Data (Delete)
// // Kita ubah namanya jadi 'deleteHasilDiagnosisById'
// export async function deleteHasilDiagnosisById(id) {
//     try {
//         const query = `DELETE FROM hasil_diagnosa WHERE id = ?`;
//         const [result] = await pool.execute(query, [id]);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }


// // import { pool } from '../config/db.js';

// // // 1. Ambil Daftar Gejala (Dipakai untuk form)
// // export async function getAllGejala() {
// //     const query = 'SELECT * FROM gejala';
// //     const [rows] = await pool.query(query);
// //     return rows;
// // }

// // // 2. Simpan Hasil Diagnosa (Create)
// // export async function insertHasilDiagnosis(data) {
// //     const { nama_pasien, email, umur, alasan, total_skor, kategori, gejala_dipilih } = data;
    
// //     // Ubah array menjadi JSON string
// //     const gejalaString = JSON.stringify(gejala_dipilih); 

// //     const query = `
// //         INSERT INTO hasil_diagnosa 
// //         (nama_pasien, email, umur, keluhan, total_skor, hasil_penyakit, detail_gejala, tanggal_diagnosa) 
// //         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
// //     `;
    
// //     const [result] = await pool.execute(query, [
// //         nama_pasien, 
// //         email || '-', 
// //         umur || 0, 
// //         alasan || '-', 
// //         total_skor, 
// //         kategori, 
// //         gejalaString
// //     ]);
    
// //     return result.insertId;
// // }

// // // 3. Ambil Semua History (Read) - Dipakai Dashboard
// // export async function getAllHasilDiagnosis() {
// //     const query = `SELECT * FROM hasil_diagnosa ORDER BY tanggal_diagnosa DESC`;
// //     const [rows] = await pool.query(query);
// //     return rows;
// // }

// // // 4. Hapus Data Berdasarkan ID (Delete) - INI YANG DITANYAKAN ERROR
// // export async function deleteHasilDiagnosisById(id) {
// //     const query = `DELETE FROM hasil_diagnosa WHERE id = ?`;
// //     const [result] = await pool.execute(query, [id]);
// //     return result;
// // }


// // // const { pool } = require('../config/db');

// // // const DiagnosisModel = {
// // //     // 1. Simpan Hasil Diagnosa Baru
// // //     create: async (data) => {
// // //         // Destructure data yang dikirim dari controller
// // //         const { nama_pasien, email, umur, alasan, total_skor, kategori, gejala_dipilih } = data;
        
// // //         // Ubah array gejala [1, 0, 3...] menjadi string JSON agar bisa masuk database
// // //         const gejalaString = JSON.stringify(gejala_dipilih); 

// // //         const query = `
// // //             INSERT INTO hasil_diagnosa 
// // //             (nama_pasien, email, umur, keluhan, total_skor, hasil_penyakit, detail_gejala, tanggal_diagnosa) 
// // //             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
// // //         `;
        
// // //         // Mapping data ke tanda tanya (?) di atas
// // //         const [result] = await pool.execute(query, [
// // //             nama_pasien, 
// // //             email || '-',    // Jika kosong, isi '-'
// // //             umur || 0,       // Jika kosong, isi 0
// // //             alasan || '-',   // 'alasan' dari form disimpan ke kolom 'keluhan' di DB
// // //             total_skor, 
// // //             kategori, 
// // //             gejalaString
// // //         ]);
        
// // //         return result.insertId;
// // //     },

// // //     // 2. Ambil Semua Data untuk Dashboard (History)
// // //     getAll: async () => {
// // //         const query = `SELECT * FROM hasil_diagnosa ORDER BY tanggal_diagnosa DESC`;
// // //         const [rows] = await pool.query(query);
// // //         return rows;
// // //     },

// // //     // 3. Hapus Data (Opsional)
// // //     deleteHasilDiagnosisById: async (id) => {
// // //         const query = `DELETE FROM hasil_diagnosa WHERE id = ?`;
// // //         const [result] = await pool.execute(query, [id]);
// // //         return result;
// // //     }
// // // };

// // // module.exports = DiagnosisModel;

// // // // import { pool } from '../config/db.js';

// // // // export const getAllGejala = async () => {
// // // //   const [rows] = await pool.query('SELECT * FROM gejala');
// // // //   return rows;
// // // // };

// // // // export const insertHasilDiagnosis = async (ide_pengguna, nama_pasien, hasil_penyakit, persentase) => {
// // // //   const [result] = await pool.query(
// // // //     'INSERT INTO hasil_diagnosa (nama_pasien, hasil_penyakit, persentase) VALUES (?, ?, ?)',
// // // //     [ide_pengguna, nama_pasien, hasil_penyakit, persentase]
// // // //   );
// // // //   return result;
// // // // };

// // // // export const getAllHasilDiagnosis = async () => {
// // // //   const [rows] = await pool.query('SELECT * FROM hasil_diagnosa ORDER BY tanggal DESC');
// // // //   return rows;
// // // // };

// // // // export const deleteHasilDiagnosisById = async (id) => {
// // // //   const [result] = await pool.query('DELETE FROM hasil_diagnosa WHERE id = ?', [id]);
// // // //   return result;
// // // // };
