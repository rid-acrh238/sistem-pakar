document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const msg = document.getElementById('error-message');
  const btn = document.getElementById('submit-button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama_lengkap = document.getElementById('nama_lengkap').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    msg.textContent = '⏳ Mendaftarkan akun...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_lengkap, username, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      msg.textContent = '✅ Pendaftaran berhasil! Mengarahkan ke login...';
      msg.className = 'text-green-600 text-sm text-center';
      setTimeout(() => (window.location.href = 'login.html'), 1500);
    } catch (err) {
      msg.textContent = `❌ ${err.message}`;
      msg.className = 'text-red-600 text-sm text-center';
    } finally {
      btn.disabled = false;
    }
  });
});



// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const nama = document.getElementById('nama').value.trim();
//     const username = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value.trim();
//     const msg = document.getElementById('msg');

//     msg.textContent = '⏳ Mendaftarkan akun...';
//     msg.className = 'info';

//     try {
//         const res = await fetch('/api/admin/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ nama_lengkap: nama, username, password }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);

//         msg.textContent = '✅ Pendaftaran berhasil! Mengarahkan ke login...';
//         msg.className = 'success';

//         setTimeout(() => (window.location.href = '../../../auth/login.html'), 1500);
//     } catch (err) {
//         msg.textContent = `❌ ${err.message}`;
//         msg.className = 'error';
//     }
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const registerForm = document.getElementById('register-form');
//     const errorMessage = document.getElementById('error-message');
//     const submitButton = document.getElementById('submit-button');

//     registerForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         errorMessage.textContent = '';
//         submitButton.disabled = true;
//         submitButton.textContent = 'Memproses...';

//         // Ambil data dari form
//         const nama_lengkap = document.getElementById('nama_lengkap').value;
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;

//         try {
//             const response = await fetch('/api/admin/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     nama_lengkap,
//                     username,
//                     password
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Skenario sukses
//                 alert('Pendaftaran berhasil! Silakan login.');
//                 window.location.href = 'login.html'; // Redirect ke halaman login
//             } else {
//                 // Skenario gagal (misal: username sudah ada)
//                 errorMessage.textContent = data.message || 'Pendaftaran gagal. Silakan coba lagi.';
//             }

//         } catch (error) {
//             // Skenario error koneksi/server
//             console.error('Error:', error);
//             errorMessage.textContent = 'Terjadi kesalahan pada server. Coba lagi nanti.';
//         } finally {
//             // Kembalikan tombol ke keadaan semula
//             submitButton.disabled = false;
//             submitButton.textContent = 'Daftar';
//         }
//     });
// });

// document.getElementById("registerForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const nama = document.getElementById("nama").value;
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;
//   const msg = document.getElementById("msg");

//   try {
//     const res = await fetch("/api/admin/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ nama_lengkap: nama, username, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);

//     msg.textContent = "Pendaftaran berhasil! Mengarahkan ke login...";
//     setTimeout(() => (window.location.href = "/login"), 1500);
//   } catch (err) {
//     msg.textContent = err.message;
//   }
// });
