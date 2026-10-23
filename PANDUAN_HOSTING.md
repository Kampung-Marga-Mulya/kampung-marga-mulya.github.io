# Panduan Hosting dan Domain — Marga Mulya On Site

Website ini adalah situs statis (hanya file HTML, CSS, JS, dan gambar), sehingga bisa dihosting **gratis** tanpa server sendiri. Yang perlu disiapkan hanyalah satu akun hosting dan, bila diinginkan, satu nama domain.

Satu hal penting sebelum mulai: buat semua akun (email, GitHub/Netlify, domain) atas nama **Pemerintah Kampung Marga Mulya**, bukan akun pribadi anggota tim. Buat email khusus, misalnya `kampungmargamulya@gmail.com`, catat kata sandinya, lalu serahkan ke Kepala Kampung dan Sekretaris saat serah terima. Dengan begitu website tetap bisa dikelola setelah Tim Ekspedisi Patriot selesai bertugas.

---

## Langkah 1 — Hosting gratis (pilih salah satu)

### A. Netlify Drop (paling mudah, tanpa coding)
1. Buka https://app.netlify.com/drop dan daftar dengan email kampung.
2. Seret seluruh folder `marga-mulya-on-site` ke halaman tersebut.
3. Website langsung tayang di alamat acak, misalnya `nama-acak.netlify.app`.
4. Masuk ke **Site configuration → Change site name**, ubah menjadi `margamulya`, sehingga alamatnya menjadi **margamulya.netlify.app** (bila nama itu masih tersedia).
5. Untuk memperbarui website, buka tab **Deploys** lalu seret folder yang sudah diperbarui.

### B. GitHub Pages (cocok bila memakai Claude Code)
1. Buat akun di https://github.com dengan email kampung.
2. Buat repositori publik bernama `marga-mulya-on-site`, unggah semua file (atau minta Claude Code melakukannya, lihat Prompt 3 di `PROMPT_CLAUDE_CODE.md`).
3. Buka **Settings → Pages**, pilih *Deploy from a branch*, branch `main`, folder `/ (root)`, lalu **Save**.
4. Dalam beberapa menit website tayang di `https://<nama-akun>.github.io/marga-mulya-on-site/`.

Alternatif lain yang setara: Cloudflare Pages dan Vercel (keduanya juga gratis untuk situs statis).

---

## Langkah 2 — Nama domain

### Pilihan 1: margamulya.desa.id (domain resmi pemerintahan desa/kampung)
Domain `.desa.id` adalah identitas resmi website pemerintah desa dan paling dipercaya warga. Pendaftarannya **tidak dilakukan oleh kampung sendiri**, melainkan melalui portal **domain.go.id** dengan pengajuan dari pemerintah kabupaten. Dokumen yang umumnya diminta:
- Surat permohonan dari pejabat atas nama Bupati Merauke, ditujukan kepada Direktur Jenderal Teknologi Pemerintah Digital (Komdigi).
- Dasar hukum: Peraturan Daerah Kabupaten Merauke tentang pembentukan kampung.
- Surat kuasa dari Kepala Kampung Marga Mulya kepada Pejabat Nama Domain.
- Surat penunjukan Pejabat Nama Domain (pejabat di Diskominfo kabupaten).
- Kartu ASN Pejabat Nama Domain.

Langkah praktis: Kepala Kampung mengirim surat permohonan ke **Dinas Kominfo Kabupaten Merauke**, yang kemudian mendaftarkannya lewat domain.go.id. Verifikasi berkas memakan waktu sekitar beberapa hari kerja. Persyaratan bisa berubah, jadi konfirmasi dulu ke Diskominfo atau helpdesk domain.go.id.

### Pilihan 2: domain .id umum (bisa langsung dibeli)
Bila ingin cepat, beli domain seperti `margamulya.my.id`, `margamulya.web.id`, atau `margamulyaonsite.id` di registrar resmi PANDI (misalnya Rumahweb, Niagahoster/Hostinger, IDwebhost, Domainesia). Domain `.id`, `.my.id`, dan `.biz.id` tidak memerlukan dokumen khusus. Biayanya tahunan, jadi pastikan ada anggaran perpanjangan (misalnya dari Dana Kampung) dan pengingat tanggal jatuh tempo.

### Pilihan 3: tanpa domain berbayar
Cukup gunakan `margamulya.netlify.app` atau alamat GitHub Pages. Gratis selamanya dan bisa dipindah ke domain resmi kapan saja.

---

## Langkah 3 — Menghubungkan domain ke hosting

**Netlify:** buka **Domain management → Add a domain**, masukkan nama domain, lalu di panel DNS domain pasang:
- `CNAME` untuk `www` → `margamulya.netlify.app`
- `A` untuk domain utama (`@`) → `75.2.60.5`

**GitHub Pages:** isi nama domain di **Settings → Pages → Custom domain** (GitHub otomatis membuat file `CNAME`), lalu di panel DNS pasang:
- `A` untuk `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` untuk `www` → `<nama-akun>.github.io`

Untuk domain `.desa.id`, rekaman DNS ini diserahkan ke Diskominfo yang mengelola domain tersebut. Setelah DNS aktif (bisa sampai 24 jam), centang **Enforce HTTPS** agar website memakai gembok aman.

Selalu cek angka IP di dokumentasi resmi Netlify/GitHub sebelum memasang, karena bisa diperbarui penyedia.

---

## Langkah 4 — Perawatan rutin

- Perbarui data di `assets/js/data.js` minimal setiap semester (data penduduk, pejabat, kegiatan).
- Kompres foto sebelum diunggah (lebar ±1600 px, ukuran < 400 KB) agar website cepat dibuka di sinyal lemah.
- Video sebaiknya diunggah ke YouTube kanal kampung, lalu cukup isi `youtubeId`, supaya tidak membebani hosting.
- Simpan salinan folder website di Google Drive kampung sebagai cadangan.
