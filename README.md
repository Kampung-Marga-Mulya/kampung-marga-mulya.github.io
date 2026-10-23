# Marga Mulya On Site

Website profil Kampung Marga Mulya (https://kampung-marga-mulya.github.io), Distrik Semangga, Kabupaten Merauke, Papua Selatan. Dikembangkan atas kerja sama **Tim Ekspedisi Patriot IPB University** dengan **Pemerintah Kampung Marga Mulya** (2026).

## Isi folder

| File / folder | Fungsi |
|---|---|
| `index.html` | Kerangka halaman |
| `assets/js/data.js` | **Semua isi website** — ubah file ini saja untuk memperbarui data |
| `assets/js/app.js` | Logika tampilan (tidak perlu diubah) |
| `assets/css/style.css` | Tampilan dan warna |
| `assets/img/` | Foto pejabat, galeri, sampul video |
| `assets/peta/` | Ortofoto hasil drone |
| `assets/video/` | Video profil MP4 (bila tidak memakai YouTube) |
| `PROMPT_CLAUDE_CODE.md` | Prompt siap pakai untuk Claude Code |
| `PANDUAN_HOSTING.md` | Cara menerbitkan website dan memasang domain |

## Melihat website di komputer

Klik dua kali `index.html`. Atau, dari terminal di folder ini: `python3 -m http.server 8000` lalu buka http://localhost:8000.

## Memperbarui isi

1. Buka `assets/js/data.js` dengan Notepad/VS Code.
2. Ganti teks atau angka di antara tanda kutip. Data bertanda `// CONTOH` belum resmi.
3. Bila semua data sudah resmi, ubah `dataContoh: true` menjadi `dataContoh: false`.
4. Simpan, lalu unggah ulang ke hosting (lihat `PANDUAN_HOSTING.md`).

**Foto:** taruh file di `assets/img/`, lalu isi path-nya, misalnya `foto: "assets/img/kepala-kampung.jpg"` atau `src: "assets/img/panen.jpg"` di galeri.

**Peta drone:** ekspor ortofoto (dari Agisoft/WebODM/DroneDeploy) ke JPG/WEBP lebar ±2400 px, taruh di `assets/peta/`, isi `peta.ortofoto`. Atur posisi titik dengan `x` dan `y` dalam persen dari kiri dan atas gambar.

**Anggaran, Indeks Desa, layanan, sosmed:** isi bagian `apbkam`, `indeksDesa`, `layanan`, dan `sosmed` di `data.js`. Untuk WhatsApp, tulis url seperti `https://wa.me/62812xxxxxxx`.

**Google Maps & Street View:** isi `identitas.koordinat` dengan koordinat GPS kantor kampung, mis. `{ lat: -8.40, lng: 140.40 }`, agar peta dan Street View tepat di kantor kampung.

**Video:** unggah ke YouTube, salin ID dari tautan (`https://youtu.be/ID_INI`) ke `video.youtubeId`. Atau taruh MP4 di `assets/video/` dan isi `video.fileLokal`.

## Data terverifikasi

Kode wilayah 93.01.05.2008, kode pos 99631, Distrik Semangga, jumlah penduduk 2.882 jiwa (proyeksi BPS pertengahan 2024), dan SD Inpres Semangga 3 di Kampung Marga Mulya. Data lain masih contoh dan wajib diganti dengan data resmi kampung.
