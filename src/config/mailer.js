// src/config/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendOTP = async (email, otp) => {
    // 👇 GANTI BAGIAN INI:
    // Sesuaikan domain kalau nanti deploy (sekarang localhost dulu)
    const magicLink = `http://localhost:3000/api/admin/magic-login?email=${encodeURIComponent(email)}&otp=${otp}`;

    const mailOptions = {
        from: '"Sistem Pakar Admin" <no-reply@sistempakar.com>',
        to: email,
        subject: '🚀 Link Masuk Ajaib',
        html: `
            <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                <h2>Login Admin Cepat</h2>
                <p>Gak usah ketik kode, klik tombol di bawah ini buat masuk:</p>
                <a href="${magicLink}" style="background-color: #2563eb; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                    MASUK DASHBOARD
                </a>
                <p style="margin-top: 20px; color: #666;">Atau pakai kode manual: <b>${otp}</b></p>
                <p style="font-size: 11px; color: #999;">Link valid 5 menit.</p>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};


// // src/config/mailer.js
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.SMTP_USER, // Email aslimu
//         pass: process.env.SMTP_PASS, // App Password 16 digit
//     },
// });

// export const sendOTP = async (email, otp) => {
//     const mailOptions = {
//         from: '"Admin Sistem Pakar" <no-reply@sistempakar.com>',
//         to: email,
//         subject: '🔐 Kode Masuk Admin',
//         html: `
//             <h3>Login Request</h3>
//             <p>Seseorang (semoga kamu) mencoba masuk sebagai Admin.</p>
//             <p>Kode aksesmu adalah:</p>
//             <h1 style="color: #2563eb;">${otp}</h1>
//             <p>Berlaku 5 menit.</p>
//         `
//     };
//     return transporter.sendMail(mailOptions);
// };


// // // src/config/mailer.js
// // const nodemailer = require('nodemailer');
// // require('dotenv').config();

// // const transporter = nodemailer.createTransport({
// //     service: 'gmail', // atau sesuaikan SMTP lain
// //     auth: {
// //         user: process.env.SMTP_USER,
// //         pass: process.env.SMTP_PASS,
// //     },
// // });

// // const sendOTP = async (email, otp) => {
// //     const mailOptions = {
// //         from: '"Admin Sistem Pakar" <no-reply@sistempakar.com>',
// //         to: email,
// //         subject: '🔐 Kode Masuk Admin',
// //         html: `
// //             <h3>Login Request</h3>
// //             <p>Seseorang (semoga kamu) mencoba masuk sebagai Admin.</p>
// //             <p>Kode aksesmu adalah:</p>
// //             <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
// //             <p>Kode ini kadaluarsa dalam 5 menit.</p>
// //         `
// //     };
// //     return transporter.sendMail(mailOptions);
// // };

// // module.exports = { sendOTP };