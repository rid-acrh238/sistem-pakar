document.addEventListener('DOMContentLoaded', () => {
     
    // --- STATE & CONFIG ---
    const token = localStorage.getItem('token');
    // fetch('/api/admin/profile', {

    // })
    if (!token) {
        window.location.href = '/auth/login';
    }




    const API_BASE_URL = '/api'; // Assuming same origin
    const HEADERS = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
    };
    let diagnosisChartInstance = null; // To hold the chart object

    

    // --- ELEMENTS ---
    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const logoutButton = document.getElementById('logoutButton');
    const pageTitle = document.getElementById('pageTitle');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    // Modals
    const tambahAdminModal = document.getElementById('tambahAdminModal');
    const ubahPasswordModal = document.getElementById('ubahPasswordModal');
    const openTambahAdminModalButton = document.getElementById('openTambahAdminModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Forms
    const formTambahAdmin = document.getElementById('formTambahAdmin');
    const formUbahPassword = document.getElementById('formUbahPassword');

    // Print Button
    const printButton = document.getElementById('printButton');

    // Alert Toast
    const alertToast = document.getElementById('alertToast');
    const alertMessage = document.getElementById('alertMessage');

    // --- SECURITY CHECK ---
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // --- CORE FUNCTIONS ---

    /**
     * Wrapper for fetch to handle auth and errors
     * @param {string} url - The API endpoint
     * @param {object} options - Fetch options (method, body, etc.)
     */
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        if (!token) {
    console.warn('⚠️ Token hilang dari localStorage, redirect ke login...');
    localStorage.clear();
    window.location.href = '/auth/login';
    return;
        }
        const headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const res = await fetch(url, { ...options, headers });

            if (res.status === 401) {
                console.warn('⚠️ Token kadaluarsa, mencoba refresh...');
                const newToken = await refreshAccessToken();

                if (!newToken) {
                    console.error('Gagal refresh token, arahkan ke login...');
                    localStorage.clear();
                    window.location.href = '/auth/login';
                    return;
                }

                // Retry request pakai token baru
                const retryHeaders = {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                };
                return await fetch(url, { ...options, headers: retryHeaders });
            }

            return res;
        } catch (err) {
            console.error('Fetch error:', err);
            throw err;
        }
    }

    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return null;

        try {
            const res = await fetch('/api/admin/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            console.log('✅ Token berhasil diperbarui!');
            return data.token;
        } catch (err) {
            console.error('Gagal refresh token:', err.message);
            return null;
        }
    }

    // 🔹 Fungsi untuk load profil admin dari token
    // Di dashboard.js, update fungsi ini:

async function loadAdminProfile() {
    try {
        const res = await fetchWithAuth('/api/admin/profile');
        if (!res.ok) throw new Error('Gagal mengambil profil admin');

        const data = await res.json();
        const user = data.user;

        // Update Nama
        const nameEl = document.getElementById('adminName');
        if(nameEl) nameEl.textContent = user.nama_lengkap || 'Admin';

        // Update Avatar Sidebar
        const avatarEl = document.getElementById('adminAvatar');
        if (avatarEl) {
            // 👇 LOGIKA SAMA: Abaikan jika isinya 'default.jpg'
            const hasPhoto = user.foto_profil && user.foto_profil !== 'default.jpg';

            if (hasPhoto) {
                avatarEl.src = `/uploads/${user.foto_profil}?v=${new Date().getTime()}`;
            } else {
                // Pakai UI Avatars
                avatarEl.src = `https://ui-avatars.com/api/?name=${user.nama_lengkap}&background=0D9488&color=fff&size=128`;
            }
        }
    } catch (err) {
        console.error('Gagal memuat profil admin:', err.message);
    }
}
//     async function loadAdminProfile() {
//     try {
//         const res = await fetchWithAuth('/api/admin/profile');
//         if (!res.ok) throw new Error('Gagal mengambil profil admin');

//         const data = await res.json();
//         const user = data.user;

//         // 1. Update Nama
//         const nameEl = document.getElementById('adminName');
//         if(nameEl) nameEl.textContent = user.nama_lengkap || 'Admin';

//         // 2. Update Avatar Sidebar
//         const avatarEl = document.getElementById('adminAvatar');
//         if (avatarEl) {
//             // Cek jika ada foto_profil dari database
//             if (user.foto_profil) {
//                 avatarEl.src = `/uploads/${user.foto_profil}`;
//             } else {
//                 // Fallback ke inisial/dummy jika tidak ada foto
//                 avatarEl.src = `https://i.pravatar.cc/150?u=${user.username}`;
//             }
//         }
        
