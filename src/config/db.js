// src/config/db.js
import mysql from 'mysql2/promise';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Buat koneksi pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
        rejectUnauthorized: false
    }
});

// ✅ Coba koneksi awal
pool.getConnection((err, conn) => {
  if (err) {
    console.error(chalk.redBright('❌ Gagal konek ke database MySQL:'));
    console.error(chalk.yellow(err.message));
    process.exit(1);
  } else {
    console.log(chalk.greenBright('✅ Pool MySQL aktif dan siap digunakan'));
    conn.release();
  }
});

// ✅ Handle error runtime (biar server gak mati diam-diam)
pool.on('error', (err) => {
  console.error(chalk.red('⚠️ Database error:'), err.code);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.warn(chalk.yellow('🔁 Reconnecting to MySQL...'));
  } else {
    throw err;
  }
});
