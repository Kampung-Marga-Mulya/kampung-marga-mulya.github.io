/* =====================================================================
   MARGA MULYA ON SITE — DATA KAMPUNG
   ---------------------------------------------------------------------
   SEMUA isi website diambil dari file ini. Untuk memperbarui website,
   cukup ubah teks/angka di bawah, simpan, lalu unggah ulang.

   SUMBER UTAMA: Monografi Tingkat Kampung Marga Mulya, ditandatangani
   Plt. Kepala Kampung dan Sekretaris Kampung pada 30 September 2026.
   - Bagian yang masih contoh diberi tanda  contoh: true  dan tampil dengan
     label "contoh" di website. Ganti isinya lalu hapus tanda tersebut.
   - Bagian yang kosong di monografi ditulis null / [] dan tampil sebagai
     "belum tersedia".
   ===================================================================== */

window.KAMPUNG = {
  meta: {
    namaSitus: "Marga Mulya On Site",
    alamatWeb: "https://kampung-marga-mulya.github.io",
    dataContoh: false,                      // label contoh kini per bagian (contoh: true)
    tahunData: "2026",
    sumberData: "Monografi Tingkat Kampung Marga Mulya per 30 September 2026",
    diperbarui: "Oktober 2026"
  },

  identitas: {
    nama: "Kampung Marga Mulya",
    distrik: "Semangga",
    kabupaten: "Merauke",
    provinsi: "Papua Selatan",
    kodeWilayah: "93.01.05.2008",
    kodePos: "99631",
    tahunBerdiri: 1983,
    dasarHukum: "UU No. 6 Tahun 2014 tentang Desa",
    luasHa: 4176.90,                        // hektare
    luas: "4.176,90 ha (± 41,8 km²)",
    tipologi: "Desa",
    klasifikasi: "Swasembada",
    kategori: "Berkembang",
    komoditasUnggulan: "Pertanian dan peternakan",
    zonaWaktu: "WIT (UTC+9)",
    jumlahRW: 7,
    jumlahRT: 18,
    petaResmi: "Skala 1:50.000 (BIG)",
    koordinatTeks: "8°24′19,5″ LS · 140°28′4,0″ BT",
    // Titik Kantor Kampung pada Peta Batas Kampung (DPMK Merauke); monografi: 8°24'19,5" LS, 140°28'4,0" BT.
    koordinat: { lat: -8.405899, lng: 140.467687 },
    orbitasi: [
      { label: "Pusat Distrik Semangga", km: 15 },
      { label: "Pusat Kota Merauke", km: 20 },
      { label: "Ibu kota Kabupaten Merauke", km: 20 }
    ],
    pertanahan: { sertifikat: 2831, tanahKasHa: 1, waduk: 6 }
  },


  // Isi tautan akun resmi kampung. Yang kosong akan tampil "belum tersedia".
  sosmed: [
    { nama: "Facebook", url: "https://www.facebook.com/share/1FFzSdy1pr/", akun: "Kampung Marga Mulya" },
    { nama: "Instagram", url: "https://www.instagram.com/kampung_margamulya/", akun: "@kampung_margamulya" },
    { nama: "YouTube", url: "", akun: "[nama kanal YouTube kampung]" },
    { nama: "TikTok", url: "https://www.tiktok.com/@kampung.marga.mul", akun: "@kampung.marga.mul" },
    { nama: "WhatsApp", url: "", akun: "[nomor WhatsApp kantor kampung]" }   // format url: https://wa.me/62812xxxxxxx
  ],

  kerjaSama: {
    pihak: ["Tim Ekspedisi Patriot IPB University", "Pemerintah Kampung Marga Mulya"],
    tahun: "2026",
    ringkas: "Website ini disusun bersama oleh Tim Ekspedisi Patriot IPB University dan Pemerintah Kampung Marga Mulya sebagai pusat informasi kampung yang terbuka bagi warga, pemerintah, dan mitra pembangunan. Pemetaan drone, pendataan penduduk, dan video profil dikerjakan selama kegiatan Ekspedisi Patriot 2026 di Distrik Semangga.",
    ketuaTim: "Dr. rer. pol. M. Iqbal Irfany, S.E., M.App.Ec."
  },

  sejarah: [
    "Kampung Marga Mulya adalah salah satu kampung di Distrik Semangga, Kabupaten Merauke, Provinsi Papua Selatan. Kampung ini dibentuk pada tahun 1983 dan kini terdiri atas 7 RW dan 18 RT dengan luas wilayah 4.176,90 hektare. Letaknya sekitar 15 km dari pusat Distrik Semangga dan 20 km dari Kota Merauke.",
    "Marga Mulya dihuni 3.201 jiwa dalam 986 kepala keluarga. Sebagian besar warga berasal dari suku Jawa dan hidup berdampingan dengan warga suku Marind, Mandobo, dan Mappi serta pendatang dari Sunda, Makassar, Maluku, NTB, NTT, dan Batak. Pertanian dan peternakan menjadi komoditas unggulan kampung, dan dua pertiga penduduk bekerja sebagai petani.",
    "Menurut monografi kampung, Marga Mulya berklasifikasi desa swasembada dengan kategori berkembang."
  ],

  visiContoh: true,   // visi & misi belum tercantum di monografi; ganti dengan RPJMKam lalu hapus baris ini
  visi: "Terwujudnya Kampung Marga Mulya yang mandiri, sejahtera, dan berbudaya melalui pertanian yang maju dan pelayanan publik yang terbuka.",   // CONTOH
  misi: [                                                                                                           // CONTOH
    "Meningkatkan kualitas pelayanan administrasi kepada warga.",
    "Mengembangkan pertanian padi dan hortikultura yang berkelanjutan.",
    "Memperkuat ekonomi warga melalui UMKM dan BUMKam.",
    "Meningkatkan kualitas pendidikan, kesehatan, dan keluarga.",
    "Menjaga kerukunan antarwarga dan kelestarian lingkungan."
  ],

  batas: {
    utara: "Distrik Tanah Miring (Kampung Sumber Harapan dan Kampung Yasa Mulya)",
    selatan: "Kampung Semangga Jaya dan Kampung Kuper",
    timur: "Kampung Kamangi dan Kali Maro",
    barat: "Kampung Waninggap Kay"
  },

  struktur: {
    // tugas = ringkasan tugas pokok jabatan; tampil saat kotak jabatan diklik.
    kepala: { jabatan: "Plt. Kepala Kampung", nama: "Sunaryo, A.Md.", pendidikan: "S1", foto: "", kontak: "",
      tugas: "Memimpin penyelenggaraan pemerintahan kampung, melaksanakan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat. Saat ini juga merangkap Sekretaris Kampung." },
    sekretaris: { jabatan: "Sekretaris Kampung", nama: "Sunaryo, A.Md.", pendidikan: "S1",
      tugas: "Membantu Kepala Kampung di bidang administrasi pemerintahan dan mengoordinasikan kepala urusan." },
    kaur: [
      { jabatan: "Kaur Keuangan", nama: "Eko Wahyudi", pendidikan: "S1", tugas: "Menatausahakan keuangan kampung: penerimaan, pengeluaran, pembukuan, dan laporan pertanggungjawaban APBKam." },
      { jabatan: "Kaur Perencanaan", nama: "Ramdan Sidik Suseno", pendidikan: "S1", tugas: "Menyusun rencana pembangunan kampung (RPJMKam dan RKPKam) serta memantau pelaksanaannya." },
      { jabatan: "Kaur Tata Usaha dan Umum", nama: "Nurdaiyah", pendidikan: "S1", tugas: "Mengurus surat-menyurat, arsip, inventaris aset, dan keperluan umum kantor kampung." }
    ],
    kasi: [
      { jabatan: "Kasi Pemerintahan", nama: "Mitra Setiawan", pendidikan: "S1", tugas: "Menangani administrasi kependudukan, pertanahan, ketertiban, dan penyusunan produk hukum kampung." },
      { jabatan: "Kasi Kesejahteraan", nama: "Kidin", pendidikan: "SMEA", tugas: "Melaksanakan pembangunan sarana prasarana dan program pemberdayaan masyarakat." },
      { jabatan: "Kasi Pelayanan", nama: "Wati", pendidikan: "D-III", tugas: "Melaksanakan penyuluhan, pelayanan sosial, keagamaan, dan ketenagakerjaan." }
    ],
    kewilayahan: [
      { jabatan: "Ketua RW", nama: "7 orang", tugas: "Membantu pemerintah kampung mengoordinasikan RT di wilayahnya. Marga Mulya memiliki 7 RW." },
      { jabatan: "Ketua RT", nama: "18 orang", tugas: "Membantu pelayanan warga, pendataan, dan ketertiban di lingkungan RT. Marga Mulya memiliki 18 RT." }
    ],
    // Jumlah perangkat & unsur pendukung (monografi)
    jumlah: [
      { label: "Aparat kampung", jumlah: 8 }, { label: "Anggota Bamuskam", jumlah: 9 }, { label: "Anggota Linmas", jumlah: 14 }
    ],
    bamuskam: [
      { jabatan: "Anggota Bamuskam", nama: "9 orang", ket: "Nama-nama anggota belum tercantum di monografi." }
    ],
    lembaga: [
      { nama: "TP PKK Kampung", ket: "Pemberdayaan dan kesejahteraan keluarga", detail: "21 pengurus dan 35 anggota, 4 kegiatan setiap bulan, 3 buku administrasi, dan dana kelola Rp86.000.000." },
      { nama: "Karang Taruna Cahaya Muda", ket: "Wadah kegiatan kepemudaan", detail: "13 pengurus dan 17 anggota. Kegiatan utama: bakti sosial." },
      { nama: "BUMKam Bina Mulya Sejahtera", ket: "Badan Usaha Milik Kampung", detail: "3 unit usaha: depot air minum, wisata pemancingan, dan ayam petelur. Modal Rp657.899.000; keuangan yang dikelola Rp84.000.000." },
      { nama: "Linmas", ket: "Perlindungan masyarakat", detail: "14 anggota Linmas dan 18 pos kamling. Kampung juga memiliki 1 tim tanggap dan siaga bencana (Tagana)." },
      { nama: "Majelis taklim", ket: "9 kelompok · 300 anggota", detail: "Al Kautsar (65), Al Muhajir (60), Al Qodri (35), Al Jannah (32), Nurul Huda (29), Attaubah (26), Al Amin (22), Al Karimah (19), dan Nurul Hikmah (12 orang)." },
      { nama: "Kelompok kepemudaan", ket: "4 kelompok · 118 anggota", detail: "Remaja Masjid Nurul Huda (37), Remaja Masjid Al Amin (36), Pemuda Gereja (26), dan Karang Taruna (19 orang)." },
      { nama: "Paguyuban kuda lumping", ket: "Seni budaya", detail: "2 kelompok dengan 58 anggota." }
    ]
  },

  penduduk: {
    total: 3201,
    laki: 1674,
    perempuan: 1527,
    kk: 986,
    // Kelompok usia di monografi hanya tiga kelompok (jumlahnya 3.197, selisih 4 dari total).
    kelompokUsia: [
      { label: "0–17 tahun", jumlah: 897, ket: "Anak dan remaja usia sekolah." },
      { label: "18–56 tahun", jumlah: 1728, ket: "Penduduk usia produktif." },
      { label: "Di atas 56 tahun", jumlah: 572, ket: "Penduduk lanjut usia." }
    ],
    kesejahteraan: [
      { label: "Pra sejahtera", jumlah: 206 }, { label: "Sejahtera I", jumlah: 361 },
      { label: "Sejahtera II", jumlah: 376 }, { label: "Sejahtera III", jumlah: 16 }, { label: "Sejahtera III Plus", jumlah: 27 }
    ],
    // Murid & guru di sekolah kampung, serta tenaga kesehatan
    sekolah: [
      { label: "Taman kanak-kanak", murid: 117, guru: 9 },
      { label: "Sekolah dasar", murid: 214, guru: 12 }
    ],
    tenagaKesehatan: [
      { label: "Dokter umum", jumlah: 1 }, { label: "Bidan / dukun bayi terlatih", jumlah: 2 }, { label: "Perawat", jumlah: 13 }
    ],
    pendidikan: [
      { label: "Tidak / belum sekolah", jumlah: 230 }, { label: "Tidak lulus", jumlah: 403 },
      { label: "Taman kanak-kanak", jumlah: 212 }, { label: "SD / sederajat", jumlah: 615 },
      { label: "SMP / sederajat", jumlah: 538 }, { label: "SMA / sederajat", jumlah: 962 },
      { label: "Akademi / D1–D3", jumlah: 52 }, { label: "Sarjana (S1)", jumlah: 129 },
      { label: "Magister (S2)", jumlah: 2 }, { label: "Pondok pesantren", jumlah: 41 },
      { label: "Pendidikan keagamaan", jumlah: 17 }
    ],
    pekerjaan: [
      { label: "Petani", jumlah: 2161 }, { label: "Tidak / belum bekerja", jumlah: 314 },
      { label: "Lainnya", jumlah: 193 }, { label: "Peternak", jumlah: 127 },
      { label: "Pegawai swasta", jumlah: 123 }, { label: "Karyawan swasta", jumlah: 68 },
      { label: "Wiraswasta / pedagang", jumlah: 65 }, { label: "Pegawai negeri sipil", jumlah: 40 },
      { label: "Jasa", jumlah: 25 }, { label: "Buruh tani", jumlah: 24 },
      { label: "TNI / Polri", jumlah: 21 }, { label: "Pensiunan", jumlah: 17 },
      { label: "Pengrajin / mebel", jumlah: 11 }, { label: "Pekerja seni", jumlah: 11 }, { label: "Nelayan", jumlah: 1 }
    ],
    agama: [
      { label: "Islam", jumlah: 2916 }, { label: "Katolik", jumlah: 258 },
      { label: "Kristen", jumlah: 18 }, { label: "Hindu", jumlah: 9 }
    ],
    suku: [
      { label: "Jawa", jumlah: 2801 }, { label: "Mandobo", jumlah: 139 }, { label: "Mappi", jumlah: 65 },
      { label: "Sunda", jumlah: 64 }, { label: "Makassar", jumlah: 34 }, { label: "Marind", jumlah: 28 },
      { label: "Maluku", jumlah: 20 }, { label: "NTB", jumlah: 18 }, { label: "Batak", jumlah: 18 }, { label: "NTT", jumlah: 14 }
    ]
  },

  /* ---------- BERITA KAMPUNG (tampil sebagai slider di bawah foto utama) ----------
     Urutkan dari yang terbaru. cover = gambar sampul dari situs berita (boleh kosong;
     bila kosong atau gagal dimuat, sampul biru otomatis ditampilkan). */
  berita: [
    { tanggal: "2026-10-23", sumber: "Tiffa News", judul: "TEP 06 IPB University Dorong Kemandirian Petani melalui Pelatihan Budidaya Padi Berkelanjutan",
      ringkas: "Petani Kampung Marga Mulya berlatih membuat sendiri pupuk dan pestisida nabati lalu mengujinya di sawah.",
      url: "https://www.tiffanews.co.id/berita/40485/tep-06-ipb-university-dorong-kemandirian-petani-melalui-pelatihan-budidaya-padi-berkelanjutan-2/",
      cover: "https://www.tiffanews.co.id/wp-content/uploads/2026/10/IMG-20261023-WA0026.jpg" },
    { tanggal: "2026-08-28", sumber: "Suara Media", judul: "Peran TNI AD, Seskoad dan LPPM Unjani dalam Mewujudkan Infrastruktur yang Bermanfaat bagi Masyarakat di Merauke",
      ringkas: "Tim Seskoad dan Unjani meninjau dua sumur bor di Marga Mulya, di SD Inpres Semangga III dan masjid RT 09.",
      url: "https://suaramediaa.id/2026/08/28/peran-tni-ad-seskoad-dan-universitas-lppm-unjani-dalam-mewujudkan-infrastruktur-yang-bermanfaat-bagi-masyarakat-di-merauke/",
      cover: "" },
    { tanggal: "2026-08-26", sumber: "Barometer99", judul: "Peran TNI AD Wujudkan Air Bersih, Harapan Siswa dan Guru SD Inpres Semangga III Kini Terwujud",
      ringkas: "Sumur bor di SD Inpres Semangga III, Kampung Marga Mulya, selesai dan ditinjau Pangdam XXIV/Mandala Trikora.",
      url: "https://barometer99.com/peran-tni-ad-wujudkan-air-bersih-harapan-siswa-dan-guru-sd-inpres-semangga-iii-kini-terwujud/",
      cover: "https://barometer99.com/wp-content/uploads/2026/08/IMG-20260826-WA0090.jpg" },
    { tanggal: "2025-10-01", sumber: "Papua Selatan Pos", judul: "Semangat Petani Merauke, Tanam Padi Serentak demi Swasembada Pangan Nasional",
      ringkas: "Lebih dari 150 petani menanam padi serentak di Sawah Lahan 1 Kampung Marga Mulya bersama Brigade Pangan.",
      url: "https://papuaselatanpos.com/2025/10/01/semangat-petani-merauke-tanam-padi-serentak-demi-swasembada-pangan-nasional/",
      cover: "https://i0.wp.com/papuaselatanpos.com/wp-content/uploads/2025/09/Tanam-Padi-Serentak-yang-digelar-oleh-Brigade-Pangan-BP.jpg?fit=1600%2C1066&ssl=1" },
    { tanggal: "2025-05-22", sumber: "Metro Merauke", judul: "Pencurian Alat Tani Resahkan Warga di Semangga, Komponen Hand Traktor hingga Mesin Pompa Air Digondol",
      ringkas: "Warga Semangga, termasuk Kampung Marga Mulya (Semangga 3), resah karena maraknya pencurian alat pertanian.",
      url: "https://metromerauke.co/pencurian-alat-tani-resahkan-warga-di-semangga-komponen-hand-traktor-hingga-mesin-pompa-air-digondol/",
      cover: "https://metromerauke.co/wp-content/uploads/2025/05/IMG_20250522_220200.jpg" },
    { tanggal: "2022-02-17", sumber: "Suara Merauke (Pemkab Merauke)", judul: "Bupati Merauke: Masalah Limbah Kotoran Ayam Masih Dikaji Secara Teknis",
      ringkas: "Pemerintah kabupaten masih mengkaji keluhan warga Marga Mulya terkait bau kandang ayam petelur di kampung.",
      url: "https://suara.merauke.go.id/post/3077/bupati-merauke-masalah-limbah-kotoran-ayam-masih-dikaji-secara-teknis.html",
      cover: "https://suara.merauke.go.id/content/file_manager/lokasi-ternak-ayam-petelur-pt-harvest-pulus-papua-di-merauke.jpg" },
    { tanggal: "2026-10-19", sumber: "IPB University", judul: "Tim Ekspedisi Patriot IPB University Kenalkan Data Desa Presisi, Bantu Rumuskan Kebijakan Kampung di Semangga",
      ringkas: "Lokakarya data desa presisi bagi perangkat dan kader kampung digelar di Balai Kampung Marga Mulya.",
      url: "https://www.ipb.ac.id/news/index/2026/10/tim-ekspedisi-patriot-ipb-university-kenalkan-data-desa-presisi-bantu-rumuskan-kebijakan-kampung-di-semangga",
      cover: "https://www.ipb.ac.id/wp-content/uploads/2026/10/tim-ekspedisi-patriot-ipb-university-kenalkan-data-desa-presisi-bantu-rumuskan-kebijakan-kampung-di-semangga-770x400.avif" },
    { tanggal: "2026-10-09", sumber: "MataPapua", judul: "Ubah Limbah Jadi Pakan Bernilai, Tim 17 TEP IPB University Kembangkan Teknologi Amoniasi Jerami di Semangga",
      ringkas: "Peternak di Semangga, termasuk Marga Mulya, belajar mengolah jerami padi menjadi pakan sapi.",
      url: "https://matapapua.com/ubah-limbah-jadi-pakan-bernilai-tim-17-tep-ipb-university-kembangkan-teknologi-amoniasi-jerami-di-semangga",
      cover: "https://matapapua.com/storage/whatsapp-image-2026-10-09-at-173204.jpeg" },
    { tanggal: "2026-09-14", sumber: "Barometer99", judul: "TNI AD Wujudkan Air Bersih, Kodim 1707/Merauke Hadir Atasi Kesulitan Warga RT.09 Marga Mulya",
      ringkas: "Sumur bor di Mushola Al Barokah RT 09 kini menjadi sumber air bersih warga.",
      url: "https://barometer99.com/tni-ad-wujudkan-air-bersih-kodim-1707-merauke-hadir-atasi-kesulitan-warga-rt-09-marga-mulya/",
      cover: "https://barometer99.com/wp-content/uploads/2026/09/IMG-20260914-WA0055.jpg" },
    { tanggal: "2026-08-23", sumber: "Barometer99", judul: "Babinsa dan Warga Bergerak Cepat Padamkan Kebakaran Lahan di Marga Mulya",
      ringkas: "Babinsa dan warga memadamkan kebakaran lahan sekitar satu hektare sebelum mencapai permukiman.",
      url: "https://barometer99.com/babinsa-dan-warga-bergerak-cepat-padamkan-kebakaran-lahan-di-marga-mulya/",
      cover: "https://barometer99.com/wp-content/uploads/2026/08/IMG-20260823-WA0030.jpg" },
    { tanggal: "2026-08-13", sumber: "Media TNI Polri", judul: "Kebersamaan TNI dan Masyarakat Wujudkan Harapan Air Bersih di Semangga Merauke",
      ringkas: "Karya Bakti TNI AD 2026 membangun sumur bor, salah satunya di Mushola RT 09 Marga Mulya.",
      url: "https://mediatni-polri.com/kebersamaan-tni-dan-masyarakat-wujudkan-harapan-air-bersih-di-semangga-merauke/",
      cover: "https://mediatni-polri.com/wp-content/uploads/2026/08/IMG-20260813-WA0144.jpg" },
    { tanggal: "2025-09-30", sumber: "Kodim 1707/Merauke", judul: "Semangat Petani Merauke; Tanam Padi Serentak demi Swasembada Pangan Nasional",
      ringkas: "Lebih dari 150 orang menanam padi serentak di Sawah Lahan 1 Marga Mulya.",
      url: "https://kodim1707merauke.com/berita/detail/semangat-petani-merauke-tanam-padi-serentak-demi-swasembada-pangan-nasional",
      cover: "https://kodim1707merauke.com/asset/foto_berita/SAMPUL_TANAM_PADI_DI_SEMANGGA.jpg" },
    { tanggal: "2025-05-22", sumber: "Metro Merauke", judul: "Viral, Pemotor Berjatuhan Melintasi Jalan Rusak di Distrik Semangga",
      ringkas: "Jalan penghubung Muram Sari dan Marga Mulya rusak setelah perbaikannya terhenti.",
      url: "https://metromerauke.co/viral-pemotor-berjatuhan-melintasi-jalan-rusak-di-distrik-semangga/",
      cover: "https://metromerauke.co/wp-content/uploads/2025/05/IMG_20250522_225734.jpg" },
    { tanggal: "2024-10-22", sumber: "Pemkab Merauke", judul: "Lima Kampung Pemekaran Baru di Merauke Ditetapkan Batas Wilayahnya Melalui FGD",
      ringkas: "Marga Mulya termasuk kampung yang diusulkan dimekarkan; batas wilayahnya dibahas dalam FGD.",
      url: "https://portal.merauke.go.id/berita/lima-kampung-pemekaran-baru-di-merauke-ditetapkan-batas-wilayahnya-melalui-fgd",
      cover: "https://portal.merauke.go.id/api/serve-uploads/images/lima-kampung.jpg" },
    { tanggal: "2023-05-13", sumber: "Kompas.com", judul: "Cerita Warga Kampung Marga Mulya Merauke, Tiap Hari Kumpulkan Uang hingga Rp 83 Juta untuk Bangun Pos Polisi",
      ringkas: "Warga bergotong royong mengumpulkan dana untuk membangun pos polisi di kampung.",
      url: "https://regional.kompas.com/read/2023/05/13/180917478/cerita-warga-kampung-marga-mulya-merauke-tiap-hari-kumpulkan-uang-hingga-rp",
      cover: "" },
    { tanggal: "2023-02-18", sumber: "Tiffa News", judul: "HUT Kota Merauke ke-121, Warga Kampung Marga Mulya Ramaikan Panggung Hiburan Rakyat",
      ringkas: "Warga menggelar tarian dan lomba anak untuk merayakan HUT Kota Merauke.",
      url: "https://www.tiffanews.co.id/berita/25420/merauke-ke-121-warga-kampung-marga-mulya-ramaikan-panggung-hiburan-rakyat/",
      cover: "" },
    { tanggal: "2022-04-26", sumber: "Surya Papua", judul: "Di Kampung Marga Mulya, Lahan 140 Hektar Dibuka Tanam Jagung",
      ringkas: "Warga membuka 140 hektare lahan untuk jagung manis dan ketan, namun terkendala air saat kemarau.",
      url: "https://suryapapua.com/di-kampung-marga-mulya-lahan-140-hektar-dibuka-tanam-jagung/",
      cover: "https://suryapapua.com/wp-content/uploads/2022/04/kepala-kampung-.jpg" },
    { tanggal: "2022-02-18", sumber: "Surya Papua", judul: "Jeritan Warga Marga Mulya, Kami Hanya Punya Tumpuan Harapan di Bapak Romanus Mbaraka",
      ringkas: "Warga mengeluhkan bau peternakan ayam dan Bupati Merauke meninjau langsung lokasinya.",
      url: "https://suryapapua.com/jeritan-warga-marga-mulya-kami-hanya-punya-tumpuan-harapan-di-bapak-romanus-mbaraka/",
      cover: "https://suryapapua.com/wp-content/uploads/2022/02/ternak-ayam.jpg" },
    { tanggal: "2022-01-07", sumber: "Tribun Papua", judul: "Petani Marga Mulya Merauke Tanam Seribu Lebih Hektar",
      ringkas: "Laporan musim tanam petani Marga Mulya yang mencakup lebih dari seribu hektare lahan.",
      url: "https://papua.tribunnews.com/2022/01/07/petani-marga-mulya-merauke-tanam-seribu-lebih-hektar",
      cover: "" }
  ],

  /* ---------- TRANSPARANSI ANGGARAN ----------
     Monografi baru mencatat pendapatan (bantuan) dan SILPA. Rincian belanja
     per bidang diisi setelah Perkam APBKam & laporan realisasi tersedia. */
  apbkam: {
    tahun: 2026,
    realisasiPer: "30 September 2026",
    dokumen: "Monografi Tingkat Kampung Marga Mulya per 30 September 2026",
    pendapatan: [
      { label: "Bantuan pemerintah", jumlah: 373456000 },
      { label: "Bantuan kabupaten", jumlah: 521227062 }
    ],
    pendapatanKosong: ["Pendapatan asli kampung", "Bantuan provinsi", "Bantuan lain tidak mengikat", "Dana cadangan"],
    pembiayaan: { label: "SILPA / SIKPA", jumlah: 60288048 },
    belanja: [],                // isi per bidang: { bidang, anggaran, realisasi, kegiatan: [{ nama, anggaran, realisasi }] }
    danaLembaga: [
      { label: "Modal BUMKam Bina Mulya Sejahtera", jumlah: 657899000 },
      { label: "Keuangan dikelola BUMKam", jumlah: 84000000 },
      { label: "Dana dikelola TP PKK", jumlah: 86000000 }
    ]
  },

  /* ---------- INDEKS DESA (pengganti IDM) ---------- */
  indeksDesa: {
    tahun: 2026,
    nilai: null,                // isi nilai resmi Indeks Desa Kemendes bila sudah ada, mis. 61.2
    skala: 100,
    status: "Berkembang",
    sumberStatus: "Monografi kampung (kategori desa), 30 September 2026",
    klasifikasi: "Swasembada",
    catatan: "Sejak 2025 Indeks Desa Membangun (IDM) diperbarui menjadi Indeks Desa, yang menilai enam dimensi pembangunan kampung. Menurut monografi, Marga Mulya berkategori berkembang dengan klasifikasi swasembada; nilai indeks resmi per dimensi belum dicantumkan.",
    dimensi: [
      { nama: "Layanan Dasar", nilai: null, ket: "Akses pendidikan, kesehatan, air bersih, sanitasi, dan listrik." },
      { nama: "Sosial", nilai: null, ket: "Kerukunan, gotong royong, keamanan, dan modal sosial warga." },
      { nama: "Ekonomi", nilai: null, ket: "Keragaman usaha, akses pasar, lembaga ekonomi, dan BUMKam." },
      { nama: "Lingkungan", nilai: null, ket: "Pengelolaan sampah, risiko bencana, dan kualitas lingkungan." },
      { nama: "Aksesibilitas", nilai: null, ket: "Kondisi jalan, transportasi, dan jarak ke pusat layanan." },
      { nama: "Tata Kelola Pemerintahan", nilai: null, ket: "Perencanaan, keuangan, pelayanan, dan keterbukaan informasi kampung." }
    ],
    riwayat: [
      { tahun: 2026, status: "Berkembang" }
    ]
  },

  /* ---------- LAYANAN ADMINISTRASI ---------- */
  layananContoh: true,         // persyaratan umum; sesuaikan dengan prosedur kantor kampung lalu hapus baris ini
  layanan: [
    { nama: "Surat Pengantar KTP-el / KK", waktu: "1 hari kerja", syarat: ["Fotokopi KK", "Surat pengantar RT", "Akta kelahiran (KTP pertama)"] },
    { nama: "Surat Keterangan Domisili", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el", "Fotokopi KK", "Surat pengantar RT"] },
    { nama: "Surat Keterangan Tidak Mampu", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el dan KK", "Surat pengantar RT", "Keterangan keperluan (sekolah/berobat)"] },
    { nama: "Surat Keterangan Usaha", waktu: "1–2 hari kerja", syarat: ["Fotokopi KTP-el", "Foto tempat usaha", "Surat pengantar RT"] },
    { nama: "Surat Keterangan Kelahiran", waktu: "1 hari kerja", syarat: ["Surat keterangan lahir dari bidan/puskesmas", "Fotokopi KTP-el orang tua", "Fotokopi KK"] },
    { nama: "Surat Keterangan Kematian", waktu: "1 hari kerja", syarat: ["Fotokopi KTP-el almarhum", "Fotokopi KK", "Keterangan dari RT/saksi"] },
    { nama: "Surat Keterangan Pindah", waktu: "1–2 hari kerja", syarat: ["KK asli", "KTP-el", "Alamat tujuan lengkap"] }
  ],

  // Rekap sarana dan prasarana dari monografi (tampil di tab Fasilitas Umum)
  sarana: [
    { kelompok: "Kesehatan", ikon: "health", isi: [{ nama: "Puskesmas pembantu", nilai: "2 unit" }, { nama: "Posyandu & polindes", nilai: "1 unit" }, { nama: "Gedung posyandu", nilai: "1 unit" }, { nama: "Klinik", nilai: "1 unit" }, { nama: "Apotek", nilai: "1 unit" }] },
    { kelompok: "Pendidikan", ikon: "school", isi: [{ nama: "Gedung PAUD", nilai: "2 unit" }, { nama: "Gedung TK", nilai: "1 unit" }, { nama: "Gedung SD", nilai: "2 unit" }] },
    { kelompok: "Ibadah", ikon: "mosque", isi: [{ nama: "Masjid", nilai: "3 unit" }, { nama: "Musala", nilai: "16 unit" }, { nama: "Gereja", nilai: "1 unit" }] },
    { kelompok: "Umum", ikon: "home", isi: [{ nama: "Kantor kampung", nilai: "2 unit" }, { nama: "Sarana olahraga", nilai: "2 unit" }, { nama: "Balai pertemuan", nilai: "2 unit" }, { nama: "Gedung serba guna", nilai: "1 unit" }, { nama: "Sumur desa", nilai: "1 unit" }, { nama: "Makam", nilai: "2 ha" }] },
    { kelompok: "Jalan & komunikasi", ikon: "route", isi: [{ nama: "Jalan kampung (aspal/beton)", nilai: "12 km" }, { nama: "Jalan kabupaten", nilai: "4,16 km" }, { nama: "Jalan provinsi", nilai: "5,10 km" }, { nama: "Menara Telkomsel 4G", nilai: "2 unit" }] },
    { kelompok: "Air bersih & sanitasi", ikon: "drop", isi: [{ nama: "Penampung air hujan", nilai: "6" }, { nama: "Pamsimas", nilai: "1" }, { nama: "Sumur gali", nilai: "8" }, { nama: "MCK umum", nilai: "11" }, { nama: "Jamban keluarga", nilai: "892" }, { nama: "Saluran drainase", nilai: "46 km" }, { nama: "Pintu air", nilai: "10" }] }
  ],

  // Peta kampung memakai Peta Batas Kampung resmi (data/batas-kampung.json, digitasi dari peta DPMK Merauke).
  peta: {
    sumber: "Peta Batas Kampung Marga Mulya – Dinas Pemberdayaan Masyarakat dan Kampung Kabupaten Merauke",
    gambar: "assets/img/peta/peta-batas-kampung-marga-mulya.jpg",
    skala: "1:14.000",
    citra: "SPOT 6/SPOT 7 tahun 2015–2018 (resolusi 1,5 m), Badan Informasi Geospasial",
    ortofoto: ""                          // bila ortofoto drone sudah ada, isi path gambarnya di sini
  },


  video: {
    judul: "Video Profil Kampung Marga Mulya",
    deskripsi: "Video profil hasil kerja sama Tim Ekspedisi Patriot IPB University dan warga Kampung Marga Mulya. Putar langsung di halaman ini.",
    youtubeId: "4WKrKH5IqJc",   // dari https://youtu.be/4WKrKH5IqJc
    fileLokal: "",          // atau "assets/video/profil.mp4"
    poster: ""
  },

  potensi: [
    { judul: "Tanaman pangan & hortikultura", ikon: "padi", foto: "assets/img/kegiatan/kebun-tomat.jpg", fotoKet: "Petani merawat tanaman tomat", kredit: "Dokumentasi Tim Ekspedisi Patriot IPB University 2026",
      fotoLain: [
        { src: "assets/img/potensi/sawah-merauke.jpg", ket: "Panen perdana cetak sawah di Merauke (2012/2013)", kredit: "Pemerintah Kabupaten Merauke · Wikimedia Commons", lisensi: "Domain publik", url: "https://commons.wikimedia.org/wiki/File:Sawah_Merauke_2012.jpg" },
        { src: "assets/img/potensi/petani-cabai.jpg", ket: "Ilustrasi: petani memetik cabai (Sukoharjo, Jawa Tengah)", kredit: "ANTARA TV · Wikimedia Commons", lisensi: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Petani_Sedang_Memetik_Cabai.jpg" }
      ], ket: "Lahan pertanian 207,15 ha: cabai, jagung, sayuran, dan padi.", detail: "Cabai menjadi tanaman terluas (118,25 ha, 127 petani), disusul jagung (46,5 ha, 41 petani) dan sayuran (41,25 ha, 62 petani). Padi tercatat dengan 771 petani; luas tanam padi di monografi (1,15 ha) sedang dicek ulang oleh pemerintah kampung." },
    { judul: "Peternakan", ikon: "ternak", foto: "assets/img/kegiatan/periksa-sapi-2.jpg", fotoKet: "Pemeriksaan kesehatan sapi milik peternak", kredit: "Dokumentasi Tim Ekspedisi Patriot IPB University 2026",
      fotoLain: [
        { src: "assets/img/potensi/sapi-bali-ipb.jpg", ket: "Ilustrasi: sapi bali di kandang IPB Jonggol", kredit: "Btcpg · Wikimedia Commons", lisensi: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bali_cattle_IPB_Jonggol.jpg" }
      ], ket: "411 sapi, 298 kambing, 117 kuda, dan 45.250 unggas.", detail: "Peternakan dikelola 119 peternak sapi, 93 peternak kambing, 51 peternak kuda, 3 peternak kerbau (9 ekor), dan 257 peternak unggas, di atas lahan peternakan seluas 7 ha." },
    { judul: "Perkebunan jeruk", ikon: "daun",
      fotoLain: [
        { src: "assets/img/potensi/kebun-jeruk.jpg", ket: "Ilustrasi: kebun jeruk berbuah", kredit: "BerkahAgeng · Wikimedia Commons", lisensi: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Kebun_jeruk.jpg" }
      ], ket: "10 ha kebun jeruk milik 9 petani.", detail: "Perkebunan jeruk seluas 10 hektare menjadi peluang pengembangan agrowisata petik buah dan olahan buah." },
    { judul: "BUMKam & usaha warga", ikon: "toko", foto: "assets/img/fasilitas/kopdes-merah-putih.jpg", fotoKet: "Koperasi Desa Merah Putih Kampung Marga Mulya", kredit: "Dokumentasi Tim Ekspedisi Patriot IPB University 2026",
      fotoLain: [
        { src: "assets/img/potensi/ayam-petelur.jpg", ket: "Ilustrasi: peternak ayam petelur memanen telur (Bojonegoro, Jawa Timur), seperti unit ayam petelur BUMKam", kredit: "Achmad Fazeri · Wikimedia Commons", lisensi: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Senyum_Peternak_Ayam_Petelur.jpg" }
      ], ket: "BUMKam Bina Mulya Sejahtera, 25 UMKM, 33 kios, 11 toko.", detail: "BUMKam Bina Mulya Sejahtera mengelola depot air minum, wisata pemancingan, dan ayam petelur dengan modal Rp657.899.000. Usaha warga lain: 10 warung, 7 pom mini, 3 agen minyak tanah, 1 SPBU, dan 1 perusahaan. Layanan bank terdekat: BRI Unit Semangga." },
    { judul: "Potensi wisata", ikon: "wisata", foto: "assets/img/fasilitas/2023/f035.jpg", fotoKet: "Kolam pemancingan kampung dengan pondok tempat duduk", kredit: "Dokumen Fasilitas Umum Kampung Marga Mulya, Desember 2023",
      fotoLain: [
        { src: "assets/img/fasilitas/2023/f034.jpg", ket: "Kolam pemancingan Kampung Marga Mulya", kredit: "Dokumen Fasilitas Umum Kampung Marga Mulya, Desember 2023" },
        { src: "assets/img/fasilitas/2023/f037.jpg", ket: "Pendopo joglo dan gazebo di sekitar kolam pemancingan", kredit: "Dokumen Fasilitas Umum Kampung Marga Mulya, Desember 2023" },
        { src: "assets/img/potensi/musamus-wasur.jpg", ket: "Musamus (sarang rayap raksasa) di Taman Nasional Wasur, Merauke", kredit: "Bonefasius Kondahon · Wikimedia Commons", lisensi: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Sarang_Semut-TamanNasionalWasur.jpg" }
      ], ket: "Kolam pemancingan kampung, agrowisata, dan taman wisata hingga Distrik Tanah Miring.", detail: "Di dalam kampung terdapat kolam pemancingan yang dilengkapi pondok tempat duduk, pendopo joglo, dan gazebo; wisata pemancingan juga tercatat sebagai salah satu unit usaha BUMKam Bina Mulya Sejahtera. Di sekitar Marga Mulya dan Distrik Tanah Miring terdapat Taman Wisata Alam Mandira Loka, Mandira Agro Park, Taman Bambu Mandira, Romans Garden, Hokkaido Farm, Kebun Percontohan Tanaman Porang, Kebun Pisang Akerezki Farm, dan Kolam Pemancingan Wisata Banyu Mulya. Kawasan Mandira hanya beberapa kilometer dari pusat kampung, sehingga warga berpeluang mengembangkan usaha pendukung seperti kuliner, oleh-oleh, dan pemandu wisata.", tautan: "#wisata", tautanLabel: "Lihat peta, jarak & rute" }
  ],

  // Rincian ekonomi dari monografi (grafik di tab Potensi)
  ekonomi: {
    lahan: [
      { label: "Cabai", ha: 118.25, petani: 127 }, { label: "Jagung", ha: 46.5, petani: 41 },
      { label: "Sayuran", ha: 41.25, petani: 62 }, { label: "Jeruk", ha: 10, petani: 9 }, { label: "Padi", ha: 1.15, petani: 771, cek: true }
    ],
    ternak: [
      { label: "Unggas", ekor: 45250, peternak: 257 }, { label: "Sapi", ekor: 411, peternak: 119 },
      { label: "Kambing", ekor: 298, peternak: 93 }, { label: "Kuda", ekor: 117, peternak: 51 }, { label: "Kerbau", ekor: 9, peternak: 3 }
    ],
    penggunaanLahan: [
      { label: "Lahan pertanian", ha: 207.15 }, { label: "Lahan perkebunan", ha: 10 }, { label: "Lahan peternakan", ha: 7 },
      { label: "Hutan", ha: 61 }, { label: "Lahan lainnya", ha: 766 }
    ],
    usaha: [
      { label: "Kios", jumlah: 33 }, { label: "UMKM", jumlah: 25 }, { label: "Pertokoan", jumlah: 11 }, { label: "Warung", jumlah: 10 },
      { label: "Pom mini (BBM)", jumlah: 7 }, { label: "Agen minyak tanah", jumlah: 3 }, { label: "BUMKam", jumlah: 1 }, { label: "SPBU", jumlah: 1 }, { label: "Perusahaan", jumlah: 1 }
    ]
  },

  galeri: [
    { src: "assets/img/galeri-ekspedisi-patriot.jpg", caption: "Tim Ekspedisi Patriot bersama perangkat kampung dan distrik" },
    { src: "assets/img/kegiatan/pelatihan-peternakan.jpg", caption: "Pelatihan Manajemen Sistem Peternakan Skala Industri dan Pengembangan Pertanian Terintegrasi Berkelanjutan" },
    { src: "assets/img/kegiatan/periksa-sapi-1.jpg", caption: "Pemeriksaan kesehatan sapi milik peternak oleh Tim Ekspedisi Patriot" },
    { src: "assets/img/kegiatan/periksa-sapi-2.jpg", caption: "Tim Ekspedisi Patriot memeriksa dan mendata kesehatan ternak bersama peternak" },
    { src: "assets/img/kegiatan/petik-tomat.jpg", caption: "Tim Ekspedisi Patriot ikut memetik tomat bersama petani" },
    { src: "assets/img/kegiatan/kebun-tomat.jpg", caption: "Petani merawat tanaman tomat di kebun hortikultura" },
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
    { tanggal: "2026", judul: "Produksi video profil", ket: "Pengambilan gambar potensi dan kehidupan warga kampung." },
    { tanggal: "2026", judul: "Pelatihan peternakan skala industri & pertanian terintegrasi", foto: "assets/img/kegiatan/pelatihan-peternakan.jpg",
      ket: "Pelatihan Manajemen Sistem Peternakan Skala Industri dan Pengembangan Pertanian Terintegrasi Berkelanjutan bersama peternak, petani, dan perangkat kampung." },
    { tanggal: "2026", judul: "Pemeriksaan kesehatan ternak sapi", foto: "assets/img/kegiatan/periksa-sapi-1.jpg",
      ket: "Tim memeriksa kesehatan sapi milik peternak di kandang dan mencatat kondisinya sebagai bahan pendampingan peternakan." },
    { tanggal: "2026", judul: "Pendampingan petani hortikultura", foto: "assets/img/kegiatan/petik-tomat.jpg",
      ket: "Tim turun ke kebun tomat warga, ikut memetik hasil panen, dan berdiskusi dengan petani tentang budi daya hortikultura." }
  ],

  kontak: {
    alamat: "Kantor Kampung Marga Mulya, Distrik Semangga, Kabupaten Merauke, Papua Selatan 99631",
    telepon: "[nomor telepon / WhatsApp kantor kampung]",
    email: "[email resmi kampung]",
    jamLayanan: "Senin–Jumat, 08.00–14.00 WIT"   // perkiraan; sesuaikan dengan jam kantor kampung
  }
};
