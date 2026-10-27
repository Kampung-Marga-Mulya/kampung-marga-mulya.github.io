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
  var CHIP = ' <span class="chip chip--contoh">contoh</span>';
  var CONTOH = D.meta.dataContoh ? CHIP : "";
  var belumAda = function (v) { return v == null || v === "" || /^\[/.test(String(v)); };
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
  modal.addEventListener("click", function (e) { if (e.target === modal || (e.target.closest && e.target.closest('a[href^="#"]'))) closeModal(); });

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
  // Titik Street View: titik di jalan (google.streetView), jika tidak ada pakai koordinat kampung
  var SV = (G.streetView && G.streetView.lat) ? G.streetView : (hasKoord ? id.koordinat : { lat: -8.409726, lng: 140.463722 });
  var gm = {
    open: G.tautan || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(gQuery),
    dir: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(gQuery),
    street: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + SV.lat + "," + SV.lng + "&heading=0&pitch=0&fov=90",
    streetEmbed: "https://www.google.com/maps?layer=c&cbll=" + SV.lat + "," + SV.lng + "&cbp=12,0,0,0,0&hl=id&output=svembed",
    streetLayer: "https://www.google.com/maps/@" + SV.lat + "," + SV.lng + ",17z/data=!5m1!1e5",
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
    { ic: "users", t: "Penduduk", v: num(P.total), s: "jiwa", info: "Jumlah penduduk Kampung Marga Mulya menurut monografi kampung per 30 September 2026: " + num(P.laki) + " laki-laki dan " + num(P.perempuan) + " perempuan." },
    { ic: "home", t: "Kepala keluarga", v: num(P.kk), s: "KK", info: "Jumlah kepala keluarga terdaftar. Rata-rata " + (P.total / P.kk).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jiwa per keluarga." },
    { ic: "layers", t: "Luas wilayah", v: num(Math.round(id.luasHa)), s: "hektare", info: "Luas wilayah Kampung Marga Mulya " + id.luas + " menurut monografi kampung. Peta resmi wilayah: " + id.petaResmi + "." },
    { ic: "pin", t: "Wilayah", v: id.jumlahRW + " RW", s: id.jumlahRT + " RT", info: "Kampung Marga Mulya terbagi atas " + id.jumlahRW + " rukun warga (RW) dan " + id.jumlahRT + " rukun tetangga (RT). Kode wilayah Kemendagri " + id.kodeWilayah + ", kode pos " + id.kodePos + "." }
  ];
  $("#facts").innerHTML = facts.map(function (f) {
    return '<button type="button" class="fact tap"' + act(function () { openModal({ kat: "Beranda", title: f.t + ": " + f.v, html: "<p>" + esc(f.info) + "</p>" }); }) +
      '><span class="fact__t">' + ic(f.ic) + esc(f.t) + '</span><span class="fact__v">' + esc(f.v) + "<small>" + esc(f.s) + "</small></span></button>";
  }).join("");
  document.querySelectorAll(".fact").forEach(function (b, i) { if (facts[i].code) b.classList.add("fact--code"); });

  var quick = [
    ["#tentang", "home", "Profil kampung", "Sejarah, identitas, visi misi, dan batas wilayah"],
    ["#pemerintahan", "users", "Pemerintahan", "Struktur organisasi, Bamuskam, dan lembaga"],
    ["#penduduk", "chart", "Data penduduk", "Usia, kesejahteraan, pekerjaan, pendidikan, suku"],
    ["#fasilitas", "school", "Sarana & fasilitas", "Sarana prasarana kampung dan peta fasilitas"],
    ["#apbkam", "wallet", "Transparansi anggaran", "APBKam dan realisasi per bidang"],
    ["#indeksdesa", "gauge", "Indeks Desa", "Status perkembangan kampung"],
    ["#petakampung", "pin", "Peta kampung", "Peta drone, satelit, dan Street View"],
    ["#wisatakuliner", "route", "Wisata & kuliner", "Tempat rekreasi dan makan 1–2 jam dari kampung"],
    ["#surat", "doc", "Layanan surat", "Persyaratan dan lama proses surat"],
    ["#media", "video", "Video & galeri", "Video profil dan dokumentasi kegiatan"],
    ["#potensi", "sprout", "Potensi kampung", "Lahan, ternak, BUMKam, dan usaha warga"],
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
    ["Kode wilayah", id.kodeWilayah], ["Kode pos", id.kodePos], ["Tahun dibentuk", id.tahunBerdiri], ["Dasar hukum", id.dasarHukum],
    ["Luas wilayah", id.luas], ["Wilayah", id.jumlahRW + " RW · " + id.jumlahRT + " RT"],
    ["Tipologi", id.tipologi], ["Klasifikasi", id.klasifikasi], ["Kategori", id.kategori], ["Komoditas unggulan", id.komoditasUnggulan],
    ["Peta resmi", id.petaResmi], ["Koordinat", id.koordinatTeks || (hasKoord ? id.koordinat.lat + ", " + id.koordinat.lng : "")], ["Zona waktu", id.zonaWaktu]
  ].filter(function (r) { return !belumAda(r[1]); }).map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  if (id.orbitasi || id.pertanahan) {
    var orb = (id.orbitasi || []).map(function (o) { return [o.km + " km", "ke " + o.label]; });
    var tn = id.pertanahan ? [[num(id.pertanahan.sertifikat), "sertifikat tanah"], [id.pertanahan.tanahKasHa + " ha", "tanah kas kampung"], [id.pertanahan.waduk + " unit", "waduk / danau / situ"]] : [];
    $("#identitas").insertAdjacentHTML("afterend", '<h3 class="mt-s">Jarak tempuh</h3><div class="tiles tiles--3">' + orb.map(function (o) { return '<div class="tile"><b>' + esc(o[0]) + "</b><span>" + esc(o[1]) + "</span></div>"; }).join("") + "</div>" +
      '<h3 class="mt-s">Pertanahan</h3><div class="tiles tiles--3">' + tn.map(function (o) { return '<div class="tile"><b>' + esc(o[0]) + "</b><span>" + esc(o[1]) + "</span></div>"; }).join("") + "</div>");
  }
  $("#visi").textContent = D.visi;
  if (D.visiContoh) $("#visi").insertAdjacentHTML("beforeend", CHIP);
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
    openModal({ kat: "Pemerintah Kampung", title: o.jabatan, html: foto + "<p><b>" + esc(o.nama) + "</b>" + (o.pendidikan ? " · pendidikan terakhir " + esc(o.pendidikan) : "") + "</p><p>" + esc(o.tugas || "") + "</p>" + (o.kontak ? "<p>Kontak: " + esc(o.kontak) + "</p>" : "") });
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
    row("Kepala urusan", S.kaur) + row("Kepala seksi", S.kasi) + row("Kewilayahan", S.kewilayahan);
  if (S.jumlah) $("#org").insertAdjacentHTML("afterend", '<div class="tiles tiles--3 mt-s">' + S.jumlah.map(function (j) { return '<div class="tile"><b>' + num(j.jumlah) + "</b><span>" + esc(j.label) + "</span></div>"; }).join("") + "</div>");
  $("#bamuskam").innerHTML = S.bamuskam.map(function (o) {
    return '<li><button type="button" class="tap"' + act(function () {
      openModal({ kat: "Badan Musyawarah Kampung", title: o.jabatan, html: "<p><b>" + esc(o.nama) + "</b>" + (o.ket ? " — " + esc(o.ket) : "") + "</p><p>Bamuskam menampung aspirasi warga, membahas dan menyepakati rancangan peraturan kampung bersama Kepala Kampung, serta mengawasi kinerja pemerintah kampung.</p>" });
    }) + "><span>" + esc(o.jabatan) + "</span><span>" + esc(o.nama) + "</span></button></li>";
  }).join("");
  $("#lembaga").innerHTML = S.lembaga.map(function (o) {
    return '<li><button type="button" class="tap"' + act(function () {
      openModal({ kat: "Lembaga kemasyarakatan", title: o.nama, html: "<p>" + esc(o.ket) + ".</p>" + (o.detail ? "<p>" + esc(o.detail) + "</p>" : "") + (o.ketua && !belumAda(o.ketua) ? "<p>Pimpinan: <b>" + esc(o.ketua) + "</b></p>" : "") });
    }) + "><span>" + esc(o.nama) + "</span><span>" + esc(o.ket) + "</span></button></li>";
  }).join("");

  /* =================== DIAGRAM LINGKARAN (donat) ===================
     Maks. 6 irisan; sisanya digabung "Lainnya". Warna: biru (identitas tema). */
  var PAL_KAT = ["#082A66", "#1452C2", "#5B8DE6", "#9DBCF2", "#0F7FB8", "#C9DBF8"];
  var PAL_URUT = ["#C9DBF8", "#9DBCF2", "#5B8DE6", "#1452C2", "#0B3A8F", "#082A66"];
  function ringkas(list, n) {
    // Kategori bernama "Lainnya" di data asli selalu masuk ke irisan gabungan
    var lain = list.filter(function (x) { return /^lain/i.test(x.label); });
    var urut = list.filter(function (x) { return lain.indexOf(x) < 0; }).sort(function (a, b) { return b.jumlah - a.jumlah; });
    if (urut.length + (lain.length ? 1 : 0) <= n) return urut.concat(lain);
    var sisa = urut.slice(n - 1).concat(lain);
    return urut.slice(0, n - 1).concat([{ label: "Lainnya", jumlah: sum(sisa, "jumlah"), isi: sisa }]);
  }
  function donut(sel, list, o) {
    o = o || {};
    var el = $(sel); if (!el) return;
    var fmt = o.fmt || num, satuan = o.satuan || "", tot = sum(list, "jumlah");
    var pal = o.warna || (o.urut ? list.map(function (_, i) { return PAL_URUT[list.length > 1 ? Math.round(i * (PAL_URUT.length - 1) / (list.length - 1)) : 3]; }) : PAL_KAT);
    var R = 42, C = 2 * Math.PI * R, gap = list.length > 1 ? 1.4 : 0, off = 0;
    var arcs = list.map(function (x, i) {
      var len = x.jumlah / tot * C, vis = Math.max(0.01, len - gap);
      var a = '<circle class="donut__seg" data-i="' + i + '" cx="60" cy="60" r="' + R + '" stroke="' + pal[i % pal.length] + '" stroke-dasharray="' + vis.toFixed(2) + " " + (C - vis).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 60 60)"><title>' + esc(x.label) + ": " + fmt(x.jumlah) + (satuan ? " " + satuan : "") + " (" + pct(x.jumlah, tot) + "%)</title></circle>";
      off += len; return a;
    }).join("");
    var tengah = o.tengah || [fmt(tot), o.tengahLabel || "total"];
    var info = function (x) {
      var isi = x.isi ? "<p>Termasuk: " + x.isi.map(function (y) { return esc(y.label) + " (" + fmt(y.jumlah) + ")"; }).join(", ") + ".</p>" : "";
      openModal({ kat: o.kat || "Diagram", title: x.label, html: '<div class="mini-stat"><div><b>' + fmt(x.jumlah) + "</b><span>" + esc(satuan || "Jumlah") + "</span></div><div><b>" + pct(x.jumlah, tot) + "%</b><span>Porsi</span></div><div><b>" + fmt(tot) + "</b><span>Total</span></div></div>" + isi });
    };
    el.innerHTML = '<div class="donut"><div class="donut__fig"><svg viewBox="0 0 120 120" role="img" aria-label="' + esc(o.kat || "Diagram lingkaran") + '"><circle cx="60" cy="60" r="' + R + '" class="donut__bg"/>' + arcs +
      '<text x="60" y="58" text-anchor="middle" class="donut__v' + (String(tengah[0]).length > 6 ? " donut__v--s" : "") + '">' + esc(tengah[0]) + '</text><text x="60" y="73" text-anchor="middle" class="donut__l">' + esc(tengah[1]) + "</text></svg></div>" +
      '<ul class="donut__lgd">' + list.map(function (x, i) {
        return '<li><button type="button" class="tap" data-i="' + i + '"' + act(function () { info(x); }) + '><span class="sw" style="background:' + pal[i % pal.length] + '"></span><span class="donut__n">' + esc(x.label) + '</span><span class="donut__p"><b>' + pct(x.jumlah, tot, 1) + "%</b><small>" + fmt(x.jumlah) + (satuan ? " " + esc(satuan) : "") + "</small></span></button></li>";
      }).join("") + "</ul></div>";
    var segs = el.querySelectorAll(".donut__seg"), items = el.querySelectorAll(".donut__lgd button");
    var sorot = function (i) {
      segs.forEach(function (s, j) { s.classList.toggle("is-dim", i != null && j !== i); });
      items.forEach(function (b, j) { b.classList.toggle("is-on", i != null && j === i); });
      var t = el.querySelector(".donut__v"), l = el.querySelector(".donut__l");
      if (i == null) { t.textContent = tengah[0]; l.textContent = tengah[1]; }
      else { t.textContent = pct(list[i].jumlah, tot, 1) + "%"; l.textContent = list[i].label.length > 16 ? list[i].label.slice(0, 15) + "…" : list[i].label; }
    };
    segs.forEach(function (s, i) {
      s.addEventListener("mouseenter", function () { sorot(i); });
      s.addEventListener("mouseleave", function () { sorot(null); });
      s.addEventListener("click", function () { info(list[i]); });
    });
    items.forEach(function (b, i) {
      b.addEventListener("mouseenter", function () { sorot(i); });
      b.addEventListener("mouseleave", function () { sorot(null); });
      b.addEventListener("focus", function () { sorot(i); });
      b.addEventListener("blur", function () { sorot(null); });
    });
  }

  /* =================== KEPENDUDUKAN =================== */
  $("#dataSumber").textContent = "Sumber: " + D.meta.sumberData + ". Ketuk angka atau grafik untuk rincian.";
  var stats = [
    [num(P.total), "Total penduduk", "", "Jumlah seluruh penduduk Kampung Marga Mulya menurut monografi kampung."],
    [num(P.laki), "Laki-laki · " + pct(P.laki, P.total) + "%", "", "Penduduk laki-laki. Rasio jenis kelamin " + Math.round(P.laki / P.perempuan * 100) + " laki-laki per 100 perempuan."],
    [num(P.perempuan), "Perempuan · " + pct(P.perempuan, P.total) + "%", "", "Penduduk perempuan kampung."],
    [num(P.kk), "Kepala keluarga", "", "Jumlah kepala keluarga terdaftar. Rata-rata " + (P.total / P.kk).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jiwa per keluarga."]
  ];
  $("#stats").innerHTML = stats.map(function (s) {
    return '<button type="button" class="stat tap"' + act(function () { openModal({ kat: "Kependudukan", title: s[1].split(" · ")[0] + ": " + s[0], html: "<p>" + esc(s[3]) + "</p>" }); }) +
      "><b>" + s[0] + "</b><span>" + esc(s[1]) + "</span>" + s[2] + "</button>";
  }).join("");

  // Piktogram laki-laki & perempuan (1 ikon ≈ 100 jiwa)
  var nL = Math.round(P.laki / 100), nP = Math.round(P.perempuan / 100);
  $("#picto").setAttribute("aria-label", num(P.laki) + " laki-laki dan " + num(P.perempuan) + " perempuan");
  $("#picto").innerHTML = '<div class="picto__row">' + new Array(nL + 1).join('<i class="picto__l">' + ic("person") + "</i>") + '</div><div class="picto__row">' + new Array(nP + 1).join('<i class="picto__p">' + ic("person") + "</i>") + "</div>" +
    '<div class="picto__lbl"><span><b>' + num(P.laki) + "</b> laki-laki</span><span><b>" + num(P.perempuan) + "</b> perempuan</span></div>";

  donut("#dGender", [{ label: "Laki-laki", jumlah: P.laki }, { label: "Perempuan", jumlah: P.perempuan }], { kat: "Jenis kelamin", satuan: "jiwa", tengahLabel: "jiwa", warna: ["#0B3A8F", "#7AAAF2"] });
  // Kelompok usia: diagram lingkaran berurutan (muda → tua)
  var totU = sum(P.kelompokUsia, "jumlah");
  donut("#kelUsia", P.kelompokUsia, { kat: "Kelompok usia", satuan: "jiwa", urut: true, tengahLabel: "jiwa" });
  $("#kelUsia").insertAdjacentHTML("beforeend", '<p class="small">Penduduk usia produktif (18–56 tahun) ' + pct(P.kelompokUsia[1].jumlah, totU, 0) + "%. Jumlah ketiga kelompok di monografi " + num(totU) + " jiwa, selisih " + (P.total - totU) + " jiwa dari total penduduk.</p>");

  // Sekolah dan tenaga kesehatan
  $("#usiaSekolah").innerHTML = P.sekolah.map(function (s) {
    var r = Math.round(s.murid / s.guru);
    return '<button type="button" class="tap"' + act(function () {
      openModal({ kat: "Sekolah di kampung", title: s.label, html: '<div class="mini-stat"><div><b>' + num(s.murid) + "</b><span>Murid</span></div><div><b>" + num(s.guru) + "</b><span>Guru</span></div><div><b>" + r + "</b><span>Murid per guru</span></div></div><p>Data murid dan guru " + esc(s.label.toLowerCase()) + " di Kampung Marga Mulya menurut monografi kampung.</p>" });
    }) + "><b>" + num(s.murid) + "</b><span>Murid " + esc(s.label) + "</span><small>" + num(s.guru) + " guru · " + r + " murid per guru</small></button>";
  }).join("");
  $("#nakes").innerHTML = P.tenagaKesehatan.map(function (t) { return '<span class="nakes__i">' + ic("health") + "<b>" + num(t.jumlah) + "</b>" + esc(t.label) + "</span>"; }).join("");

  function bars(sel, list, kat, fmt, tanpaPorsi) {
    var tot = sum(list, "jumlah"), max = Math.max.apply(null, list.map(function (x) { return x.jumlah; }));
    fmt = fmt || num;
    $(sel).innerHTML = list.map(function (x, i) {
      var rank = list.slice().sort(function (a, b) { return b.jumlah - a.jumlah; }).indexOf(x) + 1;
      return '<button type="button" class="bar tap"' + act(function () {
        openModal({ kat: kat, title: x.label, html: '<div class="mini-stat"><div><b>' + fmt(x.jumlah) + "</b><span>" + (fmt === num ? "Jiwa" : "Jumlah") + "</span></div><div><b>" + pct(x.jumlah, tot) + "%</b><span>Porsi</span></div><div><b>#" + rank + "</b><span>Peringkat</span></div></div>" +
          "<p>" + esc(x.label) + " mencakup " + pct(x.jumlah, tot) + "% dari total " + fmt(tot) + ".</p>" });
      }) + "><span>" + esc(x.label) + '</span><span class="bar__val"><b>' + fmt(x.jumlah) + "</b>" + (tanpaPorsi ? "" : " · " + pct(x.jumlah, tot) + "%") + '</span><span class="bar__track"><span class="bar__fill" style="display:block;width:' + (x.jumlah / max * 100) + '%"></span></span></button>';
    }).join("");
  }
  bars("#pendidikan", P.pendidikan, "Pendidikan terakhir");
  bars("#pekerjaan", P.pekerjaan, "Mata pencaharian");
  bars("#agama", P.agama, "Agama");
  bars("#suku", P.suku, "Suku / etnis");
  bars("#sejahtera", P.kesejahteraan, "Tingkat kesejahteraan keluarga", function (n) { return num(n) + " KK"; });
  donut("#dSejahtera", P.kesejahteraan, { kat: "Tingkat kesejahteraan keluarga", satuan: "KK", urut: true, tengahLabel: "kepala keluarga" });
  donut("#dPekerjaan", ringkas(P.pekerjaan, 6), { kat: "Mata pencaharian", satuan: "orang", tengahLabel: "jiwa" });
  donut("#dSuku", ringkas(P.suku, 6), { kat: "Suku / etnis", satuan: "jiwa", tengahLabel: "jiwa" });
  donut("#dAgama", P.agama, { kat: "Agama", satuan: "jiwa", tengahLabel: "jiwa" });
  // Pendidikan dikelompokkan menjadi 6 jenjang
  var pdk = function (labels) { return sum(P.pendidikan.filter(function (x) { return labels.indexOf(x.label) > -1; }), "jumlah"); };
  var pdkIsi = function (labels) { return P.pendidikan.filter(function (x) { return labels.indexOf(x.label) > -1; }); };
  var JENJANG = [
    ["Belum / tidak sekolah, tidak lulus", ["Tidak / belum sekolah", "Tidak lulus"]],
    ["TK dan SD", ["Taman kanak-kanak", "SD / sederajat"]],
    ["SMP / sederajat", ["SMP / sederajat"]],
    ["SMA / sederajat", ["SMA / sederajat"]],
    ["Perguruan tinggi", ["Akademi / D1–D3", "Sarjana (S1)", "Magister (S2)"]],
    ["Pendidikan keagamaan", ["Pondok pesantren", "Pendidikan keagamaan"]]
  ];
  donut("#dPendidikan", JENJANG.map(function (j) { var isi = pdkIsi(j[1]); return { label: j[0], jumlah: pdk(j[1]), isi: isi.length > 1 ? isi : null }; }), { kat: "Pendidikan terakhir", satuan: "orang", urut: true, tengahLabel: "jiwa" });

  /* =================== ANGGARAN (APBKam) =================== */
  var A = D.apbkam;
  var totPend = sum(A.pendapatan, "jumlah"), totBel = sum(A.belanja, "anggaran"), totReal = sum(A.belanja, "realisasi");
  var adaBelanja = A.belanja.length > 0;
  $("#apbTitle").innerHTML = (adaBelanja ? "APBKam Tahun " + A.tahun : "Keuangan Kampung " + A.tahun) + (A.contoh ? CHIP : "");
  $("#apbLead").textContent = adaBelanja
    ? "Anggaran Pendapatan dan Belanja Kampung Marga Mulya. Realisasi per " + A.realisasiPer + ". Ketuk setiap angka untuk penjelasan."
    : "Pendapatan kampung yang tercatat di " + A.dokumen + ". Rincian belanja per bidang akan ditampilkan setelah Peraturan Kampung tentang APBKam dan laporan realisasinya tersedia.";
  var sumCards = [
    ["Pendapatan tercatat", rpS(totPend), A.pendapatan.length + " sumber", "Pendapatan kampung yang tercatat: " + rp(totPend) + ". Rincian ada di panel sumber pendapatan.", ""],
    ["Pembiayaan", rpS(A.pembiayaan.jumlah), A.pembiayaan.label, A.pembiayaan.label + ": " + rp(A.pembiayaan.jumlah) + ". Sisa lebih perhitungan anggaran tahun sebelumnya yang dipakai pada tahun berjalan.", ""],
    ["Total dana", rpS(totPend + A.pembiayaan.jumlah), "pendapatan + pembiayaan", "Total dana kampung yang tercatat: " + rp(totPend + A.pembiayaan.jumlah) + ".", "blue"],
    adaBelanja
      ? ["Realisasi belanja", pct(totReal, totBel, 0) + "%", rpS(totReal) + " terpakai", "Belanja yang sudah terlaksana sampai " + A.realisasiPer + ": " + rp(totReal) + " dari " + rp(totBel) + ".", ""]
      : ["Belanja", "Belum ada", "rincian belum tersedia", "Monografi kampung belum memuat belanja rutin dan tidak rutin. Rincian akan diisi dari Perkam APBKam dan laporan realisasi.", ""]
  ];
  $("#apbSum").innerHTML = sumCards.map(function (c) {
    return '<button type="button" class="apb-card tap' + (c[4] ? " apb-card--blue" : "") + '"' + act(function () { openModal({ kat: "Keuangan kampung " + A.tahun, title: c[0], html: "<p>" + esc(c[3]) + "</p><p class='small'>Sumber: " + esc(A.dokumen) + ".</p>" }); }) +
      "><span>" + c[0] + "</span><b>" + c[1] + "</b><small>" + esc(c[2]) + "</small></button>";
  }).join("");
  bars("#apbPendapatan", A.pendapatan, "Sumber pendapatan", rpS);
  donut("#dPendapatan", A.pendapatan.concat(A.pembiayaan && A.pembiayaan.jumlah ? [{ label: A.pembiayaan.label + " (pembiayaan)", jumlah: A.pembiayaan.jumlah }] : []),
    { kat: "Sumber dana kampung", fmt: rpS, tengah: [rpS(totPend + (A.pembiayaan ? A.pembiayaan.jumlah : 0)).replace("Rp ", "Rp"), "total dana"] });
  if (A.pendapatanKosong && A.pendapatanKosong.length) $("#apbPendapatan").insertAdjacentHTML("afterend", '<p class="small">Belum tercatat: ' + esc(A.pendapatanKosong.join(", ")) + ".</p>");
  if (A.danaLembaga) bars("#apbLembaga", A.danaLembaga, "Dana lembaga kampung", rpS, true);
  if (!adaBelanja) {
    $("#apbBelanjaNote").textContent = "";
    $("#apbBelanja").innerHTML = '<div class="empty">' + ic("doc") + "<b>Rincian belanja belum tersedia</b><span>Belanja kampung dibagi ke lima bidang: penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, pemberdayaan masyarakat, serta penanggulangan bencana dan keadaan darurat. Angkanya akan ditampilkan setelah dokumen APBKam diterima.</span></div>";
  }
  $("#apbBelanja").insertAdjacentHTML("beforeend", A.belanja.map(function (b, i) {
    var p = pct(b.realisasi, b.anggaran, 0);
    return '<button type="button" class="bid tap"' + act(function () {
      openModal({ kat: "Bidang " + (i + 1) + " · APBKam " + A.tahun, title: b.bidang,
        html: '<div class="mini-stat"><div><b>' + rpS(b.anggaran) + "</b><span>Anggaran</span></div><div><b>" + rpS(b.realisasi) + "</b><span>Realisasi</span></div><div><b>" + p + "%</b><span>Terserap</span></div></div>" +
          '<div class="tablewrap"><table class="tbl"><thead><tr><th>Kegiatan</th><th class="num">Anggaran</th><th class="num">Realisasi</th></tr></thead><tbody>' +
          (b.kegiatan || []).map(function (k) { return "<tr><td>" + esc(k.nama) + '</td><td class="num">' + rpS(k.anggaran) + '</td><td class="num">' + pct(k.realisasi, k.anggaran, 0) + "%</td></tr>"; }).join("") +
          "</tbody></table></div>" });
    }) + '><span class="bid__top"><span>' + (i + 1) + ". " + esc(b.bidang) + "</span><span>" + rpS(b.anggaran) + '</span></span><span class="bid__track" style="display:block"><span class="bid__fill" style="display:block;width:' + p + '%"></span></span><small>Realisasi ' + rpS(b.realisasi) + " · " + p + "% · " + pct(b.anggaran, totBel, 0) + "% dari total belanja</small></button>";
  }).join(""));

  /* =================== INDEKS DESA =================== */
  var I = D.indeksDesa;
  var statusInfo = {
    "Mandiri": "Kampung mampu menyelenggarakan pembangunan secara mandiri dengan layanan dasar, ekonomi, dan tata kelola yang kuat.",
    "Maju": "Kampung memiliki layanan dan potensi ekonomi yang baik dan terus dikembangkan menuju kemandirian.",
    "Berkembang": "Kampung memiliki potensi yang mulai dikelola, tetapi beberapa dimensi masih perlu diperkuat.",
    "Tertinggal": "Kampung masih memiliki keterbatasan pada sejumlah layanan dasar dan akses.",
    "Sangat Tertinggal": "Kampung menghadapi keterbatasan besar pada layanan dasar, ekonomi, dan akses."
  };
  $("#idmLead").innerHTML = esc(I.catatan) + (I.contoh ? CHIP : "");
  var adaNilai = I.nilai != null;
  var URUT = ["Sangat Tertinggal", "Tertinggal", "Berkembang", "Maju", "Mandiri"], posS = URUT.indexOf(I.status);
  var C = 2 * Math.PI * 70, frac = adaNilai ? Math.max(0, Math.min(1, I.nilai / I.skala)) : (posS + 1) / URUT.length;
  $("#idmScore").innerHTML = '<svg class="ring" viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" stroke="rgba(255,255,255,.22)"/>' +
    '<circle cx="85" cy="85" r="70" stroke="#FFFFFF" stroke-linecap="round" stroke-dasharray="' + (C * frac).toFixed(1) + " " + C.toFixed(1) + '" transform="rotate(-90 85 85)"/>' +
    (adaNilai
      ? '<text x="85" y="86" text-anchor="middle" font-size="38" font-weight="700">' + I.nilai.toLocaleString("id-ID") + '</text><text x="85" y="112" text-anchor="middle" font-size="13" opacity=".85">dari ' + I.skala + "</text>"
      : '<text x="85" y="88" text-anchor="middle" font-size="40" font-weight="700">' + (posS + 1) + '</text><text x="85" y="112" text-anchor="middle" font-size="13" opacity=".85">dari 5 tingkat</text>') + "</svg>" +
    '<span class="idm__status">' + esc(I.status) + "</span><small>" + (adaNilai ? "Indeks Desa " + I.tahun : esc(I.sumberStatus || "")) + " · ketuk untuk penjelasan</small>";
  $("#idmScore").setAttribute("data-act", act(function () {
    openModal({ kat: "Indeks Desa " + I.tahun, title: "Status: " + I.status,
      html: "<p>" + esc(statusInfo[I.status] || "") + "</p>" + (adaNilai ? "<p>Nilai Indeks Desa Kampung Marga Mulya tahun " + I.tahun + " adalah <b>" + I.nilai.toLocaleString("id-ID") + "</b> dari " + I.skala + ".</p>" : "<p>Status ini berasal dari " + esc(I.sumberStatus || "data kampung") + (I.klasifikasi ? ", dengan klasifikasi desa <b>" + esc(I.klasifikasi.toLowerCase()) + "</b>" : "") + ". Nilai indeks resmi akan ditampilkan setelah tersedia.</p>") + "<p>" + esc(I.catatan) + "</p><p>Urutan status dari terendah: Sangat Tertinggal, Tertinggal, Berkembang, Maju, Mandiri.</p>" });
  }).replace(/^ data-act="|"$/g, ""));
  var weakest = I.dimensi.some(function (d) { return d.nilai == null; }) ? null : I.dimensi.slice().sort(function (a, b) { return a.nilai - b.nilai; })[0];
  $("#idmDims").innerHTML = I.dimensi.map(function (d) {
    if (d.nilai == null) return '<button type="button" class="dim tap"' + act(function () {
      openModal({ kat: "Dimensi Indeks Desa", title: d.nama, html: "<p>" + esc(d.ket) + "</p><p class='small'>Nilai dimensi ini untuk Marga Mulya belum tersedia.</p>" });
    }) + '><span class="dim__top"><span>' + esc(d.nama) + '</span><small>nilai belum tersedia</small></span><span class="dim__track dim__track--kosong" style="display:block"></span><small>' + esc(d.ket) + "</small></button>";
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
  var streetLoaded = false;
  function streetView() {
    if (streetLoaded) return; streetLoaded = true;
    $("#panel-street").innerHTML =
      '<iframe title="Google Street View Kampung Marga Mulya" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="' + esc(gm.streetEmbed) + '"></iframe>' +
      '<div class="street__bar"><span>Foto 360° Google di sekitar Kampung Marga Mulya. Bila layar kosong atau abu-abu, Google belum punya foto tepat di titik ini—buka Google Maps lalu seret ikon orang kuning ke jalan bergaris biru.</span>' +
      '<span class="street__btns">' + mapBtn(gm.street, "Buka Street View", "person", true) + mapBtn(gm.streetLayer, "Lihat jalur Street View", "layers") + "</span></div>";
  }
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
    if (t === "street") streetView();
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
  if (D.layananContoh) $("#layanan .lead").insertAdjacentHTML("beforeend", CHIP);

  /* =================== POTENSI, KEGIATAN, GALERI =================== */
  var ikonPot = { padi: "sprout", daun: "daun", ternak: "ternak", toko: "toko", wisata: "tree" };
  // Foto potensi: dokumentasi tim (foto) + foto dari internet berlisensi bebas (fotoLain, dengan sumber)
  var fotoPot = function (p) {
    var a = p.foto ? [{ src: p.foto, ket: p.fotoKet || p.judul, kredit: p.kredit || "Dokumentasi Tim Ekspedisi Patriot" }] : [];
    return a.concat(p.fotoLain || []);
  };
  var kreditHtml = function (f) {
    return esc(f.kredit) + (f.lisensi ? " · " + esc(f.lisensi) : "") + (f.url ? ' · <a href="' + esc(f.url) + '" target="_blank" rel="noopener">sumber</a>' : "");
  };
  $("#potensiList").innerHTML = D.potensi.map(function (p) {
    var fs = fotoPot(p), f0 = fs[0];
    return '<button type="button" class="pot tap"' + act(function () {
      openModal({ kat: "Potensi kampung", title: p.judul, html:
        (fs.length ? '<div class="potgal">' + fs.map(function (f) { return '<figure><img src="' + esc(f.src) + '" alt="' + esc(f.ket) + '" loading="lazy"><figcaption><b>' + esc(f.ket) + "</b><span>Foto: " + kreditHtml(f) + "</span></figcaption></figure>"; }).join("") + "</div>" : "") +
        "<p>" + esc(p.ket) + "</p><p>" + esc(p.detail) + "</p>" +
        (p.tautan ? "<div class='modal__actions'><a class='btn btn--solid' href='" + esc(p.tautan) + "'>" + ic("pin") + esc(p.tautanLabel || "Lihat selengkapnya") + "</a></div>" : "") });
    }) + ">" + (f0 ? '<span class="pot__media"><img class="pot__img" src="' + esc(f0.src) + '" alt="" loading="lazy">' + (fs.length > 1 ? '<span class="pot__n">' + ic("image") + fs.length + " foto</span>" : "") + '<span class="pot__cr">' + esc(f0.url ? f0.kredit.replace(" · Wikimedia Commons", "") + " · Wikimedia" : (/^Dokumen Fasilitas/.test(f0.kredit || "") ? "Dokumen kampung" : "Tim Ekspedisi Patriot")) + "</span></span>" : "") +
      '<span class="pot__ic">' + ic(ikonPot[p.ikon] || "sprout") + '</span><b class="pot__t">' + esc(p.judul) + '</b><span class="pot__d">' + esc(p.ket) + "</span></button>";
  }).join("");
  if (D.potensi.some(function (p) { return (p.fotoLain || []).length; })) $("#potensiList").insertAdjacentHTML("afterend", '<p class="small">Sebagian foto potensi adalah foto ilustrasi berlisensi bebas dari Wikimedia Commons; nama pembuat, lisensi, dan tautan sumbernya tercantum saat kartu diketuk. Foto lainnya dokumentasi Tim Ekspedisi Patriot IPB University.</p>');
  var E = D.ekonomi;
  if (E) {
    var maxHa = Math.max.apply(null, E.lahan.map(function (x) { return x.ha; }));
    $("#ekoLahan").innerHTML = E.lahan.map(function (x) {
      return '<button type="button" class="bar tap"' + act(function () {
        openModal({ kat: "Komoditas pertanian", title: x.label, html: '<div class="mini-stat"><div><b>' + x.ha.toLocaleString("id-ID") + "</b><span>Hektare</span></div><div><b>" + num(x.petani) + "</b><span>Petani</span></div></div>" +
          (x.cek ? "<p>Luas tanam padi di monografi tercatat " + x.ha.toLocaleString("id-ID") + " ha dengan " + num(x.petani) + " petani. Angka luas ini sedang dicek ulang karena padi termasuk komoditas utama kampung.</p>" : "<p>" + esc(x.label) + " ditanam di lahan seluas " + x.ha.toLocaleString("id-ID") + " ha oleh " + num(x.petani) + " petani.</p>") });
      }) + "><span>" + esc(x.label) + (x.cek ? " *" : "") + '</span><span class="bar__val"><b>' + x.ha.toLocaleString("id-ID") + " ha</b> · " + num(x.petani) + ' petani</span><span class="bar__track"><span class="bar__fill" style="display:block;width:' + Math.max(1, x.ha / maxHa * 100) + '%"></span></span></button>';
    }).join("") + '<p class="small">* Luas tanam padi sedang dicek ulang.</p>';
    var IKT = { Unggas: "ternak", Sapi: "ternak", Kambing: "ternak", Kuda: "ternak", Kerbau: "ternak" };
    $("#ekoTernak").innerHTML = E.ternak.map(function (t) {
      return '<button type="button" class="herd__i tap"' + act(function () {
        openModal({ kat: "Peternakan", title: t.label, html: '<div class="mini-stat"><div><b>' + num(t.ekor) + "</b><span>Ekor</span></div><div><b>" + num(t.peternak) + "</b><span>Peternak</span></div><div><b>" + (t.ekor / t.peternak).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "</b><span>Ekor per peternak</span></div></div>" });
      }) + "><span>" + ic(IKT[t.label] || "ternak") + "</span><b>" + num(t.ekor) + "</b><small>" + esc(t.label) + " · " + num(t.peternak) + " peternak</small></button>";
    }).join("");
    var totG = sum(E.penggunaanLahan, "ha"), toneG = ["#0B3A8F", "#1452C2", "#3A72D6", "#6E98E6", "#A3BEF0"];
    var haFmt = function (v) { return v.toLocaleString("id-ID", { maximumFractionDigits: 2 }); };
    donut("#ekoGuna", E.penggunaanLahan.map(function (g) { return { label: g.label, jumlah: g.ha }; }), { kat: "Penggunaan lahan", satuan: "ha", fmt: haFmt, tengah: [num(Math.round(totG)), "hektare"] });
    donut("#dLahan", E.lahan.map(function (g) { return { label: g.label + (g.cek ? " *" : ""), jumlah: g.ha }; }), { kat: "Luas tanam per komoditas", satuan: "ha", fmt: haFmt, tengah: [num(Math.round(sum(E.lahan, "ha"))), "hektare"] });
    if (E.lahan.some(function (g) { return g.cek; })) $("#dLahan").insertAdjacentHTML("beforeend", '<p class="small">* Luas tanam padi di monografi sedang dicek ulang.</p>');
    $("#ekoGuna").insertAdjacentHTML("beforeend", '<p class="small">Rincian ini mencakup ' + num(Math.round(totG)) + " ha dari luas wilayah " + id.luas + "; permukiman, sawah, dan pekarangan belum dirinci di monografi.</p>");
    $("#ekoUsaha").innerHTML = E.usaha.map(function (u) { return '<div class="tile"><b>' + num(u.jumlah) + "</b><span>" + esc(u.label) + "</span></div>"; }).join("");
    $("#ekoSumber").textContent = "Sumber: " + D.meta.sumberData + ". Ketuk grafik untuk rincian.";
  }

  $("#kegiatan").innerHTML = D.kegiatan.map(function (k) {
    return '<li><button type="button" class="reset tap"' + act(function () {
      openModal({ kat: "Kegiatan Ekspedisi Patriot " + k.tanggal, title: k.judul, html: (k.foto ? '<img class="modal__img" src="' + esc(k.foto) + '" alt="' + esc(k.judul) + '">' : "") + "<p>" + esc(k.ket) + "</p><p class='small'>Bagian dari kerja sama Tim Ekspedisi Patriot IPB University dengan Pemerintah Kampung Marga Mulya.</p>" });
    }) + ">" + (k.foto ? '<img class="tl__img" src="' + esc(k.foto) + '" alt="" loading="lazy">' : "") + "<time>" + esc(k.tanggal) + "</time><b>" + esc(k.judul) + '</b><span class="tl__d">' + esc(k.ket) + "</span></button></li>";
  }).join("");
  $("#gallery").innerHTML = D.galeri.map(function (g) {
    return '<button type="button"' + act(function () {
      openModal({ kat: "Galeri", title: g.caption, html: g.src ? '<img class="modal__img" src="' + esc(g.src) + '" alt="' + esc(g.caption) + '">' : "<p>Foto untuk kegiatan ini akan segera ditambahkan.</p>" });
    }) + ">" + (g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy">' : '<span class="ph">' + ic("image") + "</span>") + '<span class="cap">' + esc(g.caption) + "</span></button>";
  }).join("");

  /* =================== SARANA PRASARANA (monografi) =================== */
  if (D.sarana && $("#sarana")) {
    $("#sarana").innerHTML = D.sarana.map(function (g) {
      return '<div class="sarana__g"><h3>' + ic(g.ikon) + esc(g.kelompok) + "</h3><dl>" + g.isi.map(function (r) { return "<dt>" + esc(r.nama) + "</dt><dd>" + esc(r.nilai) + "</dd>"; }).join("") + "</dl></div>";
    }).join("") + '<p class="small sarana__src">Rekap sarana dan prasarana dari ' + esc(D.meta.sumberData) + ".</p>";
  }

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
      "Taman keluarga": { ic: "sprout", c: "#346FDE" }, "Agrowisata": { ic: "daun", c: "#1A4FB0" },
      "Kuliner": { ic: "fork", c: "#4A7FE2" }
    };
    var W = null, aktif = "Semua", markers = {}, grup = [], map = null, pusat = null;
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
        (t.lat == null ? '<span class="wcard__dist"><span>' + ic("pin") + "Titik lokasi belum dipetakan</span></span>" :
          '<span class="wcard__dist"><span>' + ic("route") + fmtKm(t.jarak_km) + "</span><span>" + ic("clock") + fmtMnt(t.waktu_menit) + "</span></span>") +
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
        return '<li><button type="button" data-fokus="' + esc(t.id) + '"><span class="dlist__no" style="background:' + ((KAT[t.kategori] || {}).c || "#1452C2") + '">' + (W.tempat.indexOf(t) + 1) + '</span><span class="dlist__n"><b>' + esc(t.nama) + "</b><small>" + esc(t.kategori) + (t.perkiraan ? " · lokasi perkiraan" : "") + " · " + esc(t.area) + '</small></span><span class="dlist__d">' + (t.lat == null ? "<b>Cek Maps</b><small>belum dipetakan</small>" : "<b>" + fmtKm(t.jarak_km) + "</b><small>" + fmtMnt(t.waktu_menit) + "</small>") + "</span></button></li>";
      }).join("");
      if (map) grup.forEach(function (g) {
        var vis = g.ids.some(function (id) { return list.some(function (t) { return t.id === id; }); });
        if (vis) g.m.addTo(map); else g.m.remove();
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
        openModal({ kat: t.kategori + " · " + t.area, title: t.nama, html: "<p>" + esc(t.deskripsi) + "</p>" +
          (t.jam ? "<p><b>Jam buka:</b> " + esc(t.jam) + "</p>" : "") + (t.tiket ? "<p><b>Tiket:</b> " + esc(t.tiket) + "</p>" : "") + (t.fasilitas ? "<p><b>Fasilitas:</b> " + esc(t.fasilitas) + "</p>" : "") +
          "<div class='modal__actions'>" + mapBtn(gmCari(t), "Cari di Google Maps", "pin", true) + mapBtn(gmRute(t), "Rute dari Marga Mulya", "nav") + (t.info ? mapBtn(t.info, "Info lengkap", "external") : "") + "</div>" });
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
      // Tempat dengan titik yang sama digabung dalam satu penanda
      var byKey = {};
      W.tempat.forEach(function (t, i) {
        if (t.lat == null) return;
        var key = t.lat.toFixed(5) + "," + t.lng.toFixed(5);
        (byKey[key] = byKey[key] || { lat: t.lat, lng: t.lng, isi: [] }).isi.push({ t: t, no: i + 1 });
      });
      Object.keys(byKey).forEach(function (key) {
        var g = byKey[key], t0 = g.isi[0].t, k = KAT[t0.kategori] || {}, lebih = g.isi.length > 1;
        var label = lebih ? g.isi.map(function (x) { return x.no; }).join("·") : g.isi[0].no;
        var m = L.marker([g.lat, g.lng], { icon: L.divIcon({ className: "", html: '<span class="mk' + (lebih ? " mk--grup" : "") + '" style="background:' + (k.c || "#1452C2") + '">' + label + "</span>", iconSize: [lebih ? 46 : 28, 28], iconAnchor: [lebih ? 23 : 14, 14] }) });
        var html = lebih
          ? '<div class="mpop"><small>' + g.isi.length + " tempat di titik ini</small>" + g.isi.map(function (x) {
              var t = x.t; return "<b>" + x.no + ". " + esc(t.nama) + "</b><span>" + esc(t.kategori) + (t.perkiraan ? " · lokasi perkiraan" : "") + "</span>";
            }).join("") + "<span>" + fmtKm(t0.jarak_km) + " · " + fmtMnt(t0.waktu_menit) + ' dari Marga Mulya</span><span class="mpop__a"><a href="' + esc(gmCari(t0)) + '" target="_blank" rel="noopener">Google Maps</a><a href="' + esc(gmRute(t0)) + '" target="_blank" rel="noopener">Rute</a></span></div>'
          : '<div class="mpop">' + (t0.foto ? '<img src="' + esc(t0.foto) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">' : "") + "<small>" + esc(t0.kategori) + "</small><b>" + esc(t0.nama) + "</b><span>" + fmtKm(t0.jarak_km) + " · " + fmtMnt(t0.waktu_menit) + " dari Marga Mulya" + (t0.perkiraan ? "<br><i>Lokasi perkiraan</i>" : "") + '</span><span class="mpop__a"><a href="' + esc(gmCari(t0)) + '" target="_blank" rel="noopener">Google Maps</a><a href="' + esc(gmRute(t0)) + '" target="_blank" rel="noopener">Rute</a></span></div>';
        m.bindPopup(html, { maxWidth: 260 });
        m.addTo(map); b.push([g.lat, g.lng]);
        grup.push({ m: m, ids: g.isi.map(function (x) { return x.t.id; }) });
        g.isi.forEach(function (x) { markers[x.t.id] = m; });
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
      $("#wisataNote").innerHTML = "Jarak dan waktu adalah perkiraan rute jalan dari pusat Kampung Marga Mulya (data OpenStreetMap) dan dapat berbeda sesuai kondisi jalan. Jam buka dan harga tiket dapat berubah. Tempat bertanda \u201clokasi perkiraan\u201d atau \u201cbelum dipetakan\u201d menunggu konfirmasi titik dari pengelola atau admin kampung. Sumber informasi dan foto destinasi: visitmerauke.com, tempatrenang.com, infodantips.com, trip.com, Wikivoyage, dan Kompas.com.";
    }).catch(function () { track.innerHTML = '<p class="small">Data wisata belum dapat dimuat.</p>'; });
  })();
  /* =================== FASILITAS UMUM =================== */
  (function () {
    var track = $("#fasilTrack"); if (!track) return;
    var KAT = {
      "Pendidikan": { ic: "school", c: "#0B3A8F" }, "Ibadah": { ic: "home", c: "#082A66" }, "Kesehatan": { ic: "health", c: "#1452C2" },
      "Air bersih": { ic: "drop", c: "#2563D6" }, "Pemerintahan": { ic: "users", c: "#346FDE" }, "Pertanian": { ic: "sprout", c: "#1046A8" },
      "Olahraga": { ic: "ball", c: "#4A7FE2" }, "Ekonomi": { ic: "toko", c: "#5B8BE6" }, "Keamanan": { ic: "person", c: "#0F3F99" },
      "Umum": { ic: "layers", c: "#2F5FB8" }
    };
    var JENIS_IC = { "Gereja": "church", "Gereja Katolik": "church", "Masjid": "mosque", "Musala": "mosque", "Madrasah": "school", "Bank": "wallet", "Koperasi": "toko", "Pertashop (BBM)": "drop", "Kantor polisi": "person", "Pos Linmas": "person",
      "TPQ": "school", "TPQ / pondok pesantren": "school", "Organisasi keagamaan": "mosque", "Lahan gereja": "church", "Apotek": "health",
      "MCK umum": "drop", "Waduk": "wave", "Pengering padi": "sprout", "Kios pupuk": "sprout", "Kolam pemancingan": "fish", "Area rekreasi": "tree",
      "SPBU": "drop", "Bengkel": "toko", "Warung makan": "fork", "Usaha konstruksi": "toko", "Menara telekomunikasi": "layers", "Pemakaman umum": "tree", "Gedung serba guna": "users", "Kantor dinas": "sprout" };
    var BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    var survei = function (f) {
      if (!f.survei) return "";
      var t = f.survei.tanggal.split("-");
      return "Difoto " + (+t[2]) + " " + BLN[+t[1] - 1] + " " + t[0] + ", " + f.survei.jam + " WIT · titik dari foto bertimestamp";
    };
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
        .map(function (f, i) { return { f: f, i: i }; })
        // Yang sudah ada fotonya tampil paling awal, lalu yang di dalam kampung, lalu yang terdekat
        .sort(function (a, b) { return (!!b.f.foto - !!a.f.foto) || (b.f.dalamKampung - a.f.dalamKampung) || ((a.f.jarak_km || 0) - (b.f.jarak_km || 0)) || (a.i - b.i); })
        .map(function (x) { return x.f; });
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
        (f.foto && f.sumberUrl ? '<span class="fcard__addr fcard__srv">' + ic("external") + "Data: " + esc(f.sumber) + "</span>" : "") +
        (f.survei ? '<span class="fcard__addr fcard__srv">' + ic("camera") + esc(survei(f)) + "</span>" : (f.titikDari ? '<span class="fcard__addr fcard__srv">' + ic("pin") + esc(f.titikDari.replace(/2023-12-0?(\d+)/, function (_, d) { return d + " Des 2023"; })) + "</span>" : "")) +
        "</span></button>" +
        '<span class="wcard__act"><a href="' + esc(gmaps(f)) + '" target="_blank" rel="noopener">' + ic("pin") + "Google Maps</a>" +
        (f.foto ? '<button type="button" class="linkbtn" data-fgal="' + esc(f.id) + '">' + ic("image") + "Lihat foto" + (fotoF(f).length > 1 ? " (" + fotoF(f).length + ")" : "") + "</button>"
          : (f.sumberUrl ? '<a href="' + esc(f.sumberUrl) + '" target="_blank" rel="noopener">' + ic("external") + "Sumber: " + esc(f.sumber) + "</a>" : '<a href="#kontak">' + ic("phone") + "Kirim data</a>")) +
        "</span></article>";
    }
    function render() {
      var list = daftar();
      track.innerHTML = list.map(kartu).join(""); track.scrollLeft = 0; nav();
      if (map) grupF.forEach(function (g) {
        var vis = g.ids.some(function (id) { return list.some(function (f) { return f.id === id; }); });
        if (vis) g.m.addTo(map); else g.m.remove();
      });
    }
    var grupF = [];
    var fotoF = function (f) {
      var a = f.foto ? [{ src: f.foto, ket: f.survei ? "Foto survei 26 Oktober 2026" : "", sumber: f.survei ? "Survei Tim Ekspedisi Patriot IPB University" : (f.galeri && f.galeri[0] && f.galeri[0].src === f.foto ? f.galeri[0].sumber : f.sumber) }] : [];
      return a.concat((f.galeri || []).filter(function (g) { return g.src !== f.foto; }));
    };
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fgal]"); if (!b) return;
      var f = F.fasilitas.filter(function (x) { return x.id === b.getAttribute("data-fgal"); })[0]; if (!f) return;
      openModal({ kat: f.kategori + " · " + (f.jenis || ""), title: f.nama, html: '<div class="potgal">' + fotoF(f).map(function (g) {
        return '<figure><img src="' + esc(g.src) + '" alt="' + esc(f.nama) + '" loading="lazy"><figcaption>' + (g.ket ? "<b>" + esc(g.ket) + "</b>" : "") + "<span>Foto: " + esc(g.sumber || "") + "</span></figcaption></figure>";
      }).join("") + "</div><p>" + esc(f.alamat) + "</p>" });
    });
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
        openModal({ kat: f.kategori, title: f.nama, html: (f.foto ? '<img class="modal__img" src="' + esc(f.foto) + '" alt="' + esc(f.nama) + '">' : "") + "<p>" + esc(f.alamat) + "</p><ul>" + (f.keterangan || []).map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>" +
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
      // Fasilitas yang titiknya berdekatan (< ±5 m) digabung dalam satu penanda
      var byKey = {};
      F.fasilitas.forEach(function (f) {
        if (f.lat == null) return;
        var key = f.lat.toFixed(4) + "," + f.lng.toFixed(4);
        (byKey[key] = byKey[key] || []).push(f);
      });
      var pop = function (f) {
        return (f.foto ? '<img src="' + esc(f.foto) + '" alt="" onerror="this.remove()">' : "") + "<small>" + esc(f.jenis || f.kategori) + "</small><b>" + esc(f.nama) + "</b><span>" + esc(f.alamat) + (f.perkiraan ? "<br><i>Lokasi perkiraan</i>" : "") + (f.survei ? "<br>" + esc(survei(f)) : "") + "</span>" +
          '<span class="mpop__a"><a href="' + esc(gmaps(f)) + '" target="_blank" rel="noopener">Google Maps</a>' + (f.sumberUrl ? '<a href="' + esc(f.sumberUrl) + '" target="_blank" rel="noopener">Sumber</a>' : "") + "</span>";
      };
      Object.keys(byKey).forEach(function (key) {
        var g = byKey[key], f0 = g[0], c = (KAT[f0.kategori] || {}).c || "#1452C2";
        var html = g.length > 1 ? '<span class="mk mk--ic mk--grup" style="background:' + c + '"><svg class="ic"><use href="#i-' + icon(f0) + '"/></svg>' + g.length + "</span>"
          : '<span class="mk mk--ic" style="background:' + c + '"><svg class="ic"><use href="#i-' + icon(f0) + '"/></svg></span>';
        var m = L.marker([f0.lat, f0.lng], { icon: L.divIcon({ className: "", html: html, iconSize: [g.length > 1 ? 44 : 30, 30], iconAnchor: [g.length > 1 ? 22 : 15, 15] }) });
        m.bindPopup('<div class="mpop">' + (g.length > 1 ? "<small>" + g.length + " fasilitas di titik ini</small>" : "") + g.map(pop).join('<hr class="mpop__hr">') + "</div>", { maxWidth: 250, maxHeight: 340 });
        m.addTo(map); grupF.push({ m: m, ids: g.map(function (f) { return f.id; }) });
        g.forEach(function (f) { markers[f.id] = m; });
        if (f0.dalamKampung || (f0.jarak_km || 99) < 8) b.push([f0.lat, f0.lng]);
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
      $("#fasilStatus").innerHTML = [["terverifikasi", "Ada foto/sumber dan titik lokasi"], ["sebagian", "Ada sumber, data belum lengkap"], ["perlu-data", "Menunggu data dari kampung"]].map(function (s_) {
        return '<li><span class="fbadge ' + STATUS[s_[0]][1] + '">' + STATUS[s_[0]][0] + "</span><b>" + hit(s_[0]) + "</b><small>" + s_[1] + "</small></li>";
      }).join("");
      $("#fasilNote").innerHTML = "Foto dan titik lokasi berasal dari Dokumen Fasilitas Umum Kampung Marga Mulya (foto GPS Desember 2023) dan survei Tim Ekspedisi Patriot IPB University 26 Oktober 2026; titik di peta adalah koordinat foto (posisi juru foto) dan cap waktu pada foto yang dipajang sudah dipotong. Data sekolah juga bersumber dari Data Referensi Kemendikdasmen. Jumlah resmi seluruh sarana menurut monografi kampung ada di rekap di atas. Musala yang belum diketahui namanya diberi nomor urut angka Romawi.";
      petakan(); render();
    }).catch(function () { track.innerHTML = '<p class="small">Data fasilitas belum dapat dimuat.</p>'; });
  })();
})();
