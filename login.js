// URL API yang sama dengan sebelumnya
const API_URL = "https://script.google.com/macros/s/AKfycby_R2i2Wc83e7Nlsxj3zWwJUwd7kBlQpM0dKDue3QUgijRZahbXkR4dZBr4RFlQWps/exec";

const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const submitButton = document.getElementById('submitButton');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    messageDiv.textContent = '';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        action: "login",
        email: email,
        password: password
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
            // Jika login berhasil, simpan userId ke localStorage
            localStorage.setItem('userId', data.userId);
            messageDiv.textContent = 'Login berhasil! Anda akan diarahkan...';
            messageDiv.style.color = 'green';
            
            // Arahkan ke halaman upload setelah 2 detik
            setTimeout(() => {
                // Kita akan buat halaman upload.html selanjutnya
                window.location.href = '/upload.html'; 
            }, 2000);
            
        } else {
            messageDiv.textContent = 'Error: ' + data.message;
            messageDiv.style.color = 'red';
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'Gagal terhubung ke server.';
        messageDiv.style.color = 'red';
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    });
});
