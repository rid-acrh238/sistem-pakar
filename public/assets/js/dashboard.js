document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. KONFIGURASI & STATE GLOBAL
    // ==========================================
    const API_BASE_URL = '/api'; 
    let is3DMode = false;       // Status Chart 2D/3D
    let savedChartData = {};    // Simpan data chart sementara

    // Cek Token saat pertama load
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    // ==========================================
    // 2. HELPER FUNCTIONS (Fungsi Pembantu)
    // ==========================================

    // Fetch dengan Auth & Auto Logout
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(url, { ...options, headers });

            // Jika token kadaluarsa (401/403)
            if (response.status === 401 || response.status === 403) {
                console.warn('⚠️ Sesi habis. Logout...');
                localStorage.removeItem('token');
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
                window.location.href = '/auth/login.html';
                return null;
            }
            return response;
        } catch (error) {
            console.error("Network Error:", error);
            return null;
        }
    }

    // Format Tanggal Indonesia
    function formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    // Loader Tabel Generik (Agar tidak copy-paste logika loading)
    async function loadTableData(url, tableId, renderRowFn) {
        const tbody = document.getElementById(tableId);
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="100%" class="text-center p-4 text-gray-500">Memuat data...</td></tr>';

        const res = await fetchWithAuth(url);
        if (!res || !res.ok) {
            tbody.innerHTML = '<tr><td colspan="100%" class="text-center p-4 text-red-500">Gagal mengambil data.</td></tr>';
            return;
        }

        const json = await res.json();
        // Ambil array dari property .data atau langsung array
        const items = Array.isArray(json) ? json : (json.data || []);

        tbody.innerHTML = ''; // Bersihkan loading

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" class="text-center p-4 text-gray-500">Belum ada data.</td></tr>';
            return;
        }

        // Render baris
        items.forEach((item, index) => {
            tbody.innerHTML += renderRowFn(item, index);
        });
    }

    // ==========================================
    // 3. DASHBOARD UTAMA (Home)
    // ==========================================

    async function loadDashboardData() {
        console.log('[Dashboard] Memuat data statistik...');
        
        try {
            const [gejalaRes, aturanRes, hasilRes, adminRes] = await Promise.all([
                fetchWithAuth(`${API_BASE_URL}/gejala`),
                fetchWithAuth(`${API_BASE_URL}/aturan`),
                fetchWithAuth(`${API_BASE_URL}/diagnosis/hasil`), 
                fetchWithAuth(`${API_BASE_URL}/admin`),
            ]);

            if(!gejalaRes || !hasilRes) return; // Stop jika error auth

            const gejalaData = await gejalaRes.json();
            const aturanData = await aturanRes.json();
            const hasilData = await hasilRes.json();
            const adminData = await adminRes.json();

            // Ekstraksi Data Aman
            const listGejala = gejalaData.data || gejalaData || [];
            const listAturan = aturanData.data || aturanData || [];
            const listDiagnosa = hasilData.data || hasilData || [];
            const listAdmin = adminData.data || adminData || [];

            // A. Update Kartu Statistik
            const safeSetText = (id, val) => {
                const el = document.getElementById(id);
                if(el) el.textContent = val;
            };
            safeSetText('totalGejala', listGejala.length);
            safeSetText('totalAturan', listAturan.length);
            safeSetText('totalHasilDiagnosa', listDiagnosa.length);
            safeSetText('totalAdmin', listAdmin.length);

            // B. Update Tabel 5 Diagnosa Terakhir
            const recentTableBody = document.getElementById('recentDiagnosisTableBody');
            if (recentTableBody) {
                recentTableBody.innerHTML = '';
                const recentFive = listDiagnosa.slice(-5).reverse();
                
                if (recentFive.length === 0) {
                    recentTableBody.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-gray-500">Belum ada data.</td></tr>';
                } else {
                    let no = 1;
                    recentFive.forEach(item => {
                        const skor = item.total_skor || 0;
                        const persen = item.persentase ? item.persentase + '%' : '-';
                        
                        recentTableBody.innerHTML += `
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="py-3 px-4 text-center font-bold text-gray-500">${no++}</td>
                                <td class="py-3 px-4 text-sm">${formatDate(item.tanggal || item.tanggal_diagnosa)}</td>
                                <td class="py-3 px-4 font-medium text-gray-900">
                                    ${item.nama_pasien} <br>
                                    <span class="text-xs text-teal-600 font-bold">${item.hasil_penyakit || 'Belum ada hasil'}</span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        ${skor} (${persen})
                                    </span>
                                </td>
                            </tr>`;
                    });
                }
            }

            // C. Siapkan Data Chart (Grouping)
            const statsKategori = {};
            listDiagnosa.forEach(item => {
                const label = item.hasil_penyakit || 'Lainnya';
                statsKategori[label] = (statsKategori[label] || 0) + 1;
            });

            // Simpan ke Global & Render
            savedChartData = statsKategori;
            renderChart(statsKategori);

        } catch (err) {
            console.error("Gagal load dashboard:", err);
        }
    }

    // ==========================================
    // 4. CHART LOGIC (Highcharts)
    // ==========================================

    window.toggleChart3D = function() {
        is3DMode = !is3DMode; // Switch
        
        // Update UI Tombol
        const btnText = document.getElementById('textToggle3D');
        const btn = document.getElementById('btnToggle3D');
        if(btn && btnText) {
            if (is3DMode) {
                btnText.innerText = "Kembali ke 2D";
                btn.className = "bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center";
            } else {
                btnText.innerText = "Ubah ke 3D";
                btn.className = "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center";
            }
        }
        renderChart(savedChartData);
    };

    function renderChart(data) {
        if (typeof Highcharts === 'undefined') return;

        const categories = Object.keys(data);
        const values = Object.values(data);

        Highcharts.chart('diagnosisChart', {
            chart: {
                type: 'column',
                options3d: {
                    enabled: is3DMode,
                    alpha: 15, beta: 15, depth: 50, viewDistance: 25
                },
                backgroundColor: 'transparent'
            },
            title: {
                text: is3DMode ? 'Statistik (Mode 3D)' : 'Statistik (Mode 2D)',
                align: 'left'
            },
            xAxis: { categories: categories, labels: { skew3d: is3DMode } },
            yAxis: { title: { text: 'Jumlah Pasien' }, allowDecimals: false },
            plotOptions: {
                column: {
                    depth: is3DMode ? 40 : 0,
                    colorByPoint: true,
                    borderRadius: is3DMode ? 0 : 5
                }
            },
            colors: ['#2dd4bf', '#fbbf24', '#f87171', '#60a5fa'],
            series: [{ name: 'Jumlah', data: values, showInLegend: false }],
            credits: { enabled: false }
        });
    }

    // ==========================================
    // 5. DATA LOADERS (Tabel Menu Lain)
    // ==========================================

    // --- TABEL GEJALA ---
    window.loadGejalaData = function() {
        loadTableData(`${API_BASE_URL}/gejala`, 'gejalaTableBody', (item, index) => `
            <tr class="bg-white border-b hover:bg-gray-50 transition">
                <td class="py-4 px-6 text-center font-medium">${index + 1}</td>
                <td class="py-4 px-6 font-mono text-teal-600 font-bold">${item.kode_gejala}</td>
                <td class="py-4 px-6">${item.nama_gejala}</td>
                <td class="py-4 px-6 text-center space-x-2">
                    <button class="bg-yellow-400 text-white py-1 px-3 rounded text-sm hover:bg-yellow-500 transition">Edit</button>
                    <button class="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition">Hapus</button>
                </td>
            </tr>
        `);
    };

    // --- TABEL PENYAKIT ---
    window.loadPenyakitData = function() {
        loadTableData(`${API_BASE_URL}/penyakit`, 'penyakitTableBody', (item) => `
            <tr class="bg-white border-b hover:bg-gray-50 transition">
                <td class="py-4 px-6 font-mono text-teal-600 font-bold">${item.kode_penyakit}</td>
                <td class="py-4 px-6 font-semibold">${item.nama_penyakit}</td>
                <td class="py-4 px-6 text-sm text-gray-600 max-w-xs truncate" title="${item.deskripsi}">${item.deskripsi || '-'}</td>
                <td class="py-4 px-6 text-center">
                    <button class="bg-yellow-400 text-white py-1 px-3 rounded text-sm hover:bg-yellow-500">Edit</button>
                </td>
            </tr>
        `);
    };

    // --- TABEL ATURAN ---
    window.loadAturanData = function() {
        let no = 1;
        loadTableData(`${API_BASE_URL}/aturan`, 'aturanTableBody', (item) => `
            <tr class="bg-white border-b hover:bg-gray-50 transition">
                <td class="py-4 px-6 text-center font-medium">${no++}</td>
                <td class="py-4 px-6 text-center">
                    <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-200">
                        ${item.kode_penyakit || item.hasil}
                    </span>
                </td>
                <td class="py-4 px-6 font-mono text-sm text-gray-600 max-w-md break-words">
                    ${item.kondisi}
                </td>
                <td class="py-4 px-6 text-center space-x-2">
                    <button class="bg-yellow-400 text-white py-1 px-3 rounded text-sm hover:bg-yellow-500">Edit</button>
                    <button class="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600">Hapus</button>
                </td>
            </tr>
        `);
    };

    // --- TABEL ADMIN (Foto Profil Fix) ---
    window.loadAdminData = function() {
        loadTableData(`${API_BASE_URL}/admin`, 'adminTableBody', (item) => {
            // Logika Foto
            const hasPhoto = item.foto_profil && item.foto_profil !== 'default.jpg';
            const avatarUrl = hasPhoto 
                ? `/uploads/${item.foto_profil}` 
                : `https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=128`;

            return `
            <tr class="bg-white border-b hover:bg-gray-50 transition">
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <img class="w-10 h-10 rounded-full border object-cover flex-shrink-0" 
                             src="${avatarUrl}" 
                             onerror="this.src='https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=128'">
                        <span class="font-medium text-gray-900">${item.username}</span>
                    </div>
                </td>
                <td class="py-4 px-6">${item.nama_lengkap}</td>
                <td class="py-4 px-6 text-gray-500 text-sm">${item.email}</td>
                <td class="py-4 px-6 text-center text-sm">${formatDate(item.created_at)}</td>
                <td class="py-4 px-6 text-center space-x-2">
                    <button class="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">Pass</button>
                    <button class="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600">Hapus</button>
                </td>
            </tr>`;
        });
    };

    // --- TABEL HASIL & LAPORAN ---
    const renderHasilRow = (item, index) => {
        const bgBadge = (item.hasil_penyakit || '').includes('Berat') ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800';
        return `
        <tr class="bg-white border-b hover:bg-gray-50 transition">
            <td class="py-4 px-6 text-center font-bold text-gray-500">${index + 1}</td>
            <td class="py-4 px-6 text-sm text-gray-600">${formatDate(item.tanggal)}</td>
            <td class="py-4 px-6 font-medium capitalize">${item.nama_pasien}</td>
            <td class="py-4 px-6">
                <span class="${bgBadge} px-3 py-1 rounded-full text-xs font-semibold">
                    ${item.hasil_penyakit || '-'}
                </span>
            </td>
            <td class="py-4 px-6 text-center font-mono text-sm">
                ${item.total_skor} (${item.persentase || 0}%)
            </td>
            <td class="py-4 px-6 text-center">
                <button class="text-red-500 hover:text-red-700" onclick="alert('Fitur hapus belum dipasang')">
                    <i data-feather="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>`;
    };

    window.loadHasilDiagnosa = function() {
        loadTableData(`${API_BASE_URL}/diagnosis/hasil`, 'hasilTableBody', renderHasilRow);
    };
    
    window.loadLaporanData = function() {
        loadTableData(`${API_BASE_URL}/diagnosis/hasil`, 'laporanTableBody', renderHasilRow);
    };


    // ==========================================
    // 6. UI LOGIC (Sidebar & Navigasi)
    // ==========================================

    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const logoutButton = document.getElementById('logoutButton');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    // Toggle Sidebar Mobile
    if(mobileMenuButton){
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Navigasi Halaman (SPA Sederhana)
    function showPage(pageId) {
        // Sembunyikan semua halaman
        pageContents.forEach(page => page.classList.add('hidden'));
        
        // Tampilkan halaman target
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.remove('hidden');
            
            // Load data sesuai halaman
            if (pageId === 'pageDashboard') loadDashboardData();
            if (pageId === 'pageDataGejala') loadGejalaData();
            if (pageId === 'pageDataPenyakit') loadPenyakitData();
            if (pageId === 'pageDataAturan') loadAturanData();
            if (pageId === 'pageKelolaAdmin') loadAdminData();
            if (pageId === 'pageHasilDiagnosa') loadHasilDiagnosa();
            if (pageId === 'pageLaporan') loadLaporanData();
        }
        // Update Title di Header
        const pageTitle = document.getElementById('pageTitle');
        if(pageTitle) pageTitle.textContent = pageId.replace('page', '').replace(/([A-Z])/g, ' $1').trim();
    }

    // Event Listener Menu Navigasi
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            showPage(targetPage);
            // Tutup sidebar di mobile setelah klik
            if(window.innerWidth < 768) sidebar.classList.add('-translate-x-full');
        });
    });

    // Logout
    if(logoutButton){
        logoutButton.addEventListener('click', () => {
            if(confirm("Yakin ingin keluar?")){
                localStorage.removeItem('token');
                window.location.href = '/auth/login.html';
            }
        });
    }

    // Tombol Landing Page
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', () => window.location.href = '/diagnosa.html');
    }

    // ==========================================
    // 7. INITIALIZATION
    // ==========================================
    // Load Feather Icons
    if(typeof feather !== 'undefined') feather.replace();

    // Load Default Page (Dashboard)
    showPage('pageDashboard');

});