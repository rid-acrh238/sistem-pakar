// public/assets/js/dashboard/modules/home.js
import { fetchWithAuth, API_BASE_URL } from '../utils.js';

export async function initHome() {
    console.log("🏠 Masuk Dashboard Home");
    
    // Ambil data statistik (Fetch Parallel biar cepet)
    const [resGejala, resAturan] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/gejala`),
        fetchWithAuth(`${API_BASE_URL}/aturan`)
    ]);

    const gejala = await resGejala.json();
    const aturan = await resAturan.json();

    document.getElementById('totalGejala').innerText = gejala.length || 0;
    document.getElementById('totalAturan').innerText = aturan.length || 0;
    
    // Panggil fungsi render chart di sini (kalau ada)
}