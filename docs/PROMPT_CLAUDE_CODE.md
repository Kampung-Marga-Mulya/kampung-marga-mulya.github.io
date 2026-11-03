# Prompt Claude Code — Marga Mulya On Site

Ada tiga prompt di file ini. Pakai **Prompt 1** bila Anda ingin Claude Code membangun ulang website dari nol. Pakai **Prompt 2** bila Anda sudah memiliki folder `marga-mulya-on-site` ini dan ingin Claude Code melanjutkan, merapikan, atau menambah fitur. **Prompt 3** adalah perintah-perintah singkat untuk pekerjaan rutin (mengganti data, memasang ortofoto, menerbitkan).

Cara memakai: buka terminal di folder proyek, jalankan `claude`, lalu salin-tempel salah satu prompt di bawah.

---

## Prompt 1 — Bangun dari nol

```
Kamu adalah pengembang web untuk pemerintahan kampung di Indonesia. Buatkan website profil
kampung bernama "Marga Mulya On Site" untuk Kampung Marga Mulya, Distrik Semangga, Kabupaten
Merauke, Provinsi Papua Selatan (kode wilayah 93.01.05.2008, kode pos 99631).

KONTEKS
- Website ini adalah hasil KERJA SAMA Tim Ekspedisi Patriot IPB University dengan Pemerintah
  Kampung Marga Mulya (2026). Tulisan kerja sama ini WAJIB tampil di beranda (hero), di bagian
  "Tentang website ini", dan di footer.
- Pengelola nantinya adalah perangkat kampung yang bukan programmer. Jadi:
  * situs statis murni: HTML + CSS + JavaScript biasa, TANPA framework, TANPA build step,
    TANPA database. Harus bisa dibuka langsung dengan klik dua kali index.html.
  * SEMUA isi (teks, angka, nama pejabat, titik peta, ID video, foto) disimpan di SATU file
    assets/js/data.js sebagai objek window.KAMPUNG, lengkap dengan komentar berbahasa
    Indonesia yang menjelaskan cara mengisinya.
  * Sediakan flag meta.dataContoh. Jika true, tampilkan pita peringatan "versi draf" dan
    lencana "contoh" di setiap panel data yang belum resmi.

STRUKTUR FOLDER
index.html
assets/css/style.css
assets/js/data.js      (isi website)
assets/js/app.js       (logika tampilan; membaca data.js dan mengisi halaman)
assets/img/            (foto pejabat, galeri, poster video)
assets/peta/           (ortofoto drone .jpg/.webp)
assets/video/          (video profil .mp4 bila tidak memakai YouTube)
README.md, PANDUAN_HOSTING.md

BAGIAN HALAMAN (satu halaman panjang, menu menempel di atas, menu lipat di ponsel)
1. Beranda/hero: gaya papan gapura "Selamat datang di Kampung Marga Mulya", nama distrik,
   kabupaten, provinsi, pita kerja sama, dan 4 angka kunci (penduduk, KK, kode wilayah, kode pos).
2. Profil: sejarah singkat, tabel identitas wilayah (luas, ketinggian, zona waktu WIT,
   koordinat), visi, misi bernomor, dan batas wilayah dalam tata letak mata angin.
3. Pemerintahan: bagan struktur organisasi (Kepala Kampung → Sekretaris → Kaur → Kasi →
   Kepala Dusun) dengan foto opsional, daftar Bamuskam, dan lembaga kemasyarakatan
   (PKK, Karang Taruna, Posyandu, LPMK, BUMKam, Gapoktan).
4. Data penduduk: kartu total/laki-laki/perempuan/KK; piramida penduduk per kelompok umur 5
   tahunan (laki-laki kiri, perempuan kanan); penduduk usia sekolah (PAUD 3–6, SD 7–12,
   SMP 13–15, SMA/SMK 16–18); diagram batang pendidikan terakhir, mata pencaharian, dan agama
   dengan jumlah dan persen; tabel fasilitas umum. Grafik digambar dengan HTML/CSS
   (tanpa pustaka grafik) supaya ringan di sinyal lemah.
5. Peta drone: gambar ortofoto drone dengan titik-titik interaktif (posisi x,y dalam persen),
   warna per kategori, tombol saring kategori, panel keterangan titik, metadata penerbangan
   (sumber, tanggal, resolusi, cakupan), dan tautan "Buka di Google Maps". Bila ortofoto belum
   ada, gambar peta sketsa sawah/jalan/irigasi/permukiman dengan <canvas>.
6. Video profil: dukung YouTube (pemutar baru dimuat setelah diklik, pakai youtube-nocookie)
   ATAU file MP4 lokal. Bila keduanya kosong, tampilkan sampul "Video profil sedang disiapkan".
6a. Transparansi APBKam: ringkasan pendapatan/belanja/pembiayaan/realisasi, sumber pendapatan,
   dan belanja per 5 bidang; tiap bidang bisa diketuk untuk tabel rincian kegiatan.
6b. Indeks Desa (pengganti IDM sejak 2025): nilai dalam cincin, status, 6 dimensi (Layanan Dasar,
   Sosial, Ekonomi, Lingkungan, Aksesibilitas, Tata Kelola), dan riwayat status per tahun.
6c. Peta bertab: Peta drone | Satelit Google (iframe maps.google.com ... &t=k&output=embed) |
   Peta jalan (&t=m) | Street View (tombol Google Maps URL map_action=pano). Tombol Buka di
   Google Maps dan Petunjuk arah.
6d. Layanan administrasi: daftar surat, persyaratan, dan lama proses.
6e. Tautan media sosial kampung (Facebook, Instagram, YouTube, TikTok, WhatsApp) dari data.js.
6f. SEMUA kartu, angka, batang grafik, jabatan, dan item bisa diketuk dan membuka jendela
   informasi (<dialog>) berisi penjelasan.
7. Potensi kampung (padi sawah, hortikultura, peternakan, UMKM) + linimasa kegiatan
   Ekspedisi Patriot.
8. Galeri foto (kotak bermotif bila foto belum ada).
9. Kontak kantor kampung + kotak "Tentang website ini" berisi teks kerja sama dan nama
   Ketua Tim Ekspedisi Patriot IPB University.
10. Footer dengan kalimat kerja sama.

DESAIN
- Identitas visual: papan nama gapura kampung (huruf display tegak dan padat, kapital).
- WARNA: dominan PUTIH, BIRU sebagai satu-satunya warna aksen (biru utama #1452C2, gradasi
  biru tua #082A66 sampai biru muda #EEF4FD), dan HITAM (#0A0A0A) khusus untuk tulisan.
  Tidak boleh ada warna lain (tanpa hijau, kuning, merah, abu-abu berwarna) termasuk pada
  grafik, titik peta, dan peta sketsa. Header putih dengan garis biru; hero, bagian peta,
  dan footer berlatar biru dengan tulisan putih; bagian lain berlatar putih.
- Font humanis minimalis: Source Serif 4 (judul) dan Source Sans 3 (isi). Hindari huruf
  geometris atau huruf display padat. Tambahkan ilustrasi SVG garis biru (sawah, rumah warga,
  musamus, pohon kelapa, drone) dan ikon garis untuk tiap bagian.
- Satu tema terang saja (tanpa mode gelap) agar warna putih-biru selalu konsisten.
- Wajib nyaman di ponsel lebar 360–400 px, tidak boleh ada gulir menyamping.
- Bahasa Indonesia baku dan sederhana di seluruh situs.

DATA
- Jumlah penduduk 2.882 jiwa (proyeksi BPS pertengahan 2024).
- SD Inpres Semangga 3 berada di Kampung Marga Mulya.
- Selain itu gunakan data contoh yang konsisten (jumlah per kelompok umur = total) dan tandai
  "// CONTOH" di data.js. Nama pejabat diisi "[Nama ...]".

KUALITAS
- Aksesibilitas: alt teks, fokus keyboard terlihat, aria-label pada tombol peta.
- Meta description dan Open Graph untuk dibagikan di WhatsApp.
- Setelah selesai, jalankan server lokal (python3 -m http.server 8000), periksa tidak ada
  galat di konsol, dan uji di lebar 390 px dan 1280 px.
- Tulis README.md berbahasa Indonesia: cara mengubah data, menambah foto, memasang
  ortofoto, mengisi video, dan menerbitkan ke GitHub Pages / Netlify.
```

