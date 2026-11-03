# Salin ke Claude Code — Marga Mulya On Site

Cara pakai: buka terminal di folder kosong, ketik `claude`, lalu salin **seluruh** blok di bawah ini (tekan tombol salin di pojok blok) dan tempelkan ke Claude Code. Claude Code akan membuat semua file website persis seperti versi putih–biru yang sudah Anda lihat.

~~~~text
Buat website statis "Marga Mulya On Site" (profil Kampung Marga Mulya, Distrik Semangga,
Kabupaten Merauke, Papua Selatan), hasil kerja sama Tim Ekspedisi Patriot IPB University
dengan Pemerintah Kampung Marga Mulya.

Buat folder proyek bernama marga-mulya-on-site, lalu buat file-file di bawah ini PERSIS
seperti isinya (jangan diringkas, jangan diubah). Buat juga folder kosong assets/img,
assets/peta, dan assets/video (isi masing-masing dengan file .gitkeep).

Setelah semua file dibuat:
1. Jalankan python3 -m http.server 8000 di folder proyek dan pastikan halaman terbuka
   tanpa galat di konsol.
2. Beri tahu saya cara membukanya di browser.

=== FILE: index.html ===
```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Marga Mulya On Site</title>
  <meta name="description" content="Profil resmi Kampung Marga Mulya, Distrik Semangga, Kabupaten Merauke, Papua Selatan. Data kampung, struktur pemerintahan, kependudukan, peta drone, dan video profil.">
  <meta property="og:title" content="Marga Mulya On Site — Profil Kampung Marga Mulya">
  <meta property="og:description" content="Pusat informasi Kampung Marga Mulya, Distrik Semangga, Merauke. Kerja sama Tim Ekspedisi Patriot IPB University dan Pemerintah Kampung Marga Mulya.">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800;900&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <a class="skip" href="#isi">Langsung ke isi</a>

  <header class="topbar" id="atas">
    <div class="wrap topbar__in">
      <a class="brand" href="#beranda" aria-label="Marga Mulya On Site, ke beranda">
        <span class="brand__mark" aria-hidden="true">MM</span>
        <span class="brand__text"><b>Marga Mulya</b><small>On Site</small></span>
      </a>
      <button class="navtoggle" id="navtoggle" aria-expanded="false" aria-controls="menu">Menu</button>
      <nav class="menu" id="menu" aria-label="Navigasi utama">
        <a href="#profil">Profil</a>
        <a href="#pemerintahan">Pemerintahan</a>
        <a href="#data">Data Penduduk</a>
        <a href="#peta">Peta Drone</a>
        <a href="#video">Video</a>
        <a href="#potensi">Potensi</a>
        <a href="#galeri">Galeri</a>
        <a href="#kontak">Kontak</a>
      </nav>
    </div>
  </header>

  <div class="draftbar" id="draftbar" hidden>
    <div class="wrap">Versi draf: bagian bertanda <span class="chip chip--contoh">contoh</span> berisi data contoh dan akan diganti dengan data resmi kampung.</div>
  </div>

  <main id="isi">
    <!-- BERANDA -->
    <section class="hero" id="beranda">
      <div class="hero__field" aria-hidden="true"></div>
      <div class="wrap hero__in">
        <p class="hero__gate">Selamat datang di</p>
        <h1 class="hero__title"><span data-bind="identitas.nama">Kampung Marga Mulya</span></h1>
        <p class="hero__place" id="heroPlace">Distrik Semangga · Kabupaten Merauke · Papua Selatan</p>
        <div class="collab" id="collab">
          <span class="collab__label">Kerja sama</span>
          <span class="collab__party">Tim Ekspedisi Patriot IPB University</span>
          <span class="collab__x" aria-hidden="true">×</span>
          <span class="collab__party">Pemerintah Kampung Marga Mulya</span>
        </div>
        <dl class="facts" id="facts"></dl>
      </div>
    </section>

    <!-- PROFIL -->
    <section class="sec" id="profil">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Profil Kampung</p>
          <h2>Mengenal Marga Mulya</h2>
        </header>
        <div class="grid-2">
          <div class="prose" id="sejarah"></div>
          <aside class="card" aria-labelledby="idtitle">
            <h3 id="idtitle">Identitas Wilayah</h3>
            <dl class="kv" id="identitas"></dl>
          </aside>
        </div>
        <div class="grid-2 mt">
          <div>
            <h3>Visi</h3>
            <p class="visi" id="visi"></p>
            <h3>Misi</h3>
            <ol class="misi" id="misi"></ol>
          </div>
          <div>
            <h3>Batas Wilayah</h3>
            <div class="compass" id="batas"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- PEMERINTAHAN -->
    <section class="sec sec--tint" id="pemerintahan">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Pemerintahan Kampung</p>
          <h2>Struktur Organisasi</h2>
          <p class="lead">Susunan Pemerintah Kampung Marga Mulya, Badan Musyawarah Kampung (Bamuskam), dan lembaga kemasyarakatan.</p>
        </header>
        <div class="org" id="org"></div>
        <div class="grid-2 mt">
          <div>
            <h3>Badan Musyawarah Kampung</h3>
            <ul class="roster" id="bamuskam"></ul>
          </div>
          <div>
            <h3>Lembaga Kemasyarakatan</h3>
            <ul class="roster" id="lembaga"></ul>
          </div>
        </div>
      </div>
    </section>

    <!-- DATA PENDUDUK -->
    <section class="sec" id="data">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Data Kampung</p>
          <h2>Kependudukan</h2>
          <p class="lead" id="dataSumber"></p>
        </header>
        <div class="stats" id="stats"></div>

        <div class="panel mt">
          <div class="panel__head">
            <h3>Piramida Penduduk menurut Kelompok Umur</h3>
            <div class="legend"><span class="sw sw--l"></span>Laki-laki <span class="sw sw--p"></span>Perempuan</div>
          </div>
          <div class="pyramid" id="pyramid" role="img" aria-label="Piramida penduduk menurut kelompok umur dan jenis kelamin"></div>
        </div>

        <div class="grid-2 mt">
          <div class="panel">
            <h3>Penduduk Usia Sekolah</h3>
            <div class="school" id="usiaSekolah"></div>
          </div>
          <div class="panel">
            <h3>Pendidikan Terakhir</h3>
            <div class="bars" id="pendidikan"></div>
          </div>
          <div class="panel">
            <h3>Mata Pencaharian</h3>
            <div class="bars" id="pekerjaan"></div>
          </div>
          <div class="panel">
            <h3>Agama</h3>
            <div class="bars" id="agama"></div>
          </div>
        </div>

        <div class="panel mt">
          <h3>Fasilitas Umum</h3>
          <div class="tablewrap">
            <table class="tbl" id="fasilitas">
              <thead><tr><th>Kategori</th><th>Fasilitas</th><th>Keterangan</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- PETA DRONE -->
    <section class="sec sec--dark" id="peta">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Peta Drone</p>
          <h2>Marga Mulya dari Udara</h2>
          <p class="lead" id="petaLead">Ketuk titik pada peta untuk melihat keterangan lokasi.</p>
        </header>
        <div class="mapwrap">
          <div class="map" id="map">
            <canvas id="sketch" aria-hidden="true"></canvas>
            <img id="ortho" alt="Foto udara (ortofoto) Kampung Marga Mulya" hidden>
            <div class="map__pins" id="pins"></div>
            <span class="map__north" aria-hidden="true">U ↑</span>
            <span class="map__tag" id="mapTag">Peta sketsa sementara</span>
          </div>
          <aside class="mapinfo">
            <div class="mapinfo__card" id="pinInfo" aria-live="polite">
              <p class="mapinfo__kat">Titik lokasi</p>
              <h3>Pilih titik di peta</h3>
              <p>Setiap titik menunjukkan fasilitas atau kawasan penting di kampung.</p>
            </div>
            <div class="mapfilter" id="mapFilter" role="group" aria-label="Saring kategori titik"></div>
            <dl class="kv kv--dark" id="petaMeta"></dl>
            <a class="btn btn--ghost" id="gmaps" target="_blank" rel="noopener">Buka lokasi di Google Maps</a>
          </aside>
        </div>
      </div>
    </section>

    <!-- VIDEO -->
    <section class="sec" id="video">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Video Profil</p>
          <h2 id="videoJudul">Video Profil Kampung Marga Mulya</h2>
          <p class="lead" id="videoDesk"></p>
        </header>
        <div class="video" id="videoBox"></div>
      </div>
    </section>

    <!-- POTENSI -->
    <section class="sec sec--tint" id="potensi">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Potensi Kampung</p>
          <h2>Pertanian, Ternak, dan Usaha Warga</h2>
        </header>
        <div class="potensi" id="potensiList"></div>
        <h3 class="mt">Kegiatan Ekspedisi Patriot</h3>
        <ol class="timeline" id="kegiatan"></ol>
      </div>
    </section>

    <!-- GALERI -->
    <section class="sec" id="galeri">
      <div class="wrap">
        <header class="sec__head">
          <p class="eyebrow">Galeri</p>
          <h2>Kehidupan di Marga Mulya</h2>
        </header>
        <div class="gallery" id="gallery"></div>
      </div>
    </section>

    <!-- KONTAK -->
    <section class="sec sec--tint" id="kontak">
      <div class="wrap grid-2">
        <div>
          <p class="eyebrow">Kontak</p>
          <h2>Kantor Kampung Marga Mulya</h2>
          <dl class="kv" id="kontakList"></dl>
        </div>
        <div class="card card--collab">
          <p class="eyebrow">Tentang website ini</p>
          <p id="collabText"></p>
          <p class="small" id="collabKetua"></p>
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap foot__in">
      <div>
        <b>Marga Mulya On Site</b>
        <p>Kampung Marga Mulya · Distrik Semangga · Kabupaten Merauke · Papua Selatan</p>
      </div>
      <p class="foot__collab">Dikembangkan atas kerja sama <b>Tim Ekspedisi Patriot IPB University</b> dengan <b>Pemerintah Kampung Marga Mulya</b>.</p>
      <p class="foot__meta" id="footMeta"></p>
    </div>
  </footer>

  <script src="assets/js/data.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
```

