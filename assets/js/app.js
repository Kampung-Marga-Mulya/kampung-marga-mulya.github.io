/* =====================================================================
   MARGA MULYA ON SITE — logika tampilan
   Membaca window.KAMPUNG (assets/js/data.js) lalu mengisi setiap bagian.
   Tidak perlu diubah untuk memperbarui isi website.
   ===================================================================== */
(function () {
  "use strict";
  var D = window.KAMPUNG;
  if (!D) { console.error("data.js tidak ditemukan"); return; }

  /* ---------- Alat bantu ---------- */
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var num = function (n) { return Number(n).toLocaleString("id-ID"); };
  var pct = function (a, b, d) { return b ? (a / b * 100).toLocaleString("id-ID", { maximumFractionDigits: d == null ? 1 : d }) : "0"; };
  var rp = function (n) { return "Rp " + num(n); };
  var rpS = function (n) {
    if (n >= 1e9) return "Rp " + (n / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M";
    if (n >= 1e6) return "Rp " + (n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
    return rp(n);
  };
  var ic = function (name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '"><use href="#i-' + name + '"/></svg>'; };
  var sum = function (arr, key) { return arr.reduce(function (a, x) { return a + (key ? x[key] : x); }, 0); };
  var CONTOH = D.meta.dataContoh ? ' <span class="chip chip--contoh">contoh</span>' : "";
  var id = D.identitas, P = D.penduduk;

  /* ---------- Aksi klik: setiap elemen diberi data-act berisi nomor fungsi ---------- */
  var acts = [];
  var act = function (fn) { acts.push(fn); return ' data-act="' + (acts.length - 1) + '"'; };
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (el) { e.preventDefault(); acts[+el.getAttribute("data-act")](el); }
  });

  /* ---------- Jendela informasi ---------- */
  var modal = $("#modal");
  function openModal(o) {
    $("#modalKat").textContent = o.kat || "";
    $("#modalTitle").textContent = o.title || "";
    $("#modalBody").innerHTML = o.html || "";
    if (typeof modal.showModal === "function") { if (!modal.open) modal.showModal(); }
    else modal.setAttribute("open", "");
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  var toastT;
  function toast(msg) {
    var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2200);
  }
  function copy(text) {
    var done = function () { toast("Disalin: " + text); };
    try { navigator.clipboard.writeText(text).then(done, function () { toast(text); }); } catch (e) { toast(text); }
  }

  /* ---------- Tautan Google Maps ---------- */
  var G = D.google, hasKoord = !!(id.koordinat && id.koordinat.lat);
  var gQuery = hasKoord ? id.koordinat.lat + "," + id.koordinat.lng : G.pencarian;
  var gm = {
    open: G.tautan || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(gQuery),
    dir: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(gQuery),
    street: hasKoord
      ? "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + id.koordinat.lat + "," + id.koordinat.lng
      : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(G.pencarian),
    embed: function (type) { return "https://maps.google.com/maps?q=" + encodeURIComponent(gQuery) + (!hasKoord && G.ftid ? "&ftid=" + G.ftid : "") + "&t=" + type + "&z=" + G.zoom + "&hl=id&ie=UTF8&iwloc=&output=embed"; },
    cari: function (nama) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nama + ", " + G.pencarian); }
  };
  var mapBtn = function (href, label, icon, solid) {
    return '<a class="btn ' + (solid ? "btn--solid" : "btn--line") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + ic(icon || "pin") + esc(label) + "</a>";
  };

  /* ---------- Penanda versi draf ---------- */
  var draft = $("#draftbar"), draftNote = $("#draftNote");
  if (draft && draftNote) draft.addEventListener("click", function (e) {
    e.stopPropagation(); draftNote.hidden = !draftNote.hidden; draft.setAttribute("aria-expanded", draftNote.hidden ? "false" : "true");
  });
  document.addEventListener("click", function () { if (draftNote && !draftNote.hidden) { draftNote.hidden = true; draft.setAttribute("aria-expanded", "false"); } });
  if (D.meta.dataContoh && $("#draftbar")) $("#draftbar").hidden = false;

  /* =================== BERANDA =================== */
  $("#heroPlace").textContent = "Distrik " + id.distrik + " · Kabupaten " + id.kabupaten + " · " + id.provinsi;
  $("#collabBtn").setAttribute("data-act", act(function () {
    openModal({ kat: "Kerja sama " + D.kerjaSama.tahun, title: "Tentang Marga Mulya On Site",
      html: "<p>" + esc(D.kerjaSama.ringkas) + "</p><p><b>Pihak yang bekerja sama:</b></p><ul>" + D.kerjaSama.pihak.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
        "</ul><p class='small'>Ketua Tim Ekspedisi Patriot IPB University: " + esc(D.kerjaSama.ketuaTim) + "</p>" });
  }).replace(/^ data-act="|"$/g, ""));

  var facts = [
    { ic: "users", t: "Penduduk", v: num(P.total), s: "jiwa", info: "Jumlah penduduk Kampung Marga Mulya menurut proyeksi BPS pertengahan 2024. Angka ini akan diperbarui dengan hasil pendataan kampung." },
    { ic: "home", t: "Kepala keluarga", v: num(P.kk), s: "KK" + (D.meta.dataContoh ? " · contoh" : ""), info: "Jumlah kepala keluarga terdaftar. Rata-rata " + (P.total / P.kk).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jiwa per keluarga." },
    { ic: "pin", t: "Kode wilayah", v: id.kodeWilayah, s: "Kemendagri", code: true, info: "Kode wilayah administrasi pemerintahan untuk Kampung Marga Mulya. 93 = Papua Selatan, 01 = Kabupaten Merauke, 05 = Distrik Semangga, 2008 = Kampung Marga Mulya." },
    { ic: "mail", t: "Kode pos", v: id.kodePos, s: "Distrik " + id.distrik, code: true, info: "Kode pos yang dipakai untuk seluruh kampung di Distrik Semangga." }
  ];
  $("#facts").innerHTML = facts.map(function (f) {
    return '<button type="button" class="fact tap"' + act(function () { openModal({ kat: "Beranda", title: f.t + ": " + f.v, html: "<p>" + esc(f.info) + "</p>" }); }) +
      '><span class="fact__t">' + ic(f.ic) + esc(f.t) + '</span><span class="fact__v">' + esc(f.v) + "<small>" + esc(f.s) + "</small></span></button>";
  }).join("");
  document.querySelectorAll(".fact").forEach(function (b, i) { if (facts[i].code) b.classList.add("fact--code"); });

  var quick = [
    ["#tentang", "home", "Profil kampung", "Sejarah, identitas, visi misi, dan batas wilayah"],
    ["#pemerintahan", "users", "Pemerintahan", "Struktur organisasi, Bamuskam, dan lembaga"],
    ["#penduduk", "chart", "Data penduduk", "Piramida umur, pendidikan, pekerjaan, agama"],
    ["#fasilitas", "school", "Fasilitas umum", "Sekolah, rumah ibadah, kesehatan, air bersih"],
    ["#apbkam", "wallet", "Transparansi anggaran", "APBKam dan realisasi per bidang"],
    ["#indeksdesa", "gauge", "Indeks Desa", "Status perkembangan kampung"],
    ["#petakampung", "pin", "Peta kampung", "Peta drone, satelit, dan Street View"],
    ["#wisatakuliner", "route", "Wisata & kuliner", "Tempat rekreasi dan makan 1–2 jam dari kampung"],
    ["#surat", "doc", "Layanan surat", "Persyaratan dan lama proses surat"],
    ["#media", "video", "Video & galeri", "Video profil dan dokumentasi kegiatan"],
    ["#potensi", "sprout", "Potensi kampung", "Pertanian, ternak, UMKM, dan kegiatan"],
    ["#kontakkampung", "phone", "Kontak & media sosial", "Kantor kampung, Facebook, Instagram, TikTok"]
  ];
  $("#quick").innerHTML = quick.map(function (q) {
    return '<a class="xcard" href="' + q[0] + '"><span class="xcard__ic">' + ic(q[1]) + '</span><span class="xcard__t"><b>' + esc(q[2]) + "</b><small>" + esc(q[3]) + '</small></span><span class="xcard__go">' + ic("arrow") + "</span></a>";
  }).join("");

  /* =================== BERITA (slider) =================== */
  var BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  var tgl = function (iso) { var p = iso.split("-"); return +p[2] + " " + BULAN[+p[1] - 1] + " " + p[0]; };
  var track = $("#newsTrack"), news = [], newsReady = false;
  var keyUrl = function (u) { return String(u || "").replace(/^https?:\/\/(www\.|m\.)?/i, "").replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase(); };
  var hariIni = new Date(), BARU_HARI = 14;
  var umurHari = function (iso) { return (hariIni - new Date(iso + "T00:00:00+09:00")) / 864e5; };
  // Gabungkan berita kurasi (data.js) dengan berita temuan robot (data/berita-otomatis.json)
  function renderNews(list) {
    var seen = {};
    news = list.filter(function (n) { var k = keyUrl(n.url); if (!n.url || seen[k]) return false; seen[k] = 1; return true; })
      .sort(function (a, b) { return a.tanggal < b.tanggal ? 1 : -1; });
    track.innerHTML = news.map(function (n) {
      var ph = '<span class="ncard__ph"' + (n.cover ? " hidden" : "") + ">" + ic("doc") + "<span>" + esc(n.sumber) + "</span><b>Kampung Marga Mulya</b></span>";
      var img = n.cover ? '<img src="' + esc(n.cover) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : "";
      var baru = umurHari(n.tanggal) <= BARU_HARI;
      return '<a class="ncard" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
        '<span class="ncard__cover">' + img + ph + '<span class="ncard__badge' + (baru ? " ncard__badge--new" : "") + '">' + (baru ? "Baru" : n.tanggal.slice(0, 4)) + "</span></span>" +
        '<span class="ncard__body"><span class="ncard__meta">' + esc(n.sumber) + " · " + tgl(n.tanggal) + '</span><span class="ncard__t">' + esc(n.judul) + "</span>" +
        '<span class="ncard__d">' + esc(n.ringkas || "Baca selengkapnya di " + n.sumber + ".") + '</span><span class="ncard__go">Baca berita ' + ic("external") + "</span></span></a>";
    }).join("");
    if (newsReady) updNav();
  }
  renderNews((D.berita || []).slice());
  var newsInfo = $("#newsInfo");
  var sudahDimuat = false;
  function muatBeritaOtomatis() {
    if (!window.fetch) return;
    fetch("data/berita-otomatis.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return;
        var sebelum = news.length;
        renderNews((D.berita || []).concat(j.berita || []));
        if (j.diperiksa && newsInfo) newsInfo.textContent = "Diperbarui otomatis · dicek " + tgl(j.diperiksa);
        if (sudahDimuat && news.length > sebelum) toast((news.length - sebelum) + " berita baru ditambahkan");
        sudahDimuat = true;
      })
      .catch(function () { /* tetap tampilkan berita kurasi */ });
  }
  // Sampul yang gagal dimuat diganti sampul biru
  track.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG") { var c = e.target.parentNode; e.target.remove(); var ph = c.querySelector(".ncard__ph"); if (ph) ph.hidden = false; }
  }, true);
  var prev = $("#newsPrev"), next = $("#newsNext"), count = $("#newsCount");
  function step() { var c = track.querySelector(".ncard"); return c ? c.getBoundingClientRect().width + 16 : 300; }
  function updNav() {
    var max = track.scrollWidth - track.clientWidth - 2;
    var first = Math.round(track.scrollLeft / step()) + 1;
    var vis = Math.max(1, Math.round(track.clientWidth / step()));
    count.textContent = first + "–" + Math.min(news.length, first + vis - 1) + " dari " + news.length;
  }
  // Berputar: setelah berita terakhir kembali ke berita pertama, dan sebaliknya.
  var atStart = function () { return track.scrollLeft <= 2; };
  var atEnd = function () { return track.scrollLeft >= track.scrollWidth - track.clientWidth - 2; };
  function goNext() { if (atEnd()) track.scrollTo({ left: 0, behavior: "smooth" }); else track.scrollBy({ left: step(), behavior: "smooth" }); }
  function goPrev() { if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }); else track.scrollBy({ left: -step(), behavior: "smooth" }); }
  prev.addEventListener("click", goPrev);
  next.addEventListener("click", goNext);
  // Geser jari melewati ujung slider juga berputar ke awal/akhir
  var tx = null, edge = "";
  track.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; edge = atEnd() ? "end" : (atStart() ? "start" : ""); }, { passive: true });
  track.addEventListener("touchend", function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (edge === "end" && dx < -40) track.scrollTo({ left: 0, behavior: "smooth" });
    if (edge === "start" && dx > 40) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  }, { passive: true });
  track.addEventListener("scroll", function () { window.requestAnimationFrame(updNav); }, { passive: true });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  });
  window.addEventListener("resize", updNav); newsReady = true; updNav();
  muatBeritaOtomatis();
  setInterval(muatBeritaOtomatis, 10 * 60 * 1000);   // cek ulang tiap 10 menit selama halaman dibuka


  /* =================== PROFIL =================== */
  $("#sejarah").innerHTML = "<h3>Sejarah singkat</h3>" + D.sejarah.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("#identitas").innerHTML = [
    ["Nama", id.nama], ["Distrik", id.distrik], ["Kabupaten", id.kabupaten], ["Provinsi", id.provinsi],
    ["Kode wilayah", id.kodeWilayah], ["Kode pos", id.kodePos], ["Luas wilayah", id.luas], ["Ketinggian", id.ketinggian],
    ["Jumlah dusun", id.jumlahDusun], ["Jumlah RT", id.jumlahRT], ["Zona waktu", id.zonaWaktu],
    ["Koordinat", hasKoord ? id.koordinat.lat + ", " + id.koordinat.lng : "[isi koordinat kantor kampung]"]
  ].map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  $("#visi").textContent = D.visi;
  $("#misi").innerHTML = D.misi.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
  var arah = [["n", "Utara", D.batas.utara], ["w", "Barat", D.batas.barat], ["e", "Timur", D.batas.timur], ["s", "Selatan", D.batas.selatan]];
  $("#batas").innerHTML = arah.map(function (a) {
    return '<button type="button" class="c tap ' + a[0] + '"' + act(function () {
      openModal({ kat: "Batas wilayah", title: "Sebelah " + a[1].toLowerCase(), html: "<p>Kampung Marga Mulya di sebelah " + a[1].toLowerCase() + " berbatasan dengan <b>" + esc(a[2]) + "</b>.</p><div class='modal__actions'>" + mapBtn(gm.open, "Lihat wilayah di Google Maps", "pin", true) + "</div>" });
    }) + "><b>" + a[1] + "</b>" + esc(a[2]) + "</button>";
  }).join("") + '<div class="mid">Marga<br>Mulya</div>';

  /* =================== PEMERINTAHAN =================== */
  var S = D.struktur;
  function pejabatModal(o) {
    var foto = o.foto ? '<img class="modal__img" src="' + esc(o.foto) + '" alt="Foto ' + esc(o.nama) + '">' : "";
    openModal({ kat: "Pemerintah Kampung", title: o.jabatan, html: foto + "<p><b>" + esc(o.nama) + "</b></p><p>" + esc(o.tugas || "") + "</p>" + (o.kontak ? "<p>Kontak: " + esc(o.kontak) + "</p>" : "") });
  }
  var node = function (o, top) {
    var ph = top ? '<span class="node__photo">' + (o.foto ? '<img src="' + esc(o.foto) + '" alt="">' : ic("users")) + "</span>" : "";
    return '<button type="button" class="node tap' + (top ? " node--top" : "") + '"' + act(function () { pejabatModal(o); }) + ">" + ph +
      '<span class="node__jab">' + esc(o.jabatan) + '</span><span class="node__nama">' + esc(o.nama) + "</span></button>";
  };
  var row = function (label, list) {
    return '<div class="org__row">' + (label ? '<div class="org__label">' + esc(label) + "</div>" : "") + list.map(function (o) { return node(o); }).join("") + "</div>";
  };
  $("#org").innerHTML = '<div class="org__row">' + node(S.kepala, true) + "</div>" + row("", [S.sekretaris]) +
    row("Kepala urusan", S.kaur) + row("Kepala seksi", S.kasi) + row("Pelaksana kewilayahan", S.kewilayahan);
  $("#bamuskam").innerHTML = S.bamuskam.map(function (o) {
    return '<li><button type="button" class="tap"' + act(function () {
      openModal({ kat: "Badan Musyawarah Kampung", title: o.jabatan, html: "<p><b>" + esc(o.nama) + "</b></p><p>Bamuskam menampung aspirasi warga, membahas dan menyepakati rancangan peraturan kampung bersama Kepala Kampung, serta mengawasi kinerja pemerintah kampung.</p>" });
    }) + "><span>" + esc(o.jabatan) + "</span><span>" + esc(o.nama) + "</span></button></li>";
  }).join("");
  $("#lembaga").innerHTML = S.lembaga.map(function (o) {
    return '<li><button type="button" class="tap"' + act(function () {
      openModal({ kat: "Lembaga kemasyarakatan", title: o.nama, html: "<p>" + esc(o.ket) + ".</p><p>Pimpinan: <b>" + esc(o.ketua) + "</b></p>" });
    }) + "><span>" + esc(o.nama) + "</span><span>" + esc(o.ket) + "</span></button></li>";
  }).join("");

  /* =================== KEPENDUDUKAN =================== */
  $("#dataSumber").textContent = "Sumber: " + D.meta.sumberData + ". Diperbarui " + D.meta.diperbarui + ". Ketuk angka atau grafik untuk rincian.";
  var stats = [
    [num(P.total), "Total penduduk", "", "Jumlah seluruh penduduk kampung (proyeksi BPS 2024)."],
    [num(P.laki), "Laki-laki · " + pct(P.laki, P.total) + "%", CONTOH, "Penduduk laki-laki. Rasio jenis kelamin " + Math.round(P.laki / P.perempuan * 100) + " laki-laki per 100 perempuan."],
    [num(P.perempuan), "Perempuan · " + pct(P.perempuan, P.total) + "%", CONTOH, "Penduduk perempuan kampung."],
    [num(P.kk), "Kepala keluarga", CONTOH, "Jumlah kartu keluarga terdaftar di kampung."]
  ];
  $("#stats").innerHTML = stats.map(function (s) {
    return '<button type="button" class="stat tap"' + act(function () { openModal({ kat: "Kependudukan", title: s[1].split(" · ")[0] + ": " + s[0], html: "<p>" + esc(s[3]) + "</p>" }); }) +
      "><b>" + s[0] + "</b><span>" + esc(s[1]) + "</span>" + s[2] + "</button>";
  }).join("");
  ["#pyramid", "#usiaSekolah", "#pendidikan", "#pekerjaan", "#agama"].forEach(function (sel) {
    var h = $(sel).closest(".panel").querySelector("h3");
    if (h && CONTOH) h.insertAdjacentHTML("beforeend", CONTOH);
  });

  var maxAge = Math.max.apply(null, P.usia.map(function (u) { return Math.max(u.l, u.p); }));
  $("#pyramid").innerHTML = P.usia.slice().reverse().map(function (u) {
    return '<button type="button" class="pyr tap"' + act(function () {
      var t = u.l + u.p;
      openModal({ kat: "Piramida penduduk", title: "Kelompok umur " + u.k + " tahun",
        html: '<div class="mini-stat"><div><b>' + num(t) + "</b><span>Jumlah</span></div><div><b>" + num(u.l) + "</b><span>Laki-laki</span></div><div><b>" + num(u.p) + "</b><span>Perempuan</span></div></div>" +
          "<p>Kelompok ini mencakup " + pct(t, P.total) + "% dari seluruh penduduk kampung.</p>" });
    }) + ' aria-label="Umur ' + esc(u.k) + '">' +
      '<span class="pyr__side pyr__side--l"><span class="pyr__num">' + u.l + '</span><span class="pyr__bar" style="width:' + (u.l / maxAge * 100) + '%"></span></span>' +
      '<span class="pyr__age">' + esc(u.k) + "</span>" +
      '<span class="pyr__side pyr__side--p"><span class="pyr__bar" style="width:' + (u.p / maxAge * 100) + '%"></span><span class="pyr__num">' + u.p + "</span></span></button>";
  }).join("");

  $("#usiaSekolah").innerHTML = P.usiaSekolah.map(function (s) {
    return '<button type="button" class="tap"' + act(function () {
      openModal({ kat: "Penduduk usia sekolah", title: s.label + " (" + s.rentang + ")", html: "<p><b>" + num(s.jumlah) + " anak</b> berada pada usia jenjang ini.</p><p>" + esc(s.ket) + "</p>" });
    }) + "><b>" + num(s.jumlah) + "</b><span>" + esc(s.label) + "</span><small>" + esc(s.rentang) + "</small></button>";
  }).join("");

  function bars(sel, list, kat, fmt) {
    var tot = sum(list, "jumlah"), max = Math.max.apply(null, list.map(function (x) { return x.jumlah; }));
    fmt = fmt || num;
    $(sel).innerHTML = list.map(function (x, i) {
      var rank = list.slice().sort(function (a, b) { return b.jumlah - a.jumlah; }).indexOf(x) + 1;
      return '<button type="button" class="bar tap"' + act(function () {
        openModal({ kat: kat, title: x.label, html: '<div class="mini-stat"><div><b>' + fmt(x.jumlah) + "</b><span>" + (fmt === num ? "Jiwa" : "Jumlah") + "</span></div><div><b>" + pct(x.jumlah, tot) + "%</b><span>Porsi</span></div><div><b>#" + rank + "</b><span>Peringkat</span></div></div>" +
          "<p>" + esc(x.label) + " mencakup " + pct(x.jumlah, tot) + "% dari total " + fmt(tot) + ".</p>" });
      }) + "><span>" + esc(x.label) + '</span><span class="bar__val"><b>' + fmt(x.jumlah) + "</b> · " + pct(x.jumlah, tot) + '%</span><span class="bar__track"><span class="bar__fill" style="display:block;width:' + (x.jumlah / max * 100) + '%"></span></span></button>';
    }).join("");
  }
  bars("#pendidikan", P.pendidikan, "Pendidikan terakhir");
  bars("#pekerjaan", P.pekerjaan, "Mata pencaharian");
  bars("#agama", P.agama, "Agama");

  /* =================== ANGGARAN (APBKam) =================== */
  var A = D.apbkam;
  var totPend = sum(A.pendapatan, "jumlah"), totBel = sum(A.belanja, "anggaran"), totReal = sum(A.belanja, "realisasi");
  $("#apbTitle").innerHTML = "APBKam Tahun " + A.tahun + CONTOH;
  $("#apbLead").textContent = "Anggaran Pendapatan dan Belanja Kampung Marga Mulya. Realisasi per " + A.realisasiPer + ". Ketuk setiap angka untuk penjelasan.";
  var sumCards = [
    ["Pendapatan", rpS(totPend), A.pendapatan.length + " sumber", "Seluruh pendapatan kampung tahun " + A.tahun + ": " + rp(totPend) + ". Rincian ada di panel sumber pendapatan.", ""],
    ["Belanja", rpS(totBel), "5 bidang", "Seluruh rencana belanja kampung: " + rp(totBel) + ", dibagi ke lima bidang sesuai aturan pengelolaan keuangan desa.", ""],
    ["Pembiayaan", rpS(A.pembiayaan.jumlah), A.pembiayaan.label, A.pembiayaan.label + ": " + rp(A.pembiayaan.jumlah) + ". Pembiayaan menutup selisih antara belanja dan pendapatan.", ""],
    ["Realisasi belanja", pct(totReal, totBel, 0) + "%", rpS(totReal) + " terpakai", "Belanja yang sudah terlaksana sampai " + A.realisasiPer + ": " + rp(totReal) + " dari " + rp(totBel) + ".", "blue"]
  ];
  $("#apbSum").innerHTML = sumCards.map(function (c) {
    return '<button type="button" class="apb-card tap' + (c[4] ? " apb-card--blue" : "") + '"' + act(function () { openModal({ kat: "APBKam " + A.tahun, title: c[0], html: "<p>" + esc(c[3]) + "</p><p class='small'>Dasar: " + esc(A.dokumen) + ".</p>" }); }) +
      "><span>" + c[0] + "</span><b>" + c[1] + "</b><small>" + esc(c[2]) + "</small></button>";
  }).join("");
  bars("#apbPendapatan", A.pendapatan, "Sumber pendapatan", rpS);
  $("#apbBelanja").innerHTML = A.belanja.map(function (b, i) {
    var p = pct(b.realisasi, b.anggaran, 0);
    return '<button type="button" class="bid tap"' + act(function () {
      openModal({ kat: "Bidang " + (i + 1) + " · APBKam " + A.tahun, title: b.bidang,
        html: '<div class="mini-stat"><div><b>' + rpS(b.anggaran) + "</b><span>Anggaran</span></div><div><b>" + rpS(b.realisasi) + "</b><span>Realisasi</span></div><div><b>" + p + "%</b><span>Terserap</span></div></div>" +
          '<div class="tablewrap"><table class="tbl"><thead><tr><th>Kegiatan</th><th class="num">Anggaran</th><th class="num">Realisasi</th></tr></thead><tbody>' +
          b.kegiatan.map(function (k) { return "<tr><td>" + esc(k.nama) + '</td><td class="num">' + rpS(k.anggaran) + '</td><td class="num">' + pct(k.realisasi, k.anggaran, 0) + "%</td></tr>"; }).join("") +
          "</tbody></table></div>" });
    }) + '><span class="bid__top"><span>' + (i + 1) + ". " + esc(b.bidang) + "</span><span>" + rpS(b.anggaran) + '</span></span><span class="bid__track" style="display:block"><span class="bid__fill" style="display:block;width:' + p + '%"></span></span><small>Realisasi ' + rpS(b.realisasi) + " · " + p + "% · " + pct(b.anggaran, totBel, 0) + "% dari total belanja</small></button>";
  }).join("");

  /* =================== INDEKS DESA =================== */
  var I = D.indeksDesa;
  var statusInfo = {
    "Mandiri": "Kampung mampu menyelenggarakan pembangunan secara mandiri dengan layanan dasar, ekonomi, dan tata kelola yang kuat.",
    "Maju": "Kampung memiliki layanan dan potensi ekonomi yang baik dan terus dikembangkan menuju kemandirian.",
    "Berkembang": "Kampung memiliki potensi yang mulai dikelola, tetapi beberapa dimensi masih perlu diperkuat.",
    "Tertinggal": "Kampung masih memiliki keterbatasan pada sejumlah layanan dasar dan akses.",
    "Sangat Tertinggal": "Kampung menghadapi keterbatasan besar pada layanan dasar, ekonomi, dan akses."
  };
  $("#idmLead").innerHTML = esc(I.catatan) + CONTOH;
  var C = 2 * Math.PI * 70, frac = Math.max(0, Math.min(1, I.nilai / I.skala));
  $("#idmScore").innerHTML = '<svg class="ring" viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" stroke="rgba(255,255,255,.22)"/>' +
    '<circle cx="85" cy="85" r="70" stroke="#FFFFFF" stroke-linecap="round" stroke-dasharray="' + (C * frac).toFixed(1) + " " + C.toFixed(1) + '" transform="rotate(-90 85 85)"/>' +
    '<text x="85" y="86" text-anchor="middle" font-size="38" font-weight="700">' + I.nilai.toLocaleString("id-ID") + '</text><text x="85" y="112" text-anchor="middle" font-size="13" opacity=".85">dari ' + I.skala + "</text></svg>" +
    '<span class="idm__status">' + esc(I.status) + "</span><small>Indeks Desa " + I.tahun + " · ketuk untuk penjelasan</small>";
  $("#idmScore").setAttribute("data-act", act(function () {
    openModal({ kat: "Indeks Desa " + I.tahun, title: "Status: " + I.status,
      html: "<p>" + esc(statusInfo[I.status] || "") + "</p><p>Nilai Indeks Desa Kampung Marga Mulya tahun " + I.tahun + " adalah <b>" + I.nilai.toLocaleString("id-ID") + "</b> dari " + I.skala + ".</p><p>" + esc(I.catatan) + "</p><p>Urutan status dari terendah: Sangat Tertinggal, Tertinggal, Berkembang, Maju, Mandiri.</p>" });
  }).replace(/^ data-act="|"$/g, ""));
  var weakest = I.dimensi.slice().sort(function (a, b) { return a.nilai - b.nilai; })[0];
  $("#idmDims").innerHTML = I.dimensi.map(function (d) {
    return '<button type="button" class="dim tap"' + act(function () {
      openModal({ kat: "Dimensi Indeks Desa", title: d.nama, html: '<div class="mini-stat"><div><b>' + d.nilai + "</b><span>Nilai</span></div><div><b>" + I.skala + "</b><span>Skala</span></div><div><b>" + (d === weakest ? "Prioritas" : "—") + "</b><span>Catatan</span></div></div><p>" + esc(d.ket) + "</p>" +
        (d === weakest ? "<p>Dimensi ini bernilai paling rendah sehingga menjadi prioritas perbaikan kampung.</p>" : "") });
    }) + '><span class="dim__top"><span>' + esc(d.nama) + "</span><b>" + d.nilai + '</b></span><span class="dim__track" style="display:block"><span class="dim__fill" style="display:block;width:' + (d.nilai / I.skala * 100) + '%"></span></span></button>';
  }).join("");
  $("#idmRiwayat").innerHTML = I.riwayat.map(function (r) {
    return '<li><button type="button" class="reset tap" style="text-align:center"' + act(function () {
      openModal({ kat: "Riwayat Indeks Desa", title: r.tahun + ": " + r.status, html: "<p>" + esc(statusInfo[r.status] || "") + "</p>" });
    }) + "><b>" + r.tahun + "</b><span>" + esc(r.status) + "</span></button></li>";
  }).join("");

  /* =================== PETA =================== */
  var PT = D.peta;
  var warna = { Pemerintahan: "#082A66", Pendidikan: "#0B3A8F", Kesehatan: "#1046A8", Ibadah: "#1452C2", Pertanian: "#2563D6", Ekonomi: "#346FDE", Olahraga: "#4A7FE2" };
  var kat = Array.from(new Set(PT.titik.map(function (t) { return t.kategori; })));
  var aktifKat = {}; kat.forEach(function (k) { aktifKat[k] = true; });
  $("#petaMeta").innerHTML = [["Sumber", PT.sumber], ["Tanggal terbang", PT.tanggalTerbang], ["Resolusi", PT.resolusi], ["Cakupan", PT.luasCakupan]]
    .map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  $("#gmOpen").href = gm.open; $("#gmDir").href = gm.dir; $("#gmStreet").href = gm.street;

  var pins = $("#pins"), info = $("#pinInfo");
  pins.innerHTML = PT.titik.map(function (t, i) {
    return '<button class="pin" type="button" data-i="' + i + '" style="left:' + t.x + "%;top:" + t.y + "%;--pin:" + (warna[t.kategori] || "#1452C2") + '" aria-label="' + esc(t.nama) + '"><span class="pin__dot"><i>' + (i + 1) + "</i></span></button>";
  }).join("");
  pins.addEventListener("click", function (e) {
    var btn = e.target.closest(".pin"); if (!btn) return;
    var t = PT.titik[+btn.dataset.i];
    pins.querySelectorAll(".pin").forEach(function (p) { p.classList.toggle("is-active", p === btn); });
    var link = (t.lat && t.lng) ? "https://www.google.com/maps/search/?api=1&query=" + t.lat + "," + t.lng : gm.cari(t.nama);
    info.innerHTML = '<p class="mapinfo__kat">' + esc(t.kategori) + " · titik " + (+btn.dataset.i + 1) + "</p><h3>" + esc(t.nama) + "</h3><p>" + esc(t.ket) + '</p><p><a href="' + esc(link) + '" target="_blank" rel="noopener">Lihat di Google Maps →</a></p>';
  });
  $("#mapFilter").innerHTML = kat.map(function (k) {
    return '<button class="fbtn" type="button" aria-pressed="true" data-k="' + esc(k) + '" style="--pin:' + (warna[k] || "#1452C2") + '">' + esc(k) + "</button>";
  }).join("");
  $("#mapFilter").addEventListener("click", function (e) {
    var f = e.target.closest(".fbtn"); if (!f) return;
    var k = f.dataset.k; aktifKat[k] = !aktifKat[k];
    f.setAttribute("aria-pressed", aktifKat[k] ? "true" : "false");
    pins.querySelectorAll(".pin").forEach(function (p) { p.hidden = !aktifKat[PT.titik[+p.dataset.i].kategori]; });
  });

  // Tab peta: drone, satelit Google, peta jalan Google, Street View
  var loaded = {};
  function frame(panel, type) {
    if (loaded[panel]) return; loaded[panel] = true;
    var el = $("#panel-" + panel);
    el.innerHTML = '<div class="map__fallback"><div><p>Peta Google sedang dimuat. Bila tidak tampil, buka langsung:</p>' + mapBtn(gm.open, "Buka di Google Maps", "pin", true) + "</div></div>" +
      '<iframe title="Peta Google ' + (type === "k" ? "satelit" : "jalan") + ' Kampung Marga Mulya" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="' + esc(gm.embed(type)) + '"></iframe>';
  }
  $("#panel-street").innerHTML = '<div class="street">' +
    '<svg class="art" viewBox="0 0 200 140" aria-hidden="true"><rect x="0" y="0" width="200" height="140" rx="16" fill="#FFFFFF"/><path d="M0 104 L200 104" stroke="#DCE6F6" stroke-width="2"/><path d="M70 140 L92 104 L108 104 L130 140Z" fill="#DCE8FB"/><path d="M100 110 v8 M100 126 v8" stroke="#1452C2" stroke-width="3" stroke-linecap="round"/>' +
    '<rect x="22" y="70" width="40" height="34" fill="#FFFFFF" stroke="#1452C2" stroke-width="2"/><path d="M16 72 L42 52 L68 72Z" fill="#1452C2"/><rect x="140" y="76" width="36" height="28" fill="#FFFFFF" stroke="#1452C2" stroke-width="2"/><path d="M134 78 L158 60 L182 78Z" fill="#0B3A8F"/>' +
    '<circle cx="100" cy="44" r="9" fill="#1452C2"/><path d="M90 92 v-22 a10 10 0 0 1 20 0 v22" fill="#1452C2"/><path d="M96 92v12M104 92v12" stroke="#0B3A8F" stroke-width="4" stroke-linecap="round"/></svg>' +
    "<h3>Jelajahi jalan kampung</h3><p>Street View membuka foto 360° Google di sekitar Kampung Marga Mulya. Ketersediaan foto bergantung pada liputan Google di Semangga." +
    (hasKoord ? "" : " Bila belum langsung tampil, seret ikon orang kuning di Google Maps ke jalan berwarna biru.") + "</p>" + mapBtn(gm.street, "Buka Street View", "person", true) + "</div>";
  var tabs = $("#mapTabs");
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-tab]"); if (b) showTab(b.dataset.tab);
  });
  function showTab(t) {
    tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.tab === t ? "true" : "false"); });
    ["drone", "satelit", "jalan", "street"].forEach(function (p) { $("#panel-" + p).hidden = p !== t; });
    if (t === "satelit") frame("satelit", "k");
    if (t === "jalan") frame("jalan", "m");
    if (t === "drone") drawSketch();
  }

  var ortho = $("#ortho"), canvas = $("#sketch");
  if (PT.ortofoto) {
    ortho.onload = function () { ortho.hidden = false; canvas.hidden = true; $("#mapTag").textContent = "Ortofoto drone · " + PT.tanggalTerbang; };
    ortho.onerror = drawSketch;
    ortho.src = PT.ortofoto;
  }
  // Selama ortofoto belum ada, peta Google satelit tampil lebih dulu di halaman.
  showTab(PT.ortofoto ? "drone" : "satelit");
  var rT; window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { if (!canvas.hidden) drawSketch(); }, 150); });

  // Peta sketsa sementara (warna biru): petak sawah, jalan, saluran irigasi, permukiman.
  function drawSketch() {
    var box = canvas.parentElement.getBoundingClientRect();
    if (!box.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.round(box.width), H = Math.round(box.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    var c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    var seed = 7; var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, W, H);
    var tones = ["#EEF4FD", "#E2ECFB", "#D3E3FA", "#C5DAF8", "#B7D0F5", "#DCE8FB", "#CADDF8"];
    var cw = W / 9, ch = H / 7;
    c.save(); c.translate(W / 2, H / 2); c.rotate(-0.08); c.translate(-W / 2, -H / 2);
    for (var gx = -1; gx < 11; gx++) for (var gy = -1; gy < 9; gy++) {
      var cols = 2 + Math.floor(rnd() * 3);
      for (var k = 0; k < cols; k++) { c.fillStyle = tones[Math.floor(rnd() * tones.length)]; c.fillRect(gx * cw + k * cw / cols + 1, gy * ch + 1, cw / cols - 2, ch - 2); }
    }
    c.restore();
    var roadY = function (x) { return H * 0.47 + Math.sin(x / W * 3.1) * H * 0.05; };
    c.fillStyle = "#FFFFFF"; c.fillRect(W * 0.3, H * 0.33, W * 0.42, H * 0.36);
    for (var i = 0; i < 90; i++) {
      var x = W * 0.3 + rnd() * W * 0.42, y = H * 0.34 + rnd() * H * 0.34;
      if (Math.abs(y - roadY(x)) < 9) continue;
      c.fillStyle = rnd() > 0.5 ? "#1452C2" : (rnd() > 0.5 ? "#7AAAF2" : "#0B3A8F");
      c.fillRect(x, y, 7 + rnd() * 6, 6 + rnd() * 5);
    }
    c.strokeStyle = "#1452C2"; c.lineWidth = 4; c.beginPath();
    c.moveTo(W * 0.1, H * 1.02); c.bezierCurveTo(W * 0.4, H * 0.8, W * 0.7, H * 0.85, W * 1.02, H * 0.62); c.stroke();
    c.strokeStyle = "#9DBDF0"; c.lineWidth = 6; c.beginPath();
    for (var xx = 0; xx <= W; xx += 8) { var yy = roadY(xx); if (xx === 0) c.moveTo(xx, yy); else c.lineTo(xx, yy); } c.stroke();
    c.lineWidth = 4; c.beginPath(); c.moveTo(W * 0.52, 0); c.lineTo(W * 0.5, roadY(W * 0.5)); c.lineTo(W * 0.46, H); c.stroke();
    c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(W * 0.3, roadY(W * 0.3)); c.lineTo(W * 0.26, H * 0.12); c.stroke();
    c.beginPath(); c.moveTo(W * 0.7, roadY(W * 0.7)); c.lineTo(W * 0.76, H * 0.95); c.stroke();
  }

  /* =================== VIDEO =================== */
  var V = D.video, vb = $("#videoBox");
  $("#videoJudul").textContent = V.judul; $("#videoDesk").textContent = V.deskripsi;
  var poster = V.poster ? '<img src="' + esc(V.poster) + '" alt="">' : (V.youtubeId ? '<img src="https://img.youtube.com/vi/' + esc(V.youtubeId) + '/hqdefault.jpg" alt="">' : "");
  if (V.fileLokal) {
    vb.innerHTML = '<video controls preload="metadata"' + (V.poster ? ' poster="' + esc(V.poster) + '"' : "") + '><source src="' + esc(V.fileLokal) + '" type="video/mp4">Peramban Anda tidak mendukung video.</video>';
  } else if (V.youtubeId) {
    // Pemutar YouTube tertanam: video diputar langsung di halaman ini.
    vb.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(V.youtubeId) + '?rel=0&playsinline=1" title="' + esc(V.judul) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    vb.insertAdjacentHTML("afterend", '<p class="video__alt"><a href="https://youtu.be/' + encodeURIComponent(V.youtubeId) + '" target="_blank" rel="noopener">' + ic("video") + "Tonton juga di YouTube</a></p>");
  } else {
    vb.innerHTML = '<button class="video__poster" type="button"' + act(function () {
      openModal({ kat: "Video profil", title: "Video sedang disiapkan", html: "<p>Video profil Kampung Marga Mulya sedang diproduksi oleh Tim Ekspedisi Patriot IPB University bersama warga. Setelah diunggah ke YouTube, video akan diputar langsung di sini.</p>" });
    }) + '><div><span class="video__play">' + ic("play") + "</span><b>Video profil sedang disiapkan</b><small>Ketuk untuk info</small></div></button>";
  }

  /* =================== LAYANAN =================== */
  $("#layananList").innerHTML = D.layanan.map(function (l) {
    return '<button type="button" class="svc tap"' + act(function () {
      openModal({ kat: "Layanan administrasi", title: l.nama,
        html: "<p><b>Persyaratan:</b></p><ul>" + l.syarat.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
          "<p><b>Lama proses:</b> " + esc(l.waktu) + "<br><b>Jam layanan:</b> " + esc(D.kontak.jamLayanan) + "</p><p>Bawa berkas ke Kantor Kampung Marga Mulya. Pelayanan tidak dipungut biaya.</p>" +
          "<div class='modal__actions'>" + mapBtn(gm.dir, "Petunjuk arah ke kantor", "nav", true) + "</div>" });
    }) + "><span>" + ic("doc") + "</span><span><b>" + esc(l.nama) + "</b><small>" + ic("clock") + esc(l.waktu) + '</small></span><span class="go">' + ic("arrow") + "</span></button>";
  }).join("");
  $("#layanan .lead").insertAdjacentHTML("beforeend", CONTOH);

  /* =================== POTENSI, KEGIATAN, GALERI =================== */
  var ikonPot = { padi: "sprout", daun: "daun", ternak: "ternak", toko: "toko" };
  $("#potensiList").innerHTML = D.potensi.map(function (p) {
    return '<button type="button" class="pot tap"' + act(function () {
      openModal({ kat: "Potensi kampung", title: p.judul, html: "<p>" + esc(p.ket) + "</p><p>" + esc(p.detail) + "</p>" });
    }) + "><span>" + ic(ikonPot[p.ikon] || "sprout") + '</span><b class="pot__t">' + esc(p.judul) + '</b><span class="pot__d">' + esc(p.ket) + "</span></button>";
  }).join("");
  $("#kegiatan").innerHTML = D.kegiatan.map(function (k) {
    return '<li><button type="button" class="reset tap"' + act(function () {
      openModal({ kat: "Kegiatan Ekspedisi Patriot " + k.tanggal, title: k.judul, html: "<p>" + esc(k.ket) + "</p><p class='small'>Bagian dari kerja sama Tim Ekspedisi Patriot IPB University dengan Pemerintah Kampung Marga Mulya.</p>" });
    }) + "><time>" + esc(k.tanggal) + "</time><b>" + esc(k.judul) + '</b><span class="tl__d">' + esc(k.ket) + "</span></button></li>";
  }).join("");
  $("#gallery").innerHTML = D.galeri.map(function (g) {
    return '<button type="button"' + act(function () {
      openModal({ kat: "Galeri", title: g.caption, html: g.src ? '<img class="modal__img" src="' + esc(g.src) + '" alt="' + esc(g.caption) + '">' : "<p>Foto untuk kegiatan ini akan segera ditambahkan.</p>" });
    }) + ">" + (g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy">' : '<span class="ph">' + ic("image") + "</span>") + '<span class="cap">' + esc(g.caption) + "</span></button>";
  }).join("");

  /* =================== KONTAK & SOSMED =================== */
  var K = D.kontak;
  var kontak = [
    ["pin", "Alamat", K.alamat, function () { openModal({ kat: "Kontak", title: "Alamat kantor", html: "<p>" + esc(K.alamat) + "</p><div class='modal__actions'>" + mapBtn(gm.open, "Buka di Google Maps", "pin", true) + mapBtn(gm.dir, "Petunjuk arah", "nav") + "</div>" }); }],
    ["phone", "Telepon / WhatsApp", K.telepon, function () { copy(K.telepon); }],
    ["mail", "Email", K.email, function () { copy(K.email); }],
    ["clock", "Jam layanan", K.jamLayanan, function () { openModal({ kat: "Kontak", title: "Jam layanan", html: "<p>" + esc(K.jamLayanan) + ". Di luar jam tersebut, hubungi perangkat kampung melalui telepon/WhatsApp.</p>" }); }]
  ];
  $("#kontakList").innerHTML = kontak.map(function (k) {
    return '<li><button type="button" class="tap"' + act(k[3]) + "><span>" + ic(k[0]) + "</span><span><small>" + esc(k[1]) + "</small><b>" + esc(k[2]) + "</b></span></button></li>";
  }).join("");

  var ikonSos = { Facebook: "thumb", Instagram: "camera", YouTube: "video", TikTok: "note", WhatsApp: "chat" };
  // Akun media sosial yang sudah ada ditulis langsung di daftar kontak (nama akun + tautan).
  $("#kontakList").insertAdjacentHTML("beforeend", D.sosmed.filter(function (s) { return s.url; }).map(function (s) {
    return '<li><a class="tap" href="' + esc(s.url) + '" target="_blank" rel="noopener"><span>' + ic(ikonSos[s.nama] || "globe") + "</span><span><small>" + esc(s.nama) + "</small><b>" + esc(s.akun) + '</b></span><span class="go">' + ic("external") + "</span></a></li>";
  }).join(""));
  var sos = D.sosmed.slice().sort(function (a, b) { return (b.url ? 1 : 0) - (a.url ? 1 : 0); }).map(function (s) {
    if (s.url) return '<a class="is-linked" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.nama + " " + s.akun) + '">' + ic(ikonSos[s.nama] || "globe") + '<span class="soc__n">' + esc(s.nama) + '</span><span class="soc__a">' + esc(s.akun) + "</span></a>";
    return '<button type="button" class="is-empty"' + act(function () {
      openModal({ kat: "Media sosial", title: s.nama + " kampung", html: "<p>Akun " + esc(s.nama) + " resmi Kampung Marga Mulya belum ditautkan. Setelah akun dibuat, tautannya akan tersedia di sini.</p><p class='small'>Untuk pengelola: isi kolom url " + esc(s.nama) + " di file data.js.</p>" });
    }) + ">" + ic(ikonSos[s.nama] || "globe") + esc(s.nama) + "</button>";
  }).join("");
  $("#sosmed").innerHTML = sos; $("#sosmedFoot").innerHTML = sos;

  $("#collabText").textContent = D.kerjaSama.ringkas;
  $("#collabKetua").textContent = "Ketua Tim Ekspedisi Patriot IPB University: " + D.kerjaSama.ketuaTim;
  $("#footMeta").textContent = "Data diperbarui " + D.meta.diperbarui + " · © " + D.kerjaSama.tahun + " Pemerintah Kampung Marga Mulya";
  /* =================== WISATA & KULINER =================== */
  (function () {
    var track = $("#wisataTrack"); if (!track) return;
    var KAT = {
      "Wisata alam": { ic: "tree", c: "#0B3A8F" }, "Pantai": { ic: "wave", c: "#1452C2" },
      "Pemancingan & air": { ic: "fish", c: "#2563D6" }, "Sejarah & religi": { ic: "monument", c: "#082A66" },
      "Taman keluarga": { ic: "sprout", c: "#346FDE" }, "Kuliner": { ic: "fork", c: "#4A7FE2" }
    };
    var W = null, aktif = "Semua", markers = {}, map = null, pusat = null;
    var fmtKm = function (k) { return k == null ? "–" : "± " + k.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " km"; };
    var fmtMnt = function (m) { if (m == null) return "–"; return m < 60 ? "± " + m + " menit" : "± " + Math.floor(m / 60) + " jam" + (m % 60 ? " " + (m % 60) + " menit" : ""); };
    var gmCari = function (t) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(t.nama + ", " + (t.perkiraan || t.lat == null ? t.area : "Merauke")); };
    var gmRute = function (t) {
      var dest = (!t.perkiraan && t.lat != null) ? t.lat + "," + t.lng : t.nama + ", " + t.area;
      return "https://www.google.com/maps/dir/?api=1&origin=" + pusat.lat + "," + pusat.lng + "&destination=" + encodeURIComponent(dest);
    };
    var daftar = function () { return W.tempat.filter(function (t) { return aktif === "Semua" || t.kategori === aktif || (aktif === "Pemancingan & air" && (t.tag || []).indexOf("pemancingan") > -1); }); };

    function kartu(t) {
      var k = KAT[t.kategori] || { ic: "pin" };
      var foto = t.foto ? '<img src="' + esc(t.foto) + '" alt="' + esc(t.nama) + '" loading="lazy" referrerpolicy="no-referrer">' : "";
      var ph = '<span class="ncard__ph"' + (t.foto ? " hidden" : "") + ">" + ic(k.ic) + "<span>" + esc(t.kategori) + "</span><b>" + esc(t.nama) + "</b></span>";
      var kredit = t.kreditFoto ? '<span class="wcard__credit">Foto: ' + esc(t.kreditFoto) + "</span>" : "";
      return '<article class="ncard wcard">' +
        '<button type="button" class="wcard__top" data-fokus="' + esc(t.id) + '" aria-label="Lihat ' + esc(t.nama) + ' di peta">' +
        '<span class="ncard__cover">' + foto + ph + '<span class="ncard__badge">' + esc(t.kategori) + "</span>" + kredit + "</span>" +
        '<span class="ncard__body"><span class="ncard__meta">' + esc(t.area) + '</span><span class="ncard__t">' + esc(t.nama) + "</span>" +
        '<span class="wcard__dist"><span>' + ic("route") + fmtKm(t.jarak_km) + "</span><span>" + ic("clock") + fmtMnt(t.waktu_menit) + "</span></span>" +
        '<span class="ncard__d">' + esc(t.deskripsi) + "</span>" +
        (t.jam || t.tiket ? '<span class="wcard__info">' + (t.jam ? "Buka " + esc(t.jam) : "") + (t.jam && t.tiket ? " · " : "") + (t.tiket ? "Tiket " + esc(t.tiket) : "") + "</span>" : "") +
        "</span></button>" +
        '<span class="wcard__act"><a href="' + esc(gmCari(t)) + '" target="_blank" rel="noopener">' + ic("pin") + 'Google Maps</a><a href="' + esc(gmRute(t)) + '" target="_blank" rel="noopener">' + ic("nav") + "Rute</a></span></article>";
    }

    function render() {
      var list = daftar();
      track.innerHTML = list.map(kartu).join("");
      track.scrollLeft = 0; nav();
      $("#wisataList").innerHTML = list.map(function (t, i) {
        return '<li><button type="button" data-fokus="' + esc(t.id) + '"><span class="dlist__no" style="background:' + ((KAT[t.kategori] || {}).c || "#1452C2") + '">' + (W.tempat.indexOf(t) + 1) + '</span><span class="dlist__n"><b>' + esc(t.nama) + "</b><small>" + esc(t.kategori) + (t.perkiraan ? " · lokasi perkiraan" : "") + '</small></span><span class="dlist__d"><b>' + fmtKm(t.jarak_km) + "</b><small>" + fmtMnt(t.waktu_menit) + "</small></span></button></li>";
      }).join("");
      Object.keys(markers).forEach(function (id) {
        var vis = list.some(function (t) { return t.id === id; });
        if (map) { if (vis) markers[id].addTo(map); else markers[id].remove(); }
      });
    }

    // Slider berputar (sama seperti slider berita)
    var prev = $("#wisataPrev"), next = $("#wisataNext"), count = $("#wisataCount");
    var step = function () { var c = track.querySelector(".ncard"); return c ? c.getBoundingClientRect().width + 16 : 300; };
    var atS = function () { return track.scrollLeft <= 2; }, atE = function () { return track.scrollLeft >= track.scrollWidth - track.clientWidth - 2; };
    function nav() {
      var n = track.children.length, first = Math.round(track.scrollLeft / step()) + 1, vis = Math.max(1, Math.round(track.clientWidth / step()));
      count.textContent = n ? first + "–" + Math.min(n, first + vis - 1) + " dari " + n : "";
    }
    next.addEventListener("click", function () { atE() ? track.scrollTo({ left: 0, behavior: "smooth" }) : track.scrollBy({ left: step(), behavior: "smooth" }); });
    prev.addEventListener("click", function () { atS() ? track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }) : track.scrollBy({ left: -step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { requestAnimationFrame(nav); }, { passive: true });
    window.addEventListener("resize", nav);
    var tx = null, edge = "";
    track.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; edge = atE() ? "e" : (atS() ? "s" : ""); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (edge === "e" && dx < -40) track.scrollTo({ left: 0, behavior: "smooth" });
      if (edge === "s" && dx > 40) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    }, { passive: true });
    track.addEventListener("error", function (e) {
      if (e.target.tagName === "IMG") { var c = e.target.parentNode; e.target.remove(); var ph = c.querySelector(".ncard__ph"); if (ph) ph.hidden = false; var cr = c.querySelector(".wcard__credit"); if (cr) cr.remove(); }
    }, true);

    function fokus(id) {
      var t = W.tempat.filter(function (x) { return x.id === id; })[0]; if (!t) return;
      if (map && markers[id]) {
        if (window.MM_ROUTE) window.MM_ROUTE("wisatakuliner", true);
        $("#wisataMap").scrollIntoView({ behavior: "smooth", block: "center" });
        map.flyTo([t.lat, t.lng], Math.max(map.getZoom(), 13), { duration: .8 });
        setTimeout(function () { markers[id].openPopup(); }, 850);
      } else {
        openModal({ kat: t.kategori, title: t.nama, html: "<p>" + esc(t.deskripsi) + "</p><div class='modal__actions'>" + mapBtn(gmCari(t), "Google Maps", "pin", true) + mapBtn(gmRute(t), "Rute dari Marga Mulya", "nav") + "</div>" });
      }
    }
    document.addEventListener("click", function (e) { var b = e.target.closest("[data-fokus]"); if (b) fokus(b.getAttribute("data-fokus")); });

    function petakan() {
      var el = $("#wisataMap");
      if (!window.L) { el.innerHTML = '<p class="wmap__load">Peta tidak dapat dimuat. Gunakan tombol Google Maps pada setiap tempat.</p>'; return; }
      el.innerHTML = "";
      map = L.map(el, { scrollWheelZoom: false, tap: true }).setView([pusat.lat, pusat.lng], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; kontributor OpenStreetMap" }).addTo(map);
      var home = L.marker([pusat.lat, pusat.lng], { icon: L.divIcon({ className: "", html: '<span class="mk mk--home"><svg class="ic"><use href="#i-home"/></svg></span>', iconSize: [36, 36], iconAnchor: [18, 18] }), zIndexOffset: 1000 })
        .addTo(map).bindPopup("<b>" + esc(pusat.nama) + "</b><br>Titik awal perhitungan jarak");
      var b = [[pusat.lat, pusat.lng]];
      W.tempat.forEach(function (t, i) {
        if (t.lat == null) return;
        var k = KAT[t.kategori] || {};
        var m = L.marker([t.lat, t.lng], { icon: L.divIcon({ className: "", html: '<span class="mk" style="background:' + (k.c || "#1452C2") + '">' + (i + 1) + "</span>", iconSize: [28, 28], iconAnchor: [14, 14] }) });
        m.bindPopup('<div class="mpop">' + (t.foto ? '<img src="' + esc(t.foto) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : "") + "<small>" + esc(t.kategori) + "</small><b>" + esc(t.nama) + "</b><span>" + fmtKm(t.jarak_km) + " · " + fmtMnt(t.waktu_menit) + " dari Marga Mulya" + (t.perkiraan ? "<br><i>Lokasi perkiraan</i>" : "") + '</span><span class="mpop__a"><a href="' + esc(gmCari(t)) + '" target="_blank" rel="noopener">Google Maps</a><a href="' + esc(gmRute(t)) + '" target="_blank" rel="noopener">Rute</a></span></div>', { maxWidth: 240 });
        m.addTo(map); markers[t.id] = m; b.push([t.lat, t.lng]);
      });
      map.fitBounds(b, { padding: [24, 24] });
      (window.MM_MAPS = window.MM_MAPS || []).push({ el: el, map: map, fit: function () { map.invalidateSize(); map.fitBounds(b, { padding: [24, 24] }); } });
      el.addEventListener("click", function () { map.scrollWheelZoom.enable(); }, { once: true });
    }

    fetch("data/wisata.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      W = j; pusat = j.pusat;
      var kats = ["Semua"].concat(Object.keys(KAT).filter(function (k) { return j.tempat.some(function (t) { return t.kategori === k; }); }));
      $("#wisataFilter").innerHTML = kats.map(function (k) { return '<button type="button" class="chipbtn" aria-pressed="' + (k === "Semua") + '" data-kat="' + esc(k) + '">' + (KAT[k] ? ic(KAT[k].ic) : "") + esc(k) + "</button>"; }).join("");
      $("#wisataFilter").addEventListener("click", function (e) {
        var c = e.target.closest("[data-kat]"); if (!c) return; aktif = c.getAttribute("data-kat");
        this.querySelectorAll("[data-kat]").forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        render();
      });
      petakan(); render();
      $("#wisataNote").innerHTML = "Jarak dan waktu adalah perkiraan rute jalan dari pusat Kampung Marga Mulya (data OpenStreetMap) dan dapat berbeda sesuai kondisi jalan. Jam buka dan harga tiket dapat berubah. Sumber informasi dan foto destinasi: visitmerauke.com, tempatrenang.com, Wikivoyage, dan Kompas.com.";
    }).catch(function () { track.innerHTML = '<p class="small">Data wisata belum dapat dimuat.</p>'; });
  })();
  /* =================== FASILITAS UMUM =================== */
  (function () {
    var track = $("#fasilTrack"); if (!track) return;
    var KAT = {
      "Pendidikan": { ic: "school", c: "#0B3A8F" }, "Ibadah": { ic: "home", c: "#082A66" }, "Kesehatan": { ic: "health", c: "#1452C2" },
      "Air bersih": { ic: "drop", c: "#2563D6" }, "Pemerintahan": { ic: "users", c: "#346FDE" }, "Pertanian": { ic: "sprout", c: "#1046A8" },
      "Olahraga": { ic: "ball", c: "#4A7FE2" }, "Ekonomi": { ic: "toko", c: "#5B8BE6" }
    };
    var JENIS_IC = { "Gereja": "church", "Gereja Katolik": "church", "Masjid": "mosque", "Musala": "mosque" };
    var STATUS = { "terverifikasi": ["Terverifikasi", "is-ok"], "sebagian": ["Data sebagian", "is-part"], "perlu-data": ["Perlu dilengkapi", "is-need"] };
    var F = null, aktif = "Semua", map = null, markers = {};
    var icon = function (f) { return JENIS_IC[f.jenis] || (KAT[f.kategori] || {}).ic || "pin"; };
    var gmaps = function (f) {
      return (!f.perkiraan && f.lat != null) ? "https://www.google.com/maps/search/?api=1&query=" + f.lat + "," + f.lng
        : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.nama + ", " + f.alamat + ", Merauke");
    };
    var lokasi = function (f) {
      if (f.dalamKampung) return "Di Kampung Marga Mulya";
      return f.jarak_km != null ? "± " + f.jarak_km.toLocaleString("id-ID") + " km · ± " + f.waktu_menit + " menit dari kampung" : "Sekitar Distrik Semangga";
    };
    var daftar = function () {
      return F.fasilitas.filter(function (f) { return aktif === "Semua" || (aktif === "Dalam kampung" ? f.dalamKampung : f.kategori === aktif); })
        .sort(function (a, b) { return (b.dalamKampung - a.dalamKampung) || ((a.jarak_km || 0) - (b.jarak_km || 0)); });
    };
    function kartu(f) {
      var st = STATUS[f.status] || STATUS["perlu-data"];
      var foto = f.foto ? '<img src="' + esc(f.foto) + '" alt="' + esc(f.nama) + '" loading="lazy">' : "";
      var ph = '<span class="ncard__ph"' + (f.foto ? " hidden" : "") + ">" + ic(icon(f)) + "<span>" + esc(f.jenis || f.kategori) + "</span><b>" + esc(f.nama) + "</b></span>";
      return '<article class="ncard wcard fcard">' +
        '<button type="button" class="wcard__top" data-fasil="' + esc(f.id) + '" aria-label="Lihat ' + esc(f.nama) + ' di peta">' +
        '<span class="ncard__cover">' + foto + ph + '<span class="ncard__badge">' + esc(f.kategori) + '</span><span class="fbadge ' + st[1] + '">' + st[0] + "</span></span>" +
        '<span class="ncard__body"><span class="ncard__meta">' + esc(f.jenis || "") + '</span><span class="ncard__t">' + esc(f.nama) + "</span>" +
        '<span class="fcard__loc">' + ic(f.dalamKampung ? "home" : "route") + esc(lokasi(f)) + "</span>" +
        '<span class="fcard__addr">' + esc(f.alamat) + "</span>" +
        '<ul class="fcard__ket">' + (f.keterangan || []).map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>" +
        (f.kontak ? '<span class="fcard__addr">' + ic("mail") + esc(f.kontak) + "</span>" : "") +
        "</span></button>" +
        '<span class="wcard__act"><a href="' + esc(gmaps(f)) + '" target="_blank" rel="noopener">' + ic("pin") + "Google Maps</a>" +
        (f.sumberUrl ? '<a href="' + esc(f.sumberUrl) + '" target="_blank" rel="noopener">' + ic("external") + "Sumber: " + esc(f.sumber) + "</a>" : '<a href="#kontak">' + ic("phone") + "Kirim data</a>") +
        "</span></article>";
    }
    function render() {
      var list = daftar();
      track.innerHTML = list.map(kartu).join(""); track.scrollLeft = 0; nav();
      Object.keys(markers).forEach(function (id) {
        var vis = list.some(function (f) { return f.id === id; });
        if (map) { if (vis) markers[id].addTo(map); else markers[id].remove(); }
      });
    }
    var prev = $("#fasilPrev"), next = $("#fasilNext"), count = $("#fasilCount");
    var step = function () { var c = track.querySelector(".ncard"); return c ? c.getBoundingClientRect().width + 16 : 300; };
    var atS = function () { return track.scrollLeft <= 2; }, atE = function () { return track.scrollLeft >= track.scrollWidth - track.clientWidth - 2; };
    function nav() { var n = track.children.length, first = Math.round(track.scrollLeft / step()) + 1, vis = Math.max(1, Math.round(track.clientWidth / step())); count.textContent = n ? first + "–" + Math.min(n, first + vis - 1) + " dari " + n : ""; }
    next.addEventListener("click", function () { atE() ? track.scrollTo({ left: 0, behavior: "smooth" }) : track.scrollBy({ left: step(), behavior: "smooth" }); });
    prev.addEventListener("click", function () { atS() ? track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }) : track.scrollBy({ left: -step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { requestAnimationFrame(nav); }, { passive: true });
    window.addEventListener("resize", nav);
    var tx = null, edge = "";
    track.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; edge = atE() ? "e" : (atS() ? "s" : ""); }, { passive: true });
    track.addEventListener("touchend", function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null; if (edge === "e" && dx < -40) track.scrollTo({ left: 0, behavior: "smooth" }); if (edge === "s" && dx > 40) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }); }, { passive: true });
    track.addEventListener("error", function (e) { if (e.target.tagName === "IMG") { var c = e.target.parentNode; e.target.remove(); var ph = c.querySelector(".ncard__ph"); if (ph) ph.hidden = false; } }, true);

    function fokus(id) {
      var f = F.fasilitas.filter(function (x) { return x.id === id; })[0]; if (!f) return;
      if (map && markers[id]) {
        $("#fasilMap").scrollIntoView({ behavior: "smooth", block: "center" });
        map.flyTo([f.lat, f.lng], Math.max(map.getZoom(), 15), { duration: .8 });
        setTimeout(function () { markers[id].openPopup(); }, 850);
      } else {
        openModal({ kat: f.kategori, title: f.nama, html: "<p>" + esc(f.alamat) + "</p><ul>" + (f.keterangan || []).map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>" +
          "<p class='small'>Titik lokasi fasilitas ini belum tersedia. Pemerintah kampung dapat mengirimkan koordinat atau tautan Google Maps-nya.</p><div class='modal__actions'>" + mapBtn(gmaps(f), "Cari di Google Maps", "pin", true) + "</div>" });
      }
    }
    document.addEventListener("click", function (e) { var b = e.target.closest("[data-fasil]"); if (b) fokus(b.getAttribute("data-fasil")); });

    function petakan() {
      var el = $("#fasilMap");
      if (!window.L) { el.innerHTML = '<p class="wmap__load">Peta tidak dapat dimuat. Gunakan tombol Google Maps pada setiap fasilitas.</p>'; return; }
      el.innerHTML = "";
      var P = F.pusat;
      map = L.map(el, { scrollWheelZoom: false }).setView([P.lat, P.lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; kontributor OpenStreetMap" }).addTo(map);
      L.marker([P.lat, P.lng], { icon: L.divIcon({ className: "", html: '<span class="mk mk--home"><svg class="ic"><use href="#i-home"/></svg></span>', iconSize: [36, 36], iconAnchor: [18, 18] }), zIndexOffset: 1000 })
        .addTo(map).bindPopup("<b>" + esc(P.nama) + "</b><br>Pusat kampung");
      var b = [[P.lat, P.lng]];
      F.fasilitas.forEach(function (f) {
        if (f.lat == null) return;
        var c = (KAT[f.kategori] || {}).c || "#1452C2";
        var m = L.marker([f.lat, f.lng], { icon: L.divIcon({ className: "", html: '<span class="mk mk--ic" style="background:' + c + '"><svg class="ic"><use href="#i-' + icon(f) + '"/></svg></span>', iconSize: [30, 30], iconAnchor: [15, 15] }) });
        m.bindPopup('<div class="mpop"><small>' + esc(f.jenis || f.kategori) + "</small><b>" + esc(f.nama) + "</b><span>" + esc(f.alamat) + (f.perkiraan ? "<br><i>Lokasi perkiraan</i>" : "") + '</span><span class="mpop__a"><a href="' + esc(gmaps(f)) + '" target="_blank" rel="noopener">Google Maps</a>' + (f.sumberUrl ? '<a href="' + esc(f.sumberUrl) + '" target="_blank" rel="noopener">Sumber</a>' : "") + "</span></div>", { maxWidth: 240 });
        m.addTo(map); markers[f.id] = m; if (f.dalamKampung || (f.jarak_km || 99) < 8) b.push([f.lat, f.lng]);
      });
      map.fitBounds(b, { padding: [30, 30], maxZoom: 15 });
      (window.MM_MAPS = window.MM_MAPS || []).push({ el: el, map: map, fit: function () { map.invalidateSize(); map.fitBounds(b, { padding: [30, 30], maxZoom: 15 }); } });
      el.addEventListener("click", function () { map.scrollWheelZoom.enable(); }, { once: true });
    }

    fetch("data/fasilitas.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      F = j;
      var dalam = j.fasilitas.filter(function (f) { return f.dalamKampung; });
      var kats = Object.keys(KAT).filter(function (k) { return j.fasilitas.some(function (f) { return f.kategori === k; }); });
      $("#fasilSum").innerHTML = kats.map(function (k) {
        var n = dalam.filter(function (f) { return f.kategori === k; }).length, luar = j.fasilitas.filter(function (f) { return f.kategori === k && !f.dalamKampung; }).length;
        return '<button type="button" class="fsum__i" data-fkat="' + esc(k) + '"><span>' + ic(KAT[k].ic) + "</span><b>" + n + "</b><small>" + esc(k) + "</small>" + (luar ? "<i>+" + luar + " di sekitar kampung</i>" : "") + "</button>";
      }).join("");
      var chips = ["Semua", "Dalam kampung"].concat(kats);
      $("#fasilFilter").innerHTML = chips.map(function (k) { return '<button type="button" class="chipbtn" aria-pressed="' + (k === "Semua") + '" data-fkat="' + esc(k) + '">' + (KAT[k] ? ic(KAT[k].ic) : (k === "Dalam kampung" ? ic("home") : "")) + esc(k) + "</button>"; }).join("");
      document.addEventListener("click", function (e) {
        var c = e.target.closest("[data-fkat]"); if (!c) return; aktif = c.getAttribute("data-fkat");
        $("#fasilFilter").querySelectorAll("[data-fkat]").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-fkat") === aktif ? "true" : "false"); });
        render(); if (c.classList.contains("fsum__i")) $("#fasilFilter").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      var hit = function (s_) { return j.fasilitas.filter(function (f) { return f.status === s_; }).length; };
      $("#fasilStatus").innerHTML = [["terverifikasi", "Terverifikasi dari sumber resmi"], ["sebagian", "Ada sumber, data belum lengkap"], ["perlu-data", "Menunggu data dari kampung"]].map(function (s_) {
        return '<li><span class="fbadge ' + STATUS[s_[0]][1] + '">' + STATUS[s_[0]][0] + "</span><b>" + hit(s_[0]) + "</b><small>" + s_[1] + "</small></li>";
      }).join("");
      $("#fasilNote").innerHTML = "Data sekolah bersumber dari Data Referensi Kemendikdasmen; data lain dari pemberitaan dan pemerintah kampung. Fasilitas bertanda <b>Perlu dilengkapi</b> menunggu nama, foto, dan titik lokasi dari Pemerintah Kampung Marga Mulya.";
      petakan(); render();
    }).catch(function () { track.innerHTML = '<p class="small">Data fasilitas belum dapat dimuat.</p>'; });
  })();
})();
