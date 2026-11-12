// Ambil tangkapan layar setiap bagian website (dipakai sekali untuk membuat PDF panduan).
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:8765/';
const OUT = process.env.OUT || 'ss';
fs.mkdirSync(OUT, { recursive: true });
const D = [ // [nama, hash, selector (null = paling atas), tunggu ms]
  ['01-beranda-atas', 'beranda', null, 5000],
  ['02-beranda-fakta', 'beranda', '#facts', 2500],
  ['03-beranda-kegiatan', 'beranda', '.keg', 3000],
  ['04-beranda-momen', 'beranda', '#momen', 3000],
  ['05-beranda-berita', 'beranda', '#berita', 3000],
  ['06-beranda-jelajah', 'beranda', '.explore', 2000],
  ['07-profil-tentang', 'tentang', null, 3000],
  ['08-profil-visi-batas', 'tentang', '#visi', 3000],
  ['09-profil-pemerintahan', 'pemerintahan', null, 3000],
  ['10-profil-potensi', 'potensi', null, 3000],
  ['11-profil-potensi-kalender', 'potensi', '.kal', 2500],
  ['12-profil-kegiatan', 'kegiatan', null, 3000],
  ['13-profil-video', 'video', null, 4000],
  ['14-profil-galeri', 'galeri', '#galeri', 3000],
  ['15-data-penduduk', 'penduduk', null, 3000],
  ['16-data-penduduk-rincian', 'penduduk', '#dPekerjaan', 2500],
  ['17-data-sarana', 'sarana', null, 2500],
  ['18-transparansi-apbkam', 'apbkam', null, 3000],
  ['19-transparansi-rpjmk', 'perencanaan', null, 3000],
  ['20-jelajah-peta', 'petakampung', null, 7000],
  ['21-jelajah-fasilitas', 'fasilitas', null, 7000],
  ['22-jelajah-fasilitas-peta', 'fasilitas', '#fasilMap', 6000],
  ['23-jelajah-wisata', 'wisatakuliner', null, 6000],
  ['24-layanan-surat', 'layanan', null, 2500],
  ['25-layanan-ajukan', 'layanan', '#ajukan', 2500],
  ['26-layanan-kontak', 'kontak', null, 2500],
  ['27-aspirasi-kaki', 'kontak', '#aspirasi', 2000],
];
(async () => {
  const b = await chromium.launch(process.env.CHANNEL ? { channel: process.env.CHANNEL, args: ['--autoplay-policy=no-user-gesture-required'] } : { args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, colorScheme: 'light', locale: 'id-ID' });
  const p = await ctx.newPage();
  for (const [nama, hash, sel, tunggu] of D) {
    try {
      await p.goto(BASE + '#' + hash, { waitUntil: 'load' }); await p.waitForTimeout(1200);
      if (sel) await p.evaluate((s) => { const e = document.querySelector(s); if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 150); }, sel);
      else await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(tunggu);
      await p.screenshot({ path: `${OUT}/${nama}.jpg`, type: 'jpeg', quality: 82 });
      console.log('ok', nama);
    } catch (e) { console.log('GAGAL', nama, e.message); }
  }
  // Halaman tambahan
  for (const [nama, url, tunggu] of [['28-halaman-apbk', 'apbk.html', 3000], ['29-halaman-rpjmk', 'rpjmk.html', 3000], ['30-portal-admin', 'admin/', 2000]]) {
    try { await p.goto(BASE + url, { waitUntil: 'load' }); await p.waitForTimeout(tunggu); await p.screenshot({ path: `${OUT}/${nama}.jpg`, type: 'jpeg', quality: 82 }); console.log('ok', nama); } catch (e) { console.log('GAGAL', nama, e.message); }
  }
  // Tampilan HP (terang & gelap)
  for (const [nama, hash, sel, skema] of [['31-hp-beranda', 'beranda', null, 'light'], ['32-hp-beranda-gelap', 'beranda', '#facts', 'dark'], ['33-hp-layanan-form', 'layanan', '#ajukan', 'light']]) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: skema, locale: 'id-ID' });
    const q = await c.newPage();
    try {
      await q.goto(BASE + '#' + hash, { waitUntil: 'load' }); await q.waitForTimeout(1500);
      if (sel) await q.evaluate((s) => { const e = document.querySelector(s); if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 120); }, sel);
      await q.waitForTimeout(4000);
      await q.screenshot({ path: `${OUT}/${nama}.jpg`, type: 'jpeg', quality: 82 }); console.log('ok', nama);
    } catch (e) { console.log('GAGAL', nama, e.message); }
    await c.close();
  }
  await b.close();
})();
