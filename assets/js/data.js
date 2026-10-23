/* =====================================================================
   MARGA MULYA ON SITE — DATA KAMPUNG
   ---------------------------------------------------------------------
   SEMUA isi website diambil dari file ini. Untuk memperbarui website,
   cukup ubah teks/angka di bawah, simpan, lalu unggah ulang.

   PENTING:
   - Angka bertanda  // CONTOH  adalah data contoh agar tampilan terisi.
     Ganti dengan data resmi kampung (Profil Kampung / Prodeskel / SID /
     hasil pendataan Tim Ekspedisi Patriot), lalu ubah  dataContoh: false
     agar pita "data contoh" di website hilang.
   - Data yang SUDAH terverifikasi dari sumber publik:
       kode wilayah, kode pos, distrik, jumlah penduduk (proyeksi BPS 2024),
       SD Inpres Semangga 3 berlokasi di Kampung Marga Mulya.
   ===================================================================== */

window.KAMPUNG = {
  meta: {
    namaSitus: "Marga Mulya On Site",
    dataContoh: true,                       // ubah ke false bila semua data sudah resmi
    tahunData: "2026",
    sumberData: "Pemerintah Kampung Marga Mulya; BPS Kabupaten Merauke; pendataan Tim Ekspedisi Patriot IPB University 2026",
    diperbarui: "Oktober 2026"
  },

  identitas: {
    nama: "Kampung Marga Mulya",
    sebutan: "Kampung",                     // di Papua, setingkat desa disebut "kampung"
    distrik: "Semangga",
    kabupaten: "Merauke",
    provinsi: "Papua Selatan",
    kodeWilayah: "93.01.05.2008",
    kodePos: "99631",
    luas: "± — km²",                        // isi luas wilayah
    ketinggian: "± 5 mdpl",                 // CONTOH
    zonaWaktu: "WIT (UTC+9)",
    // Titik tengah kampung. GANTI dengan koordinat GPS kantor kampung hasil survei.
    koordinat: { lat: -8.4300, lng: 140.5200 }
  },

  kerjaSama: {
    judul: "Kerja sama Tim Ekspedisi Patriot IPB University dengan Pemerintah Kampung Marga Mulya",
    pihak: ["Tim Ekspedisi Patriot IPB University", "Pemerintah Kampung Marga Mulya"],
    tahun: "2026",
    ringkas: "Website ini disusun bersama oleh Tim Ekspedisi Patriot IPB University dan Pemerintah Kampung Marga Mulya sebagai pusat informasi kampung yang terbuka bagi warga, pemerintah, dan mitra pembangunan. Pemetaan drone, pendataan penduduk, dan video profil dikerjakan selama kegiatan Ekspedisi Patriot 2026 di Distrik Semangga.",
    ketuaTim: "Dr. rer. pol. M. Iqbal Irfany, S.E., M.App.Ec."
  },

  // Tulis sejarah kampung dari hasil wawancara tokoh masyarakat.
  sejarah: [
    "Kampung Marga Mulya adalah salah satu kampung di Distrik Semangga, Kabupaten Merauke, Provinsi Papua Selatan. Wilayahnya berada di dataran rendah dekat pusat Kota Merauke dan sebagian besar warganya hidup dari pertanian, terutama sawah padi.",
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

  batas: {                                   // isi sesuai peta wilayah resmi kampung
    utara: "[nama kampung/wilayah di utara]",
    selatan: "[nama kampung/wilayah di selatan]",
    timur: "[nama kampung/wilayah di timur]",
    barat: "[nama kampung/wilayah di barat]"
  },

  struktur: {
    // Ganti "[Nama]" dengan nama pejabat. Kosongkan foto atau isi path, mis. "assets/img/kepala.jpg"
    kepala: { jabatan: "Kepala Kampung", nama: "[Nama Kepala Kampung]", foto: "" },
    sekretaris: { jabatan: "Sekretaris Kampung", nama: "[Nama Sekretaris]" },
    kaur: [
      { jabatan: "Kaur Keuangan", nama: "[Nama]" },
      { jabatan: "Kaur Umum & Perencanaan", nama: "[Nama]" }
    ],
    kasi: [
      { jabatan: "Kasi Pemerintahan", nama: "[Nama]" },
      { jabatan: "Kasi Kesejahteraan", nama: "[Nama]" },
      { jabatan: "Kasi Pelayanan", nama: "[Nama]" }
    ],
    kewilayahan: [
      { jabatan: "Kepala Dusun I", nama: "[Nama]" },
      { jabatan: "Kepala Dusun II", nama: "[Nama]" },
      { jabatan: "Kepala Dusun III", nama: "[Nama]" }
    ],
    bamuskam: [
      { jabatan: "Ketua Bamuskam", nama: "[Nama]" },
      { jabatan: "Wakil Ketua", nama: "[Nama]" },
      { jabatan: "Sekretaris", nama: "[Nama]" },
      { jabatan: "Anggota", nama: "[Nama], [Nama]" }
    ],
    lembaga: [
      { nama: "TP PKK Kampung", ket: "Pemberdayaan keluarga" },
      { nama: "Karang Taruna", ket: "Kepemudaan" },
      { nama: "Posyandu", ket: "Kesehatan ibu dan anak" },
      { nama: "LPMK", ket: "Lembaga Pemberdayaan Masyarakat Kampung" },
      { nama: "BUMKam", ket: "Badan Usaha Milik Kampung" },
      { nama: "Kelompok Tani / Gapoktan", ket: "Pertanian" }
    ]
  },

  penduduk: {
    total: 2882,               // proyeksi BPS pertengahan 2024
    laki: 1480,                // CONTOH
    perempuan: 1402,           // CONTOH
    kk: 812,                   // CONTOH
    rt: 12,                    // CONTOH
    // Kelompok umur (l = laki-laki, p = perempuan). CONTOH — jumlahnya disamakan dengan total.
    usia: [
      { k: "0–4", l: 136, p: 128 }, { k: "5–9", l: 133, p: 125 }, { k: "10–14", l: 130, p: 122 },
      { k: "15–19", l: 124, p: 116 }, { k: "20–24", l: 113, p: 105 }, { k: "25–29", l: 110, p: 103 },
      { k: "30–34", l: 112, p: 105 }, { k: "35–39", l: 111, p: 104 }, { k: "40–44", l: 108, p: 101 },
      { k: "45–49", l: 101, p: 94 }, { k: "50–54", l: 89, p: 83 }, { k: "55–59", l: 74, p: 75 },
      { k: "60–64", l: 59, p: 60 }, { k: "65+", l: 80, p: 81 }
    ],
    usiaSekolah: [             // CONTOH
      { label: "PAUD / TK", rentang: "3–6 th", jumlah: 205 },
      { label: "SD", rentang: "7–12 th", jumlah: 301 },
      { label: "SMP", rentang: "13–15 th", jumlah: 150 },
      { label: "SMA / SMK", rentang: "16–18 th", jumlah: 144 }
    ],
    pendidikan: [              // CONTOH — pendidikan terakhir
      { label: "Tidak / belum sekolah", jumlah: 410 },
      { label: "Belum tamat SD", jumlah: 352 },
      { label: "Tamat SD", jumlah: 690 },
      { label: "Tamat SMP", jumlah: 548 },
      { label: "Tamat SMA / SMK", jumlah: 662 },
      { label: "Diploma (D1–D3)", jumlah: 82 },
      { label: "Sarjana (S1)", jumlah: 128 },
      { label: "Pascasarjana", jumlah: 10 }
    ],
    pekerjaan: [               // CONTOH
      { label: "Petani", jumlah: 612 },
      { label: "Buruh tani", jumlah: 214 },
      { label: "Pedagang / wiraswasta", jumlah: 168 },
      { label: "Karyawan swasta", jumlah: 74 },
      { label: "Peternak", jumlah: 52 },
      { label: "PNS / TNI / Polri", jumlah: 46 },
      { label: "Pelajar / mahasiswa", jumlah: 590 },
      { label: "Mengurus rumah tangga", jumlah: 420 },
      { label: "Belum / tidak bekerja", jumlah: 706 }
    ],
    agama: [                   // CONTOH
      { label: "Islam", jumlah: 1610 },
      { label: "Katolik", jumlah: 812 },
      { label: "Kristen Protestan", jumlah: 436 },
      { label: "Hindu", jumlah: 18 },
      { label: "Buddha", jumlah: 6 }
    ]
  },

  fasilitas: [
    { kategori: "Pendidikan", nama: "SD Inpres Semangga 3", ket: "Sekolah dasar negeri di Kampung Marga Mulya" },
    { kategori: "Pendidikan", nama: "PAUD / TK Kampung", ket: "CONTOH — sesuaikan" },
    { kategori: "Kesehatan", nama: "Posyandu", ket: "CONTOH — jumlah dan lokasi" },
    { kategori: "Kesehatan", nama: "Pustu / Polindes", ket: "CONTOH — sesuaikan" },
    { kategori: "Ibadah", nama: "Masjid, gereja, dan rumah ibadah lain", ket: "CONTOH — rinci jumlahnya" },
    { kategori: "Pemerintahan", nama: "Kantor Kampung Marga Mulya", ket: "Pusat pelayanan administrasi warga" },
    { kategori: "Pertanian", nama: "Saluran irigasi & lahan sawah", ket: "CONTOH — luas sawah (ha)" },
    { kategori: "Olahraga", nama: "Lapangan kampung", ket: "CONTOH — sesuaikan" }
  ],

  peta: {
    // Letakkan hasil foto udara (ortofoto) drone di assets/peta/ lalu isi path-nya.
    // Biarkan "" untuk menampilkan peta sketsa sementara.
    ortofoto: "",                          // mis. "assets/peta/ortofoto-marga-mulya.jpg"
    sumber: "Pemetaan drone Tim Ekspedisi Patriot IPB University, 2026",
    tanggalTerbang: "[tanggal penerbangan]",
    resolusi: "[mis. 5 cm/piksel]",
    luasCakupan: "[mis. 350 ha]",
    // x dan y = posisi titik dalam PERSEN dari lebar/tinggi gambar ortofoto (0–100).
    // lat/lng opsional, dipakai untuk tombol "Buka di Google Maps".
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
    youtubeId: "",          // isi ID video YouTube, mis. "dQw4w9WgXcQ" dari https://youtu.be/dQw4w9WgXcQ
    fileLokal: "",          // atau file MP4 di folder assets/video, mis. "assets/video/profil.mp4"
    poster: ""              // gambar sampul opsional, mis. "assets/img/poster-video.jpg"
  },

  potensi: [
    { judul: "Padi sawah", ket: "Komoditas utama kampung. Isi luas tanam, produktivitas (ton/ha), dan musim tanam." },
    { judul: "Hortikultura", ket: "Sayuran dan buah di pekarangan serta lahan kering." },
    { judul: "Peternakan", ket: "Sapi, kambing, dan unggas milik warga." },
    { judul: "UMKM", ket: "Olahan pangan, kios, dan jasa. Daftarkan usaha warga di sini." }
  ],

  // Isi src dengan path foto di assets/img/. Tanpa src, kotak berwarna akan ditampilkan.
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