---

## Prompt 2 — Lanjutkan dari kode yang sudah ada

```
Folder ini berisi website statis "Marga Mulya On Site" (profil Kampung Marga Mulya, Distrik
Semangga, Merauke), hasil kerja sama Tim Ekspedisi Patriot IPB University dengan Pemerintah
Kampung Marga Mulya. Baca dulu README.md, index.html, assets/js/data.js, assets/js/app.js,
dan assets/css/style.css sebelum mengubah apa pun.

Aturan proyek:
- Tetap situs statis tanpa framework dan tanpa build step.
- Semua isi tetap bersumber dari assets/js/data.js. Jangan menulis data langsung di HTML.
- Pertahankan tulisan kerja sama Tim Ekspedisi Patriot IPB University × Pemerintah Kampung
  Marga Mulya di hero, bagian kontak, dan footer.
- Pertahankan palet putih–biru–hitam (tanpa warna lain), token warna di :root, dan tampilan
  ponsel yang sudah ada.

Tugas:
[TULIS TUGAS DI SINI, contoh:]
1. Tambahkan bagian "Transparansi Dana Kampung" (APBKam: pendapatan, belanja per bidang,
   realisasi) yang datanya diambil dari data.js, ditampilkan sebagai tabel dan batang.
2. Tambahkan bagian "Layanan Administrasi" berisi daftar surat yang bisa diurus warga,
   syarat dokumen, dan lama proses.
3. Tambahkan halaman berita sederhana: setiap berita adalah objek di data.js (judul, tanggal,
   foto, isi), tampil sebagai kartu, dan bisa dibuka dalam tampilan penuh.

Setelah selesai: jalankan python3 -m http.server 8000, uji di lebar 390 px dan 1280 px,
pastikan tidak ada galat konsol, lalu perbarui README.md.
```

