/* Pilihan bahasa Indonesia / English — Marga Mulya On Site
 * Bahasa Indonesia adalah teks asli. Bila English dipilih, setiap teks di halaman
 * diganti memakai kamus assets/i18n/en.json (teks Indonesia → teks Inggris),
 * termasuk teks yang muncul belakangan (jendela rincian, kartu, pesan).
 * Pilihan disimpan di perangkat (localStorage) dan bisa dipaksa lewat ?lang=en / ?lang=id.
 * Berita dan video otomatis tetap dalam bahasa aslinya.
 */
(function () {
  "use strict";
  var KUNCI = "mm_bahasa", root = document.documentElement;
  var akar = (document.currentScript && document.currentScript.src || "").replace(/assets\/js\/bahasa\.js.*$/, "");
  var lang = "id";
  try {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "id") localStorage.setItem(KUNCI, q);
    lang = localStorage.getItem(KUNCI) === "en" ? "en" : "id";
  } catch (e) { /* penyimpanan tidak tersedia: pakai bahasa Indonesia */ }
  root.setAttribute("data-bahasa", lang);
  window.MM_BAHASA = lang;

  /* ---------- Tombol ID / EN di kepala halaman ---------- */
  function pasangTombol() {
    if (document.getElementById("bahasaBtn")) return;
    var b = document.createElement("button");
    b.type = "button"; b.id = "bahasaBtn"; b.className = "bahasa";
    b.setAttribute("aria-label", lang === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English");
    b.title = lang === "en" ? "Bahasa Indonesia" : "English";
    var BENDERA = {
      id: '<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="15" fill="#CE1126"/><rect y="15" width="30" height="15" fill="#fff"/></svg>',
      en: '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id="bhsT"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
        '<rect width="60" height="30" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>' +
        '<path d="M0,0L60,30M60,0L0,30" clip-path="url(#bhsT)" stroke="#C8102E" stroke-width="4"/>' +
        '<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>'
    };
    function opsi(k, nama) { return '<span class="bahasa__opsi bahasa__opsi--' + k + (lang === k ? " is-on" : "") + '" title="' + nama + '">' + BENDERA[k] + '</span>'; }
    b.innerHTML = opsi("id", "Bahasa Indonesia") + opsi("en", "English");
    b.setAttribute("data-i18n-skip", "");
    b.addEventListener("click", function () {
      try { localStorage.setItem(KUNCI, lang === "en" ? "id" : "en"); } catch (e) {}
      var u = new URL(location.href); u.searchParams.delete("lang"); location.replace(u.toString());
    });
    var tema = document.getElementById("temaBtn"), row = document.querySelector(".bar__in .row"), bar = document.querySelector(".bar__in");
    if (tema && tema.parentNode) tema.parentNode.insertBefore(b, tema);
    else if (row) row.insertBefore(b, row.firstChild);
    else if (bar && bar.lastElementChild) { b.classList.add("bahasa--lepas"); bar.insertBefore(b, bar.lastElementChild); }
    else { b.classList.add("bahasa--apung"); document.body.appendChild(b); }
  }

  if (lang !== "en") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pasangTombol); else pasangTombol();
    return;
  }

  /* ---------- Mode English ---------- */
  root.lang = "en";
  root.classList.add("i18n-tunggu");
  var lepas = function () { root.classList.remove("i18n-tunggu"); };
  setTimeout(lepas, 2500);   // jangan pernah menyembunyikan halaman terlalu lama

  var KAMUS = null, POLA = [];
  var BULAN = { Januari: "January", Februari: "February", Maret: "March", April: "April", Mei: "May", Juni: "June", Juli: "July", Agustus: "August",
    September: "September", Oktober: "October", November: "November", Desember: "December",
    Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Jun: "Jun", Jul: "Jul", Agu: "Aug", Agt: "Aug", Sep: "Sep", Okt: "Oct", Nov: "Nov", Des: "Dec" };
  var RE_TGL = /^[\s\d.,:–\-·/()]*(?:(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|Jun|Jul|Agu|Agt|Sep|Okt|Nov|Des)\b[\s\d.,:–\-·/()]*(?:WIT|pukul)?[\s\d.,:–\-·/()]*)+$/;
  var ATR = ["placeholder", "aria-label", "title", "alt", "data-ket"];
  var SELESAI = typeof WeakMap === "function" ? new WeakMap() : null;

  /* BEGIN-INTI */
  // Angka gaya Indonesia (1.674 / 41,8) → gaya Inggris (1,674 / 41.8)
  var RE_ANGKA_SAJA = /^[−\-+±]?\s?(?:\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+,\d+)\s?%?$/;
  function angka(s) {
    return s.replace(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+,\d+/g, function (n) {
      return n.replace(/[.,]/g, function (c) { return c === "." ? "," : "."; });
    });
  }
  function tanggal(s) { return s.replace(/[A-Za-z]+/g, function (w) { return BULAN[w] || (w === "pukul" ? "at" : w); }); }
  function inti1(inti, dalam) {
    var t = KAMUS[inti];
    if (t != null) return t;
    for (var i = 0; i < POLA.length; i++) {
      var m = inti.match(POLA[i][0]);
      if (!m) continue;
      if (dalam > 3) return null;
      var r = POLA[i][1].replace(/\{t(\d)\}/g, function (_, k) {
        var g = m[+k] || ""; var h = inti1(g, dalam + 1); return h == null ? angka(g) : h;
      }).replace(/\$(\d)/g, function (_, k) { return angka(m[+k] || ""); });
      return r;
    }
    if (RE_ANGKA_SAJA.test(inti)) return angka(inti);
    if (/[A-Za-z]/.test(inti) && RE_TGL.test(inti)) return angka(tanggal(inti));
    // Gabungan "A · B · C": terjemahkan tiap bagian
    if (inti.indexOf(" · ") > 0) {
      var bag = inti.split(" · "), ada = false;
      for (var j = 0; j < bag.length; j++) {
        var b = inti1(bag[j], dalam + 1);
        if (b != null && b !== bag[j]) { bag[j] = b; ada = true; }
      }
      if (ada) return bag.join(" · ");
    }
    return null;
  }
  function terjemah(s) {
    var inti = s.replace(/\s+/g, " ").trim();
    if (!inti || !/[A-Za-z0-9]/.test(inti)) return null;
    var t = inti1(inti, 0);
    if (t == null || t === inti) return null;
    var awal = s.match(/^\s*/)[0], akhir = s.match(/\s*$/)[0];
    return awal + t + akhir;
  }
  /* END-INTI */
  function lewati(el) { return el && el.closest && el.closest("script,style,textarea,input,select,[data-i18n-skip],#modalBody .wa-pratinjau"); }
  function teks(n) {
    if (SELESAI && SELESAI.get(n) === n.nodeValue) return;
    if (lewati(n.parentElement)) return;
    var t = terjemah(n.nodeValue);
    if (t != null) n.nodeValue = t;
    if (SELESAI) SELESAI.set(n, n.nodeValue);
  }
  function atribut(el) {
    if (lewati(el)) return;
    for (var i = 0; i < ATR.length; i++) {
      var v = el.getAttribute(ATR[i]); if (!v) continue;
      var t = terjemah(v); if (t != null) el.setAttribute(ATR[i], t);
    }
  }
  function sapu(akarNode) {
    if (akarNode.nodeType === 3) { teks(akarNode); return; }
    if (akarNode.nodeType !== 1) return;
    var w = document.createTreeWalker(akarNode, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) teks(n);
    if (akarNode.getAttribute) atribut(akarNode);
    var els = akarNode.querySelectorAll("[placeholder],[aria-label],[title],[alt],[data-ket]");
    for (var i = 0; i < els.length; i++) atribut(els[i]);
    var opts = akarNode.querySelectorAll("option");
    for (var j = 0; j < opts.length; j++) { var o = opts[j]; var t = terjemah(o.textContent); if (t != null) o.textContent = t; }
  }
  function mulai() {
    sapu(document.body);
    var tj = terjemah(document.title); if (tj) document.title = tj;
    pasangTombol();
    lepas();
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === "characterData") teks(m.target);
        else if (m.type === "attributes") atribut(m.target);
        else for (var k = 0; k < m.addedNodes.length; k++) sapu(m.addedNodes[k]);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATR });
    new MutationObserver(function () { var tj2 = terjemah(document.title); if (tj2) document.title = tj2; })
      .observe(document.querySelector("title") || document.head, { childList: true, characterData: true, subtree: true });
  }

  fetch(akar + "assets/i18n/en.json?v=" + (document.currentScript ? (document.currentScript.src.split("v=")[1] || "1") : "1"))
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (j) {
      KAMUS = j.kamus || {};
      POLA = (j.pola || []).map(function (p) { return [new RegExp(p[0]), p[1]]; });
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai); else mulai();
    })
    .catch(function () { lepas(); if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pasangTombol); else pasangTombol(); });
})();
