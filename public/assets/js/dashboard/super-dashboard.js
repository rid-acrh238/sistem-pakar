document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('nama_lengkap');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminList = document.getElementById('adminList');
  const btnTambah = document.getElementById('btnTambah');
  const modalTambah = document.getElementById('modalTambah');
  const formTambah = document.getElementById('formTambahAdmin');
  const btnBatal = document.getElementById('btnBatal');
  const msg = document.getElementById('formMsg');

  if (!token || role !== 'super-admin') {
    window.location.href = '/public/auth/login.html';
    return;
  }

  document.getElementById('userName').textContent = userName || 'Super Admin';

  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/public/auth/login.html';
  });

  btnTambah.addEventListener('click', () => {
    modalTambah.classList.remove('hidden');
    msg.textContent = '';
  });

  btnBatal.addEventListener('click', () => {
    modalTambah.classList.add('hidden');
    formTambah.reset();
  });

  // load daftar admin
  await loadAdminList();

  // form tambah admin
  formTambah.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama_lengkap = document.getElementById('nama_lengkap').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    msg.textContent = '⏳ Menyimpan...';
    msg.className = 'text-gray-500 text-center';

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_lengkap, username, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      msg.textContent = '✅ Admin berhasil ditambahkan.';
      msg.className = 'text-green-600 text-center';

      setTimeout(() => {
        modalTambah.classList.add('hidden');
        formTambah.reset();
        loadAdminList();
      }, 1000);
    } catch (err) {
      msg.textContent = `❌ ${err.message}`;
      msg.className = 'text-red-600 text-center';
    }
  });

  let adminDataCache = [];

  // fungsi ambil daftar admin
  async function loadAdminList() {
  try {
    const res = await fetch('/api/admin/list', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    adminDataCache = Array.isArray(data) ? data : [];
    renderTable(adminDataCache);
  } catch (err) {
    adminList.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-3">${err.message}</td></tr>`;
  }
}

// fungsi render tabel + filter
function renderTable(data) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const roleFilter = document.getElementById('filterRole').value;

  const filtered = data.filter((admin) => {
    const cocokNama =
      admin.nama_lengkap.toLowerCase().includes(searchTerm) ||
      admin.username.toLowerCase().includes(searchTerm);
    const cocokRole = roleFilter ? admin.role === roleFilter : true;
    return cocokNama && cocokRole;
  });

  if (filtered.length === 0) {
    adminList.innerHTML =
      '<tr><td colspan="6" class="text-center py-3 text-gray-500">Tidak ada hasil ditemukan.</td></tr>';
    return;
  }

  adminList.innerHTML = filtered
    .map(
      (admin) => `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-2 px-4">${admin.id}</td>
        <td class="py-2 px-4">${admin.nama_lengkap}</td>
        <td class="py-2 px-4">${admin.username}</td>
        <td class="py-2 px-4">${admin.email}</td>
        <td class="py-2 px-4 font-semibold">${admin.role}</td>
        <td class="py-2 px-4 text-center">
          <button
            onclick="hapusAdmin(${admin.id})"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
          >
            Hapus
          </button>
        </td>
      </tr>`
    )
    .join('');
}

// event listener filter & search
document.getElementById('searchInput').addEventListener('input', () => renderTable(adminDataCache));
document.getElementById('filterRole').addEventListener('change', () =>
  renderTable(adminDataCache)
);
});

// fungsi hapus admin (global)
async function hapusAdmin(id) {
  if (!confirm('Yakin ingin menghapus admin ini?')) return;
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`/api/admin/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert('✅ Admin berhasil dihapus.');
    location.reload();
  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}
