document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('errorMsg');
  const btn = document.getElementById('submit-button');
  const registerLink = document.querySelector('register-link');

  // kalau link register diklik, pastikan navigasi tetap jalan
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      window.location.href = '/auth/register.html';
    });
  }

  if (!form) {
    console.error('⚠️ Elemen form loginForm tidak ditemukan di halaman!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    msg.textContent = '⏳ Sedang masuk...';
    msg.className = 'text-gray-500 text-sm text-center';
    btn.disabled = true;

    try {
      // ⬇️ panggil API login, bukan halaman HTML
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal login');

      // simpan data penting
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('nama_lengkap', data.admin);
      localStorage.setItem('role', data.role);

      msg.textContent = '✅ Login berhasil! Mengarahkan...';
      msg.className = 'text-green-600 text-sm text-center';

      // redirect sesuai role
      setTimeout(() => {
        window.location.href = '/dashboard/dashboard.html';
      }, 1500);
    } catch (err) {
      msg.textContent = `❌ ${err.message}`;
      msg.className = 'text-red-600 text-sm text-center';
    } finally {
      btn.disabled = false;
    }
  });
});
