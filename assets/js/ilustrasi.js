/* =====================================================================
   MARGA MULYA ON SITE — ilustrasi orang dan benda (SVG buatan sendiri)
   Dipakai di data kependudukan dan angka ringkas Beranda.
   window.MM_ILUS("laki") mengembalikan teks <svg> siap tempel.
   ===================================================================== */
(function () {
  "use strict";
  var KULIT = ["#C98B5E", "#E2B288", "#B07246", "#D69C6E"];
  var RAMBUT = "#2A2522", UBAN = "#D9DCE1";
  var BIRU = "#1452C2", BIRU_MUDA = "#7AAAF2", BIRU_TUA = "#0B3A8F", HIJAU = "#4F7A3A", COKLAT = "#8A5A33", KUNING = "#E2B24A";

  // Satu sosok orang. o: { x, s (skala), kulit, rambut, gaya, baju, celana, aksesori[] }
  function orang(o) {
    var k = o.kulit || KULIT[0], r = o.rambut || RAMBUT, b = o.baju || BIRU, g = o.gaya || "pendek", a = o.aksesori || [];
    var h = "";
    // rambut panjang di belakang kepala
    if (g === "panjang") h += '<path d="M21 23c-1-11 23-11 22 0l1 13c-5-2-19-2-24 0z" fill="' + r + '"/>';
    // badan dan leher
    h += '<rect x="29" y="29" width="6" height="7" rx="2" fill="' + k + '"/>';
    h += '<path d="M17 60c0-14 6-23 15-23s15 9 15 23z" fill="' + b + '"/>';
    if (g === "panjang") h += '<path d="M26 38l6 7 6-7" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>';
    else h += '<path d="M27 38l5 5 5-5" fill="#fff" fill-opacity=".85"/>';
    // kepala dan wajah
    h += '<circle cx="32" cy="22" r="9.5" fill="' + k + '"/>';
    h += '<circle cx="28.6" cy="22.5" r="1.1" fill="#2A2522"/><circle cx="35.4" cy="22.5" r="1.1" fill="#2A2522"/>';
    h += '<path d="M29.5 26.6c1.6 1.2 3.4 1.2 5 0" fill="none" stroke="#7A3B2A" stroke-width="1.2" stroke-linecap="round"/>';
    // rambut depan
    if (g === "pendek") h += '<path d="M22.4 21c-.4-7.4 4.6-10.6 9.6-10.6s10 3.2 9.6 10.6c-1.6-3.6-4.6-5.4-9.6-5.4s-8 1.8-9.6 5.4z" fill="' + r + '"/>';
    if (g === "panjang") h += '<path d="M22.4 22c0-7.6 4.6-11.6 9.6-11.6s9.6 4 9.6 11.6c-2.4-4.6-6.4-5.8-9.6-7.2-3.2 1.4-7.2 2.6-9.6 7.2z" fill="' + r + '"/>';
    if (g === "uban") h += '<path d="M22.6 21.4c-.6-6.4 4-10.4 9.4-10.4s10 4 9.4 10.4c-1.4-3-3.4-4.4-5.4-4.8-1.4 1.4-6.6 1.4-8 0-2 .4-4 1.8-5.4 4.8z" fill="' + UBAN + '"/>';
    if (g === "anak") h += '<path d="M22.6 20.6c0-6.8 4.4-10 9.4-10s9.4 3.2 9.4 10c-2.2-1.8-3.4-4.2-4.2-5.4-2.4 2.2-7.2 3-11.2 2.2-1.2.8-2.4 1.8-3.4 3.2z" fill="' + r + '"/>';
    // aksesori
    a.forEach(function (x) {
      if (x === "caping") h += '<path d="M14 18.5 32 7l18 11.5z" fill="' + KUNING + '"/><path d="M14 18.5h36" stroke="#B88A2C" stroke-width="1.6"/>';
      if (x === "pacul") h += '<path d="M50 30v30" stroke="' + COKLAT + '" stroke-width="2.4" stroke-linecap="round"/><path d="M45 30h9l-2 5h-6z" fill="#8C96A3"/>';
      if (x === "dasi") h += '<path d="M32 40l-2 3 2 12 2-12z" fill="' + BIRU_TUA + '"/>';
      if (x === "topi") h += '<path d="M22 17c0-6 4.5-8 10-8s10 2 10 8z" fill="' + (o.warnaTopi || HIJAU) + '"/><rect x="20" y="16" width="24" height="3" rx="1.5" fill="' + (o.warnaTopi || HIJAU) + '"/>';
      if (x === "tongkat") h += '<path d="M48 36c3 0 3 4 0 4v20" fill="none" stroke="' + COKLAT + '" stroke-width="2.4" stroke-linecap="round"/>';
      if (x === "kotak") h += '<rect x="23" y="44" width="18" height="12" rx="2" fill="' + KUNING + '"/><path d="M23 48h18" stroke="#B88A2C" stroke-width="1.4"/>';
      if (x === "laptop") h += '<rect x="22" y="44" width="20" height="12" rx="1.5" fill="#33404F"/><rect x="24" y="46" width="16" height="8" fill="' + BIRU_MUDA + '"/>';
      if (x === "palu") h += '<path d="M46 34l8 22" stroke="' + COKLAT + '" stroke-width="2.4" stroke-linecap="round"/><rect x="42" y="30" width="9" height="5" rx="1" transform="rotate(-20 46 32)" fill="#8C96A3"/>';
      if (x === "nada") h += '<path d="M48 30v14" stroke="' + BIRU_TUA + '" stroke-width="2"/><circle cx="46" cy="45" r="3" fill="' + BIRU_TUA + '"/><path d="M48 30l6 2v4l-6-2" fill="' + BIRU_TUA + '"/>';
      if (x === "ikan") h += '<path d="M42 50c4-5 10-5 13 0-3 5-9 5-13 0zm13 0 5-4v8z" fill="' + BIRU_MUDA + '"/><circle cx="45.5" cy="49" r=".9" fill="#2A2522"/>';
      if (x === "sapi") h += '<ellipse cx="50" cy="49" rx="9" ry="6" fill="#F4F1EC" stroke="#8A6A4A" stroke-width="1.2"/><circle cx="47" cy="48" r="2" fill="#8A6A4A"/><path d="M57 45l3-3m-1 6h3" stroke="#8A6A4A" stroke-width="1.4" stroke-linecap="round"/>';
      if (x === "buku") h += '<path d="M22 46h9v10h-9z" fill="#fff" stroke="' + BIRU_TUA + '" stroke-width="1.4"/><path d="M31 46h9v10h-9z" fill="#fff" stroke="' + BIRU_TUA + '" stroke-width="1.4"/>';
      if (x === "toga") h += '<path d="M18 13 32 7l14 6-14 6z" fill="#22262E"/><path d="M42 15v7" stroke="' + KUNING + '" stroke-width="1.6"/><circle cx="42" cy="22.5" r="1.4" fill="' + KUNING + '"/>';
      if (x === "ransel") h += '<rect x="42" y="40" width="9" height="13" rx="3" fill="' + KUNING + '"/>';
    });
    var s = o.s || 1, x = o.x || 0, y = o.y || 0;
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' + h + "</g>";
  }
  function svg(isi, label) {
    return '<svg class="ilus" viewBox="0 0 64 64" role="img" aria-label="' + label + '" focusable="false">' + isi + "</svg>";
  }

  var LIB = {
    laki: function () { return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: BIRU }), "Ilustrasi laki-laki"); },
    perempuan: function () { return svg(orang({ kulit: KULIT[1], gaya: "panjang", baju: BIRU_MUDA }), "Ilustrasi perempuan"); },
    anak: function () { return svg(orang({ kulit: KULIT[3], gaya: "anak", baju: KUNING, aksesori: ["ransel"], s: .82, x: 6, y: 11 }), "Ilustrasi anak"); },
    dewasa: function () { return svg(orang({ kulit: KULIT[2], gaya: "pendek", baju: BIRU_TUA }), "Ilustrasi orang dewasa"); },
    lansia: function () { return svg(orang({ kulit: KULIT[0], gaya: "uban", baju: "#8C96A3", aksesori: ["tongkat"] }), "Ilustrasi lansia"); },
    keluarga: function () {
      return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: BIRU, s: .72, x: -2, y: 16 }) + orang({ kulit: KULIT[1], gaya: "panjang", baju: BIRU_MUDA, s: .68, x: 23, y: 19 }) +
        orang({ kulit: KULIT[3], gaya: "anak", baju: KUNING, s: .5, x: 15, y: 31 }), "Ilustrasi keluarga");
    },
    rumah: function () {
      return svg('<path d="M8 30 32 11l24 19" fill="none" stroke="' + BIRU_TUA + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 28h36v28H14z" fill="' + BIRU_MUDA + '"/><path d="M27 40h10v16H27z" fill="' + BIRU_TUA + '"/><rect x="18" y="34" width="6" height="6" rx="1" fill="#fff"/><rect x="40" y="34" width="6" height="6" rx="1" fill="#fff"/>' +
        orang({ kulit: KULIT[2], gaya: "pendek", baju: BIRU, s: .36, x: 38, y: 40 }), "Ilustrasi rumah keluarga");
    },
    sawah: function () {
      return svg('<rect x="4" y="34" width="56" height="24" rx="4" fill="#9CCB6B"/><path d="M4 44h56M4 52h56M20 34v24M40 34v24" stroke="#6E9E43" stroke-width="1.4"/><circle cx="48" cy="16" r="7" fill="' + KUNING + '"/><path d="M8 34c6-8 12-8 18 0 6-8 12-8 18 0" fill="none" stroke="#4F7A3A" stroke-width="2"/>', "Ilustrasi sawah");
    },
    wilayah: function () {
      return svg('<path d="M8 16l14-6 20 6 14-6v38l-14 6-20-6-14 6z" fill="#E8F0FC" stroke="' + BIRU_TUA + '" stroke-width="2" stroke-linejoin="round"/><path d="M22 10v38M42 16v38" stroke="' + BIRU_MUDA + '" stroke-width="2"/><path d="M32 22c-5 0-8 3.6-8 8 0 6 8 13 8 13s8-7 8-13c0-4.4-3-8-8-8z" fill="' + BIRU + '"/><circle cx="32" cy="30" r="3" fill="#fff"/>', "Ilustrasi peta wilayah");
    },
    petani: function () { return svg(orang({ kulit: KULIT[2], gaya: "pendek", baju: HIJAU, aksesori: ["caping", "pacul"] }), "Ilustrasi petani"); },
    peternak: function () { return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: "#B8742E", aksesori: ["topi", "sapi"], warnaTopi: COKLAT, s: .9, x: -2, y: 4 }), "Ilustrasi peternak"); },
    pedagang: function () { return svg(orang({ kulit: KULIT[1], gaya: "panjang", baju: "#D0603E", aksesori: ["kotak"] }), "Ilustrasi pedagang"); },
    pns: function () { return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: "#B89A6A", aksesori: ["dasi"] }), "Ilustrasi pegawai negeri"); },
    karyawan: function () { return svg(orang({ kulit: KULIT[1], gaya: "pendek", baju: BIRU, aksesori: ["dasi", "laptop"] }), "Ilustrasi karyawan"); },
    aparat: function () { return svg(orang({ kulit: KULIT[2], gaya: "pendek", baju: "#56663A", aksesori: ["topi"], warnaTopi: "#3D4A28" }), "Ilustrasi TNI atau Polri"); },
    pensiunan: function () { return LIB.lansia().replace("Ilustrasi lansia", "Ilustrasi pensiunan"); },
    pengrajin: function () { return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: "#8A6A4A", aksesori: ["palu"] }), "Ilustrasi pengrajin"); },
    seniman: function () { return svg(orang({ kulit: KULIT[1], gaya: "panjang", baju: "#7B5CC9", aksesori: ["nada"] }), "Ilustrasi pekerja seni"); },
    nelayan: function () { return svg(orang({ kulit: KULIT[2], gaya: "pendek", baju: BIRU_MUDA, aksesori: ["topi", "ikan"], warnaTopi: BIRU_TUA }), "Ilustrasi nelayan"); },
    jasa: function () { return svg(orang({ kulit: KULIT[3], gaya: "pendek", baju: "#3C9A8E" }), "Ilustrasi pekerja jasa"); },
    belumKerja: function () { return svg(orang({ kulit: KULIT[3], gaya: "pendek", baju: "#A9B4C6" }), "Ilustrasi belum bekerja"); },
    buku: function () { return svg(orang({ kulit: KULIT[3], gaya: "anak", baju: "#FFFFFF", aksesori: ["buku"], s: .9, x: 3, y: 6 }), "Ilustrasi pelajar"); },
    sarjana: function () { return svg(orang({ kulit: KULIT[1], gaya: "pendek", baju: "#22262E", aksesori: ["toga"] }), "Ilustrasi sarjana"); },
    santri: function () { return svg(orang({ kulit: KULIT[0], gaya: "pendek", baju: "#FFFFFF", aksesori: ["buku", "topi"], warnaTopi: "#22262E" }), "Ilustrasi santri"); },
    sejahtera: function () { return LIB.rumah().replace("Ilustrasi rumah keluarga", "Ilustrasi keluarga sejahtera"); }
  };

  // Mencocokkan label data dengan ilustrasi yang sesuai
  var COCOK = [
    [/laki/i, "laki"], [/perempuan/i, "perempuan"], [/total penduduk|^penduduk$/i, "keluarga"], [/kepala keluarga|^kk$/i, "rumah"],
    [/^0|anak|remaja/i, "anak"], [/18|produktif|dewasa/i, "dewasa"], [/56 tahun|lansia|lanjut/i, "lansia"],
    [/buruh tani|petani/i, "petani"], [/peternak/i, "peternak"], [/pedagang|wiraswasta/i, "pedagang"], [/pegawai negeri|pns/i, "pns"],
    [/karyawan|pegawai swasta/i, "karyawan"], [/tni|polri/i, "aparat"], [/pensiun/i, "pensiunan"], [/pengrajin|mebel/i, "pengrajin"],
    [/seni/i, "seniman"], [/nelayan/i, "nelayan"], [/jasa/i, "jasa"], [/tidak \/ belum bekerja|belum bekerja/i, "belumKerja"],
    [/pesantren|keagamaan/i, "santri"], [/sarjana|magister|akademi|d1|perguruan tinggi/i, "sarjana"], [/taman kanak|belum sekolah|tidak lulus/i, "anak"],
    [/sd|smp|sma/i, "buku"], [/sejahtera/i, "sejahtera"], [/luas/i, "sawah"], [/wilayah|rw/i, "wilayah"]
  ];
  window.MM_ILUS = function (kunci) { var f = LIB[kunci]; return f ? f() : ""; };
  window.MM_ILUS_LABEL = function (label) {
    for (var i = 0; i < COCOK.length; i++) if (COCOK[i][0].test(label)) return window.MM_ILUS(COCOK[i][1]);
    return "";
  };
})();
