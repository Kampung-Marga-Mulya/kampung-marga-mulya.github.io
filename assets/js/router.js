/* =====================================================================
   MARGA MULYA ON SITE — navigasi menu & tab
   Website dibagi menjadi 6 menu (view). Setiap menu punya beberapa tab.
   Alamat seperti #fasilitas, #wisata, atau #kontak tetap berfungsi dan
   langsung membuka menu + tab yang sesuai.
   ===================================================================== */
(function () {
  "use strict";
  var R = {
    beranda: ["beranda"], berita: ["beranda", null, "berita"],
    profil: ["profil", "tentang"], tentang: ["profil", "tentang"], pemerintahan: ["profil", "pemerintahan"],
    potensi: ["profil", "potensi"], media: ["profil", "media"], video: ["profil", "media"], galeri: ["profil", "media", "galeri"],
    data: ["data", "penduduk"], penduduk: ["data", "penduduk"], fasilitas: ["data", "fasilitas"],
    transparansi: ["transparansi", "apbkam"], apbkam: ["transparansi", "apbkam"], anggaran: ["transparansi", "apbkam"],
    indeksdesa: ["transparansi", "indeksdesa"], indeks: ["transparansi", "indeksdesa"],
    perencanaan: ["transparansi", "perencanaan"], rpjmk: ["transparansi", "perencanaan"], rpjmkam: ["transparansi", "perencanaan"],
    jelajah: ["jelajah", "petakampung"], petakampung: ["jelajah", "petakampung"], peta: ["jelajah", "petakampung"],
    wisatakuliner: ["jelajah", "wisatakuliner"], wisata: ["jelajah", "wisatakuliner"],
    "layanan-warga": ["layanan-warga", "surat"], surat: ["layanan-warga", "surat"], layanan: ["layanan-warga", "surat"],
    kontakkampung: ["layanan-warga", "kontakkampung"], kontak: ["layanan-warga", "kontakkampung"]
  };
  var JUDUL = { beranda: "", profil: "Profil Kampung", data: "Data Kampung", transparansi: "Transparansi", jelajah: "Jelajah", "layanan-warga": "Layanan & Kontak" };
  var baseTitle = document.title;
  var views = document.querySelectorAll(".view");

  function segarkan() {
    window.dispatchEvent(new Event("resize"));
    (window.MM_MAPS || []).forEach(function (m) { if (m.el.offsetParent !== null) m.fit(); });
  }

  function route(key, diam) {
    key = String(key || "").replace(/^#/, "") || "beranda";
    var r = R[key]; if (!r) return false;
    var vid = r[0], tab = r[1], target = r[2];
    views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== vid; });
    var view = document.getElementById("v-" + vid);
    if (view && view.querySelector("[data-tab]")) {
      tab = tab || view.querySelector("[data-tab]").getAttribute("data-tab");
      view.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === tab ? "true" : "false"); });
      view.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== tab; });
      var aktifBtn = view.querySelector('[data-tab="' + tab + '"]');
      if (aktifBtn && aktifBtn.scrollIntoView) aktifBtn.scrollIntoView({ block: "nearest", inline: "center" });
    }
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === vid;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.title = JUDUL[vid] ? JUDUL[vid] + " · " + baseTitle : baseTitle;
    requestAnimationFrame(function () {
      segarkan();
      if (target && document.getElementById(target)) document.getElementById(target).scrollIntoView({ behavior: diam ? "auto" : "smooth", block: "start" });
      else if (!diam) window.scrollTo({ top: 0, behavior: "auto" });
    });
    return true;
  }
  window.MM_ROUTE = route;

  // Tautan internal (#...) dan tombol tab
  document.addEventListener("click", function (e) {
    var tabBtn = e.target.closest("[data-tab]");
    if (tabBtn && tabBtn.closest(".vtabs")) {
      var t = tabBtn.getAttribute("data-tab");
      if (location.hash !== "#" + t) history.pushState(null, "", "#" + t);
      route(t, true); window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var key = a.getAttribute("href").slice(1);
    if (!R[key]) return;
    e.preventDefault();
    if (location.hash !== "#" + key) history.pushState(null, "", "#" + key);
    route(key);
  });
  window.addEventListener("popstate", function () { route(location.hash, true); });
  window.addEventListener("hashchange", function () { route(location.hash, true); });

  route(location.hash || "beranda", true);
})();
