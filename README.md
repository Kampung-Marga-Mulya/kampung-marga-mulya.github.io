# Marga Mulya On Site

Website resmi Kampung Marga Mulya, Distrik Semangga, Kabupaten Merauke, Papua Selatan (kode wilayah 93.01.05.2008). Dikembangkan atas kerja sama **Tim Ekspedisi Patriot IPB University** dengan **Pemerintah Kampung Marga Mulya** (2026).

Alamat saat ini: https://kampung-marga-mulya.github.io

## Ringkasan teknis

- **Jenis situs:** statis. Hanya berkas HTML, CSS, JavaScript, gambar, dan JSON. Tidak ada server aplikasi, PHP, maupun database.
- **Teknologi:** HTML5, CSS3, JavaScript murni tanpa framework dan tanpa proses build. Peta memakai Leaflet 1.9.4 dengan peta dasar OpenStreetMap. Huruf Source Sans 3 dan Source Serif 4.
- **Tanpa ketergantungan CDN:** Leaflet, JSON5, dan huruf disimpan di website sendiri (`assets/vendor`, `assets/fonts`).
- **Data:** `assets/js/data.js` (profil, pemerintahan, penduduk, APBKam, potensi) dan berkas JSON di `data/`. Setiap perubahan tercatat di riwayat git.
- **Otomasi:** GitHub Actions menjalankan robot berita setiap 3 jam (`scripts/update_berita.py`), mengumpulkan video setiap 6 jam (`scripts/update_video.py`), menghitung jarak wisata dan fasilitas (`scripts/hitung_wisata.py`), dan memindai keamanan kode dengan CodeQL.
- **Keamanan:** lihat [SECURITY.md](SECURITY.md).

## Isi folder

| Berkas / folder | Fungsi |
|---|---|
| `index.html` | Halaman utama (beranda, profil, data, transparansi, jelajah, layanan) |
| `apbk.html` | Rincian lengkap APBKam 2026 (dari `data/apbk-2026.json`) |
| `rpjmk.html` | RPJMK Kampung Marga Mulya versi lengkap |
| `admin/` | Portal admin untuk mengubah isi tanpa menyentuh kode |
| `assets/js/data.js` | Isi utama website |
| `assets/js/app.js`, `router.js`, `apbk.js`, `rpjmk.js` | Logika tampilan |
| `assets/css/` | Tampilan dan huruf |
| `assets/img/`, `assets/video/`, `assets/dok/` | Foto, video, dan dokumen PDF |
| `assets/vendor/` | Pustaka pihak ketiga yang disimpan sendiri (Leaflet, JSON5) |
| `data/` | Data fasilitas, wisata, berita otomatis, APBKam, batas wilayah |
| `scripts/` | Skrip Python untuk robot berita dan perhitungan jarak (`scripts/arsip` berisi skrip riset sekali pakai) |
| `docs/` | Catatan pengembangan dan panduan hosting |
| `404.html`, `robots.txt`, `manifest.webmanifest`, `.well-known/security.txt` | Berkas pendukung standar website |

## Memperbarui isi

Cara yang disarankan adalah **Portal Admin** di `/admin/`. Masuk memakai token GitHub milik akun admin (fine-grained token, hanya untuk repositori ini, izin *Contents: Read and write*, dengan tanggal kedaluwarsa). Setiap penyimpanan menjadi satu commit atas nama admin, lalu website terbit ulang otomatis dalam 1–2 menit.

Perubahan langsung ke berkas juga bisa dilakukan lewat GitHub. Berkas `data.js` boleh berisi komentar; portal admin membacanya sebagai data (JSON5), bukan menjalankannya sebagai kode.

## Melihat website di komputer

Dari terminal di folder ini jalankan `python3 -m http.server 8000`, lalu buka http://localhost:8000.

## Berita otomatis

Robot di `.github/workflows/berita-otomatis.yml` mencari berita tentang Kampung Marga Mulya dan berita terkait Semangga/Merauke (pertanian, harga pangan) setiap 3 jam, memeriksa isinya, lalu menyimpannya ke `data/berita-otomatis.json`. Berita yang keliru bisa disembunyikan dengan menambahkan tautannya ke `data/berita-abaikan.json`.

## Video otomatis

Robot di `.github/workflows/video-otomatis.yml` mencari video tentang Kampung Marga Mulya di YouTube, TikTok, Instagram, dan Facebook setiap 6 jam (`scripts/update_video.py`). Video hanya disimpan bila judul atau keterangannya menyebut Marga Mulya beserta Merauke/Semangga; kabar insiden atau kriminal perorangan tidak ditampilkan. Urutan tampil memakai skor relevansi, kesegaran, dan popularitas. Hasilnya di `data/video-otomatis.json`, sampulnya di `assets/img/video/`.

- Video yang wajib selalu tampil di depan (misalnya video resmi kampung): tambahkan tautannya di `video.pilihan` pada `assets/js/data.js` atau lewat Portal Admin.
- Video yang keliru: tambahkan tautannya ke `data/video-abaikan.json`.

## Pindah ke domain pemerintah

Semua tautan di dalam website bersifat relatif, jadi website berjalan di domain apa pun. Saat domain baru aktif (misalnya subdomain `merauke.go.id` atau `desa.id`), yang perlu diganti hanya:

1. Berkas `CNAME` berisi nama domain baru (bila tetap memakai GitHub Pages), atau salin seluruh isi repositori ke server web.
2. Alamat di `og:url` dan `og:image` pada `index.html`, serta `meta.alamatWeb` di `data.js`.
3. Alamat `Contact` dan `Policy` di `.well-known/security.txt` bila pelaporan keamanan dipindahkan.

## Lisensi pihak ketiga

- Leaflet 1.9.4: BSD-2-Clause (`assets/vendor/leaflet/LICENSE`)
- JSON5 2.2.3: MIT (`assets/vendor/json5/LICENSE.md`)
- Source Sans 3 dan Source Serif 4: SIL Open Font License 1.1 (`assets/fonts/`)
- Peta dasar © kontributor OpenStreetMap (ODbL)