//         console.log('✅ Profil dimuat. Foto:', user.foto_profil);
//     } catch (err) {
//         console.error('Gagal memuat profil admin:', err.message);
//     }
// }

    function autoLogout(message) {
        Swal.fire({
            title: 'Sesi Berakhir',
            text: message || 'Silakan login ulang untuk melanjutkan.',
            icon: 'warning',
            confirmButtonText: 'Login Ulang',
            confirmButtonColor: '#d33',
        }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nama_lengkap');
            window.location.href = '/auth/login';
        });
        //loadAdminProfile();
    }

    /**
     * Shows/hides pages based on navigation
     * @param {string} pageId - The ID of the page div to show
     */
    function showPage(pageId) {
        // Hide all pages
        pageContents.forEach((page) => page.classList.add('hidden'));

        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');

            // Update page title
            const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
            pageTitle.textContent = navLink ? navLink.textContent.trim() : 'Dashboard';
            // Update active link state
            navLinks.forEach((link) => {
                link.classList.remove('bg-teal-700', 'text-white', 'font-semibold');
            });
            if (navLink) {
                navLink.classList.add('bg-teal-700', 'text-white', 'font-semibold');
            }

            // Load data for the specific page
            switch (pageId) {
                case 'pageDashboard':
                    loadDashboardData();
                    break;
                case 'pageProfil':
                    loadUserProfileForEdit();
                    break;
                case 'pageDataGejala':
                    loadGejalaData();
                    break;
                case 'pageDataPenyakit':
                    loadPenyakitData();
                    break;
                case 'pageDataAturan':
                    loadAturanData();
                    break;
                case 'pageHasilDiagnosa':
                    loadHasilDiagnosaData();
                    break;
                case 'pageKelolaAdmin':
                    loadAdminData();
                    break;
                case 'pageLaporan':
                    loadLaporanData();
                    break;
            }
        }

        // Close mobile sidebar on nav click
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
        }
    }

    /**
     * Shows a success/error toast message
     * @param {string} message - The message to display
     * @param {boolean} isError - True for red, false for green
     */
    function showAlert(message, isError = false) {
        alertMessage.textContent = message;
        alertToast.classList.remove('hidden', 'bg-green-500', 'bg-red-500');

        if (isError) {
            alertToast.classList.add('bg-red-500');
        } else {
            alertToast.classList.add('bg-green-500');
        }

        // Hide after 3 seconds
        setTimeout(() => {
            alertToast.classList.add('hidden');
        }, 3000);
    }

    /**
     * Opens a modal
     * @param {string} modalId - The ID of the modal to open
     */
    function openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    /**
     * Closes a modal
     * @param {string} modalId - The ID of the modal to close
     */
    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    /**
     * Formats a date string (YYYY-MM-DDTHH:mm:ss.sssZ) to DD/MM/YYYY
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    }

    // --- DATA LOADERS ---

    /**
     * Loads all data for the main dashboard
     */
    async function loadDashboardData() {
    console.log('[Dashboard] Mulai ambil data...');
        try {
            // Fetch all data in parallel
            const [gejalaRes, penyakitRes, aturanRes, hasilRes, adminRes] = await Promise.all([
  fetchWithAuth(`${API_BASE_URL}/gejala`),
  fetchWithAuth(`${API_BASE_URL}/penyakit`),
  fetchWithAuth(`${API_BASE_URL}/aturan`),
  fetchWithAuth(`${API_BASE_URL}/diagnosis/hasil`),
  fetchWithAuth(`${API_BASE_URL}/admin`),
]);
console.log('[Dashboard] Semua request selesai.');

    console.log('[Dashboard] Status:', 
      gejalaRes.status, penyakitRes.status, aturanRes.status, hasilRes.status, adminRes.status
    );

const [gejala, penyakit, aturan, hasil, admin] = await Promise.all([
  gejalaRes.json(),
  penyakitRes.json(),
  aturanRes.json(),
  hasilRes.json(),
  adminRes.json(),
]);
console.log('[Dashboard] Data hasil diagnosa:', hasil);
    console.log('[Dashboard] Data admin:', admin);

            // Update stat cards
            document.getElementById('totalGejala').textContent = gejala.length || 0;
            document.getElementById('totalAturan').textContent = aturan.length || 0;
            //document.getElementById('totalPenyakit').textContent = penyakit.length || 0;
            document.getElementById('totalHasilDiagnosa').textContent = hasil.length || 0;
            document.getElementById('totalAdmin').textContent = admin.length || 0;

            // Update recent diagnosis table
            const recentTableBody = document.getElementById('recentDiagnosisTableBody');
            const recentHasil = hasil.slice(-5).reverse(); // Get last 5, newest first
            recentTableBody.innerHTML = ''; // Clear loading

            if (recentHasil.length === 0) {
                recentTableBody.innerHTML =
                    '<tr><td colspan="3" class="text-center p-4 text-gray-500">Belum ada data diagnosa.</td></tr>';
            } else {
                recentHasil.forEach((item) => {
                    recentTableBody.innerHTML += `
                                <tr class="bg-white border-b">
                                    <td class="py-3 px-4">${formatDate(item.tanggal)}</td>
                                    <td class="py-3 px-4 font-medium text-gray-900">${item.hasil_penyakit || 'Tidak Terdiagnosa'}</td>
                                    <td class="py-3 px-4">${parseFloat(item.persentase || 0).toFixed(0)}%</td>
                                </tr>
                            `;
                });
            }

            // Render chart
            renderDiagnosisChart(hasil);
        } catch (error) {
        console.error('[Dashboard] Error:', error);
            showAlert('Gagal memuat data dashboard', true);
        }
    }

    /**
     * Renders the diagnosis distribution chart
     * @param {Array} hasilData - Array of diagnosis results
     */
    function renderDiagnosisChart(hasilData) {
        const ctx = document.getElementById('diagnosisChart').getContext('2d');

        // Process data: count occurrences of each disease
        const counts = hasilData.reduce((acc, curr) => {
            const disease = curr.hasil_penyakit || 'Tidak Terdiagnosa';
            acc[disease] = (acc[disease] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const data = Object.values(counts);

        if (diagnosisChartInstance) {
            diagnosisChartInstance.destroy(); // Destroy old chart before creating new one
        }

        diagnosisChartInstance = new Chart(ctx, {
            type: 'bar', // 'pie' or 'bar'
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Jumlah Diagnosa',
                        data: data,
                        backgroundColor: [
                            'rgba(13, 148, 136, 0.6)', // teal-600
                            'rgba(6, 182, 212, 0.6)', // cyan-500
                            'rgba(16, 185, 129, 0.6)', // emerald-500
                            'rgba(139, 92, 246, 0.6)', // violet-500
                            'rgba(239, 68, 68, 0.6)', // red-500
                            'rgba(236, 72, 153, 0.6)', // pink-500
                        ],
                        borderColor: [
                            'rgba(13, 148, 136, 1)',
                            'rgba(6, 182, 212, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(236, 72, 153, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1, // Only show whole numbers
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: labels.length <= 6, // Only show legend if few items
                    },
                },
            },
        });
    }
    loadDashboardData();

    /**
     * Generic table loader function
     */
    async function loadTableData(endpoint, tableBodyId, rowRenderer) {
        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = `<tr><td colspan="10" class="text-center p-6 text-gray-500">Loading...</td></tr>`;
        try {
            const res = await fetchWithAuth(endpoint);
            const data = await res.json();
            tableBody.innerHTML = ''; // Clear loading
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="10" class="text-center p-6 text-gray-500">Tidak ada data.</td></tr>`;
            } else {
                data.forEach((item) => {
                    tableBody.innerHTML += rowRenderer(item);
                });

                // Re-attach event listeners if needed (e.g., for Kelola Admin)
                if (tableBodyId === 'adminTableBody') {
                    attachAdminButtonListeners();
                }
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="10" class="text-center p-6 text-red-500">Gagal memuat data.</td></tr>`;
        }
    }

    // ===========================
    // 🔹 CRUD: DATA GEJALA
    // ===========================

    function loadGejalaData() {
        const page = document.getElementById('pageDataGejala');
        const tableBody = document.getElementById('gejalaTableBody');

        // Pastikan tombol tambah hanya dibuat sekali
        if (!page.querySelector('#btnTambahGejala')) {
            const btnTambah = document.createElement('button');
            btnTambah.id = 'btnTambahGejala';
            btnTambah.textContent = 'Tambah Gejala';
            btnTambah.className =
                'bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg mb-4';
            btnTambah.addEventListener('click', handleTambahGejala);
            page.querySelector('h2').insertAdjacentElement('afterend', btnTambah);
        }

        // Ambil data gejala
        loadTableData(
            `${API_BASE_URL}/gejala`,
            'gejalaTableBody',
            (item) => `
        <tr class="bg-white border-b hover:bg-gray-50 transition">
            <td class="py-4 px-6 font-medium text-gray-900">${item.kode_gejala}</td>
            <td class="py-4 px-6">${item.nama_gejala}</td>
            <td class="py-4 px-6 space-x-2">
                <button class="btn-edit-gejala bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm" data-id="${item.id_gejala}">Edit</button>
                <button class="btn-hapus-gejala bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id_gejala}">Hapus</button>
            </td>
        </tr>
    `
        ).then(() => attachGejalaListeners());
    }

    /**
     * Tambah data gejala baru
     */
    async function handleTambahGejala() {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Gejala Baru',
            html: `
            <input id="namaGejala" class="swal2-input" placeholder="Nama Gejala">
        `,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            showCancelButton: true,
            preConfirm: () => {
                // const kode = document.getElementById('kodeGejala').value.trim();
                const nama = document.getElementById('namaGejala').value.trim();
                if (!nama) {
                    Swal.showValidationMessage('Semua field wajib diisi!');
                    return false;
                }
                return { nama_gejala: nama };
            },
        });

        if (!formValues) return;

        try {
            await fetchWithAuth('/api/gejala', {
                method: 'POST',
                body: JSON.stringify(formValues),
            });
            Swal.fire('Berhasil!', 'Data gejala berhasil ditambahkan!', 'success');
            loadGejalaData();
            loadDashboardData(); // refresh card
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat menambah data gejala.', 'error');
        }
    }

    /**
     * Edit data gejala
     */
    async function handleEditGejala(id) {
        try {
            const data = await fetchWithAuth(`/api/gejala/${id}`);
            const { value: formValues } = await Swal.fire({
                title: 'Edit Gejala',
                html: `
                <input id="editKodeGejala" class="swal2-input" value="${data.kode_gejala}" placeholder="Kode Gejala" disabled>
                <input id="editNamaGejala" class="swal2-input" value="${data.nama_gejala}" placeholder="Nama Gejala">
            `,
                confirmButtonText: 'Perbarui',
                cancelButtonText: 'Batal',
                showCancelButton: true,
                preConfirm: () => {
                    //const kode = document.getElementById('editKodeGejala').value.trim();
                    const nama = document.getElementById('editNamaGejala').value.trim();
                    if (!nama) {
                        Swal.showValidationMessage('Semua field wajib diisi!');
                        return false;
                    }
                    return { nama_gejala: nama };
                },
            });

            if (!formValues) return;

            await fetchWithAuth(`/api/gejala/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formValues),
            });

            Swal.fire('Berhasil!', 'Data gejala diperbarui!', 'success');
            loadGejalaData();
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat memperbarui data.', 'error');
        }
    }

    /**
     * Hapus data gejala
     */
    async function handleHapusGejala(id) {
        const confirm = await Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Data ini akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        });

        if (!confirm.isConfirmed) return;

        try {
            await fetchWithAuth(`/api/gejala/${id}`, { method: 'DELETE' });
            Swal.fire('Terhapus!', 'Data gejala berhasil dihapus.', 'success');
            loadGejalaData();
            loadDashboardData(); // refresh card
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat menghapus data.', 'error');
        }
    }

    /**
     * Attach listeners untuk tombol Edit dan Hapus
     */
    function attachGejalaListeners() {
        document.querySelectorAll('.btn-edit-gejala').forEach((btn) => {
            btn.addEventListener('click', (e) => handleEditGejala(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-hapus-gejala').forEach((btn) => {
            btn.addEventListener('click', (e) => handleHapusGejala(e.target.dataset.id));
        });
    }

    // ===========================
// 🔹 CRUD: DATA PENYAKIT
// ===========================

function loadPenyakitData() {
    const tableBody = document.getElementById('penyakitTableBody');
  const btnTambah = document.getElementById('btnTambahPenyakit');

  // ✅ pastikan tombol langsung dikaitkan event-nya
  if (btnTambah && !btnTambah.hasListener) {
    btnTambah.addEventListener('click', handleTambahPenyakit);
    btnTambah.hasListener = true; // supaya gak dobel
  }
//   const page = document.getElementById('pageDataPenyakit');
//   const tableBody = document.getElementById('penyakitTableBody');

//   if (!page.querySelector('#btnTambahPenyakit')) {
//     const btnTambah = document.getElementById('btnTambahPenyakit');
//     btnTambah.addEventListener('click', handleTambahPenyakit);
//   }

  loadTableData(
    `${API_BASE_URL}/penyakit`,
    'penyakitTableBody',
    (item) => `
      <tr class="bg-white border-b hover:bg-gray-50 transition">
        <td class="py-4 px-6 font-medium text-gray-900">${item.kode_penyakit}</td>
        <td class="py-4 px-6">${item.nama_penyakit}</td>
        <td class="py-4 px-6 max-w-sm truncate">${item.deskripsi || '-'}</td>
        <td class="py-4 px-6 text-center space-x-2">
          <button class="btn-edit-penyakit bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm" data-id="${item.id}">Edit</button>
          <button class="btn-hapus-penyakit bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id}">Hapus</button>
        </td>
      </tr>
    `
  ).then(() => attachPenyakitListeners());
}

async function handleTambahPenyakit() {
  const { value: formValues } = await Swal.fire({
    title: 'Tambah Penyakit Baru',
    html: `
      <input id="kodePenyakit" class="swal2-input" placeholder="Kode Penyakit (misal P01)">
      <input id="namaPenyakit" class="swal2-input" placeholder="Nama Penyakit">
      <textarea id="deskripsiPenyakit" class="swal2-textarea" placeholder="Deskripsi penyakit"></textarea>
    `,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    showCancelButton: true,
    preConfirm: () => {
      const kode = document.getElementById('kodePenyakit').value.trim();
      const nama = document.getElementById('namaPenyakit').value.trim();
      const deskripsi = document.getElementById('deskripsiPenyakit').value.trim();
      if (!kode || !nama) {
        Swal.showValidationMessage('Kode dan Nama wajib diisi!');
        return false;
      }
      return { kode_penyakit: kode, nama_penyakit: nama, deskripsi };
    },
  });

  if (!formValues) return;

  try {
    await fetchWithAuth('/api/penyakit', {
      method: 'POST',
      body: JSON.stringify(formValues),
    });
    Swal.fire('Berhasil!', 'Data penyakit berhasil ditambahkan!', 'success');
    loadPenyakitData();
    loadDashboardData();
  } catch {
    Swal.fire('Gagal!', 'Tidak dapat menambah data penyakit.', 'error');
  }
}

async function handleEditPenyakit(id) {
  try {
    const res = await fetchWithAuth(`/api/penyakit/${id}`);
    const data = await res.json();

    const { value: formValues } = await Swal.fire({
      title: 'Edit Penyakit',
      html: `
        <input id="editKodePenyakit" class="swal2-input" value="${data.kode_penyakit}" placeholder="Kode Penyakit">
        <input id="editNamaPenyakit" class="swal2-input" value="${data.nama_penyakit}" placeholder="Nama Penyakit">
        <textarea id="editDeskripsiPenyakit" class="swal2-textarea" placeholder="Deskripsi">${data.deskripsi || ''}</textarea>
      `,
      confirmButtonText: 'Perbarui',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      preConfirm: () => {
        const kode = document.getElementById('editKodePenyakit').value.trim();
        const nama = document.getElementById('editNamaPenyakit').value.trim();
        const deskripsi = document.getElementById('editDeskripsiPenyakit').value.trim();
        if (!kode || !nama) {
          Swal.showValidationMessage('Kode dan Nama wajib diisi!');
          return false;
        }
        return { kode_penyakit: kode, nama_penyakit: nama, deskripsi };
      },
    });

    if (!formValues) return;

    await fetchWithAuth(`/api/penyakit/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formValues),
    });

    Swal.fire('Berhasil!', 'Data penyakit berhasil diperbarui!', 'success');
    loadPenyakitData();
  } catch {
    Swal.fire('Gagal!', 'Tidak dapat memperbarui data penyakit.', 'error');
  }
}

