// =======================================================
// LOGIKA LOGIN BARU (OTP / MAGIC LINK)
// =======================================================

const BASE_URL = '/api/admin'; 

// --- FUNGSI 1: MINTA KODE OTP ---
async function requestOTP() {
    const emailInput = document.getElementById('email');
    const loading = document.getElementById('loading');
    
    // Validasi sederhana
    if (!emailInput || !emailInput.value.trim()) {
        alert('❌ Masukkan email dulu!');
        return;
    }

    const email = emailInput.value.trim();

    // Tampilkan loading
    if(loading) loading.style.display = 'block';

    try {
        console.log('Mengirim OTP ke:', email);

        // 👇 Panggil API backend yang BARU
        const response = await fetch(`${BASE_URL}/login-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        // Cek response, kalau HTML berarti error salah alamat
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server error (Response bukan JSON). Cek console.");
        }

        const result = await response.json();

        if (response.ok) {
            // ✅ SUKSES: Ganti tampilan dari Step 1 ke Step 2
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            
            // Ubah teks judul biar informatif
            const title = document.getElementById('pageTitle');
            if(title) title.innerText = 'Masukkan Kode';
            
            alert('✅ Kode terkirim! Cek Email (Inbox/Spam).');
        } else {
            alert(`⚠️ Gagal: ${result.message}`);
        }

    } catch (error) {
        console.error('Error Request OTP:', error);
        alert('❌ Terjadi kesalahan koneksi/server.');
    } finally {
        if(loading) loading.style.display = 'none';
    }
}

// --- FUNGSI 2: VERIFIKASI KODE OTP ---
async function verifyOTP() {
    const email = document.getElementById('email').value.trim();
    const otpInput = document.getElementById('otp');
    const loading = document.getElementById('loading');

    if (!otpInput || !otpInput.value.trim()) {
        alert('❌ Masukkan kode OTP!');
        return;
    }

    const otp = otpInput.value.trim();

    if(loading) loading.style.display = 'block';

    try {
        console.log('Verifikasi OTP:', otp);

        // 👇 Panggil API Verifikasi
        const response = await fetch(`${BASE_URL}/login-verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();

        if (response.ok) {
            // ✅ SUKSES LOGIN
            console.log('Login Berhasil:', result);
            
            // Simpan Token
            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            
            // Simpan Info User (Opsional, buat nampilin nama di dashboard)
            if (result.user) {
                localStorage.setItem('user_data', JSON.stringify(result.user));
            }

            alert('🚀 Login Berhasil! Mengalihkan...');
            
            // Redirect ke Dashboard
            setTimeout(() => {
                window.location.href = '/dashboard/dashboard.html';
            }, 1000);

        } else {
            alert(`⚠️ Gagal: ${result.message}`);
        }

    } catch (error) {
        console.error('Error Verify OTP:', error);
        alert('❌ Terjadi kesalahan saat verifikasi.');
    } finally {
        if(loading) loading.style.display = 'none';
    }
}


// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('loginForm');
//   const msg = document.getElementById('errorMsg');
//   const btn = document.getElementById('submit-button');
//   const registerLink = document.querySelector('register-link');

//   // kalau link register diklik, pastikan navigasi tetap jalan
//   if (registerLink) {
//     registerLink.addEventListener('click', (e) => {
//       window.location.href = '/auth/register.html';
//     });
//   }

//   if (!form) {
//     console.error('⚠️ Elemen form loginForm tidak ditemukan di halaman!');
//     return;
//   }

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const identifier = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value.trim();
//     //const role = document.getElementById('role').value;

//     msg.textContent = '⏳ Sedang masuk...';
//     msg.className = 'text-gray-500 text-sm text-center';
//     btn.disabled = true;

//     try {
//       // ⬇️ panggil API login, bukan halaman HTML
//       const res = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ identifier, password }),
//       });

//       const data = await res.json();
//       console.log("📦 RESPON SERVER:", data);
//       if (!res.ok) throw new Error(data.message || 'Gagal login');

//       // simpan data penting
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('refreshToken', data.refreshToken);
//       localStorage.setItem('nama_lengkap', data.admin);
//       localStorage.setItem('role', data.role);

//       msg.textContent = '✅ Login berhasil! Mengarahkan...';
//       msg.className = 'text-green-600 text-sm text-center';

//       // redirect sesuai role
//       setTimeout(() => {
//         window.location.href = '/dashboard/dashboard.html';
//       }, 1500);
//     } catch (err) {
//       msg.textContent = `❌ ${err.message}`;
//       msg.className = 'text-red-600 text-sm text-center';
//     } finally {
//       btn.disabled = false;
//     }
//   });
// });
