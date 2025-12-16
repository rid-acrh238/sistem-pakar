// public/assets/js/dashboard/modules/gejala.js
import { fetchWithAuth, loadTableData, API_BASE_URL } from '../utils.js';

// 1. Fungsi Init (Dipanggil pas buka halaman)
export function initGejala() {
    console.log("🚀 Masuk Halaman Gejala");
    
    // Load Data
    loadGejalaData();

    // Setup Tombol Tambah (Pakai teknik clone biar gak double listener)
    const btn = document.getElementById('btnTambahGejala');
    if(btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', handleTambah);
    }
}

// 2. Load Table
function loadGejalaData() {
    loadTableData('/gejala', 'gejalaTableBody', (item, i) => `
        <tr class="border-b bg-white hover:bg-gray-50">
            <td class="p-3 text-center">${i+1}</td>
            <td class="p-3 font-bold text-teal-700">${item.kode_gejala}</td>
            <td class="p-3">${item.nama_gejala}</td>
            <td class="p-3 text-center">
                <button class="btn-aksi bg-red-500 text-white px-2 py-1 rounded text-sm" 
                    onclick="window.hapusGejala('${item.id_gejala}')">Hapus</button>
            </td>
        </tr>
    `);
}

// 3. Logic Tambah & Hapus
async function handleTambah() {
    // ... Logika SweetAlert kamu copas ke sini ...
    // Panggil fetchWithAuth(...)
    // Kalau sukses: loadGejalaData();
    console.log("Tombol tambah diklik");
}

// Biar fungsi hapus bisa dipanggil dari HTML onclick="", kita tembak ke window
window.hapusGejala = async (id) => {
    if(!confirm("Hapus gejala ini?")) return;
    await fetchWithAuth(`${API_BASE_URL}/gejala/${id}`, { method: 'DELETE' });
    loadGejalaData();
};