/**
 * File: script.js
 * Deskripsi: Menangani logika untuk halaman registrasi (index.html).
 * Mengirimkan data pendaftaran ke backend dan mengarahkan pengguna ke halaman login jika berhasil.
 */

// Ganti URL ini dengan URL Google Apps Script Anda jika berbeda
const API_URL = `https://script.google.com/macros/s/${API_ID}/exec`;

// Mengambil elemen-elemen penting dari halaman HTML
const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
const submitButton = document.getElementById('submitButton');

// Menambahkan 'event listener' yang akan berjalan saat formulir disubmit
form.addEventListener('submit', function(e) {
    // Mencegah formulir mengirim data dengan cara default (yang akan me-refresh halaman)
    e.preventDefault();

    // Memberikan umpan balik visual kepada pengguna bahwa proses sedang berjalan
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    messageDiv.textContent = '';
    messageDiv.style.color = 'black';

    // Mengambil nilai dari input email dan password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Menyiapkan data yang akan dikirim ke backend dalam format JSON
    const requestBody = {
        action: "register", // Memberi tahu backend aksi apa yang kita inginkan
        email: email,
        password: password
    };

    // Menggunakan 'fetch' untuk mengirim permintaan POST ke API
    fetch(API_URL, {
        method: 'POST',
        // Google Apps Script terkadang lebih andal dengan header 'text/plain'
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestBody), // Mengubah objek JavaScript menjadi string JSON
        redirect: 'follow' // Mengikuti redirect jika ada dari sisi server
    })
    .then(response => response.json()) // Mengubah respons dari server menjadi objek JavaScript
    .then(data => {
        // Logika yang dijalankan setelah menerima respons dari server
        console.log('Response from server:', data);

        if (data.status === 'success') {
            // Jika backend merespons dengan 'success'
            messageDiv.textContent = 'Registrasi berhasil! Anda akan diarahkan ke halaman login...';
            messageDiv.style.color = 'green';
            // Tombol tetap nonaktif karena halaman akan berpindah

            // Menunggu 2 detik sebelum mengarahkan pengguna ke halaman login
            setTimeout(function() {
                window.location.href = "login.html"; // Perintah untuk redirect
            }, 2000); // 2000 milidetik = 2 detik

        } else {
            // Jika backend merespons dengan 'error'
            messageDiv.textContent = 'Error: ' + data.message;
            messageDiv.style.color = 'red';
            // Aktifkan kembali tombol agar pengguna bisa mencoba lagi
            submitButton.disabled = false;
            submitButton.textContent = 'Daftar';
        }
    })
    .catch(error => {
        // Logika yang dijalankan jika ada masalah jaringan
        console.error('Fetch Error:', error);
        messageDiv.textContent = 'Gagal terhubung ke server. Cek koneksi internet Anda.';
        messageDiv.style.color = 'red';
        // Aktifkan kembali tombol agar pengguna bisa mencoba lagi
        submitButton.disabled = false;
        submitButton.textContent = 'Daftar';
    });
});