=== FILE: assets/css/style.css ===
```css
/* =====================================================================
   MARGA MULYA ON SITE — gaya tampilan
   Konsep: papan nama gapura kampung (huruf tegak, padat, kapital) di atas
   hamparan sawah dataran rendah Semangga. Putih dominan, biru sebagai warna aksen,
   hitam untuk tulisan.
   ===================================================================== */
/* Palet: putih dominan, biru sebagai satu-satunya warna, hitam untuk tulisan. */
:root {
  color-scheme: light;
  --bg: #FFFFFF;
  --surface: #FFFFFF;
  --tint: #EEF4FD;           /* biru sangat muda untuk selang-seling bagian */
  --ink: #0A0A0A;            /* hitam tulisan */
  --muted: #0A0A0A;
  --line: #D3E1F7;
  --accent: #1452C2;         /* biru utama */
  --accent-ink: #FFFFFF;
  --straw: #1452C2;          /* aksen kedua = biru (di pita biru diganti biru muda) */
  --clay: #1452C2;
  --band: #1452C2;           /* pita biru: hero, peta, footer */
  --band-2: #0F43A3;
  --band-ink: #FFFFFF;
  --band-muted: #D6E4FF;
  --sex-l: #0B3A8F;
  --sex-p: #7AAAF2;
  --font-display: "Big Shoulders Display", "Arial Narrow", "Roboto Condensed", Impact, sans-serif;
  --font-body: "Source Sans 3", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --r: 10px;
  --step--1: .875rem; --step-0: 1.0625rem; --step-1: 1.25rem; --step-2: 1.6rem; --step-3: 2.3rem;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 72px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition: none !important; animation: none !important; } }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: var(--font-body); font-size: var(--step-0); line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: var(--accent); }
h1, h2, h3 { line-height: 1.15; text-wrap: balance; margin: 0 0 .5em; }
h2 { font-family: var(--font-display); font-weight: 800; font-size: var(--step-3); letter-spacing: .01em; text-transform: uppercase; }
h3 { font-size: var(--step-1); font-weight: 700; }
p { margin: 0 0 1em; }
:focus-visible { outline: 3px solid var(--straw); outline-offset: 2px; border-radius: 4px; }
[hidden] { display: none !important; }

.wrap {
  width: 100%; max-width: 1140px; margin-inline: auto;
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.skip { position: absolute; left: -9999px; }
.skip:focus { left: 16px; top: 16px; z-index: 100; background: var(--surface); padding: 8px 12px; }
.mt { margin-top: 2.5rem; }
.small { font-size: var(--step--1); color: var(--ink); opacity: .75; }
.eyebrow { font-family: var(--font-mono); font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; color: var(--straw); margin: 0 0 .4rem; }
.lead { color: var(--ink); opacity: .78; max-width: 62ch; }

/* ---------- Header ---------- */
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 60; background: #FFFFFF; }
.topbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 50; background: #FFFFFF; color: var(--ink); border-bottom: 3px solid var(--accent); }
.topbar__in { display: flex; align-items: center; gap: 16px; min-height: 60px; }
.brand { display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; margin-right: auto; }
.brand__mark { display: grid; place-items: center; width: 38px; height: 38px; border: 0; background: var(--accent); color: #FFFFFF; font-family: var(--font-display); font-weight: 900; font-size: 1.05rem; border-radius: 6px; }
.brand__text { display: flex; flex-direction: column; line-height: 1; }
.brand__text b { font-family: var(--font-display); font-weight: 800; font-size: 1.25rem; text-transform: uppercase; letter-spacing: .02em; }
.brand__text small { font-family: var(--font-mono); font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-top: 3px; }
.menu { display: flex; gap: 2px; flex-wrap: wrap; }
.menu a { color: var(--ink); text-decoration: none; padding: 8px 10px; border-radius: 6px; font-size: .95rem; font-weight: 600; }
.menu a:hover { background: var(--tint); color: var(--accent); }
.navtoggle { display: none; background: transparent; color: var(--accent); border: 1px solid var(--accent); border-radius: 6px; padding: 6px 12px; font: 600 .95rem var(--font-body); cursor: pointer; }
@media (max-width: 900px) {
  .navtoggle { display: block; }
  .menu { display: none; position: absolute; left: 0; right: 0; top: 100%; background: #FFFFFF; flex-direction: column; padding: 8px max(16px, env(safe-area-inset-right, 0px)) 16px max(16px, env(safe-area-inset-left, 0px)); border-bottom: 3px solid var(--accent); }
  .menu.is-open { display: flex; }
  .menu a { padding: 12px 8px; border-bottom: 1px solid var(--line); }
}

.draftbar { background: var(--tint); color: var(--ink); border-bottom: 1px solid var(--line); font-size: .9rem; padding-block: 6px; }
.chip { display: inline-block; font-family: var(--font-mono); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; padding: 1px 7px; border-radius: 99px; vertical-align: 1px; }
.chip--contoh { background: var(--accent); color: #FFFFFF; }

/* ---------- Hero: papan gapura di atas sawah ---------- */
.hero { position: relative; background: var(--band); color: var(--band-ink); overflow: hidden; }
.hero__field {
  position: absolute; inset: 0; opacity: .5;
  background:
    repeating-linear-gradient(100deg, transparent 0 22px, rgba(255,255,255,.10) 22px 24px),
    repeating-linear-gradient(10deg, transparent 0 90px, rgba(255,255,255,.08) 90px 92px);
}
.hero__in { position: relative; padding-block: 64px 48px; }
.hero__gate { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .3em; font-size: .8rem; color: var(--straw); margin-bottom: .6rem; }
.hero__title {
  font-family: var(--font-display); font-weight: 900; text-transform: uppercase;
  font-size: clamp(3rem, 11vw, 7.5rem); line-height: .88; letter-spacing: .005em; margin: 0 0 1rem;
  max-width: 12ch;
}
.hero__title span { display: inline; }
.hero__place { font-size: var(--step-1); color: var(--band-muted); margin-bottom: 1.5rem; }
.collab { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; border: 1px solid rgba(255,255,255,.6); border-radius: 8px; padding: 10px 14px; margin-bottom: 2rem; background: #FFFFFF; color: var(--ink); }
.collab .collab__label, .collab .collab__x { color: #1452C2; }
.collab__label { font-family: var(--font-mono); font-size: .7rem; letter-spacing: .16em; text-transform: uppercase; color: var(--straw); }
.collab__party { font-weight: 700; }
.collab__x { color: var(--straw); font-weight: 700; }
.facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; margin: 0; border-top: 1px solid rgba(255,255,255,.18); }
.facts > div { padding: 14px 16px 4px 0; border-right: 1px solid rgba(255,255,255,.12); padding-left: 16px; }
.facts > div:first-child { padding-left: 0; }
.facts > div:last-child { border-right: 0; }
.facts dt { font-family: var(--font-mono); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--band-muted); }
.facts dd { margin: 4px 0 0; font-family: var(--font-display); font-weight: 800; font-size: 2rem; line-height: 1.05; font-variant-numeric: tabular-nums; }
.facts dd.mono { font-family: var(--font-mono); font-weight: 500; font-size: 1.15rem; padding-top: 8px; }
.facts small { display: block; font-family: var(--font-body); font-size: .8rem; font-weight: 400; color: var(--band-muted); }
@media (max-width: 720px) {
  .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .facts > div { padding-left: 0; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.1); padding-bottom: 12px; }
}

/* ---------- Sections ---------- */
.sec { padding-block: 72px; }
.sec--tint { background: var(--tint); }
.sec--dark { background: var(--band); color: var(--band-ink); }
.hero, .sec--dark, .foot { --straw: #D6E4FF; --accent: #FFFFFF; }
.sec--dark .lead { color: var(--band-muted); }
.sec__head { margin-bottom: 2rem; }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
@media (max-width: 820px) { .grid-2 { grid-template-columns: minmax(0, 1fr); } }
.prose { max-width: 65ch; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 24px; }
.kv { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 8px 18px; margin: 0; }
.kv dt { color: var(--ink); opacity: .7; font-size: .95rem; }
.kv dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.kv .mono { font-family: var(--font-mono); font-weight: 500; }
.kv--dark dt { color: var(--band-muted); opacity: 1; }
.visi { font-size: var(--step-1); font-style: italic; border-left: 3px solid var(--straw); padding-left: 16px; }
.misi { padding-left: 1.3em; }
.misi li { margin-bottom: .4em; }

.compass { display: grid; grid-template-columns: 1fr minmax(90px, 1fr) 1fr; grid-template-rows: auto auto auto; gap: 8px; text-align: center; }
.compass .c { background: var(--tint); border: 1px solid var(--line); border-radius: 8px; padding: 10px; font-size: .92rem; min-width: 0; overflow-wrap: anywhere; }
.compass .c b { display: block; font-family: var(--font-mono); font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: var(--straw); font-weight: 500; }
.compass .n { grid-column: 2; grid-row: 1; }
.compass .w { grid-column: 1; grid-row: 2; }
.compass .mid { grid-column: 2; grid-row: 2; display: grid; place-items: center; font-family: var(--font-display); font-weight: 800; text-transform: uppercase; color: var(--accent); border: 2px dashed var(--accent); border-radius: 8px; padding: 8px; line-height: 1; font-size: 1.1rem; }
.compass .e { grid-column: 3; grid-row: 2; }
.compass .s { grid-column: 2; grid-row: 3; }
@media (max-width: 520px) { .compass { grid-template-columns: 1fr 1fr; } .compass .n, .compass .s, .compass .mid { grid-column: 1 / -1; } .compass .w { grid-column: 1; grid-row: 3; } .compass .e { grid-column: 2; grid-row: 3; } .compass .s { grid-row: 4; } .compass .mid { grid-row: 2; } }

/* ---------- Struktur organisasi ---------- */
.org { display: flex; flex-direction: column; align-items: center; gap: 0; overflow-x: auto; padding-bottom: 8px; }
.org__row { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; position: relative; padding-top: 22px; width: 100%; }
.org__row::before { content: ""; position: absolute; top: 0; left: 50%; width: 2px; height: 22px; background: var(--line); transform: translateX(-1px); }
.org__row:first-child { padding-top: 0; }
.org__row:first-child::before { display: none; }
.org__label { width: 100%; text-align: center; font-family: var(--font-mono); font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-bottom: -4px; }
.node { background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--accent); border-radius: 8px; padding: 12px 14px; width: 210px; max-width: 100%; text-align: center; }
.node--top { border-top-color: var(--straw); width: 260px; }
.node__photo { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 8px; background: var(--tint); display: grid; place-items: center; font-family: var(--font-display); font-weight: 800; color: var(--accent); font-size: 1.4rem; overflow: hidden; }
.node__photo img { width: 100%; height: 100%; object-fit: cover; }
.node__jab { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.node__nama { font-weight: 700; margin-top: 2px; }
.roster { list-style: none; padding: 0; margin: 0; display: grid; gap: 0; border-top: 1px solid var(--line); }
.roster li { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.roster li span:first-child { color: var(--muted); }
.roster li span:last-child { font-weight: 600; text-align: right; }

/* ---------- Statistik ---------- */
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 720px) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.stat { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 16px; }
.stat b { display: block; font-family: var(--font-display); font-weight: 800; font-size: 2.3rem; line-height: 1; font-variant-numeric: tabular-nums; }
.stat span { font-size: .92rem; }
.stat b, .school b { color: var(--accent); }
.panel { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 20px; min-width: 0; }
.panel__head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 8px 16px; }
.legend { font-size: .88rem; color: var(--ink); display: flex; align-items: center; gap: 6px; }
.sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-left: 6px; }
.sw--l { background: var(--sex-l); } .sw--p { background: var(--sex-p); }

.pyramid { display: grid; gap: 3px; margin-top: 12px; font-variant-numeric: tabular-nums; }
.pyr { display: grid; grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr); align-items: center; gap: 8px; font-size: .82rem; }
.pyr__side { display: flex; align-items: center; gap: 6px; min-width: 0; }
.pyr__side--l { justify-content: flex-end; }
.pyr__bar { height: 16px; border-radius: 3px; min-width: 2px; }
.pyr__side--l .pyr__bar { background: var(--sex-l); border-radius: 3px 0 0 3px; }
.pyr__side--p .pyr__bar { background: var(--sex-p); border-radius: 0 3px 3px 0; }
.pyr__num { color: var(--ink); width: 3ch; flex: none; }
.pyr__side--l .pyr__num { text-align: right; }
.pyr__age { text-align: center; font-family: var(--font-mono); font-size: .76rem; color: var(--ink); }

.bars { display: grid; gap: 10px; margin-top: 8px; }
.bar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 10px; font-size: .92rem; }
.bar__val { font-variant-numeric: tabular-nums; color: var(--ink); }
.bar__val b { color: var(--ink); }
.bar__track { grid-column: 1 / -1; height: 8px; background: var(--line); border-radius: 99px; overflow: hidden; }
.bar__fill { height: 100%; background: var(--accent); border-radius: 99px; }

.school { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 8px; }
.school div { border: 1px solid var(--line); border-radius: 8px; padding: 12px; }
.school b { display: block; font-family: var(--font-display); font-weight: 800; font-size: 2rem; line-height: 1; font-variant-numeric: tabular-nums; color: var(--accent); }
.school span { display: block; font-weight: 600; margin-top: 4px; }
.school small { color: var(--muted); font-family: var(--font-mono); font-size: .74rem; }

.tablewrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: .95rem; min-width: 520px; }
.tbl th { text-align: left; font-family: var(--font-mono); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 500; border-bottom: 2px solid var(--line); padding: 8px 10px; }
.tbl td { border-bottom: 1px solid var(--line); padding: 10px; vertical-align: top; }
.tbl td:first-child { white-space: nowrap; }
.tag { display: inline-block; font-size: .78rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; background: var(--tint); color: var(--accent); }

/* ---------- Peta drone ---------- */
.mapwrap { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 20px; align-items: start; }
@media (max-width: 900px) { .mapwrap { grid-template-columns: minmax(0, 1fr); } }
.map { position: relative; aspect-ratio: 4 / 3; max-width: 100%; border-radius: var(--r); overflow: hidden; background: #FFFFFF; border: 1px solid rgba(255,255,255,.4); }
.map canvas, .map img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.map__pins { position: absolute; inset: 0; }
.pin { position: absolute; transform: translate(-50%, -100%); background: none; border: 0; padding: 0; cursor: pointer; }
.pin__dot { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: var(--pin, #E0B25A); border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(10,30,80,.35); transition: transform .15s; }
.pin__dot i { transform: rotate(45deg); font-style: normal; font-weight: 800; font-size: .72rem; color: #FFFFFF; font-family: var(--font-mono); }
.pin:hover .pin__dot, .pin.is-active .pin__dot { transform: rotate(-45deg) scale(1.2); }
.pin.is-active .pin__dot { border-color: #0A0A0A; }
.map__north { position: absolute; top: 10px; right: 10px; background: #FFFFFF; color: var(--ink); font-family: var(--font-mono); font-size: .75rem; padding: 4px 8px; border-radius: 6px; }
.map__tag { position: absolute; left: 10px; bottom: 10px; background: #FFFFFF; color: #1452C2; font-family: var(--font-mono); font-size: .72rem; padding: 4px 8px; border-radius: 6px; }
.mapinfo { display: grid; gap: 16px; }
.mapinfo__card { background: var(--band-2); border: 1px solid rgba(255,255,255,.25); border-radius: var(--r); padding: 18px; min-height: 150px; }
.mapinfo__kat { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: var(--straw); margin-bottom: .3rem; }
.mapinfo__card p:last-child { margin-bottom: 0; color: var(--band-muted); }
.mapfilter { display: flex; flex-wrap: wrap; gap: 6px; }
.fbtn { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--band-ink); border: 1px solid rgba(255,255,255,.5); border-radius: 99px; padding: 5px 11px; font: 600 .85rem var(--font-body); cursor: pointer; }
.fbtn::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--pin); box-shadow: 0 0 0 1.5px #FFFFFF; }
.fbtn[aria-pressed="false"] { opacity: .45; }
.btn { display: inline-block; text-align: center; padding: 10px 16px; border-radius: 8px; font-weight: 700; text-decoration: none; }
.btn--ghost { border: 1px solid var(--straw); color: var(--straw); }
.btn--ghost:hover { background: rgba(255,255,255,.12); }

/* ---------- Video ---------- */
.video { position: relative; aspect-ratio: 16 / 9; max-width: 100%; border-radius: var(--r); overflow: hidden; background: var(--band); color: var(--band-ink); }
.video iframe, .video video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.video__poster { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 24px; border: 0; width: 100%; background: linear-gradient(160deg, var(--band-2), var(--band)); color: var(--band-ink); cursor: pointer; font: inherit; }
.video__poster img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .55; }
.video__poster > div { position: relative; }
.video__play { display: grid; place-items: center; width: 76px; height: 76px; border-radius: 50%; background: #FFFFFF; color: #1452C2; margin: 0 auto 14px; font-size: 1.8rem; padding-left: 6px; }
.video__poster b { font-family: var(--font-display); font-weight: 800; font-size: 1.6rem; text-transform: uppercase; display: block; }
.video__poster small { color: var(--band-muted); }
.video__poster[disabled] { cursor: default; }
.video__poster[disabled] .video__play { background: transparent; border: 2px dashed var(--band-muted); color: var(--band-muted); }

/* ---------- Potensi, kegiatan, galeri ---------- */
.potensi { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 900px) { .potensi { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 480px) { .potensi { grid-template-columns: minmax(0, 1fr); } }
.pot { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 18px; }
.pot h3 { font-family: var(--font-display); font-weight: 800; text-transform: uppercase; font-size: 1.35rem; color: var(--accent); margin-bottom: .3em; }
.pot p { margin: 0; color: var(--ink); font-size: .95rem; }
.timeline { list-style: none; padding: 0; margin: 0; display: grid; gap: 0; border-left: 2px solid var(--line); }
.timeline li { position: relative; padding: 0 0 18px 20px; }
.timeline li::before { content: ""; position: absolute; left: -7px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--straw); }
.timeline time { font-family: var(--font-mono); font-size: .75rem; color: var(--accent); }
.timeline b { display: block; }
.timeline p { margin: 0; color: var(--ink); }
.gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 720px) { .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gallery figure { margin: 0; position: relative; aspect-ratio: 4 / 3; max-width: 100%; border-radius: 8px; overflow: hidden; background: var(--tint); }
.gallery img { width: 100%; height: 100%; object-fit: cover; }
.gallery .ph { position: absolute; inset: 0; background: repeating-linear-gradient(100deg, transparent 0 14px, rgba(20,82,194,.14) 14px 16px), var(--tint); }
.gallery figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 10px 8px; font-size: .88rem; font-weight: 600; color: #fff; background: linear-gradient(transparent, rgba(11,58,143,.85)); }

.card--collab { border-top: 4px solid var(--straw); }
.foot { background: var(--band); color: var(--band-ink); padding-block: 36px; font-size: .92rem; }
.foot b { color: #FFFFFF; }
.foot__in { display: grid; gap: 10px; }
.foot__in p { margin: 0; }
.foot__collab { color: var(--band-ink); }
```

=== FILE: assets/js/data.js ===
```javascript
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
```

=== FILE: assets/js/app.js ===
```javascript
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
```
~~~~
