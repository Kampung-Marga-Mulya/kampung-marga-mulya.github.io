# Kebijakan keamanan

## Melaporkan celah keamanan

Jika menemukan celah keamanan pada website Kampung Marga Mulya, laporkan secara pribadi melalui tab **Security → Report a vulnerability** di repositori ini, jangan melalui *issue* publik. Laporan akan ditanggapi oleh pengelola website dari Pemerintah Kampung Marga Mulya.

## Rancangan keamanan

**Arsitektur.** Website ini statis: tidak ada server aplikasi, tidak ada database, dan tidak ada formulir yang mengirim data warga. Karena itu serangan yang menargetkan server aplikasi seperti SQL injection dan pengambilalihan sesi server tidak berlaku.

**Autentikasi admin.** Portal admin (`/admin/`) tidak memiliki sistem kata sandi sendiri. Admin masuk dengan *fine-grained personal access token* GitHub yang:

- hanya berlaku untuk repositori ini, dengan izin *Contents: Read and write*;
- memiliki tanggal kedaluwarsa;
- diperiksa langsung oleh GitHub melalui HTTPS (TLS);
- disimpan hanya di `sessionStorage` tab tersebut, sehingga hilang saat tab ditutup;
- dihapus otomatis setelah 30 menit tanpa aktivitas.

Keamanan akun bergantung pada akun GitHub admin, sehingga **autentikasi dua faktor (2FA) wajib** bagi semua anggota organisasi.

**CSRF.** Portal admin tidak memakai cookie. Token dikirim melalui header `Authorization` yang ditambahkan oleh skrip portal, sehingga situs lain tidak dapat memicu permintaan atas nama admin.

**XSS.** Semua data yang ditampilkan disaring dengan fungsi `esc()`. Alamat tautan dan gambar disaring dengan `escUrl()` yang menolak skema `javascript:`, `data:`, dan `vbscript:`. Setiap halaman memakai *Content Security Policy* (`script-src 'self'`) tanpa skrip sebaris, dan portal admin membaca `data.js` sebagai data JSON5, bukan menjalankannya.

**Clickjacking.** Portal admin menolak dibuka di dalam bingkai (*frame*) situs lain.

**Rantai pasok.** Pustaka pihak ketiga (Leaflet, JSON5) dan huruf disimpan di repositori sendiri, bukan dimuat dari CDN. Versi GitHub Actions dipantau Dependabot, dan kode dipindai CodeQL setiap minggu.

**Kunci dan rahasia.** Tidak ada kata sandi, API key, atau rahasia lain di dalam repositori. Otomasi GitHub Actions memakai token sementara bawaan GitHub dengan izin minimum.

**Integritas dan cadangan.** Setiap perubahan isi tercatat sebagai commit (siapa, kapan, apa yang diubah) dan dapat dikembalikan ke versi sebelumnya.

## Pengaturan yang wajib diaktifkan pemilik organisasi

1. Organization settings → Authentication security → **Require two-factor authentication**.
2. Repository settings → Pages → **Enforce HTTPS**.
3. Repository settings → Code security → **Private vulnerability reporting**, **Secret scanning**, dan **Push protection**.
4. Repository settings → Branches → aturan perlindungan untuk `main` (larang *force push* dan penghapusan cabang).
5. Tinjau daftar anggota dan token admin setiap 6 bulan; cabut akses anggota yang sudah tidak bertugas.
