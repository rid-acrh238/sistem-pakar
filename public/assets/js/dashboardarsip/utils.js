// public/assets/js/dashboard/utils.js

export const API_BASE_URL = '/api';

// --- Auth Helper ---
export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/login';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const res = await fetch(url, { ...options, headers });
        if (res.status === 401) {
            alert("Sesi habis. Login ulang ya!");
            localStorage.clear();
            window.location.href = '/auth/login';
        }
        return res;
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}

// --- Format Tanggal ---
export function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
}

// --- Loading Tabel Helper ---
export async function loadTableData(endpoint, tableBodyId, renderRowFn) {
    const tbody = document.getElementById(tableBodyId);
    if(!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="100%" class="text-center p-4">Loading...</td></tr>';
    
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}${endpoint}`);
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data || []);
        
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" class="text-center p-4">Kosong.</td></tr>';
        } else {
            data.forEach((item, index) => {
                tbody.innerHTML += renderRowFn(item, index);
            });
        }
        return data; // Return data kalau butuh diproses lagi
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="100%" class="text-center text-red-500">Error ambil data.</td></tr>';
    }
}