async function handleHapusPenyakit(id) {
  const confirm = await Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: 'Data penyakit ini akan dihapus permanen.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  try {
    await fetchWithAuth(`/api/penyakit/${id}`, { method: 'DELETE' });
    Swal.fire('Terhapus!', 'Data penyakit berhasil dihapus.', 'success');
    loadPenyakitData();
    loadDashboardData();
  } catch {
    Swal.fire('Gagal!', 'Tidak dapat menghapus data penyakit.', 'error');
  }
}

function attachPenyakitListeners() {
  document.querySelectorAll('.btn-edit-penyakit').forEach((btn) => {
    btn.addEventListener('click', (e) => handleEditPenyakit(e.target.dataset.id));
  });
  document.querySelectorAll('.btn-hapus-penyakit').forEach((btn) => {
    btn.addEventListener('click', (e) => handleHapusPenyakit(e.target.dataset.id));
  });
}


    // ===========================
    // 🔹 CRUD: DATA ATURAN
    // ===========================

    function loadAturanData() {
        const page = document.getElementById('pageDataAturan');
        const tableBody = document.getElementById('aturanTableBody');

        // buat tombol tambah kalau belum ada
        if (!page.querySelector('#btnTambahAturan')) {
            const btnTambah = document.createElement('button');
            btnTambah.id = 'btnTambahAturan';
            btnTambah.textContent = 'Tambah Aturan';
            btnTambah.className =
                'bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg mb-4';
            btnTambah.addEventListener('click', handleTambahAturan);
            page.querySelector('h2').insertAdjacentElement('afterend', btnTambah);
        }

        // ambil data dari API
        loadTableData(
            `${API_BASE_URL}/aturan`,
            'aturanTableBody',
            (item) => `
        <tr class="bg-white border-b hover:bg-gray-50 transition">
            <td class="py-4 px-6 font-medium text-gray-900">${item.id_aturan}</td>
            <td class="py-4 px-6">${item.kondisi}</td>
            <td class="py-4 px-6">${item.hasil}</td>
            <td class="py-4 px-6 space-x-2">
                <button class="btn-edit-aturan bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm" data-id="${item.id_aturan}">Edit</button>
                <button class="btn-hapus-aturan bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id_aturan}">Hapus</button>
            </td>
        </tr>
    `
        ).then(() => attachAturanListeners());
    }

    /**
     * Tambah aturan baru
     */
    async function handleTambahAturan() {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Aturan Baru',
            html: `
            <textarea id="kondisi" class="swal2-textarea" placeholder="Kondisi (misal: G01 & G03)"></textarea>
            <input id="hasil" class="swal2-input" placeholder="Hasil diagnosa">
        `,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            showCancelButton: true,
            preConfirm: () => {
                const kondisi = document.getElementById('kondisi').value.trim();
                const hasil = document.getElementById('hasil').value.trim();
                if (!kondisi || !hasil) {
                    Swal.showValidationMessage('Semua field wajib diisi!');
                    return false;
                }
                return { kondisi, hasil };
            },
        });

        if (!formValues) return;

        try {
            await fetchWithAuth('/api/aturan', {
                method: 'POST',
                body: JSON.stringify(formValues),
            });
            Swal.fire('Berhasil!', 'Aturan baru berhasil ditambahkan!', 'success');
            loadAturanData();
            loadDashboardData();
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat menambah data aturan.', 'error');
        }
    }

    /**
     * Edit aturan
     */
    async function handleEditAturan(id) {
        try {
            const data = await fetchWithAuth(`/api/aturan/${id}`);
            const { value: formValues } = await Swal.fire({
                title: 'Edit Aturan',
                html: `
                <textarea id="editKondisi" class="swal2-textarea">${data.kondisi}</textarea>
                <input id="editHasil" class="swal2-input" value="${data.hasil}" placeholder="Hasil diagnosa">
            `,
                confirmButtonText: 'Perbarui',
                cancelButtonText: 'Batal',
                showCancelButton: true,
                preConfirm: () => {
                    const kondisi = document.getElementById('editKondisi').value.trim();
                    const hasil = document.getElementById('editHasil').value.trim();
                    if (!kondisi || !hasil) {
                        Swal.showValidationMessage('Semua field wajib diisi!');
                        return false;
                    }
                    return { kondisi, hasil };
                },
            });

            if (!formValues) return;

            await fetchWithAuth(`/api/aturan/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formValues),
            });

            Swal.fire('Berhasil!', 'Aturan diperbarui!', 'success');
            loadAturanData();
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat memperbarui aturan.', 'error');
        }
    }

    /**
     * Hapus aturan
     */
    async function handleHapusAturan(id) {
        const confirm = await Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Data ini akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        });

        if (!confirm.isConfirmed) return;

        try {
            await fetchWithAuth(`/api/aturan/${id}`, { method: 'DELETE' });
            Swal.fire('Terhapus!', 'Data aturan berhasil dihapus.', 'success');
            loadAturanData();
            loadDashboardData();
        } catch (error) {
            Swal.fire('Gagal!', 'Tidak dapat menghapus aturan.', 'error');
        }
    }

    /**
     * Pasang event listener pada tombol Edit & Hapus
     */
    function attachAturanListeners() {
        document.querySelectorAll('.btn-edit-aturan').forEach((btn) => {
            btn.addEventListener('click', (e) => handleEditAturan(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-hapus-aturan').forEach((btn) => {
            btn.addEventListener('click', (e) => handleHapusAturan(e.target.dataset.id));
        });
    }

    function loadHasilDiagnosaData() {
  loadTableData(
    `${API_BASE_URL}/diagnosis/hasil`,
    'hasilDiagnosaTableBody',
    (item) => `
      <tr class="bg-white border-b hover:bg-gray-50">
        <td class="py-4 px-6 font-medium text-gray-900">${item.id}</td>
        <td class="py-4 px-6">${formatDate(item.tanggal)}</td>
        <td class="py-4 px-6">${item.nama_pasien || '-'}</td>
        <td class="py-4 px-6 font-semibold">${item.hasil_penyakit || 'Tidak Terdiagnosa'}</td>
        <td class="py-4 px-6">${parseFloat(item.persentase || 0).toFixed(0)}%</td>
        <td class="py-4 px-6 text-center">
          <button class="btn-hapus-hasil bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id}">
            Hapus
          </button>
        </td>
      </tr>
    `
  ).then(() => attachHasilListeners());
}

function attachHasilListeners() {
  document.querySelectorAll('.btn-hapus-hasil').forEach((btn) => {
    btn.addEventListener('click', (e) => handleHapusHasil(e.target.dataset.id));
  });
}

async function handleHapusHasil(id) {
  const confirm = await Swal.fire({
    title: 'Yakin ingin menghapus hasil diagnosa ini?',
    text: 'Data hasil diagnosa akan dihapus permanen dari sistem.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetchWithAuth(`/api/diagnosis/hasil/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    Swal.fire('Berhasil!', data.message, 'success');

    loadHasilDiagnosaData();
    loadDashboardData(); // refresh jumlah di card
  } catch (error) {
    Swal.fire('Gagal!', error.message || 'Tidak dapat menghapus data hasil diagnosa.', 'error');
  }
}

    
    /**
     * Load data laporan ke tabel dashboard (fitur tampilkan, cetak, export Excel)
     */
    function loadLaporanData() {
        const tableBody = document.getElementById('laporanTableBody');
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const filterButton = document.getElementById('filterButton');
        const printButton = document.getElementById('printButton');
        const exportButton = document.getElementById('exportButton');

        let currentData = [];

        // Ambil semua laporan
        async function fetchLaporan() {
            tableBody.innerHTML =
                '<tr><td colspan="10" class="text-center p-6 text-gray-500">Memuat laporan...</td></tr>';
            try {
                const res = await fetchWithAuth('/api/laporan');
                const data = await res.json();
                currentData = data;
                renderTable(data);
            } catch (err) {
                tableBody.innerHTML =
                    '<tr><td colspan="10" class="text-center p-6 text-red-500">Gagal memuat data laporan.</td></tr>';
            }
        }

        // Filter laporan berdasarkan tanggal
        async function fetchFiltered() {
            const from = dateFrom.value;
            const to = dateTo.value;
            if (!from || !to)
                return Swal.fire(
                    'Perhatian',
                    'Silakan isi rentang tanggal terlebih dahulu.',
                    'info'
                );

            tableBody.innerHTML =
                '<tr><td colspan="10" class="text-center p-6 text-gray-500">Memuat data...</td></tr>';
            try {
                const res = await fetchWithAuth(`/api/laporan/filter?from=${from}&to=${to}`);
                const data = await res.json();
                currentData = data;
                renderTable(data);
            } catch {
                Swal.fire('Gagal', 'Tidak dapat memuat laporan berdasarkan tanggal.', 'error');
            }
        }

        // Render isi tabel laporan
        function renderTable(data) {
            tableBody.innerHTML = '';
            if (data.length === 0) {
                tableBody.innerHTML =
                    '<tr><td colspan="10" class="text-center p-6 text-gray-500">Tidak ada data laporan.</td></tr>';
                return;
            }

            data.forEach((item) => {
                tableBody.innerHTML += `
        <tr class="bg-white border-b hover:bg-gray-50">
          <td class="py-4 px-6 font-medium text-gray-900">${item.id}</td>
          <td class="py-4 px-6">${formatDate(item.tanggal)}</td>
          <td class="py-4 px-6">${item.nama_pasien}</td>
          <td class="py-4 px-6 font-semibold">${item.hasil_penyakit}</td>
          <td class="py-4 px-6">${parseFloat(item.persentase || 0).toFixed(2)}%</td>
        </tr>
      `;
            });
        }

        // Ekspor ke Excel
        function exportToExcel() {
            if (currentData.length === 0)
                return Swal.fire('Info', 'Tidak ada data untuk diekspor.', 'info');

            // Convert ke worksheet
            const worksheet = XLSX.utils.json_to_sheet(
                currentData.map((item) => ({
                    ID: item.id,
                    'Tanggal Diagnosa': formatDate(item.tanggal),
                    'Nama Pasien': item.nama_pasien,
                    'Hasil Penyakit': item.hasil_penyakit,
                    Persentase: `${parseFloat(item.persentase).toFixed(2)}%`,
                }))
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Diagnosa');

            XLSX.writeFile(
                workbook,
                `Laporan_Diagnosa_${new Date().toISOString().slice(0, 10)}.xlsx`
            );
            Swal.fire('Berhasil', 'Laporan berhasil diekspor ke Excel.', 'success');
        }

        // Tombol event listener
        filterButton.onclick = fetchFiltered;
       printButton.onclick = () => {
  if (currentData.length === 0) {
    Swal.fire('Info', 'Tidak ada data untuk dicetak.', 'info');
    return;
  }

  // simpan data laporan ke localStorage
  localStorage.setItem('laporanData', JSON.stringify(currentData));

  // buka halaman print terpisah
  window.open('/laporan/print.html', '_blank');
};


        exportButton.onclick = exportToExcel;

        // Muat data awal
        fetchLaporan();
    }

    /**
 * Menambahkan header otomatis saat print
 */
/**
 * Menampilkan header & footer otomatis saat print laporan
 */
function setupPrintHeader() {
  const printHeader = document.getElementById("printHeader");
  const printFooter = document.getElementById("printFooter");
  const meta = document.getElementById("printMeta");
  const adminName = localStorage.getItem("nama_lengkap") || "Administrator";

  const now = new Date();
  const formattedDate = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  meta.textContent = `Dicetak oleh: ${adminName} — ${formattedDate}, ${formattedTime}`;
  printHeader.classList.remove("hidden");
  printFooter.classList.remove("hidden");

  // Setelah selesai print, sembunyikan lagi
  window.onafterprint = () => {
    printHeader.classList.add("hidden");
    printFooter.classList.add("hidden");
  };
}



 // ===========================
// 🔹 CRUD: KELOLA ADMIN
// ===========================

// function loadAdminData() {
//   loadTableData(`${API_BASE_URL}/admin`, 'adminTableBody', (item) => `
//     <tr class="bg-white border-b hover:bg-gray-50 transition">
//       <td class="py-4 px-6 font-medium text-gray-900">${item.username}</td>
//       <td class="py-4 px-6">${item.nama_lengkap}</td>
//       <td class="py-4 px-6">${item.email || '-'}</td>
//       <td class="py-4 px-6">${formatDate(item.created_at)}</td>
//       <td class="py-4 px-6 text-center space-x-2">
//         <button class="btn-edit-admin bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm" data-id="${item.id}" data-username="${item.username}">Edit</button>
//          <button class="btn-password-admin bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id}">Password</button>
//         <button class="btn-hapus-admin bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" data-id="${item.id}">Hapus</button>
//       </td>
//     </tr>
//   `).then(() => attachAdminButtonListeners());
// }
function loadAdminData() {
  loadTableData(`${API_BASE_URL}/admin`, 'adminTableBody', (item) => {
    
    // 👇 LOGIKA BARU: Cek jika foto ada DAN bukan 'default.jpg'
    const hasPhoto = item.foto_profil && item.foto_profil !== 'default.jpg';

    // Kalau punya foto asli, pakai itu. Kalau tidak (atau default.jpg), pakai UI Avatars.
    const avatarUrl = hasPhoto 
      ? `/uploads/${item.foto_profil}` 
      : `https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=128`;

    return `
      <tr class="bg-white border-b hover:bg-gray-50 transition">
        <td class="py-4 px-6">
          <div class="flex items-center space-x-3">
            <img class="w-10 h-10 rounded-full border border-gray-300 object-cover" 
                 src="${avatarUrl}" 
                 alt="Avatar"
                 onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=128';">
            <span class="font-medium text-gray-900">${item.username}</span>
          </div>
        </td>
        <td class="py-4 px-6">${item.nama_lengkap}</td>
        <td class="py-4 px-6">${item.email || '-'}</td>
        <td class="py-4 px-6">${formatDate(item.created_at)}</td>
        <td class="py-4 px-6 text-center space-x-2">
           <div class="flex justify-center gap-2">
              <button class="btn-edit-admin bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm" 
                data-id="${item.id}" data-username="${item.username}">Edit</button>
              
              <button class="btn-password-admin bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm" 
                data-id="${item.id}">Pass</button>
              
              <button class="btn-hapus-admin bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm" 
                data-id="${item.id}">Hapus</button>
           </div>
        </td>
      </tr>
    `;
  }).then(() => attachAdminButtonListeners());
}

// Tambah admin baru
async function handleTambahAdmin() {
  const { value: formValues } = await Swal.fire({
    title: 'Tambah Admin Baru',
    html: `
      <input id="newUsername" class="swal2-input" placeholder="Username">
      <input id="newEmail" class="swal2-input" placeholder="Email">
      <input id="newPassword" class="swal2-input" type="password" placeholder="Password">
      <input id="newNama" class="swal2-input" placeholder="Nama Lengkap">
    `,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    showCancelButton: true,
    preConfirm: () => {
      const username = document.getElementById('newUsername').value.trim();
      const email = document.getElementById('newEmail').value.trim();
      const password = document.getElementById('newPassword').value.trim();
      const nama_lengkap = document.getElementById('newNama').value.trim();
      if (!username || !email || !password || !nama_lengkap) {
        Swal.showValidationMessage('Semua field wajib diisi!');
        return false;
      }
      return { username, email, password, nama_lengkap };
    },
  });

  if (!formValues) return;

  try {
    await fetchWithAuth('/api/admin/register', {
      method: 'POST',
      body: JSON.stringify(formValues),
    });
    Swal.fire('Berhasil!', 'Admin baru berhasil ditambahkan!', 'success');
    // loadAdminData();
    // loadDashboardData();
  } catch {
    Swal.fire('Gagal!', 'Tidak dapat menambah admin.', 'error');
  }
}

// Edit nama/email admin
async function handleEditAdmin(id, username) {
  const res = await fetchWithAuth('/api/admin');
  const data = await res.json();
  const admin = data.find((a) => a.id == id);
  if (!admin) return Swal.fire('Error', 'Data admin tidak ditemukan', 'error');

  const { value: formValues } = await Swal.fire({
    title: `Edit Admin (${username})`,
    html: `
      <input id="editNama" class="swal2-input" value="${admin.nama_lengkap}" placeholder="Nama Lengkap">
      <input id="editEmail" class="swal2-input" value="${admin.email}" placeholder="Email">
    `,
    confirmButtonText: 'Perbarui',
    cancelButtonText: 'Batal',
    showCancelButton: true,
    preConfirm: () => {
      const nama_lengkap = document.getElementById('editNama').value.trim();
      const email = document.getElementById('editEmail').value.trim();
      if (!nama_lengkap || !email) {
        Swal.showValidationMessage('Semua field wajib diisi!');
        return false;
      }
      return { nama_lengkap, email };
    },
  });

  if (!formValues) return;

  try {
    await fetchWithAuth(`/api/admin/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formValues),
    });
    Swal.fire('Berhasil!', 'Data admin berhasil diperbarui!', 'success');
    //loadAdminData();
  } catch {
    Swal.fire('Gagal!', 'Tidak dapat memperbarui data admin.', 'error');
  }
}

// Hapus admin
async function handleHapusAdmin(id) {
  const confirm = await Swal.fire({
    title: 'Yakin ingin menghapus admin ini?',
    text: 'Data admin akan dihapus permanen dari sistem.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetchWithAuth(`/api/admin/delete/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    Swal.fire('Terhapus!', data.message, 'success');
    
  } catch (error) {
    Swal.fire('Gagal!', error.message || 'Tidak dapat menghapus admin.', 'error');
  }
}

async function handleUbahPassword(id) {
  const { value: formValues } = await Swal.fire({
    title: 'Ubah Password Admin',
    html: `
      <input id="newPassword" type="password" class="swal2-input" placeholder="Password Baru">
    `,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    showCancelButton: true,
    preConfirm: () => {
      const newPassword = document.getElementById('newPassword').value.trim();
      if (!newPassword) {
        Swal.showValidationMessage('Password baru wajib diisi!');
        return false;
      }
      return { newPassword };
    },
  });

  if (!formValues) return;

  try {
    const res = await fetchWithAuth(`/api/admin/update-password/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formValues),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    Swal.fire('Berhasil!', 'Password admin berhasil diubah.', 'success');
  } catch (err) {
    Swal.fire('Gagal!', err.message || 'Tidak dapat mengubah password.', 'error');
  }
}


// Pasang listener ke tombol edit & hapus
function attachAdminButtonListeners() {
  document.querySelectorAll('.btn-edit-admin').forEach((btn) => {
    btn.addEventListener('click', (e) =>
      handleEditAdmin(e.target.dataset.id, e.target.dataset.username)
    );
  });
  document.querySelectorAll('.btn-password-admin').forEach((btn) => {
    btn.addEventListener('click', (e) => handleUbahPassword(e.target.dataset.id));
  });
  document.querySelectorAll('.btn-hapus-admin').forEach((btn) => {
    btn.addEventListener('click', (e) => handleHapusAdmin(e.target.dataset.id));
  });

  const tambahBtn = document.getElementById('btnTambahAdmin');
  if (tambahBtn && !tambahBtn.hasListener) {
    tambahBtn.addEventListener('click', handleTambahAdmin);
    tambahBtn.hasListener = true;
  }
}


// ===========================
// 🔹 LOGIKA PROFIL SAYA
// ===========================

// 1. Load Data ke Form Edit
async function loadUserProfileForEdit() {
    try {
        // Kita pakai endpoint profile yang sudah ada
        const res = await fetchWithAuth('/api/admin/profile'); 
        const data = await res.json();
        
        if (res.ok && data.user) {
            const user = data.user;
            
            // Isi Form
            document.getElementById('profilNama').value = user.nama_lengkap || '';
            document.getElementById('profilEmail').value = user.email || '';
            
            // Tampilkan Foto
            const preview = document.getElementById('previewFoto');
            if (user.foto_profil) {
                // Pastikan path uploads sesuai setting backend (misal /uploads/namafile.jpg)
                preview.src = `/uploads/${user.foto_profil}`;
            } else {
                preview.src = `https://i.pravatar.cc/150?u=${user.username}`;
            }
        }
    } catch (err) {
        console.error("Gagal load profil edit:", err);
    }
}

// 2. Handle Simpan Profil (Pakai FormData)
async function handleUpdateProfil(e) {
    e.preventDefault();
    
    const btnSimpan = e.target.querySelector('button[type="submit"]');
    const originalText = btnSimpan.innerHTML;
    btnSimpan.textContent = 'Menyimpan...';
    btnSimpan.disabled = true;

    try {
        const formData = new FormData();
        // Ambil ID dari token/profile (atau biarkan backend ambil dari req.user.id)
        // Disini kita asumsi backend baca ID dari Token JWT, jadi gak perlu append ID manual
        
        formData.append('nama_lengkap', document.getElementById('profilNama').value);
        formData.append('email', document.getElementById('profilEmail').value);

        // Password Opsional
        const passBaru = document.getElementById('profilPassBaru')?.value;
        if(passBaru) {
            formData.append('password', passBaru);
        }

        // File Foto
        const fileInput = document.getElementById('uploadFotoInput');
        if (fileInput.files[0]) {
            formData.append('foto', fileInput.files[0]);
        }

        // ⚠️ PENTING: Kita pakai fetch biasa (bukan fetchWithAuth) 
        // karena FormData tidak boleh ada header 'Content-Type: application/json'
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/update-profil', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}` 
                // Browser akan otomatis set Content-Type ke multipart/form-data
            },
            body: formData
        });

        const result = await res.json();

        if (res.ok) {
            Swal.fire('Berhasil', 'Profil berhasil diperbarui!', 'success');
            // Update UI Sidebar langsung
            document.getElementById('adminName').textContent = document.getElementById('profilNama').value;
            // Jika ada foto baru, update avatar sidebar
            if(fileInput.files[0]){
                 const reader = new FileReader();
                 reader.onload = (e) => document.getElementById('adminAvatar').src = e.target.result;
                 reader.readAsDataURL(fileInput.files[0]);
            }
        } else {
            throw new Error(result.message || 'Gagal update');
        }

    } catch (error) {
        Swal.fire('Gagal', error.message, 'error');
    } finally {
        btnSimpan.innerHTML = originalText;
        btnSimpan.disabled = false;
    }
}

