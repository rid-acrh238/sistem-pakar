import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware untuk memverifikasi access token JWT
 */
export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //const token = authHeader && authHeader.split(' ')[1];

    // if (!token) {
    //     return res.status(401).json({ message: 'Token tidak ditemukan' });
    // }
    if (!authHeader) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa' });
  }
};

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             if (err.name === 'TokenExpiredError') {
//                 // Token expired → biar frontend bisa auto-refresh
//                 return res.status(401).json({ message: 'Token kadaluarsa' });
//             } else {
//                 return res.status(403).json({ message: 'Token tidak valid' });
//             }
//         }

//         req.admin = decoded; // simpan data admin ke request
//         next();
//     });
// }



// ✅ versi opsional
export function verifyTokenOptional(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(); // kalau tidak ada token, tetap lanjut (untuk register publik)

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) req.admin = decoded; // simpan role jika valid
    next(); // lanjutkan tanpa error
  });
}