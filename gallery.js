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

// Menggunakan Event Delegation untuk menangani semua klik di dalam container
imageContainer.addEventListener('click', function(e) {
    // Cek apakah yang diklik adalah tombol dengan class 'delete-button'
    if (e.target.classList.contains('delete-button')) {
        const button = e.target;
        const fileId = button.dataset.fileid; // Ambil fileId dari atribut data-*
        
        // Minta konfirmasi dari pengguna
        if (confirm('Anda yakin ingin menghapus gambar ini secara permanen?')) {
            handleDelete(fileId, button);
        }
    }
});

// Fungsi untuk mengirim permintaan hapus ke backend
function handleDelete(fileId, buttonElement) {
    buttonElement.disabled = true;
    buttonElement.textContent = '...'; // Tanda loading

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
            // Jika sukses, hapus elemen gambar dari halaman
            buttonElement.closest('.gallery-item').remove();
        } else {
            alert('Error: ' + data.message);
            buttonElement.disabled = false;
            buttonElement.textContent = '×'; // Kembalikan ke 'X'
        }
    })
    .catch(error => {
        alert('Gagal terhubung ke server.');
        buttonElement.disabled = false;
        buttonElement.textContent = '×';
    });
}

// 3. Fungsi logout (sama seperti sebelumnya)
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('userId');
    alert('Anda telah logout.');
    window.location.href = '/login.html';
});
