// Ganti URL ini dengan URL Google Apps Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbzqBPHYarGqskIRoizGrCRP8f0P-xZ0fWHsRnUnsNlVfPKkXXVYPCfw_KS_gThw9Bo/exec";

const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
const submitButton = document.getElementById('submitButton');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form mengirim data secara default

    // Tampilkan status loading
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    messageDiv.textContent = '';
    messageDiv.style.color = 'black';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        action: "register",
        email: email,
        password: password
    };

    fetch(API_URL, {
        method: 'POST',
        // 'mode: no-cors' diperlukan untuk permintaan sederhana, tapi kita akan perbaiki nanti
        // Untuk sekarang, kita lewati header CORS karena Apps Script akan mengatasinya dengan redirect
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Apps Script terkadang lebih suka text/plain
        },
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        if (data.status === 'success') {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';
            form.reset(); // Kosongkan form jika berhasil
        } else {
            messageDiv.textContent = 'Error: ' + data.message;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        messageDiv.textContent = 'Gagal terhubung ke server. Cek konsol untuk detail.';
        messageDiv.style.color = 'red';
    })
    .finally(() => {
        // Kembalikan tombol ke keadaan normal
        submitButton.disabled = false;
        submitButton.textContent = 'Daftar';
    });
});
