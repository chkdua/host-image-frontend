// URL API
const API_URL = 'https://script.google.com/macros/s/AKfycbx_SV7E056UbYIAt5OlGK8wFyUdyCzt5i06Jl2qmdfLqZLFcNevZVfEf8NSt_eOaf2i/exec';
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
