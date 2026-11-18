/* Dimuat paling awal agar tidak ada kilatan warna saat halaman dibuka.
   Pilihan mode (terang/gelap) disimpan di perangkat pengunjung; bila belum memilih, mengikuti pengaturan perangkat. */
(function () {
  try {
    var t = localStorage.getItem("mm_tema");
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
