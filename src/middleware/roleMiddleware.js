/**
 * Middleware untuk memastikan user adalah admin
 * (pastikan token JWT menyimpan role: 'admin' saat login)
 */
export function onlyAdmin(req, res, next) {
    // Ganti dari req.user ke req.admin (biar konsisten sama authMiddleware)
    if (!req.admin || req.admin.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak: bukan admin' });
    }

    next();
}
