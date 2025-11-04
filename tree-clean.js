// tree-clean.mjs
// 🌳 Generate struktur folder proyek tanpa node_modules, .git, dist, dll

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Buat __dirname manual karena di ESM gak otomatis ada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'coverage', 'build'];
const IGNORED_FILES = ['package-lock.json']; // bisa ditambah kalau mau skip file tertentu

function printTree(dir, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    // Filter folder & file yang di-ignore
    const filtered = items.filter(
        (item) => !IGNORED_DIRS.includes(item.name) && !IGNORED_FILES.includes(item.name)
    );

    filtered.forEach((item, index) => {
        const isLast = index === filtered.length - 1;
        const connector = isLast ? '└── ' : '├── ';

        if (item.isDirectory()) {
            console.log(`${prefix}${connector}📁 ${item.name}`);
            printTree(path.join(dir, item.name), prefix + (isLast ? '    ' : '│   '));
        } else {
            console.log(`${prefix}${connector}📄 ${item.name}`);
        }
    });
}

console.log('📦 Struktur folder proyek (tanpa node_modules/.git):\n');
printTree(__dirname);