// 3. Helper Preview Image saat pilih file
window.previewImage = function(event) {
    const reader = new FileReader();
    reader.onload = function(){
        const output = document.getElementById('previewFoto');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}


    // --- EVENT LISTENERS ---
    //baru ditambahin
    // Logout
    // ==========================================
    // 🔹 EVENT LISTENERS (VERSI AMAN / ANTI ERROR)
    // ==========================================
    
    // Helper: Pasang listener hanya jika elemen ada
    function safeAddListener(id, event, handler) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
        }
    }

    // 1. Tombol Navigasi & Logout
    safeAddListener('logoutButton', 'click', () => {
        Swal.fire({
            title: 'Keluar?',
            text: 'Sesi login akan berakhir.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, keluar',
            confirmButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }
        });
    });

    safeAddListener('homeButton', 'click', () => {
        window.location.href = '/diagnosa.html';
    });

    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // 2. Form Submissions (Hanya jalan jika form ada di layar)
    safeAddListener('formTambahAdmin', 'submit', handleTambahAdmin);
    safeAddListener('formUbahPassword', 'submit', handleUbahPassword);
    
    // Khusus Form Edit Profil (cegah duplikasi listener)
    const formProfil = document.getElementById('formEditProfil');
    if (formProfil) {
        const newForm = formProfil.cloneNode(true);
        formProfil.parentNode.replaceChild(newForm, formProfil);
        newForm.addEventListener('submit', handleUpdateProfil);
    }

    // 3. Modal Controls
    safeAddListener('openTambahAdminModal', 'click', () => openModal('tambahAdminModal'));
    
    document.querySelectorAll('.close-modal').forEach((button) => {
        button.addEventListener('click', (e) => closeModal(e.currentTarget.dataset.modal));
    });

    // 4. Sidebar Links
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(e.currentTarget.dataset.page);
        });
    });

    // 5. Print & Export
    safeAddListener('printButton', 'click', () => {
        const data = JSON.parse(localStorage.getItem('laporanData') || '[]');
        if (data.length === 0) return Swal.fire('Info', 'Tidak ada data.', 'info');
        window.open('/laporan/print.html', '_blank');
    });

    // --- INITIALIZATION ---
    showPage('pageDashboard');
}); // Penutup DOMContentLoaded
//     logoutButton.addEventListener('click', () => {
//         Swal.fire({
//             title: 'Keluar dari dashboard?', 
//             text: 'Sesi login kamu akan berakhir.',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Ya, keluar',
//             cancelButtonText: 'Batal',
//             confirmButtonColor: '#d33',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Hapus token & redirect ke login
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('nama_lengkap');
//                 Swal.fire('Berhasil keluar!', 'Kamu telah logout dari sistem.', 'success');
//                 setTimeout(() => (window.location.href = '/auth/login'), 1000);
//             }
//         });
//     });