---

## Prompt 3 — Perintah singkat untuk pekerjaan rutin

Mengganti data dengan data resmi:
```
Saya lampirkan data resmi kampung (file Excel/CSV/foto tabel). Masukkan ke assets/js/data.js
di bagian penduduk (usia, usiaSekolah, pendidikan, pekerjaan, agama, laki, perempuan, kk).
Pastikan jumlah per kelompok umur sama dengan total. Hapus tanda // CONTOH pada data yang
sudah resmi. Bila semua sudah resmi, ubah meta.dataContoh menjadi false.
```

Memasang ortofoto drone:
```
Saya punya ortofoto drone di assets/peta/ortofoto-asli.tif. Konversikan menjadi
assets/peta/ortofoto-marga-mulya.webp dengan lebar maksimal 2400 px (ukuran < 1,5 MB),
isi peta.ortofoto di data.js, lalu bantu saya menempatkan ulang titik-titik peta: tampilkan
gambar, dan saya akan menyebutkan posisi setiap fasilitas.
```

Memasang video:
```
Video profil sudah diunggah ke YouTube dengan tautan https://youtu.be/XXXXXXXXXXX.
Isi video.youtubeId di data.js dan uji bahwa pemutar muncul setelah sampul diklik.
```

Menerbitkan ke GitHub Pages:
```
Inisialisasi git di folder ini, buat repositori publik "marga-mulya-on-site" di akun GitHub
saya dengan gh CLI, push ke branch main, lalu aktifkan GitHub Pages dari branch main folder
root. Beri tahu saya alamat websitenya.
```

Menghubungkan domain:
```
Domain margamulya.desa.id (atau domain lain) sudah aktif. Buat file CNAME berisi nama domain
tersebut, push ke GitHub, lalu tuliskan rekaman DNS yang harus saya pasang di panel domain.
```
