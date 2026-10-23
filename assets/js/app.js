/* =====================================================================
   MARGA MULYA ON SITE — logika tampilan
   Membaca window.KAMPUNG (assets/js/data.js) lalu mengisi setiap bagian.
   Tidak perlu diubah untuk memperbarui isi website.
   ===================================================================== */
(function () {
  "use strict";
  var D = window.KAMPUNG;
  if (!D) { console.error("data.js tidak ditemukan"); return; }

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var num = function (n) { return Number(n).toLocaleString("id-ID"); };
  var pct = function (a, b) { return b ? (a / b * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : "0"; };
  var CONTOH = D.meta.dataContoh ? ' <span class="chip chip--contoh">contoh</span>' : "";
  var id = D.identitas, P = D.penduduk;

  /* ---------- Menu ponsel ---------- */
  var tog = $("#navtoggle"), menu = $("#menu");
  tog.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    tog.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("is-open"); tog.setAttribute("aria-expanded", "false"); }
  });

  if (D.meta.dataContoh) $("#draftbar").hidden = false;

  /* ---------- Beranda ---------- */
  $("#heroPlace").textContent = "Distrik " + id.distrik + " · Kabupaten " + id.kabupaten + " · " + id.provinsi;
  $("#facts").innerHTML = [
    ["Penduduk", num(P.total), "jiwa", ""],
    ["Kepala keluarga", num(P.kk), "KK" + (D.meta.dataContoh ? " · contoh" : ""), ""],
    ["Kode wilayah", id.kodeWilayah, "Kemendagri", "mono"],
    ["Kode pos", id.kodePos, "Distrik " + id.distrik, "mono"]
  ].map(function (f) {
    return '<div><dt>' + esc(f[0]) + '</dt><dd class="' + f[3] + '">' + esc(f[1]) + '<small>' + esc(f[2]) + '</small></dd></div>';
  }).join("");

  /* ---------- Profil ---------- */
  $("#sejarah").innerHTML = "<h3>Sejarah Singkat</h3>" + D.sejarah.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("#identitas").innerHTML = [
    ["Nama", id.nama], ["Distrik", id.distrik], ["Kabupaten", id.kabupaten], ["Provinsi", id.provinsi],
    ["Kode wilayah", id.kodeWilayah, "mono"], ["Kode pos", id.kodePos, "mono"], ["Luas wilayah", id.luas],
    ["Ketinggian", id.ketinggian], ["Zona waktu", id.zonaWaktu],
    ["Koordinat", id.koordinat.lat.toFixed(4) + ", " + id.koordinat.lng.toFixed(4), "mono"]
  ].map(function (r) { return "<dt>" + esc(r[0]) + '</dt><dd class="' + (r[2] || "") + '">' + esc(r[1]) + "</dd>"; }).join("");
  $("#visi").textContent = D.visi;
  $("#misi").innerHTML = D.misi.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
  var b = D.batas;
  $("#batas").innerHTML =
    '<div class="c n"><b>Utara</b>' + esc(b.utara) + '</div>' +
    '<div class="c w"><b>Barat</b>' + esc(b.barat) + '</div>' +
    '<div class="mid">Marga<br>Mulya</div>' +
    '<div class="c e"><b>Timur</b>' + esc(b.timur) + '</div>' +
    '<div class="c s"><b>Selatan</b>' + esc(b.selatan) + '</div>';

  /* ---------- Struktur organisasi ---------- */
  var S = D.struktur;
  var initials = function (s) { return s.replace(/\[.*?\]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); };
  var node = function (o, top) {
    var ph = top ? '<div class="node__photo">' + (o.foto ? '<img src="' + esc(o.foto) + '" alt="Foto ' + esc(o.nama) + '">' : esc(initials(o.jabatan))) + "</div>" : "";
    return '<div class="node' + (top ? " node--top" : "") + '">' + ph + '<div class="node__jab">' + esc(o.jabatan) + '</div><div class="node__nama">' + esc(o.nama) + "</div></div>";
  };
  var row = function (label, list) {
    return '<div class="org__row">' + (label ? '<div class="org__label">' + esc(label) + "</div>" : "") + list.map(function (o) { return node(o); }).join("") + "</div>";
  };
  $("#org").innerHTML =
    '<div class="org__row">' + node(S.kepala, true) + "</div>" +
    row("", [S.sekretaris]) + row("Kepala Urusan", S.kaur) + row("Kepala Seksi", S.kasi) + row("Pelaksana Kewilayahan", S.kewilayahan);
  $("#bamuskam").innerHTML = S.bamuskam.map(function (o) { return "<li><span>" + esc(o.jabatan) + "</span><span>" + esc(o.nama) + "</span></li>"; }).join("");
  $("#lembaga").innerHTML = S.lembaga.map(function (o) { return "<li><span>" + esc(o.nama) + "</span><span>" + esc(o.ket) + "</span></li>"; }).join("");

  /* ---------- Kependudukan ---------- */
  $("#dataSumber").textContent = "Sumber: " + D.meta.sumberData + ". Pembaruan terakhir " + D.meta.diperbarui + ".";
  $("#stats").innerHTML = [
    [num(P.total), "Total penduduk (jiwa)", ""],
    [num(P.laki), "Laki-laki · " + pct(P.laki, P.total) + "%", CONTOH],
    [num(P.perempuan), "Perempuan · " + pct(P.perempuan, P.total) + "%", CONTOH],
    [num(P.kk), "Kepala keluarga", CONTOH]
  ].map(function (s) { return '<div class="stat"><b>' + s[0] + "</b><span>" + esc(s[1]) + "</span>" + s[2] + "</div>"; }).join("");

  // judul panel data diberi tanda contoh
  ["#pyramid", "#usiaSekolah", "#pendidikan", "#pekerjaan", "#agama"].forEach(function (sel) {
    var h = $(sel).closest(".panel").querySelector("h3");
    if (h && CONTOH) h.insertAdjacentHTML("beforeend", CONTOH);
  });

  var maxAge = Math.max.apply(null, P.usia.map(function (u) { return Math.max(u.l, u.p); }));
  $("#pyramid").innerHTML = P.usia.slice().reverse().map(function (u) {
    return '<div class="pyr">' +
      '<div class="pyr__side pyr__side--l"><span class="pyr__num">' + u.l + '</span><span class="pyr__bar" style="width:' + (u.l / maxAge * 100) + '%"></span></div>' +
      '<div class="pyr__age">' + esc(u.k) + "</div>" +
      '<div class="pyr__side pyr__side--p"><span class="pyr__bar" style="width:' + (u.p / maxAge * 100) + '%"></span><span class="pyr__num">' + u.p + "</span></div>" +
      "</div>";
  }).join("");

  $("#usiaSekolah").innerHTML = P.usiaSekolah.map(function (s) {
    return "<div><b>" + num(s.jumlah) + "</b><span>" + esc(s.label) + "</span><small>" + esc(s.rentang) + "</small></div>";
  }).join("");

  var bars = function (sel, list) {
    var tot = list.reduce(function (a, x) { return a + x.jumlah; }, 0);
    var max = Math.max.apply(null, list.map(function (x) { return x.jumlah; }));
    $(sel).innerHTML = list.map(function (x) {
      return '<div class="bar"><span>' + esc(x.label) + '</span><span class="bar__val"><b>' + num(x.jumlah) + "</b> · " + pct(x.jumlah, tot) + '%</span>' +
        '<div class="bar__track"><div class="bar__fill" style="width:' + (x.jumlah / max * 100) + '%"></div></div></div>';
    }).join("");
  };
  bars("#pendidikan", P.pendidikan);
  bars("#pekerjaan", P.pekerjaan);
  bars("#agama", P.agama);

  $("#fasilitas tbody").innerHTML = D.fasilitas.map(function (f) {
    return '<tr><td><span class="tag">' + esc(f.kategori) + "</span></td><td><b>" + esc(f.nama) + "</b></td><td>" + esc(f.ket) + "</td></tr>";
  }).join("");

  /* ---------- Peta drone ---------- */
  var PT = D.peta;
  // Semua kategori memakai gradasi biru (palet situs: putih, biru, hitam).
  var warna = { Pemerintahan: "#082A66", Pendidikan: "#0B3A8F", Kesehatan: "#1046A8", Ibadah: "#1452C2", Pertanian: "#2563D6", Ekonomi: "#346FDE", Olahraga: "#4A7FE2" };
  var kat = Array.from(new Set(PT.titik.map(function (t) { return t.kategori; })));
  var aktifKat = {}; kat.forEach(function (k) { aktifKat[k] = true; });

  $("#petaMeta").innerHTML = [["Sumber", PT.sumber], ["Tanggal terbang", PT.tanggalTerbang], ["Resolusi", PT.resolusi], ["Cakupan", PT.luasCakupan]]
    .map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  $("#gmaps").href = "https://www.google.com/maps?q=" + id.koordinat.lat + "," + id.koordinat.lng;

  var pins = $("#pins");
  pins.innerHTML = PT.titik.map(function (t, i) {
    return '<button class="pin" type="button" data-i="' + i + '" style="left:' + t.x + "%;top:" + t.y + "%;--pin:" + (warna[t.kategori] || "#1452C2") + '" aria-label="' + esc(t.nama) + '">' +
      '<span class="pin__dot"><i>' + (i + 1) + "</i></span></button>";
  }).join("");
  var info = $("#pinInfo");
  pins.addEventListener("click", function (e) {
    var btn = e.target.closest(".pin"); if (!btn) return;
    var t = PT.titik[+btn.dataset.i];
    pins.querySelectorAll(".pin").forEach(function (p) { p.classList.toggle("is-active", p === btn); });
    var gm = (t.lat && t.lng) ? '<p><a href="https://www.google.com/maps?q=' + t.lat + "," + t.lng + '" target="_blank" rel="noopener">Buka titik ini di Google Maps</a></p>' : "";
    info.innerHTML = '<p class="mapinfo__kat">' + esc(t.kategori) + " · titik " + (+btn.dataset.i + 1) + "</p><h3>" + esc(t.nama) + "</h3><p>" + esc(t.ket) + "</p>" + gm;
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

  var ortho = $("#ortho"), canvas = $("#sketch");
  if (PT.ortofoto) {
    ortho.onload = function () { ortho.hidden = false; canvas.hidden = true; $("#mapTag").textContent = "Ortofoto drone · " + PT.tanggalTerbang; };
    ortho.onerror = drawSketch;
    ortho.src = PT.ortofoto;
  }
  drawSketch();
  var rT; window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { if (!canvas.hidden) drawSketch(); }, 150); });

  // Peta sketsa sementara: hamparan petak sawah, jalan, saluran irigasi, dan permukiman.
  function drawSketch() {
    var box = canvas.parentElement.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.max(1, Math.round(box.width)), H = Math.max(1, Math.round(box.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    var c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    var seed = 7; var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, W, H);
    // petak sawah
    var greens = ["#EEF4FD", "#E2ECFB", "#D3E3FA", "#C5DAF8", "#B7D0F5", "#DCE8FB", "#CADDF8"];
    var cw = W / 9, ch = H / 7;
    c.save(); c.translate(W / 2, H / 2); c.rotate(-0.08); c.translate(-W / 2, -H / 2);
    for (var gx = -1; gx < 11; gx++) for (var gy = -1; gy < 9; gy++) {
      var cols = 2 + Math.floor(rnd() * 3);
      for (var k = 0; k < cols; k++) {
        c.fillStyle = greens[Math.floor(rnd() * greens.length)];
        c.fillRect(gx * cw + k * cw / cols + 1, gy * ch + 1, cw / cols - 2, ch - 2);
      }
    }
    c.restore();
    // permukiman di sepanjang jalan utama
    var roadY = function (x) { return H * 0.47 + Math.sin(x / W * 3.1) * H * 0.05; };
    c.fillStyle = "#FFFFFF"; c.fillRect(W * 0.3, H * 0.33, W * 0.42, H * 0.36);
    for (var i = 0; i < 90; i++) {
      var x = W * 0.3 + rnd() * W * 0.42, y = H * 0.34 + rnd() * H * 0.34;
      if (Math.abs(y - roadY(x)) < 9) continue;
      c.fillStyle = rnd() > 0.5 ? "#1452C2" : (rnd() > 0.5 ? "#7AAAF2" : "#0B3A8F");
      c.fillRect(x, y, 7 + rnd() * 6, 6 + rnd() * 5);
    }
    // saluran irigasi
    c.strokeStyle = "#1452C2"; c.lineWidth = 4; c.beginPath();
    c.moveTo(W * 0.1, H * 1.02); c.bezierCurveTo(W * 0.4, H * 0.8, W * 0.7, H * 0.85, W * 1.02, H * 0.62); c.stroke();
    // jalan
    c.strokeStyle = "#9DBDF0"; c.lineWidth = 6; c.beginPath();
    for (var xx = 0; xx <= W; xx += 8) { var yy = roadY(xx); if (xx === 0) c.moveTo(xx, yy); else c.lineTo(xx, yy); } c.stroke();
    c.lineWidth = 4; c.beginPath(); c.moveTo(W * 0.52, 0); c.lineTo(W * 0.5, roadY(W * 0.5)); c.lineTo(W * 0.46, H); c.stroke();
    c.lineWidth = 2.5; c.strokeStyle = "#9DBDF0";
    c.beginPath(); c.moveTo(W * 0.3, roadY(W * 0.3)); c.lineTo(W * 0.26, H * 0.12); c.stroke();
    c.beginPath(); c.moveTo(W * 0.7, roadY(W * 0.7)); c.lineTo(W * 0.76, H * 0.95); c.stroke();
  }

  /* ---------- Video ---------- */
  var V = D.video, vb = $("#videoBox");
  $("#videoJudul").textContent = V.judul; $("#videoDesk").textContent = V.deskripsi;
  var poster = V.poster ? '<img src="' + esc(V.poster) + '" alt="">' : (V.youtubeId ? '<img src="https://img.youtube.com/vi/' + esc(V.youtubeId) + '/hqdefault.jpg" alt="">' : "");
  if (V.fileLokal) {
    vb.innerHTML = '<video controls preload="metadata"' + (V.poster ? ' poster="' + esc(V.poster) + '"' : "") + '><source src="' + esc(V.fileLokal) + '" type="video/mp4">Peramban Anda tidak mendukung video.</video>';
  } else if (V.youtubeId) {
    vb.innerHTML = '<button class="video__poster" type="button" id="playBtn">' + poster + '<div><span class="video__play" aria-hidden="true">▶</span><b>Putar video profil</b><small>YouTube</small></div></button>';
    $("#playBtn").addEventListener("click", function () {
      vb.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(V.youtubeId) + '?autoplay=1&rel=0" title="' + esc(V.judul) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    });
  } else {
    vb.innerHTML = '<button class="video__poster" type="button" disabled>' + poster + '<div><span class="video__play" aria-hidden="true">▶</span><b>Video profil sedang disiapkan</b><small>Isi youtubeId atau fileLokal di data.js</small></div></button>';
  }

  /* ---------- Potensi, kegiatan, galeri, kontak ---------- */
  $("#potensiList").innerHTML = D.potensi.map(function (p) { return '<div class="pot"><h3>' + esc(p.judul) + "</h3><p>" + esc(p.ket) + "</p></div>"; }).join("");
  $("#kegiatan").innerHTML = D.kegiatan.map(function (k) { return "<li><time>" + esc(k.tanggal) + "</time><b>" + esc(k.judul) + "</b><p>" + esc(k.ket) + "</p></li>"; }).join("");
  $("#gallery").innerHTML = D.galeri.map(function (g) {
    return "<figure>" + (g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy">' : '<div class="ph" aria-hidden="true"></div>') + "<figcaption>" + esc(g.caption) + "</figcaption></figure>";
  }).join("");
  var K = D.kontak;
  $("#kontakList").innerHTML = [["Alamat", K.alamat], ["Telepon", K.telepon], ["Email", K.email], ["Jam layanan", K.jamLayanan]]
    .map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
  $("#collabText").textContent = D.kerjaSama.ringkas;
  $("#collabKetua").textContent = "Ketua Tim Ekspedisi Patriot IPB University: " + D.kerjaSama.ketuaTim;
  $("#footMeta").textContent = "Data diperbarui " + D.meta.diperbarui + " · © " + D.kerjaSama.tahun + " Pemerintah Kampung Marga Mulya";
})();
