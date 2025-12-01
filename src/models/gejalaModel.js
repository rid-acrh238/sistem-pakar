import { pool } from '../config/db.js';

/**
 * GET semua gejala 
 */
export const getAllGejala = async () => {
   const [rows] = await pool.query(`
      SELECT *
      FROM gejala
      ORDER BY CAST(SUBSTRING(kode_gejala, 2) AS UNSIGNED) ASC
   `);
   return rows;
};

/**
 * GET gejala by ID 
 */
export const getGejalaById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM gejala WHERE id_gejala = ?', [id]);
  return rows[0];
};

/**
 * INSERT gejala 
 * auto-generate kode di sini.
 */
export const insertGejala = async (nama_gejala) => {
  // Hitung jumlah gejala aktual
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM gejala`);
  const nextNum = countRows[0].total + 1;

  // Generate kode berurutan
  const kode_gejala = `C${nextNum}`;

  const [result] = await pool.query(
    'INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)',
    [kode_gejala, nama_gejala]
  );

  return { insertId: result.insertId, kode_gejala };
};

// export const insertGejala = async (nama_gejala) => {
//   // Ambil ID maksimum
//   const [rows] = await pool.query(`SELECT MAX(id_gejala) AS maxId FROM gejala`);
//   const nextId = (rows[0].maxId || 0) + 1;

//   // Generate kode otomatis
//   const kode_gejala = `C${nextId}`;

//   const [result] = await pool.query(
//     'INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)',
//     [kode_gejala, nama_gejala]
//   );

//   return { insertId: result.insertId, kode_gejala };
// };

/**
 * UPDATE gejala
 */
export const updateGejala = async (id, data) => {
  const { nama_gejala } = data;
  return pool.query(
    "UPDATE gejala SET nama_gejala = ? WHERE id_gejala = ?",
    [nama_gejala, id]
  );
};

/**
 * DELETE gejala 
 */
export const deleteGejala = async (id) => {
  const [result] = await pool.query('DELETE FROM gejala WHERE id_gejala=?', [id]);
  return result;
};


// import { pool } from '../config/db.js';

// // export const getAllGejala = async () => {
// //   const [rows] = await pool.query('SELECT * FROM gejala');
// //   return rows;
// // };

// export const getAllGejala = async () => {
//    const [rows] = await pool.query(`
//       SELECT *
//       FROM gejala
//       ORDER BY CAST(SUBSTRING(kode_gejala, 2) AS UNSIGNED) ASC
//    `);
//    return rows;
// };



// export const getGejalaById = async (id) => {
//   const [rows] = await pool.query('SELECT * FROM gejala WHERE id_gejala = ?', [id]);
//   return rows[0];
// };

// export const insertGejala = async (data) => {
//   const [result] = await pool.query(
//     'INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)',
//     [data.kode_gejala, data.nama_gejala]
//   );
//   return result;
// };

// // export const updateGejala = async (id, data) => {
// //   const [result] = await pool.query(
// //     'UPDATE gejala SET kode_gejala=?, nama_gejala=? WHERE id_gejala=?',
// //     [data.kode_gejala, data.nama_gejala, id]
// //   );
// //   return result;
// // };
// export const updateGejala = async (id, data) => {
//   const { nama_gejala } = data;
//   return pool.query(
//     "UPDATE gejala SET nama_gejala = ? WHERE id_gejala = ?",
//     [nama_gejala, id]
//   );
// };
// export const deleteGejala = async (id) => {
//   const [result] = await pool.query('DELETE FROM gejala WHERE id_gejala=?', [id]);
//   return result;
// };
