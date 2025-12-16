document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. KONFIGURASI & STATE GLOBAL
    // ==========================================
    const API_BASE_URL = '/api'; 
    let is3DMode = false;
    let savedChartData = {};

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    // ==========================================
    // 2. HELPER FUNCTIONS
    // ==========================================
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(url, { ...options, headers });
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

    function formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    async function loadTableData(url, tableId, renderRowFn, options = {}) {
        const tbody = document.getElementById(tableId);
        if (!tbody) return;

        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="${options.colspan || 6}" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center text-gray-400">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
                        <p>Memuat data...</p>
                    </div>
                </td>
            </tr>
        `;

        const res = await fetchWithAuth(url);
        if (!res || !res.ok) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${options.colspan || 6}" class="text-center py-8 text-red-500">
                        <div class="flex flex-col items-center">
                            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Gagal mengambil data.
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const json = await res.json();
        const items = Array.isArray(json) ? json : (json.data || []);

        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${options.colspan || 6}" class="text-center py-8 text-gray-500">
                        <div class="flex flex-col items-center">
                            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            Belum ada data.
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        items.forEach((item, index) => {
            tbody.innerHTML += renderRowFn(item, index);
        });
    }

    // ==========================================
    // 3. DASHBOARD UTAMA
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

            if(!gejalaRes || !hasilRes) return;

            const gejalaData = await gejalaRes.json();
            const aturanData = await aturanRes.json();
            const hasilData = await hasilRes.json();
            const adminData = await adminRes.json();

            const listGejala = gejalaData.data || gejalaData || [];
            const listAturan = aturanData.data || aturanData || [];
            const listDiagnosa = hasilData.data || hasilData || [];
            const listAdmin = adminData.data || adminData || [];

            // Update Kartu Statistik
            const safeSetText = (id, val) => {
                const el = document.getElementById(id);
                if(el) el.textContent = val;
            };
            safeSetText('totalGejala', listGejala.length);
            safeSetText('totalAturan', listAturan.length);
            safeSetText('totalHasilDiagnosa', listDiagnosa.length);
            safeSetText('totalAdmin', listAdmin.length);

            // Tabel 5 Diagnosa Terakhir
            const recentTableBody = document.getElementById('recentDiagnosisTableBody');
            if (recentTableBody) {
                recentTableBody.innerHTML = '';
                const recentFive = listDiagnosa.slice(-5).reverse();
                
                if (recentFive.length === 0) {
                    recentTableBody.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center py-6 text-gray-500">
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    Belum ada data diagnosa.
                                </div>
                            </td>
                        </tr>`;
                } else {
                    recentFive.forEach((item, index) => {
                        const skor = item.total_skor || 0;
                        const persen = item.persentase ? item.persentase + '%' : '-';
                        
                        recentTableBody.innerHTML += `
                            <tr class="border-b hover:bg-gray-50 transition-colors">
                                <td class="py-4 px-4 text-center font-medium text-gray-700">${index + 1}</td>
                                <td class="py-4 px-4 text-sm text-gray-600">${formatDate(item.tanggal || item.tanggal_diagnosa)}</td>
                                <td class="py-4 px-4">
                                    <div class="font-medium text-gray-900">${item.nama_pasien || 'N/A'}</div>
                                    <div class="text-xs text-teal-600 font-semibold mt-1">${item.hasil_penyakit || 'Belum ada hasil'}</div>
                                </td>
                                <td class="py-4 px-4 text-center">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        ${skor} (${persen})
                                    </span>
                                </td>
                            </tr>`;
                    });
                }
            }

            // Data Chart
            const statsKategori = {};
            listDiagnosa.forEach(item => {
                const label = item.hasil_penyakit || 'Lainnya';
                statsKategori[label] = (statsKategori[label] || 0) + 1;
            });

            savedChartData = statsKategori;
            renderChart(statsKategori);

        } catch (err) {
            console.error("Gagal load dashboard:", err);
        }
    }

    // ==========================================
    // 4. CHART LOGIC
    // ==========================================
    window.toggleChart3D = function() {
        is3DMode = !is3DMode;
        
        const btnText = document.getElementById('textToggle3D');
        const btn = document.getElementById('btnToggle3D');
        if(btn && btnText) {
            if (is3DMode) {
                btnText.innerText = "Kembali ke 2D";
                btn.className = "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition bg-teal-100 text-teal-700 hover:bg-teal-200";
            } else {
                btnText.innerText = "Ubah ke 3D";
                btn.className = "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition bg-indigo-100 text-indigo-600 hover:bg-indigo-200";
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
                backgroundColor: 'transparent',
                height: 400
            },
            title: {
                text: is3DMode ? 'Statistik Diagnosa (Mode 3D)' : 'Statistik Diagnosa (Mode 2D)',
                align: 'left',
                style: { fontSize: '16px', fontWeight: 'bold', color: '#374151' }
            },
            xAxis: { 
                categories: categories, 
                labels: { 
                    style: { fontSize: '12px', color: '#6B7280' },
                    skew3d: is3DMode 
                },
                title: { text: 'Kategori Penyakit', style: { color: '#6B7280' } }
            },
            yAxis: { 
                title: { 
                    text: 'Jumlah Pasien',
                    style: { color: '#6B7280' }
                }, 
                allowDecimals: false,
                gridLineColor: '#F3F4F6'
            },
            plotOptions: {
                column: {
                    depth: is3DMode ? 40 : 0,
                    colorByPoint: true,
                    borderRadius: is3DMode ? 0 : 4,
                    dataLabels: {
                        enabled: true,
                        format: '{y}',
                        style: { fontSize: '11px', fontWeight: 'bold' }
                    }
                }
            },
            colors: ['#0D9488', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'],
            series: [{ 
                name: 'Jumlah Diagnosa', 
                data: values,
                showInLegend: false 
            }],
            credits: { enabled: false },
            tooltip: {
                headerFormat: '<span style="font-size: 11px">{point.key}</span><br/>',
                pointFormat: '<b>{point.y}</b> pasien',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#E5E7EB'
            }
        });
    }

    // ==========================================
    // 5. DATA LOADERS - TABEL
    // ==========================================

    // --- TABEL GEJALA ---
    window.loadGejalaData = function() {
        loadTableData(`${API_BASE_URL}/gejala`, 'gejalaTableBody', (item, index) => `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6 text-center font-medium text-gray-700">${index + 1}</td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        ${item.kode_gejala}
                    </span>
                </td>
                <td class="py-4 px-6 font-medium text-gray-900">${item.nama_gejala}</td>
                <td class="py-4 px-6">
                    <div class="flex justify-center space-x-2">
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `, { colspan: 4 });
    };

    // --- TABEL PENYAKIT ---
    window.loadPenyakitData = function() {
        loadTableData(`${API_BASE_URL}/penyakit`, 'penyakitTableBody', (item) => `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6">
                    <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ${item.kode_penyakit}
                    </span>
                </td>
                <td class="py-4 px-6 font-semibold text-gray-900">${item.nama_penyakit}</td>
                <td class="py-4 px-6 text-sm text-gray-600">
                    <div class="max-w-xs truncate" title="${item.deskripsi}">
                        ${item.deskripsi || '-'}
                    </div>
                </td>
                <td class="py-4 px-6">
                    <div class="flex justify-center">
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </td>
            </tr>
        `, { colspan: 4 });
    };

    // --- TABEL ATURAN ---
    window.loadAturanData = function() {
        let no = 1;
        loadTableData(`${API_BASE_URL}/aturan`, 'aturanTableBody', (item) => `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6 text-center font-medium text-gray-700">${no++}</td>
                <td class="py-4 px-6 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        ${item.kode_penyakit || item.hasil}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <div class="font-mono text-sm text-gray-600 break-words max-w-lg">
                        ${item.kondisi || item.kode_gejala || '-'}
                    </div>
                </td>
                <td class="py-4 px-6">
                    <div class="flex justify-center space-x-2">
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `, { colspan: 4 });
    };

    // --- TABEL ADMIN ---
    window.loadAdminData = function() {
        loadTableData(`${API_BASE_URL}/admin`, 'adminTableBody', (item) => {
            const hasPhoto = item.foto_profil && item.foto_profil !== 'default.jpg';
            const avatarUrl = hasPhoto 
                ? `/uploads/${item.foto_profil}` 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'Admin')}&background=random&color=fff&size=128`;

            return `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <img class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
                             src="${avatarUrl}" 
                             alt="${item.username}"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'Admin')}&background=random&color=fff&size=128'">
                        <div>
                            <div class="font-medium text-gray-900">${item.username}</div>
                            <div class="text-xs text-gray-500">ID: ${item.id || '-'}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 font-medium text-gray-900">${item.nama_lengkap}</td>
                <td class="py-4 px-6">
                    <div class="text-sm text-gray-600">${item.email || '-'}</div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-500">${formatDate(item.created_at)}</td>
                <td class="py-4 px-6">
                    <div class="flex justify-center space-x-2">
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Password
                        </button>
                        <button class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>`;
        }, { colspan: 5 });
    };

    // --- TABEL HASIL DIAGNOSA ---
    const renderHasilRow = (item, index) => {
        const skor = item.total_skor || 0;
        const persen = item.persentase || 0;
        const hasil = item.hasil_penyakit || '-';
        
        let badgeClass = 'bg-gray-100 text-gray-800';
        if (hasil.includes('Berat')) badgeClass = 'bg-red-100 text-red-800';
        else if (hasil.includes('Sedang')) badgeClass = 'bg-yellow-100 text-yellow-800';
        else if (hasil.includes('Ringan')) badgeClass = 'bg-green-100 text-green-800';

        return `
        <tr class="border-b hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6 text-center font-medium text-gray-700">${index + 1}</td>
            <td class="py-4 px-6">
                <div class="text-sm text-gray-600">${formatDate(item.tanggal)}</div>
                <div class="text-xs text-gray-400">${new Date(item.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
            </td>
            <td class="py-4 px-6 font-medium text-gray-900 capitalize">${item.nama_pasien}</td>
            <td class="py-4 px-6">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeClass}">
                    ${hasil}
                </span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div class="bg-teal-600 h-2 rounded-full" style="width: ${Math.min(persen, 100)}%"></div>
                    </div>
                    <span class="text-sm font-mono font-medium text-gray-700">${skor} (${persen}%)</span>
                </div>
            </td>
            <td class="py-4 px-6">
                <div class="flex justify-center space-x-2">
                    <button class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" onclick="alert('Fitur hapus belum dipasang')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    };

    window.loadHasilDiagnosa = function() {
        loadTableData(`${API_BASE_URL}/diagnosis/hasil`, 'hasilTableBody', renderHasilRow, { colspan: 6 });
    };
    
    window.loadLaporanData = function() {
        loadTableData(`${API_BASE_URL}/diagnosis/hasil`, 'laporanTableBody', renderHasilRow, { colspan: 5 });
    };

    // ==========================================
    // 6. UI LOGIC
    // ==========================================
    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const logoutButton = document.getElementById('logoutButton');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    if(mobileMenuButton){
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    function showPage(pageId) {
        pageContents.forEach(page => page.classList.add('hidden'));
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
        
        const pageTitle = document.getElementById('pageTitle');
        if(pageTitle) {
            const titleMap = {
                'pageDashboard': 'Dashboard',
                'pageProfil': 'Profil Saya',
                'pageDataGejala': 'Data Gejala',
                'pageDataPenyakit': 'Data Penyakit',
                'pageDataAturan': 'Data Aturan',
                'pageHasilDiagnosa': 'Hasil Diagnosa',
                'pageKelolaAdmin': 'Kelola Admin',
                'pageLaporan': 'Laporan'
            };
            pageTitle.textContent = titleMap[pageId] || pageId.replace('page', '').replace(/([A-Z])/g, ' $1').trim();
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            showPage(targetPage);
            if(window.innerWidth < 768) sidebar.classList.add('-translate-x-full');
        });
    });

    if(logoutButton){
        logoutButton.addEventListener('click', () => {
            if(confirm("Yakin ingin keluar?")){
                localStorage.removeItem('token');
                window.location.href = '/auth/login.html';
            }
        });
    }

    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', () => window.location.href = '/diagnosa.html');
    }

    // ==========================================
    // 7. INITIALIZATION
    // ==========================================
    if(typeof feather !== 'undefined') feather.replace();
    showPage('pageDashboard');

});