import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// 1. Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Siapkan Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sistem-pakar-uploads', // Nama folder di dashboard Cloudinary nanti
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Opsional: Resize otomatis
    }
});

// 3. Buat middleware upload
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Maksimal 2MB
});

export default upload;


// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // 👇 Trik untuk membuat __dirname di ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Arahkan ke folder uploads di root
//         cb(null, path.join(__dirname, '../../uploads')); 
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//         cb(null, true);
//     } else {
//         cb(new Error('Format file tidak didukung! Hanya JPG/PNG.'), false);
//     }
// };

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//     fileFilter: fileFilter
// });

// // Gunakan export default
// export default upload;