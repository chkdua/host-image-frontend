// URL API
const API_URL = `https://script.google.com/macros/s/${API_ID}/exec`;
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
						<div class="loading-overlay"><div class="spinner"></div></div>
						<a href="${image.url}" target="_blank" title="Lihat gambar penuh">
							<img src="${image.thumbnailUrl}" alt="${image.name}" loading="lazy">
						</a>
						<p title="${image.name}">${image.name}</p>
						<button class="delete-button" data-fileid="${image.fileId}" title="Hapus Gambar">×</button>
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

/// === GANTI SEMUA KODE DI BAWAH INI ===

/**
 * Menampilkan notifikasi toast di pojok layar.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - 'success' atau 'error' untuk warna.
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.className = 'show ' + type; // Menambahkan class .show dan tipe (success/error)

    // Sembunyikan toast setelah 3 detik
    setTimeout(function(){ 
        toast.className = toast.className.replace('show', ''); 
    }, 3000);
}

// Menggunakan Event Delegation untuk menangani semua klik di dalam container
imageContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-button')) {
        const button = e.target;
        const fileId = button.dataset.fileid;
        
        if (confirm('Anda yakin ingin menghapus gambar ini secara permanen?')) {
            handleDelete(fileId, button);
        }
    }
});

/**
 * Fungsi untuk mengirim permintaan hapus ke backend dan menangani UI.
 * @param {string} fileId - ID file yang akan dihapus.
 * @param {HTMLElement} buttonElement - Elemen tombol yang diklik.
 */
function handleDelete(fileId, buttonElement) {
    const cardElement = buttonElement.closest('.gallery-item');
    
    // 1. Tampilkan status loading
    cardElement.classList.add('deleting');

    const userId = localStorage.getItem('userId');
    const requestBody = {
        action: "deleteImage",
        fileId: fileId,
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
        if (data.status === 'success') {
            // 2a. Jika sukses, hapus kartu dan tampilkan notifikasi sukses
            cardElement.remove();
            showToast('Gambar berhasil dihapus!', 'success');
        } else {
            // 2b. Jika gagal, hapus loading dan tampilkan notifikasi error
            cardElement.classList.remove('deleting');
            showToast('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        // 2c. Jika ada masalah jaringan, hapus loading dan tampilkan notifikasi error
        cardElement.classList.remove('deleting');
        showToast('Gagal terhubung ke server.', 'error');
    });
}

// Fungsi logout
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('userId');
    alert('Anda telah logout.');
    window.location.href = '/login.html';
});
