document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        id_pengunjung: localStorage.getItem('id_pengunjung') || null,
        jawaban: [],
        currentQuestionIndex: 0,
    };

    // --- Dummy Data (gantilah dengan data dari API) ---
    const DUMMY_QUESTIONS = [
        {
            id: 'G01',
            text: 'Apakah Anda merasa sedih, murung, atau hampa hampir sepanjang hari, hampir setiap hari?',
        },
        {
            id: 'G02',
            text: 'Apakah Anda kehilangan minat atau kesenangan dalam semua, atau hampir semua, aktivitas yang biasanya Anda nikmati?',
        },
        {
            id: 'G03',
            text: 'Apakah Anda mengalami penurunan atau kenaikan berat badan yang signifikan tanpa melakukan diet, atau penurunan/peningkatan nafsu makan?',
        },
        {
            id: 'G04',
            text: 'Apakah Anda mengalami kesulitan tidur (insomnia) atau tidur terlalu banyak (hipersomnia) hampir setiap hari?',
        },
        {
            id: 'G05',
            text: 'Apakah Anda merasa gelisah atau justru melambat secara fisik yang dapat diamati oleh orang lain?',
        },
        {
            id: 'G06',
            text: 'Apakah Anda merasa lelah atau kehilangan energi hampir setiap hari?',
        },
        {
            id: 'G07',
            text: 'Apakah Anda memiliki perasaan tidak berharga atau rasa bersalah yang berlebihan atau tidak pada tempatnya?',
        },
        {
            id: 'G08',
            text: 'Apakah Anda mengalami kesulitan untuk berkonsentrasi, berpikir, atau membuat keputusan?',
        },
        {
            id: 'G09',
            text: 'Apakah Anda memiliki pikiran berulang tentang kematian, bunuh diri tanpa rencana spesifik, atau usaha bunuh diri?',
        },
    ];

    const DUMMY_OPTIONS = [
        { text: 'Sangat Yakin', value: 1.0 },
        { text: 'Yakin', value: 0.8 },
        { text: 'Cukup Yakin', value: 0.6 },
        { text: 'Sedikit Yakin', value: 0.4 },
        { text: 'Tidak Tahu', value: 0.2 },
        { text: 'Tidak', value: 0.0 },
    ];

    // --- Element Selectors ---
    const sections = document.querySelectorAll('.page-section');
    const btnStart = document.getElementById('btnStart');
    const formIdentitas = document.getElementById('formIdentitas');
    const pertanyaanContainer = document.getElementById('pertanyaanContainer');
    const jawabanContainer = document.getElementById('jawabanContainer');
    const btnNext = document.getElementById('btnNext');
    const hasilContainer = document.getElementById('hasilContainer');
    const btnBackHome = document.getElementById('btnBackHome');
    const btnCetak = document.getElementById('btnCetak');
    const questionCounter = document.getElementById('questionCounter');

    // --- Functions ---

    /**
     * Menampilkan section yang aktif dan menyembunyikan yang lain.
     * @param {string} sectionId ID dari section yang ingin ditampilkan.
     */
    const showSection = (sectionId) => {
        sections.forEach((section) => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
                section.classList.add('active');
            } else {
                section.classList.add('hidden');
                section.classList.remove('active');
            }
        });
    };

    /**
     * Mengirim data identitas ke backend (simulasi).
     * @param {Event} event Event submit form.
     */
    const kirimIdentitas = async (event) => {
        event.preventDefault();
        const formData = new FormData(formIdentitas);
        const data = Object.fromEntries(formData.entries());

        console.log('Mengirim data identitas:', data);

        // Simulasi API call dengan fetch
        try {
            // GANTILAH DENGAN URL API SEBENARNYA
            // const response = await fetch('/api/diagnosis/identitas', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            // const result = await response.json();

            // Simulasi response dari backend
            const result = {
                success: true,
                id_pengunjung: `user-${new Date().getTime()}`,
            };

            if (result.success) {
                state.id_pengunjung = result.id_pengunjung;
                localStorage.setItem('id_pengunjung', result.id_pengunjung);
                console.log('ID Pengunjung diterima:', state.id_pengunjung);

                showSection('diagnosis');
                tampilkanPertanyaan();
            } else {
                alert('Gagal mengirim data. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error saat mengirim identitas:', error);
            alert('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        }
    };

    /**
     * Menampilkan pertanyaan diagnosa saat ini.
     */
    const tampilkanPertanyaan = () => {
        if (state.currentQuestionIndex < DUMMY_QUESTIONS.length) {
            const question = DUMMY_QUESTIONS[state.currentQuestionIndex];
            pertanyaanContainer.textContent = question.text;
            questionCounter.textContent = `Pertanyaan ${state.currentQuestionIndex + 1} dari ${DUMMY_QUESTIONS.length}`;

            // Render jawaban
            jawabanContainer.innerHTML = '';
            DUMMY_OPTIONS.forEach((option) => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-secondary');
                button.textContent = option.text;
                button.dataset.value = option.value;
                button.onclick = () => handleAnswer(question.id, option.value);
                jawabanContainer.appendChild(button);
            });
        } else {
            // Semua pertanyaan sudah dijawab
            console.log('Semua pertanyaan selesai. Mengirim jawaban...');
            pertanyaanContainer.textContent = 'Menyelesaikan diagnosa...';
            jawabanContainer.innerHTML = '';
            kirimJawaban();
        }
    };

    /**
     * Menangani pemilihan jawaban dan lanjut ke pertanyaan berikutnya.
     * @param {string} questionId ID pertanyaan.
     * @param {number} value Nilai jawaban.
     */
    const handleAnswer = (questionId, value) => {
        state.jawaban.push({
            id_gejala: questionId,
            cf_user: value,
        });

        // Animasi singkat sebelum lanjut
        jawabanContainer.querySelectorAll('.btn').forEach((btn) => {
            btn.disabled = true;
            if (btn.dataset.value == value) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            }
        });

        setTimeout(() => {
            state.currentQuestionIndex++;
            tampilkanPertanyaan();
        }, 400); // delay
    };

    /**
     * Mengirim semua jawaban ke backend (simulasi).
     */
    const kirimJawaban = async () => {
        const payload = {
            id_pengunjung: state.id_pengunjung,
            jawaban: state.jawaban,
        };

        console.log('Mengirim jawaban:', payload);
        showSection('hasil');

        // Simulasi API call
        try {
            // GANTILAH DENGAN URL API SEBENARNYA
            // await fetch('/api/diagnosis/proses', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // Panggil fungsi untuk menampilkan hasil setelah proses selesai
            setTimeout(tampilkanHasil, 2000); // Simulasi delay proses backend
        } catch (error) {
            console.error('Error saat mengirim jawaban:', error);
            alert('Gagal mengirim jawaban. Coba kembali ke beranda.');
        }
    };

    /**
     * Mengambil dan menampilkan hasil diagnosa dari backend (simulasi).
     */
    const tampilkanHasil = async () => {
        console.log('Mengambil hasil untuk ID:', state.id_pengunjung);

        try {
            // GANTILAH DENGAN URL API SEBENARNYA
            // const response = await fetch(`/api/diagnosis/hasil/${state.id_pengunjung}`);
            // const result = await response.json();

            // Simulasi response dari backend
            const result = {
                nama_penyakit: 'Depresi Mayor (Tingkat Sedang)',
                persentase: '78.50',
                saran: 'Hasil diagnosa awal menunjukkan kemungkinan adanya gejala Depresi Mayor tingkat sedang. Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental seperti psikolog atau psikiater untuk mendapatkan evaluasi yang lebih mendalam dan penanganan yang tepat. Jangan ragu mencari dukungan dari orang terdekat.',
            };

            hasilContainer.innerHTML = `
                <h3>Hasil: ${result.nama_penyakit}</h3>
                <p><strong>Tingkat Keyakinan Sistem:</strong> ${result.persentase}%</p>
                <p><strong>Saran & Rekomendasi:</strong></p>
                <p>${result.saran}</p>
                <hr>
                <p><small><strong>Disclaimer:</strong> Ini adalah diagnosa awal berdasarkan sistem pakar dan tidak menggantikan konsultasi profesional.</small></p>
            `;
        } catch (error) {
            console.error('Error saat mengambil hasil:', error);
            hasilContainer.innerHTML =
                '<p>Maaf, terjadi kesalahan saat memuat hasil. Silakan coba kembali.</p>';
        }
    };

    /**
     * Mereset state dan kembali ke halaman utama.
     */
    const kembaliKeBeranda = () => {
        state.id_pengunjung = null;
        state.jawaban = [];
        state.currentQuestionIndex = 0;
        localStorage.removeItem('id_pengunjung');
        formIdentitas.reset();
        hasilContainer.innerHTML = '<div class="loader"></div>';
        showSection('landing');
    };

    // --- Event Listeners ---
    btnStart.addEventListener('click', () => showSection('identitas'));
    formIdentitas.addEventListener('submit', kirimIdentitas);
    btnBackHome.addEventListener('click', kembaliKeBeranda);
    btnCetak.addEventListener('click', () => window.print());

    // --- Initial Load ---
    showSection('landing');
});
