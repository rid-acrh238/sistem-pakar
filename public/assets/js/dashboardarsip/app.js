// // public/assets/js/dashboard/app.js
// import { initHome } from './modules/home.js';
// import { initGejala } from './modules/gejala.js';
// // import { initPenyakit } from './modules/penyakit.js'; <-- Bikin nanti

// document.addEventListener('DOMContentLoaded', () => {
    
//     // 1. Cek Login
//     if(!localStorage.getItem('token')) window.location.href = '/auth/login';

//     // 2. Mapping Halaman ke Fungsi
//     const routes = {
//         'pageDashboard': initHome,
//         'pageDataGejala': initGejala,
//         // 'pageDataPenyakit': initPenyakit
//     };

//     // 3. Logic Pindah Halaman
//     const navLinks = document.querySelectorAll('.nav-link');
//     const pages = document.querySelectorAll('.page-content');

//     function showPage(pageId) {
//         // Sembunyikan semua page
//         pages.forEach(p => p.classList.add('hidden'));
        
//         // Munculkan page target
//         const target = document.getElementById(pageId);
//         if(target) {
//             target.classList.remove('hidden');
//             // Jalanin script khusus halaman itu
//             if(routes[pageId]) routes[pageId](); 
//         }
        
//         // Update Judul
//         const titleEl = document.getElementById('pageTitle');
//         if(titleEl) titleEl.innerText = pageId.replace('page', '');
//     }

//     // 4. Event Listener Menu
//     navLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const id = link.getAttribute('data-page');
//             showPage(id);
//         });
//     });

//     // 5. Load Default
//     showPage('pageDashboard');

//     // 6. Global Logout
//     document.getElementById('logoutButton')?.addEventListener('click', () => {
//         if(confirm('Logout?')) {
//             localStorage.clear();
//             window.location.href = '/auth/login';
//         }
//     });
// });