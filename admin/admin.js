/* Dipisah dari admin/index.html agar halaman bisa memakai Content Security Policy tanpa skrip sebaris. */
// Cegah halaman admin dibuka di dalam bingkai situs lain (perlindungan clickjacking).
if (window.top !== window.self) {
  document.documentElement.innerHTML = "<body><p style=\"font:16px sans-serif;padding:16px\">Portal admin hanya bisa dibuka langsung di <a target=\"_top\" href=\"" + location.href.replace(/"/g, "%22") + "\">halaman aslinya</a>.</p></body>";
  throw new Error("Portal admin tidak boleh dibuka di dalam bingkai.");
}
(function () {
  "use strict";
  var OWNER = "Kampung-Marga-Mulya", REPO = "kampung-marga-mulya.github.io", BRANCH = "main";
  var API = "https://api.github.com";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  // Token hanya disimpan selama tab ini terbuka (sessionStorage) dan hilang saat tab ditutup.
  // Sisa token versi lama yang tersimpan permanen (localStorage) dihapus.
  try { localStorage.removeItem("mm_token"); } catch (e) {}
  var store = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} } };

  var token = null, user = null;
  // Berkas yang bisa diedit
  var FILES = {
    "assets/js/data.js": { kind: "js", data: null, asli: null, sha: null },
    "data/wisata.json": { kind: "json", data: null, asli: null, sha: null },
    "data/fasilitas.json": { kind: "json", data: null, asli: null, sha: null },
    "data/berita-abaikan.json": { kind: "json", data: null, asli: null, sha: null }
  };
  var uploads = {};   // path -> base64 (gambar baru yang belum disimpan)
  var previews = {};  // path -> dataURL

  // Daftar bagian di portal
  var SECTIONS = [
    { g: "Profil", id: "identitas", label: "Identitas wilayah", file: "assets/js/data.js", keys: ["identitas"], desc: "Nama, kode wilayah, luas, koordinat kantor kampung, dan data dasar lainnya." },
    { g: "Profil", id: "sejarah", label: "Sejarah, visi & misi", file: "assets/js/data.js", keys: ["sejarah", "sejarahRingkas", "sejarahLini", "sejarahSumber", "visi", "visiMakna", "misi", "misiRingkas"], desc: "Paragraf sejarah, lini masa kepemimpinan, visi, dan misi (dari RPJMK). Angka \"ringkas\" = jumlah paragraf/misi yang tampil sebelum tombol Baca selengkapnya." },
    { g: "Profil", id: "rpjmk", label: "RPJMK & potensi sumber daya", file: "assets/js/data.js", keys: ["rpjmk", "potensiSD"], desc: "Ringkasan RPJMK (landasan, dasar hukum, bidang kegiatan) dan tulisan singkat potensi sumber daya. Teks lengkap ada di halaman rpjmk.html." },
    { g: "Profil", id: "batas", label: "Batas wilayah", file: "assets/js/data.js", keys: ["batas"], desc: "Wilayah yang berbatasan di empat arah." },
    { g: "Profil", id: "kerjasama", label: "Kerja sama", file: "assets/js/data.js", keys: ["kerjaSama"], desc: "Teks kerja sama Tim Ekspedisi Patriot IPB University dan Pemerintah Kampung." },
    { g: "Profil", id: "prestasi", label: "Prestasi kampung", file: "assets/js/data.js", keys: ["prestasi"], desc: "Penghargaan kampung: tahun, judul, pemberi, nomor dokumen, keterangan, dan foto piagam." },
    { g: "Pemerintahan", id: "struktur", label: "Struktur organisasi", file: "assets/js/data.js", keys: ["struktur"], desc: "Nama, foto, dan tugas perangkat kampung, Bamuskam, serta lembaga." },
    { g: "Data", id: "penduduk", label: "Kependudukan", file: "assets/js/data.js", keys: ["penduduk"], desc: "Jumlah penduduk, kelompok usia, kesejahteraan keluarga, sekolah, pendidikan, pekerjaan, agama, dan suku." },
    { g: "Data", id: "sarana", label: "Sarana prasarana", file: "assets/js/data.js", keys: ["sarana"], desc: "Rekap jumlah sarana kesehatan, pendidikan, ibadah, umum, jalan, serta air bersih dan sanitasi." },
    { g: "Data", id: "fasilitas", label: "Fasilitas umum", file: "data/fasilitas.json", keys: ["fasilitas"], desc: "Sekolah, rumah ibadah, kesehatan, air bersih, dll. Status: terverifikasi, sebagian, atau perlu-data. Isi lat/lng atau biarkan kosong (robot mencarikan dari kolom 'cari')." },
    { g: "Transparansi", id: "apbkam", label: "APBKam & keuangan", file: "assets/js/data.js", keys: ["apbkam"], desc: "Ringkasan APBKam: pendapatan per kelompok, belanja per bidang/sub bidang/kegiatan, jenis belanja, sumber dana, dan pembiayaan. Rincian per kegiatan (untuk halaman apbk.html) ada di data/apbk-2026.json. Angka dalam rupiah tanpa titik." },
    { g: "Transparansi", id: "indeks", label: "Indeks Desa", file: "assets/js/data.js", keys: ["indeksDesa"], desc: "Nilai, status, enam dimensi, dan riwayat status." },
    { g: "Konten", id: "berita", label: "Berita pilihan", file: "assets/js/data.js", keys: ["berita"], desc: "Berita yang ditambahkan manual. Berita dari robot otomatis tidak perlu diisi di sini." },
    { g: "Konten", id: "beritaabaikan", label: "Sembunyikan berita robot", file: "data/berita-abaikan.json", keys: ["abaikan"], desc: "Tempel tautan berita temuan robot yang keliru agar tidak ditampilkan." },
    { g: "Konten", id: "kegiatankampung", label: "Kegiatan kampung", file: "assets/js/data.js", keys: ["kegiatanKampung"], desc: "Kegiatan yang tampil di Beranda (foto berganti tiap 3 detik) dan di Profil > Kegiatan: judul, waktu, deskripsi singkat, dan foto beserta keterangannya." },
    { g: "Konten", id: "momen", label: "Foto bergoyang di Beranda", file: "assets/js/data.js", keys: ["momen"], desc: "Foto yang tampil di tali jemuran dan deretan polaroid Beranda. Delapan foto pertama untuk tali jemuran, sisanya untuk polaroid." },
    { g: "Konten", id: "galeri", label: "Galeri foto", file: "assets/js/data.js", keys: ["galeri"], desc: "Unggah foto kegiatan dan tulis keterangannya." },
    { g: "Konten", id: "video", label: "Video profil", file: "assets/js/data.js", keys: ["video"], desc: "ID video YouTube (bagian setelah youtu.be/)." },
    { g: "Konten", id: "potensi", label: "Potensi & kegiatan", file: "assets/js/data.js", keys: ["potensi", "ekonomi", "kegiatan"], desc: "Potensi kampung, data lahan, ternak, dan usaha warga, serta linimasa kegiatan." },
    { g: "Jelajah", id: "peta", label: "Peta kampung", file: "assets/js/data.js", keys: ["peta"], desc: "Keterangan Peta Batas Kampung. Garis batas dan titik kartometrik tersimpan di data/batas-kampung.json." },
    { g: "Jelajah", id: "wisata", label: "Wisata & kuliner", file: "data/wisata.json", keys: ["tempat"], desc: "Daftar tempat wisata dan kuliner. Jarak dan waktu dihitung ulang otomatis setelah disimpan." },
    { g: "Layanan", id: "layanan", label: "Layanan surat", file: "assets/js/data.js", keys: ["layananContoh", "layanan"], desc: "Jenis surat, persyaratan, dan lama proses." },
    { g: "Layanan", id: "kontak", label: "Kontak & media sosial", file: "assets/js/data.js", keys: ["kontak", "sosmed"], desc: "Alamat, telepon, email, jam layanan, dan tautan media sosial." },
    { g: "Pengaturan", id: "meta", label: "Pengaturan website", file: "assets/js/data.js", keys: ["meta"], desc: "Label data contoh, sumber data, dan tanggal pembaruan." }
  ];
  var LABEL = {
    nama: "Nama", waktu: "Waktu kegiatan", jabatan: "Jabatan", foto: "Foto", tugas: "Tugas pokok", kontak: "Kontak", ket: "Keterangan", ketua: "Ketua / pimpinan",
    lat: "Lintang (lat)", lng: "Bujur (lng)", url: "Tautan", akun: "Nama akun", judul: "Judul", ringkas: "Ringkasan", tanggal: "Tanggal (TTTT-BB-HH)",
    sumber: "Sumber", cover: "Gambar sampul", caption: "Keterangan foto", src: "Foto", label: "Label", jumlah: "Jumlah", rentang: "Rentang umur",
    k: "Kelompok umur", l: "Laki-laki", p: "Perempuan", total: "Total penduduk", laki: "Laki-laki", perempuan: "Perempuan", kk: "Kepala keluarga",
    deskripsi: "Deskripsi", kategori: "Kategori", area: "Lokasi / area", jam: "Jam buka", fasilitas: "Fasilitas", info: "Tautan info",
    kreditFoto: "Kredit foto", cari: "Kata kunci pencarian lokasi", tag: "Tag", alamat: "Alamat", jenis: "Jenis", keterangan: "Keterangan",
    status: "Status (terverifikasi / sebagian / perlu-data)", sumberUrl: "Tautan sumber", dalamKampung: "Berada di dalam kampung", npsn: "NPSN",
    youtubeId: "ID video YouTube", fileLokal: "Berkas video lokal", poster: "Gambar sampul video", ortofoto: "Ortofoto drone", x: "Posisi X (%)", y: "Posisi Y (%)",
    anggaran: "Anggaran (Rp)", realisasi: "Realisasi (Rp)", bidang: "Bidang", kegiatan: "Kegiatan", nilai: "Nilai", skala: "Skala", tahun: "Tahun",
    dataContoh: "Tampilkan label \"contoh\" (data belum resmi)", diperbarui: "Diperbarui", sumberData: "Sumber data", namaSitus: "Nama situs", alamatWeb: "Alamat web",
    kodeWilayah: "Kode wilayah", kodePos: "Kode pos", luas: "Luas wilayah", ketinggian: "Ketinggian", zonaWaktu: "Zona waktu", jumlahDusun: "Jumlah dusun", jumlahRT: "Jumlah RT",
    koordinat: "Koordinat kantor kampung", distrik: "Distrik", kabupaten: "Kabupaten", provinsi: "Provinsi", sejarah: "Sejarah (per paragraf)", visi: "Visi", misi: "Misi",
    utara: "Utara", selatan: "Selatan", timur: "Timur", barat: "Barat", kepala: "Kepala Kampung", sekretaris: "Sekretaris Kampung", kaur: "Kepala urusan",
    kasi: "Kepala seksi", kewilayahan: "Kewilayahan (RW/RT)", rw: "Ketua RW dan RT", rt: "Ketua RT (nomor, nama)", prestasi: "Prestasi", pemberi: "Pemberi penghargaan", dokumen: "Dokumen / nomor piagam", tentang: "Tentang penghargaan", pengurus: "Susunan pengurus", bamuskam: "Bamuskam", lembaga: "Lembaga kemasyarakatan", usia: "Kelompok umur", usiaSekolah: "Usia sekolah",
    pendidikan: "Pendidikan terakhir", pekerjaan: "Mata pencaharian", agama: "Agama", pendapatan: "Sumber pendapatan", pembiayaan: "Pembiayaan", belanja: "Belanja per bidang",
    realisasiPer: "Realisasi per tanggal", dokumen: "Dokumen dasar", dimensi: "Dimensi", riwayat: "Riwayat status", catatan: "Catatan", titik: "Titik lokasi di peta drone",
    tanggalTerbang: "Tanggal terbang", resolusi: "Resolusi", luasCakupan: "Luas cakupan", pencarian: "Nama tempat di Google Maps", tautan: "Tautan Google Maps", ftid: "ID tempat Google",
    zoom: "Zoom peta", ikon: "Ikon", detail: "Detail", telepon: "Telepon / WhatsApp", email: "Email", jamLayanan: "Jam layanan", syarat: "Persyaratan", waktu: "Lama proses",
    abaikan: "Tautan yang disembunyikan", tempat: "Daftar tempat", pihak: "Pihak", ketuaTim: "Ketua tim", ringkasK: "Ringkasan", perkiraan: "Lokasi perkiraan",
    apbkam: "APBKam", indeksDesa: "Indeks Desa", identitas: "Identitas wilayah", struktur: "Struktur organisasi", penduduk: "Kependudukan", berita: "Berita",
    galeri: "Foto galeri", video: "Video profil", potensi: "Potensi", kerjaSama: "Kerja sama", layanan: "Jenis layanan", sosmed: "Media sosial", peta: "Peta kampung", gambar: "Gambar peta", citra: "Citra satelit", meta: "Pengaturan",
    jarak_km: "Jarak (km, otomatis)", waktu_menit: "Waktu (menit, otomatis)", tahunData: "Tahun data",
    survei: "Data survei foto", jam: "Jam foto (WIT)", arah: "Arah kamera", alat: "Alat / aplikasi foto", visiContoh: "Visi & misi masih contoh", sejarahRingkas: "Paragraf yang tampil di awal", sejarahLini: "Lini masa kepemimpinan", sejarahSumber: "Sumber sejarah", visiMakna: "Makna visi", misiRingkas: "Misi yang tampil di awal", rpjmk: "RPJMK", potensiSD: "Potensi sumber daya", perkam: "Peraturan kampung", periode: "Periode", ditetapkan: "Ditetapkan", landasan: "Landasan utama", halaman: "Halaman RPJMK lengkap", pdf: "Berkas PDF", dasarHukumRingkas: "Dasar hukum yang tampil di awal", bidang: "Bidang kegiatan", kegiatan: "Kegiatan", pengantar: "Pengantar", daftar: "Daftar", isi: "Isi", angka: "Angka", bab: "Bagian di RPJMK", kalender: "Kalender musim", sorotan: "Sorotan (judul & isi)", layananContoh: "Persyaratan layanan masih contoh", contoh: "Masih contoh", tahunBerdiri: "Tahun dibentuk", dasarHukum: "Dasar hukum",
    luasHa: "Luas wilayah (ha)", tipologi: "Tipologi", klasifikasi: "Klasifikasi desa", komoditasUnggulan: "Komoditas unggulan", jumlahRW: "Jumlah RW", petaResmi: "Peta resmi",
    koordinatTeks: "Koordinat (teks)", orbitasi: "Jarak tempuh", km: "Jarak (km)", pertanahan: "Pertanahan", sertifikat: "Sertifikat tanah", tanahKasHa: "Tanah kas (ha)", waduk: "Waduk/danau/situ",
    kelompokUsia: "Kelompok usia", kesejahteraan: "Tingkat kesejahteraan (KK)", sekolah: "Murid dan guru", murid: "Murid", guru: "Guru", tenagaKesehatan: "Tenaga kesehatan", suku: "Suku / etnis",
    pendapatanKosong: "Pendapatan yang belum tercatat", danaLembaga: "Dana lembaga kampung", sumberStatus: "Sumber status", sarana: "Sarana prasarana", kelompok: "Kelompok", isi: "Rincian",
    ekonomi: "Data ekonomi", lahan: "Komoditas (luas tanam)", ha: "Luas (ha)", petani: "Jumlah petani", cek: "Perlu dicek ulang", ternak: "Ternak", ekor: "Jumlah ekor", peternak: "Jumlah peternak",
    penggunaanLahan: "Penggunaan lahan", usaha: "Sarana usaha"
  };
  var PANJANG = /^(deskripsi|ringkas|ket|tugas|detail|catatan|visi|keterangan|alamat|ringkasan)$/;
  var GAMBAR = /^(foto|src|cover|poster|ortofoto)$/;
  var labelOf = function (k) { return LABEL[k] || String(k).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/^./, function (c) { return c.toUpperCase(); }); };

  /* ---------- GitHub API ---------- */
  function gh(path, opt) {
    opt = opt || {};
    return fetch(API + path, {
      method: opt.method || "GET",
      headers: Object.assign({ "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, opt.body ? { "Content-Type": "application/json" } : {}),
      body: opt.body ? JSON.stringify(opt.body) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = t ? JSON.parse(t) : {};
        if (!r.ok) { var e = new Error(j.message || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  var b64ToText = function (b) { var bin = atob(b.replace(/\n/g, "")); var bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder("utf-8").decode(bytes); };
  var textToB64 = function (t) { var bytes = new TextEncoder().encode(t), bin = ""; for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); };

  function parseFile(name, text) {
    if (FILES[name].kind === "json") return JSON.parse(text);
    // data.js dibaca sebagai data (JSON5), tidak dijalankan sebagai kode.
    var a = text.indexOf("=", text.indexOf("window.KAMPUNG")) + 1, b = text.lastIndexOf(";");
    var k = window.JSON5.parse(text.slice(a, b > a ? b : text.length));
    if (k && k.identitas && !k.identitas.koordinat) k.identitas.koordinat = { lat: null, lng: null };
    return k;
  }
  function serialize(name, data) {
    if (FILES[name].kind === "json") return JSON.stringify(data, null, 1) + "\n";
    return "/* =====================================================================\n" +
      "   MARGA MULYA ON SITE — DATA KAMPUNG\n" +
      "   Diubah melalui Portal Admin: " + location.origin + location.pathname + "\n" +
      "   Terakhir disimpan oleh " + (user ? user.login : "admin") + " pada " + new Date().toISOString() + "\n" +
      "   ===================================================================== */\n\n" +
      "window.KAMPUNG = " + JSON.stringify(data, null, 2) + ";\n";
  }

  /* ---------- Masuk ---------- */
  function showErr(m) { var e = $("#loginErr"); e.textContent = m; e.hidden = false; }
  var POLA_TOKEN = /^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/;
  function masuk(t) {
    token = String(t || "").trim();
    if (!POLA_TOKEN.test(token)) { token = null; store.del("mm_token"); showErr("Format token tidak dikenali. Token GitHub diawali github_pat_ (disarankan) atau ghp_."); return; } $("#loginBtn").disabled = true; $("#loginBtn").textContent = "Memeriksa…"; $("#loginErr").hidden = true;
    gh("/user").then(function (u) {
      user = u;
      return gh("/repos/" + OWNER + "/" + REPO);
    }).then(function (repo) {
      if (!repo.permissions || !repo.permissions.push) throw new Error("Akun ini belum punya izin menulis ke repositori website. Minta pemilik organisasi memberi akses write.");
      store.set("mm_token", token);
      $("#token").value = "";
      return muatSemua();
    }).then(function () {
      $("#login").hidden = true; $("#app").hidden = false; $("#savebar").hidden = false;
      $("#who").hidden = false;
      $("#who").innerHTML = '<img src="' + esc(user.avatar_url) + '" alt=""><span>' + esc(user.name || user.login) + '</span><button class="btn btn--ghost btn--sm" type="button" id="outBtn"><svg class="ic"><use href="#i-out"/></svg>Keluar</button>';
      $("#outBtn").onclick = function () { if (adaPerubahan() && !window.confirm("Perubahan belum disimpan. Tetap keluar?")) return; store.del("mm_token"); location.reload(); };
      bukaBagian(location.hash.slice(1) || SECTIONS[0].id);
      jagaSesi();
    }).catch(function (e) {
      store.del("mm_token");
      showErr(e.status === 401 ? "Token tidak valid atau sudah kedaluwarsa. Buat token baru lalu coba lagi." :
        e.status === 404 ? "Token tidak punya akses ke repositori website. Pastikan token dibuat untuk organisasi Kampung-Marga-Mulya dan repositori kampung-marga-mulya.github.io." : e.message);
    }).then(function () { $("#loginBtn").disabled = false; $("#loginBtn").textContent = "Masuk"; });
  }
  $("#loginForm").addEventListener("submit", function (e) { e.preventDefault(); masuk($("#token").value); });

  /* Sesi berakhir otomatis setelah 30 menit tanpa aktivitas (bila tidak ada perubahan yang belum disimpan). */
  var BATAS_DIAM = 30 * 60 * 1000, terakhirAktif = Date.now(), pemeriksaSesi = null;
  function jagaSesi() {
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
      document.addEventListener(ev, function () { terakhirAktif = Date.now(); }, { passive: true, capture: true });
    });
    clearInterval(pemeriksaSesi);
    pemeriksaSesi = setInterval(function () {
      if (Date.now() - terakhirAktif < BATAS_DIAM || adaPerubahan()) return;
      store.del("mm_token"); token = null;
      try { sessionStorage.setItem("mm_info", "Sesi berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk lagi."); } catch (e) {}
      location.reload();
    }, 60 * 1000);
  }
  (function () { var m = null; try { m = sessionStorage.getItem("mm_info"); sessionStorage.removeItem("mm_info"); } catch (e) {} if (m) showErr(m); })();

  function muatSemua() {
    return Promise.all(Object.keys(FILES).map(function (name) {
      return gh("/repos/" + OWNER + "/" + REPO + "/contents/" + name + "?ref=" + BRANCH).then(function (j) {
        var text = b64ToText(j.content);
        FILES[name].sha = j.sha; FILES[name].data = parseFile(name, text); FILES[name].asli = JSON.stringify(FILES[name].data);
      }).catch(function (e) { if (e.status === 404 && name.indexOf("abaikan") > -1) { FILES[name].data = { abaikan: [] }; FILES[name].asli = JSON.stringify(FILES[name].data); } else throw e; });
    }));
  }

  /* ---------- Navigasi bagian ---------- */
  var aktif = null;
  function nav() {
    var html = "", g = "";
    SECTIONS.forEach(function (s) {
      if (s.g !== g) { html += "<h2>" + esc(s.g) + "</h2>"; g = s.g; }
      html += '<button type="button" data-sec="' + s.id + '" aria-current="' + (aktif === s.id) + '">' + esc(s.label) + "</button>";
    });
    $("#nav").innerHTML = html;
    $("#navSelect").innerHTML = SECTIONS.map(function (s) { return '<option value="' + s.id + '"' + (aktif === s.id ? " selected" : "") + ">" + esc(s.g + " · " + s.label) + "</option>"; }).join("");
  }
  $("#nav").addEventListener("click", function (e) { var b = e.target.closest("[data-sec]"); if (b) bukaBagian(b.getAttribute("data-sec")); });
  $("#navSelect").addEventListener("change", function () { bukaBagian(this.value); });
  function bukaBagian(id) {
    var s = SECTIONS.filter(function (x) { return x.id === id; })[0] || SECTIONS[0];
    aktif = s.id; nav(); history.replaceState(null, "", "#" + s.id);
    $("#secTitle").textContent = s.label; $("#secDesc").textContent = s.desc;
    var data = FILES[s.file].data, form = $("#form"); form.innerHTML = "";
    s.keys.forEach(function (k) {
      var box = document.createElement("div"); box.className = "box";
      box.innerHTML = '<span class="lbl">' + esc(labelOf(k)) + "</span>";
      box.appendChild(editor(data, k, k));
      form.appendChild(box);
    });
    window.scrollTo({ top: 0 });
  }

  /* ---------- Pembuat formulir otomatis ---------- */
  function judulItem(o, i) {
    if (o == null || typeof o !== "object") return String(o == null ? "" : o) || "(kosong)";
    return o.nama || o.judul || o.jabatan || o.label || o.bidang || o.caption || o.k || o.tahun || o.kategori || ("Item " + (i + 1));
  }
  function kosongkan(v) {
    if (Array.isArray(v)) return v.length && v[0] && typeof v[0] === "object" ? [kosongkan(v[0])] : [];
    if (v && typeof v === "object") { var o = {}; Object.keys(v).forEach(function (k) { o[k] = kosongkan(v[k]); }); return o; }
    if (typeof v === "number") return 0;
    if (typeof v === "boolean") return false;
    return "";
  }
  function editor(parent, key, nama) {
    var v = parent[key];
    if (Array.isArray(v)) return editorList(parent, key);
    if (v && typeof v === "object") return editorObj(v);
    return editorField(parent, key);
  }
  function editorObj(obj) {
    var wrap = document.createElement("div"); wrap.className = "grid2";
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if ((v && typeof v === "object") || Array.isArray(v)) {
        var sub = document.createElement("div"); sub.className = "obj"; sub.style.gridColumn = "1 / -1";
        sub.innerHTML = '<span class="lbl">' + esc(labelOf(k)) + "</span>";
        sub.appendChild(editor(obj, k)); wrap.appendChild(sub);
      } else {
        var f = editorField(obj, k);
        if (PANJANG.test(k) || GAMBAR.test(k) || (typeof v === "string" && v.length > 70)) f.style.gridColumn = "1 / -1";
        wrap.appendChild(f);
      }
    });
    return wrap;
  }
  function editorField(obj, k) {
    var v = obj[k], row = document.createElement("div"); row.className = "row";
    var idf = "f" + Math.random().toString(36).slice(2, 9);
    if (typeof v === "boolean") {
      row.innerHTML = '<label class="switch" for="' + idf + '"><input type="checkbox" id="' + idf + '"' + (v ? " checked" : "") + "> " + esc(labelOf(k)) + "</label>";
      $("input", row).addEventListener("change", function () { obj[k] = this.checked; ubah(); });
      return row;
    }
    var angka = typeof v === "number" || (v === null && /^(lat|lng|x|y|jumlah|nilai|zoom|jarak_km|waktu_menit)$/.test(k));
    row.innerHTML = '<label for="' + idf + '">' + esc(labelOf(k)) + "</label>";
    var input;
    if (GAMBAR.test(k)) {
      var box = document.createElement("div"); box.className = "img";
      box.innerHTML = '<img alt="" src="' + esc(srcOf(v)) + '"' + (v ? "" : " hidden") + '><input type="text" id="' + idf + '" value="' + esc(v) + '" placeholder="assets/img/… atau https://…">' +
        '<label class="btn btn--line btn--sm"><svg class="ic"><use href="#i-upload"/></svg>Unggah<input type="file" accept="image/*"></label>';
      row.appendChild(box); input = $("input[type=text]", box);
      var img = $("img", box);
      input.addEventListener("input", function () { obj[k] = this.value.trim(); img.src = srcOf(obj[k]); img.hidden = !obj[k]; ubah(); });
      $("input[type=file]", box).addEventListener("change", function () {
        var file = this.files && this.files[0]; if (!file) return;
        unggah(file).then(function (path) { obj[k] = path; input.value = path; img.src = srcOf(path); img.hidden = false; ubah(); toast("Foto siap. Klik Simpan & terbitkan untuk mengunggah."); })
          .catch(function (e) { toast("Gagal memproses foto: " + e.message); });
      });
      return row;
    }
    if (!angka && (PANJANG.test(k) || (typeof v === "string" && v.length > 70))) {
      input = document.createElement("textarea"); input.value = v == null ? "" : v;
    } else {
      input = document.createElement("input"); input.type = angka ? "number" : "text"; if (angka) input.step = "any";
      input.value = v == null ? "" : v;
    }
    input.id = idf; row.appendChild(input);
    input.addEventListener("input", function () {
      if (angka) obj[k] = this.value === "" ? null : Number(this.value);
      else obj[k] = this.value;
      ubah();
    });
    return row;
  }
  function editorList(parent, key) {
    var arr = parent[key], wrap = document.createElement("div");
    var list = document.createElement("div"); list.className = "list"; wrap.appendChild(list);
    var primitif = !arr.length || typeof arr[0] !== "object";
    function gambar() {
      list.innerHTML = "";
      arr.forEach(function (it, i) {
        if (primitif) {
          var r = document.createElement("div"); r.className = "strrow row";
          var multi = typeof it === "string" && (it.length > 70 || key === "sejarah");
          r.innerHTML = (multi ? "<textarea></textarea>" : '<input type="text">') +
            '<button type="button" class="iconbtn" data-a="up" title="Naikkan"><svg class="ic"><use href="#i-up"/></svg></button>' +
            '<button type="button" class="iconbtn" data-a="del" title="Hapus"><svg class="ic"><use href="#i-trash"/></svg></button>';
          var inp = r.firstChild; inp.value = it == null ? "" : it;
          inp.setAttribute("aria-label", labelOf(key) + " " + (i + 1));
          inp.addEventListener("input", function () { arr[i] = this.value; ubah(); });
          aksi(r, i); list.appendChild(r);
        } else {
          var card = document.createElement("div"); card.className = "item";
          card.innerHTML = '<div class="item__head"><span class="no">' + (i + 1) + "</span><b>" + esc(judulItem(it, i)) + "</b>" +
            '<button type="button" class="iconbtn" data-a="up" title="Naikkan"><svg class="ic"><use href="#i-up"/></svg></button>' +
            '<button type="button" class="iconbtn" data-a="down" title="Turunkan"><svg class="ic"><use href="#i-down"/></svg></button>' +
            '<button type="button" class="iconbtn" data-a="del" title="Hapus"><svg class="ic"><use href="#i-trash"/></svg></button></div><div class="item__body"></div>';
          $(".item__body", card).appendChild(editorObj(it));
          $(".item__head", card).addEventListener("click", function (e) { if (!e.target.closest("[data-a]")) card.classList.toggle("is-open"); });
          $(".item__body", card).addEventListener("input", function () { $(".item__head b", card).textContent = judulItem(it, i); });
          aksi(card, i); list.appendChild(card);
        }
      });
    }
    function aksi(el, i) {
      el.querySelectorAll("[data-a]").forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation(); var a = b.getAttribute("data-a");
          if (a === "del") { if (!window.confirm("Hapus item ini?")) return; arr.splice(i, 1); }
          if (a === "up" && i > 0) { var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t; }
          if (a === "down" && i < arr.length - 1) { var t2 = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t2; }
          gambar(); ubah();
        });
      });
    }
    var add = document.createElement("button"); add.type = "button"; add.className = "btn btn--line btn--sm add";
    add.innerHTML = '<svg class="ic"><use href="#i-plus"/></svg>Tambah ' + esc(labelOf(key).toLowerCase());
    add.addEventListener("click", function () {
      var baru = primitif ? "" : kosongkan(arr[0] || {});
      arr.push(baru); gambar(); ubah();
      var last = list.lastElementChild; if (last) { last.classList.add("is-open"); var f = last.querySelector("input, textarea"); if (f) f.focus(); }
    });
    wrap.appendChild(add); gambar();
    return wrap;
  }

  /* ---------- Unggah gambar (diperkecil dulu) ---------- */
  function slug(s) { return String(s).toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "foto"; }
  function unggah(file) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onerror = function () { rej(new Error("berkas tidak terbaca")); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { rej(new Error("format gambar tidak didukung")); };
        img.onload = function () {
          var max = 1600, s = Math.min(1, max / Math.max(img.width, img.height));
          var c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          var png = /png/i.test(file.type) && img.width <= 800;
          var url = c.toDataURL(png ? "image/png" : "image/jpeg", .82);
          var path = "assets/img/unggahan/" + Date.now() + "-" + slug(file.name) + (png ? ".png" : ".jpg");
          uploads[path] = url.split(",")[1]; previews[path] = url;
          res(path);
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function srcOf(p) { if (!p) return ""; if (previews[p]) return previews[p]; return /^https?:/.test(p) ? p : "../" + p; }

  /* ---------- Status perubahan & simpan ---------- */
  function berubah() { return Object.keys(FILES).filter(function (n) { return FILES[n].data && JSON.stringify(FILES[n].data) !== FILES[n].asli; }); }
  function adaPerubahan() { return berubah().length > 0 || Object.keys(uploads).length > 0; }
  function ubah() {
    var n = berubah(), u = Object.keys(uploads).length, ada = n.length || u;
    $("#saveBtn").disabled = !ada; $("#resetBtn").disabled = !ada;
    $("#saveMsg").innerHTML = ada ? '<span class="dot"></span><b>Ada perubahan belum disimpan</b>' + (u ? " · " + u + " foto baru" : "") : "Belum ada perubahan.";
  }
  window.addEventListener("beforeunload", function (e) { if (adaPerubahan()) { e.preventDefault(); e.returnValue = ""; } });
  $("#resetBtn").addEventListener("click", function () {
    if (!window.confirm("Batalkan semua perubahan yang belum disimpan?")) return;
    Object.keys(FILES).forEach(function (n) { if (FILES[n].asli) FILES[n].data = JSON.parse(FILES[n].asli); });
    uploads = {}; previews = {}; bukaBagian(aktif); ubah();
  });

  $("#saveBtn").addEventListener("click", function () {
    var files = berubah(), btn = this;
    btn.disabled = true; btn.textContent = "Menyimpan…";
    var R = "/repos/" + OWNER + "/" + REPO, headSha, baseTree;
    gh(R + "/git/ref/heads/" + BRANCH).then(function (ref) {
      headSha = ref.object.sha;
      return gh(R + "/git/commits/" + headSha);
    }).then(function (c) {
      baseTree = c.tree.sha;
      // Cek apakah ada admin lain yang mengubah berkas yang sama sejak dibuka
      return Promise.all(files.map(function (n) {
        return gh(R + "/contents/" + n + "?ref=" + BRANCH).then(function (j) {
          if (j.sha !== FILES[n].sha) throw new Error("Berkas " + n + " sudah diubah orang lain sejak portal dibuka. Muat ulang halaman, lalu ulangi perubahan Anda.");
        });
      }));
    }).then(function () {
      return gh(R + "/contents/index.html?ref=" + BRANCH);
    }).then(function (idx) {
      var html = b64ToText(idx.content).replace(/\?v=\d+/g, "?v=" + Date.now());
      var blobs = files.map(function (n) { return { path: n, content: textToB64(serialize(n, FILES[n].data)) }; })
        .concat([{ path: "index.html", content: textToB64(html) }])
        .concat(Object.keys(uploads).map(function (p) { return { path: p, content: uploads[p] }; }));
      return Promise.all(blobs.map(function (b) {
        return gh(R + "/git/blobs", { method: "POST", body: { content: b.content, encoding: "base64" } }).then(function (r) { return { path: b.path, mode: "100644", type: "blob", sha: r.sha }; });
      }));
    }).then(function (tree) {
      return gh(R + "/git/trees", { method: "POST", body: { base_tree: baseTree, tree: tree } });
    }).then(function (t) {
      var bagian = SECTIONS.filter(function (s) { return files.indexOf(s.file) > -1; }).map(function (s) { return s.label; });
      var pesan = "Admin: perbarui isi website" + (Object.keys(uploads).length ? " dan unggah foto" : "") + "\n\nDiubah melalui Portal Admin oleh " + (user.name || user.login) + " (@" + user.login + ").";
      return gh(R + "/git/commits", { method: "POST", body: { message: pesan, tree: t.sha, parents: [headSha] } });
    }).then(function (c) {
      return gh(R + "/git/refs/heads/" + BRANCH, { method: "PATCH", body: { sha: c.sha } });
    }).then(function () {
      uploads = {}; previews = {};
      return muatSemua();
    }).then(function () {
      bukaBagian(aktif); ubah();
      toast("Tersimpan. Website diperbarui dalam 1–2 menit.");
    }).catch(function (e) {
      toast("Gagal menyimpan: " + e.message); ubah();
    }).then(function () { btn.innerHTML = '<svg class="ic"><use href="#i-save"/></svg>Simpan &amp; terbitkan'; btn.disabled = !adaPerubahan(); });
  });

  var toastT;
  function toast(m) { var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); } t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4500); }

  var simpanan = store.get("mm_token");
  if (simpanan) masuk(simpanan);
})();