//     const formEditProfil = document.getElementById('formEditProfil');
//     if (formEditProfil) {
//         formEditProfil.addEventListener('submit', handleUpdateProfil);
//     }

//     // Tombol ke landing page
// const homeButton = document.getElementById('homeButton');
// if (homeButton) {
//   homeButton.addEventListener('click', () => {
//     window.location.href = '/diagnosa.html';
//   });
// }


//     // Mobile menu toggle
//     mobileMenuButton.addEventListener('click', () => {
//         sidebar.classList.toggle('-translate-x-full');
//     });

//     // Sidebar navigation
//     navLinks.forEach((link) => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             showPage(e.currentTarget.dataset.page);
//         });
//     });

//     // Modal triggers
//     openTambahAdminModalButton.addEventListener('click', () => openModal('tambahAdminModal'));
//     closeModalButtons.forEach((button) => {
//         button.addEventListener('click', (e) => closeModal(e.currentTarget.dataset.modal));
//     });
// on
//     // Form submissions
//     formTambahAdmin.addEventListener('submit', handleTambahAdmin);
//     formUbahPassword.addEventListener('submit', handleUbahPassword);

//     // Print button
//     // printButton.addEventListener('click', () => {
//     //     window.print();
//     // });

//     // --- INITIALIZATION ---
//     showPage('pageDashboard'); // Load dashboard on page load
// });

