/* =====================================================================
   MARGA MULYA ON SITE — DATA KAMPUNG
   ---------------------------------------------------------------------
   SEMUA isi website diambil dari file ini. Untuk memperbarui website,
   cukup ubah teks/angka di bawah, simpan, lalu unggah ulang.

   PENTING:
   - Angka bertanda  // CONTOH  adalah data contoh agar tampilan terisi.
     Ganti dengan data resmi kampung (Profil Kampung, APBKam, Indeks Desa,
     pendataan Tim Ekspedisi Patriot), lalu ubah  dataContoh: false
     agar pita "versi draf" di website hilang.
   - Data yang SUDAH terverifikasi dari sumber publik:
       kode wilayah, kode pos, distrik, jumlah penduduk (proyeksi BPS 2024),
       SD Inpres Semangga 3 berlokasi di Kampung Marga Mulya.
   ===================================================================== */

window.KAMPUNG = {
  meta: {
    namaSitus: "Marga Mulya On Site",
    alamatWeb: "https://kampung-marga-mulya.github.io",
    dataContoh: true,                       // ubah ke false bila semua data sudah resmi
    tahunData: "2026",
    sumberData: "Pemerintah Kampung Marga Mulya; BPS Kabupaten Merauke; pendataan Tim Ekspedisi Patriot IPB University 2026",
    diperbarui: "Oktober 2026"
  },

  identitas: {
    nama: "Kampung Marga Mulya",
    distrik: "Semangga",
    kabupaten: "Merauke",
    provinsi: "Papua Selatan",
    kodeWilayah: "93.01.05.2008",
    kodePos: "99631",
    luas: "[isi luas] km²",
    ketinggian: "[isi] mdpl",
    zonaWaktu: "WIT (UTC+9)",
    jumlahDusun: 3,                         // CONTOH
    jumlahRT: 12,                           // CONTOH
    // Koordinat GPS kantor kampung. Isi dengan angka dari survei, mis. { lat: -8.4, lng: 140.4 }.
    // Selama null, peta Google memakai pencarian nama kampung di bawah.
    koordinat: null
  },

  // Dipakai untuk Google Maps, petunjuk arah, dan Street View.
  google: {
    pencarian: "Marga Mulya, Semangga, Merauke, Papua Selatan",
    zoom: 15
  },

  // Isi tautan akun resmi kampung. Yang kosong akan tampil "belum tersedia".
  sosmed: [
    { nama: "Facebook", url: "", akun: "[nama halaman Facebook kampung]" },
    { nama: "Instagram", url: "", akun: "[@akun Instagram kampung]" },
    { nama: "YouTube", url: "", akun: "[nama kanal YouTube kampung]" },
    { nama: "TikTok", url: "", akun: "[@akun TikTok kampung]" },
    { nama: "WhatsApp", url: "", akun: "[nomor WhatsApp kantor kampung]" }   // format url: https://wa.me/62812xxxxxxx
  ],

  kerjaSama: {
    pihak: ["Tim Ekspedisi Patriot IPB University", "Pemerintah Kampung Marga Mulya"],
    tahun: "2026",
    ringkas: "Website ini disusun bersama oleh Tim Ekspedisi Patriot IPB University dan Pemerintah Kampung Marga Mulya sebagai pusat informasi kampung yang terbuka bagi warga, pemerintah, dan mitra pembangunan. Pemetaan drone, pendataan penduduk, dan video profil dikerjakan selama kegiatan Ekspedisi Patriot 2026 di Distrik Semangga.",
    ketuaTim: "Dr. rer. pol. M. Iqbal Irfany, S.E., M.App.Ec."
  },

  sejarah: [
    "Kampung Marga Mulya adalah salah satu kampung di Distrik Semangga, Kabupaten Merauke, Provinsi Papua Selatan. Wilayahnya berada di dataran rendah dan sebagian besar warganya hidup dari pertanian, terutama sawah padi.",
    "Paragraf ini adalah draf. Lengkapi dengan asal-usul nama Marga Mulya, tahun berdirinya kampung, kedatangan warga pertama, serta tokoh-tokoh yang berperan dalam pembangunan kampung."
  ],

  visi: "Terwujudnya Kampung Marga Mulya yang mandiri, sejahtera, dan berbudaya melalui pertanian yang maju dan pelayanan publik yang terbuka.",   // CONTOH
  misi: [                                                                                                           // CONTOH
    "Meningkatkan kualitas pelayanan administrasi kepada warga.",
    "Mengembangkan pertanian padi dan hortikultura yang berkelanjutan.",
    "Memperkuat ekonomi warga melalui UMKM dan BUMKam.",
    "Meningkatkan kualitas pendidikan, kesehatan, dan keluarga.",
    "Menjaga kerukunan antarwarga dan kelestarian lingkungan."
  ],

  batas: {
    utara: "[nama kampung/wilayah di utara]",
    selatan: "[nama kampung/wilayah di selatan]",
    timur: "[nama kampung/wilayah di timur]",
    barat: "[nama kampung/wilayah di barat]"
  },

  struktur: {
    // tugas = ringkasan tugas pokok jabatan; tampil saat kotak jabatan diklik.
    kepala: { jabatan: "Kepala Kampung", nama: "[Nama Kepala Kampung]", foto: "", kontak: "",
      tugas: "Memimpin penyelenggaraan pemerintahan kampung, melaksanakan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat." },
    sekretaris: { jabatan: "Sekretaris Kampung", nama: "[Nama Sekretaris]",
      tugas: "Membantu Kepala Kampung di bidang administrasi pemerintahan dan mengoordinasikan kepala urusan." },
    kaur: [
      { jabatan: "Kaur Keuangan", nama: "[Nama]", tugas: "Menatausahakan keuangan kampung: penerimaan, pengeluaran, pembukuan, dan laporan pertanggungjawaban APBKam." },
      { jabatan: "Kaur Umum & Perencanaan", nama: "[Nama]", tugas: "Mengurus surat-menyurat, arsip, aset, serta menyusun rencana pembangunan (RPJMKam dan RKPKam)." }
    ],
    kasi: [
      { jabatan: "Kasi Pemerintahan", nama: "[Nama]", tugas: "Menangani administrasi kependudukan, pertanahan, ketertiban, dan penyusunan produk hukum kampung." },
      { jabatan: "Kasi Kesejahteraan", nama: "[Nama]", tugas: "Melaksanakan pembangunan sarana prasarana dan program pemberdayaan masyarakat." },
      { jabatan: "Kasi Pelayanan", nama: "[Nama]", tugas: "Melaksanakan penyuluhan, pelayanan sosial, keagamaan, dan ketenagakerjaan." }
    ],
    kewilayahan: [
      { jabatan: "Kepala Dusun I", nama: "[Nama]", tugas: "Membantu Kepala Kampung di wilayah Dusun I: ketertiban, pendataan, dan pembangunan." },
      { jabatan: "Kepala Dusun II", nama: "[Nama]", tugas: "Membantu Kepala Kampung di wilayah Dusun II: ketertiban, pendataan, dan pembangunan." },
      { jabatan: "Kepala Dusun III", nama: "[Nama]", tugas: "Membantu Kepala Kampung di wilayah Dusun III: ketertiban, pendataan, dan pembangunan." }
    ],
    bamuskam: [
      { jabatan: "Ketua Bamuskam", nama: "[Nama]" },
      { jabatan: "Wakil Ketua", nama: "[Nama]" },
      { jabatan: "Sekretaris", nama: "[Nama]" },
      { jabatan: "Anggota", nama: "[Nama], [Nama]" }
    ],
    lembaga: [
      { nama: "TP PKK Kampung", ket: "Pemberdayaan dan kesejahteraan keluarga", ketua: "[Nama ketua]" },
      { nama: "Karang Taruna", ket: "Wadah kegiatan kepemudaan", ketua: "[Nama ketua]" },
      { nama: "Posyandu", ket: "Kesehatan ibu, bayi, dan balita", ketua: "[Nama ketua]" },
      { nama: "LPMK", ket: "Lembaga Pemberdayaan Masyarakat Kampung", ketua: "[Nama ketua]" },
      { nama: "BUMKam", ket: "Badan Usaha Milik Kampung", ketua: "[Nama direktur]" },
      { nama: "Gapoktan", ket: "Gabungan kelompok tani", ketua: "[Nama ketua]" }
    ]
  },

  penduduk: {
    total: 2882,               // proyeksi BPS pertengahan 2024
    laki: 1480,                // CONTOH
    perempuan: 1402,           // CONTOH
    kk: 812,                   // CONTOH
    usia: [                    // CONTOH — jumlahnya disamakan dengan total
      { k: "0–4", l: 136, p: 128 }, { k: "5–9", l: 133, p: 125 }, { k: "10–14", l: 130, p: 122 },
      { k: "15–19", l: 124, p: 116 }, { k: "20–24", l: 113, p: 105 }, { k: "25–29", l: 110, p: 103 },
      { k: "30–34", l: 112, p: 105 }, { k: "35–39", l: 111, p: 104 }, { k: "40–44", l: 108, p: 101 },
      { k: "45–49", l: 101, p: 94 }, { k: "50–54", l: 89, p: 83 }, { k: "55–59", l: 74, p: 75 },
      { k: "60–64", l: 59, p: 60 }, { k: "65+", l: 80, p: 81 }
    ],
    usiaSekolah: [             // CONTOH
      { label: "PAUD / TK", rentang: "3–6 tahun", jumlah: 205, ket: "Anak usia prasekolah. Layanan terdekat: PAUD/TK kampung." },
      { label: "SD", rentang: "7–12 tahun", jumlah: 301, ket: "Anak usia sekolah dasar. Sekolah di kampung: SD Inpres Semangga 3." },
      { label: "SMP", rentang: "13–15 tahun", jumlah: 150, ket: "Anak usia SMP. Isi nama sekolah tujuan terdekat." },
      { label: "SMA / SMK", rentang: "16–18 tahun", jumlah: 144, ket: "Remaja usia SMA/SMK. Isi nama sekolah tujuan terdekat." }
    ],
    pendidikan: [              // CONTOH
      { label: "Tidak / belum sekolah", jumlah: 410 }, { label: "Belum tamat SD", jumlah: 352 },
      { label: "Tamat SD", jumlah: 690 }, { label: "Tamat SMP", jumlah: 548 },
      { label: "Tamat SMA / SMK", jumlah: 662 }, { label: "Diploma (D1–D3)", jumlah: 82 },
      { label: "Sarjana (S1)", jumlah: 128 }, { label: "Pascasarjana", jumlah: 10 }
    ],
    pekerjaan: [               // CONTOH
      { label: "Petani", jumlah: 612 }, { label: "Buruh tani", jumlah: 214 },
      { label: "Pedagang / wiraswasta", jumlah: 168 }, { label: "Karyawan swasta", jumlah: 74 },
      { label: "Peternak", jumlah: 52 }, { label: "PNS / TNI / Polri", jumlah: 46 },
      { label: "Pelajar / mahasiswa", jumlah: 590 }, { label: "Mengurus rumah tangga", jumlah: 420 },
      { label: "Belum / tidak bekerja", jumlah: 706 }
    ],
    agama: [                   // CONTOH
      { label: "Islam", jumlah: 1610 }, { label: "Katolik", jumlah: 812 },
      { label: "Kristen Protestan", jumlah: 436 }, { label: "Hindu", jumlah: 18 }, { label: "Buddha", jumlah: 6 }
    ]
  },

  /* ---------- TRANSPARANSI ANGGARAN (APBKam) ---------- */
  apbkam: {                    // CONTOH SELURUHNYA — ganti dengan Perkam APBKam & laporan realisasi
    tahun: 2026,
    realisasiPer: "30 September 2026",
    dokumen: "Peraturan Kampung tentang APBKam Tahun Anggaran 2026",
    pendapatan: [
      { label: "Dana Desa (APBN)", jumlah: 1120000000 },
      { label: "Alokasi Dana Kampung (ADK)", jumlah: 450000000 },
      { label: "Bantuan Keuangan Provinsi", jumlah: 100000000 },
      { label: "Bagi Hasil Pajak & Retribusi", jumlah: 35000000 },
      { label: "Pendapatan Asli Kampung", jumlah: 15000000 }
    ],
    pembiayaan: { label: "SiLPA tahun sebelumnya", jumlah: 30000000 },
    belanja: [
      { bidang: "Penyelenggaraan Pemerintahan Kampung", anggaran: 560000000, realisasi: 418000000,
        kegiatan: [
          { nama: "Penghasilan tetap & tunjangan perangkat", anggaran: 410000000, realisasi: 307500000 },
          { nama: "Operasional kantor kampung", anggaran: 85000000, realisasi: 66000000 },
          { nama: "Administrasi kependudukan & pendataan", anggaran: 40000000, realisasi: 30000000 },
          { nama: "Musyawarah kampung & penyusunan RKPKam", anggaran: 25000000, realisasi: 14500000 }
        ] },
      { bidang: "Pelaksanaan Pembangunan Kampung", anggaran: 620000000, realisasi: 372000000,
        kegiatan: [
          { nama: "Jalan usaha tani (rabat beton)", anggaran: 260000000, realisasi: 182000000 },
          { nama: "Saluran irigasi tersier", anggaran: 150000000, realisasi: 90000000 },
          { nama: "Posyandu & pencegahan stunting", anggaran: 110000000, realisasi: 60000000 },
          { nama: "Dukungan PAUD kampung", anggaran: 100000000, realisasi: 40000000 }
        ] },
      { bidang: "Pembinaan Kemasyarakatan", anggaran: 140000000, realisasi: 92000000,
        kegiatan: [
          { nama: "Kegiatan PKK", anggaran: 45000000, realisasi: 30000000 },
          { nama: "Karang Taruna & olahraga", anggaran: 35000000, realisasi: 22000000 },
          { nama: "Linmas & keamanan lingkungan", anggaran: 30000000, realisasi: 22500000 },
          { nama: "Kegiatan keagamaan", anggaran: 30000000, realisasi: 17500000 }
        ] },
      { bidang: "Pemberdayaan Masyarakat", anggaran: 380000000, realisasi: 205000000,
        kegiatan: [
          { nama: "Ketahanan pangan (benih & alsintan)", anggaran: 230000000, realisasi: 140000000 },
          { nama: "Pelatihan petani & UMKM", anggaran: 60000000, realisasi: 35000000 },
          { nama: "Penyertaan modal BUMKam", anggaran: 90000000, realisasi: 30000000 }
        ] },
      { bidang: "Penanggulangan Bencana, Darurat & Mendesak", anggaran: 50000000, realisasi: 37500000,
        kegiatan: [
          { nama: "BLT Dana Desa", anggaran: 45000000, realisasi: 33750000 },
          { nama: "Siaga bencana banjir", anggaran: 5000000, realisasi: 3750000 }
        ] }
    ]
  },

  /* ---------- INDEKS DESA (pengganti IDM) ---------- */
  indeksDesa: {                // CONTOH — ganti dengan hasil resmi Kemendes
    tahun: 2025,
    nilai: 61.2,
    skala: 100,
    status: "Berkembang",
    catatan: "Sejak 2025 Indeks Desa Membangun (IDM) diperbarui menjadi Indeks Desa, yang menilai enam dimensi pembangunan kampung.",
    dimensi: [
      { nama: "Layanan Dasar", nilai: 66, ket: "Akses pendidikan, kesehatan, air bersih, sanitasi, dan listrik." },
      { nama: "Sosial", nilai: 70, ket: "Kerukunan, gotong royong, keamanan, dan modal sosial warga." },
      { nama: "Ekonomi", nilai: 58, ket: "Keragaman usaha, akses pasar, lembaga ekonomi, dan BUMKam." },
      { nama: "Lingkungan", nilai: 63, ket: "Pengelolaan sampah, risiko bencana, dan kualitas lingkungan." },
      { nama: "Aksesibilitas", nilai: 52, ket: "Kondisi jalan, transportasi, dan jarak ke pusat layanan." },
      { nama: "Tata Kelola Pemerintahan", nilai: 58, ket: "Perencanaan, keuangan, pelayanan, dan keterbukaan informasi kampung." }
    ],
    riwayat: [
      { tahun: 2022, status: "Tertinggal" },
      { tahun: 2023, status: "Berkembang" },
      { tahun: 2024, status: "Berkembang" },
      { tahun: 2025, status: "Berkembang" }
    ]
  },

  /* ---------- LAYANAN ADMINISTRASI ---------- */
  layanan: [                   // CONTOH — sesuaikan dengan prosedur kantor kampung
    { nama: "Surat Pengantar KTP-el / KK", waktu: "1 hari kerja", syarat: ["Fotokopi KK", "Surat pengantar RT", "Akta kelahiran (KTP pertama)"] },
    { nama: "Surat Keterangan Domisili", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el", "Fotokopi KK", "Surat pengantar RT"] },
    { nama: "Surat Keterangan Tidak Mampu", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el dan KK", "Surat pengantar RT", "Keterangan keperluan (sekolah/berobat)"] },
    { nama: "Surat Keterangan Usaha", waktu: "1–2 hari kerja", syarat: ["Fotokopi KTP-el", "Foto tempat usaha", "Surat pengantar RT"] },
    { nama: "Surat Keterangan Kelahiran", waktu: "1 hari kerja", syarat: ["Surat keterangan lahir dari bidan/puskesmas", "Fotokopi KTP-el orang tua", "Fotokopi KK"] },
    { nama: "Surat Keterangan Kematian", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el almarhum", "Fotokopi KK", "Keterangan dari RT/saksi"] },
    { nama: "Surat Keterangan Pindah", waktu: "1–2 hari kerja", syarat: ["KK asli", "KTP-el", "Alamat tujuan lengkap"] }
  ],

  fasilitas: [
    { kategori: "Pendidikan", nama: "SD Inpres Semangga 3", ket: "Sekolah dasar negeri di Kampung Marga Mulya." },
    { kategori: "Pendidikan", nama: "PAUD / TK Kampung", ket: "CONTOH — sesuaikan nama dan jumlahnya." },
    { kategori: "Kesehatan", nama: "Posyandu", ket: "CONTOH — isi jumlah pos dan jadwal pelayanan." },
    { kategori: "Kesehatan", nama: "Pustu / Polindes", ket: "CONTOH — sesuaikan." },
    { kategori: "Ibadah", nama: "Rumah ibadah", ket: "CONTOH — rinci jumlah masjid, gereja, dan pura." },
    { kategori: "Pemerintahan", nama: "Kantor Kampung Marga Mulya", ket: "Pusat pelayanan administrasi warga." },
    { kategori: "Pertanian", nama: "Saluran irigasi & lahan sawah", ket: "CONTOH — isi luas sawah (ha)." },
    { kategori: "Olahraga", nama: "Lapangan kampung", ket: "CONTOH — sesuaikan." }
  ],

  peta: {
    ortofoto: "",                          // mis. "assets/peta/ortofoto-marga-mulya.webp"
    sumber: "Pemetaan drone Tim Ekspedisi Patriot IPB University, 2026",
    tanggalTerbang: "[tanggal penerbangan]",
    resolusi: "[mis. 5 cm/piksel]",
    luasCakupan: "[mis. 350 ha]",
    // x, y = posisi titik dalam PERSEN pada gambar ortofoto. lat/lng opsional untuk Google Maps.
    titik: [
      { nama: "Kantor Kampung", kategori: "Pemerintahan", x: 48, y: 44, ket: "Pelayanan administrasi, surat-menyurat, dan musyawarah kampung." },
      { nama: "SD Inpres Semangga 3", kategori: "Pendidikan", x: 57, y: 38, ket: "Sekolah dasar negeri di kampung." },
      { nama: "Posyandu", kategori: "Kesehatan", x: 42, y: 52, ket: "Layanan kesehatan ibu dan anak setiap bulan." },
      { nama: "Rumah Ibadah", kategori: "Ibadah", x: 62, y: 50, ket: "Contoh titik — sesuaikan nama dan lokasinya." },
      { nama: "Hamparan Sawah", kategori: "Pertanian", x: 22, y: 24, ket: "Lahan sawah padi utama kampung." },
      { nama: "Saluran Irigasi", kategori: "Pertanian", x: 78, y: 70, ket: "Saluran pengairan sawah." },
      { nama: "Kios & UMKM", kategori: "Ekonomi", x: 52, y: 60, ket: "Pusat jual beli kebutuhan warga." },
      { nama: "Lapangan Kampung", kategori: "Olahraga", x: 34, y: 66, ket: "Lapangan olahraga dan kegiatan warga." }
    ]
  },

  video: {
    judul: "Video Profil Kampung Marga Mulya",
    deskripsi: "Video profil hasil kerja sama Tim Ekspedisi Patriot IPB University dan warga Kampung Marga Mulya.",
    youtubeId: "",          // ID dari https://youtu.be/ID_VIDEO
    fileLokal: "",          // atau "assets/video/profil.mp4"
    poster: ""
  },

  potensi: [
    { judul: "Padi sawah", ikon: "padi", ket: "Komoditas utama kampung.", detail: "Isi luas tanam (ha), produktivitas (ton/ha), jumlah musim tanam per tahun, dan kelompok tani yang mengelola." },
    { judul: "Hortikultura", ikon: "daun", ket: "Sayuran dan buah di pekarangan serta lahan kering.", detail: "Isi jenis tanaman, luas lahan, dan tujuan pemasaran hasil panen." },
    { judul: "Peternakan", ikon: "ternak", ket: "Sapi, kambing, dan unggas milik warga.", detail: "Isi jumlah ternak per jenis dan kelompok peternak yang ada." },
    { judul: "UMKM", ikon: "toko", ket: "Olahan pangan, kios, dan jasa.", detail: "Daftarkan nama usaha, pemilik, produk, dan kontak agar mudah ditemukan pembeli." }
  ],

  galeri: [
    { src: "", caption: "Musyawarah kampung" },
    { src: "", caption: "Panen padi" },
    { src: "", caption: "Pemetaan drone bersama warga" },
    { src: "", caption: "Kegiatan Posyandu" },
    { src: "", caption: "Sekolah Keluarga Berkualitas" },
    { src: "", caption: "Kerja bakti kampung" }
  ],

  kegiatan: [
    { tanggal: "2026", judul: "Pemetaan wilayah dengan drone", ket: "Pengambilan foto udara untuk peta kampung bersama perangkat kampung." },
    { tanggal: "2026", judul: "Pendataan penduduk", ket: "Pemutakhiran data kependudukan, pendidikan, dan pekerjaan warga." },
    { tanggal: "2026", judul: "Produksi video profil", ket: "Pengambilan gambar potensi dan kehidupan warga kampung." }
  ],

  kontak: {
    alamat: "Kantor Kampung Marga Mulya, Distrik Semangga, Kabupaten Merauke, Papua Selatan 99631",
    telepon: "[nomor telepon / WhatsApp kantor kampung]",
    email: "[email resmi kampung]",
    jamLayanan: "Senin–Jumat, 08.00–14.00 WIT"   // CONTOH
  }
};
