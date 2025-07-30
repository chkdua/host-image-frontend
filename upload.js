// URL API kita
const API_URL = "https://script.google.com/macros/s/AKfycbz4U29eOsKIPA9eiZ7IgBik8fBYzT1rSzNjMnah5aP17fdiudP0y9i9fuX3TxdJ9U0/exec";

// Ambil elemen dari halaman
const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const messageDiv = document.getElementById('message');
const submitButton = document.getElementById('submitButton');
const imagePreview = document.getElementById('imagePreview');
const resultArea = document.getElementById('resultArea');
const imageUrlInput = document.getElementById('imageUrl');
const copyButton = document.getElementById('copyButton');
const logoutButton = document.getElementById('logoutButton');

// 1. Lindungi Halaman: Cek apakah pengguna sudah login
document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        // Jika tidak ada userId, tendang kembali ke halaman login
        alert('Anda harus login terlebih dahulu!');
        window.location.href = '/login.html';
    }
});

// 2. Tampilkan pratinjau gambar saat dipilih
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// 3. Tangani proses upload saat form disubmit
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) {
        messageDiv.textContent = 'Silakan pilih file terlebih dahulu.';
        messageDiv.style.color = 'red';
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Mengunggah...';
    messageDiv.textContent = '';
    resultArea.style.display = 'none';

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
        const base64Data = reader.result;
        const requestBody = {
            action: "upload",
            userId: localStorage.getItem('userId'),
            fileName: file.name,
            mimeType: file.type,
            base64Data: base64Data
        };

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            redirect: 'follow'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'green';
                imageUrlInput.value = data.publicUrl;
                resultArea.style.display = 'block';
            } else {
                messageDiv.textContent = 'Error: ' + data.message;
                messageDiv.style.color = 'red';
            }
        })
        .catch(error => {
            messageDiv.textContent = 'Gagal terhubung ke server.';
            messageDiv.style.color = 'red';
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Upload';
        });
    };
});

// 4. Fungsi untuk menyalin link
copyButton.addEventListener('click', function() {
    imageUrlInput.select();
    document.execCommand('copy');
    alert('Link disalin ke clipboard!');
});

// 5. Fungsi logout
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('userId');
    alert('Anda telah logout.');
    window.location.href = '/login.html';
});
