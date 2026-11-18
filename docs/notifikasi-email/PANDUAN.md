# Memasang notifikasi email Layanan Surat (±5 menit, sekali saja)

Email notifikasi hanya berisi **jenis surat dan waktu pengajuan**, tanpa data pribadi. Data lengkap tetap dikirim warga lewat WhatsApp.

1. Buka https://script.google.com dengan akun Google yang akan mengirim email (misalnya akun kampung).
2. Klik **Proyek baru**. Hapus isi editor, lalu tempel seluruh isi `Kode.gs`. Beri nama proyek: `Notifikasi Layanan Surat`.
3. Pilih fungsi **ujiEmail** di bilah atas, klik **Jalankan**, lalu klik **Tinjau izin** → pilih akun → **Lanjutan** → **Buka Notifikasi Layanan Surat (tidak aman)** → **Izinkan**. Email uji akan masuk ke seldiozora3@gmail.com.
4. Klik **Terapkan** → **Deployment baru** → ikon roda gigi → **Aplikasi web**.
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
   Klik **Terapkan**, lalu salin **URL aplikasi web** (berakhiran `/exec`).
5. Tempel URL itu di `assets/js/data.js` pada `layananWa.notifikasi.emailScript` (atau lewat Portal Admin), lalu simpan.

Selesai. Setiap ada pengajuan surat dari website, email pemberitahuan masuk ke seldiozora3@gmail.com dan muncul sebagai notifikasi Gmail di HP.
