// URL API kita yang sakti
const API_URL = "https://script.google.com/macros/s/AKfycbwIqTpOSat_n5319PBBBHYjhxpOXFOm2x3-vxWglMuz52pJG9eUVYRFn2ESZqvmI6A/exec";

// Ambil elemen dari halaman
const imageContainer = document.getElementById('imageContainer');
const loadingMessage = document.getElementById('loadingMessage');
const logoutButton = document.getElementById('logoutButton');

// 1. Saat halaman dimuat, langsung ambil data
document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Anda harus login terlebih dahulu!');
        window.location.href = '/login.html';
        return;
    }
    fetchImages(userId);
});

// 2. Fungsi untuk mengambil dan menampilkan gambar
function fetchImages(userId) {
    const requestBody = {
        action: "getImages",
        userId: userId
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(data => {
        loadingMessage.style.display = 'none'; // Sembunyikan pesan loading

        if (data.status === 'success') {
            if (data.images.length > 0) {
                // Jika ada gambar, tampilkan satu per satu
                data.images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    
                    item.innerHTML = `
                        <a href="${image.url}" target="_blank">
                            <img src="${image.url}" alt="${image.name}" loading="lazy">
                        </a>
                        <p title="${image.name}">${image.name}</p>
                    `;
                    imageContainer.appendChild(item);
                });
            } else {
                // Jika tidak ada gambar
                imageContainer.innerHTML = "<p>Anda belum mengunggah gambar apapun. Ayo mulai dari halaman upload!</p>";
            }
        } else {
            imageContainer.innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
        }
    })
    .catch(error => {
        loadingMessage.style.display = 'none';
        imageContainer.innerHTML = `<p style="color: red;">Gagal terhubung ke server.</p>`;
    });
}

// 3. Fungsi logout (sama seperti sebelumnya)
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('userId');
    alert('Anda telah logout.');
    window.location.href = '/login.html';
});
