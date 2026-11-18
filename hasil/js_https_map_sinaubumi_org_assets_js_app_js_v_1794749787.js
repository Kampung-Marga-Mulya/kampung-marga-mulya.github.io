(() => {
'use strict';
const APP = window.APP;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ── Warna marker berdasarkan suhu ────────────────────────────────────────
const colorCache = new Map();
function getColorByTemperature(temp, isActive) {
  const cacheKey = `${temp}-${isActive}`;
  if (colorCache.has(cacheKey)) return colorCache.get(cacheKey);
  const put = (c) => { colorCache.set(cacheKey, c); return c; };
  if (!isActive || temp === null || temp === undefined) return put('rgb(128, 128, 128)');
  const colors = [[0, [34, 211, 238]], [10, [34, 197, 94]], [20, [255, 215, 0]], [30, [255, 165, 0]], [40, [255, 0, 0]], [50, [153, 27, 27]]];
  temp = Math.max(0, Math.min(50, temp));
  const i = colors.findIndex(([t]) => temp <= t);
  if (i === -1) return put('rgb(128, 128, 128)');
  if (i === 0) return put(`rgb(${colors[0][1]})`);
  const [t1, c1] = colors[i - 1], [t2, c2] = colors[i];
  const ratio = (temp - t1) / (t2 - t1);
  return put(`rgb(${c1.map((v, j) => Math.round(v + ratio * (c2[j] - v)))})`);
}

// ── Parameter panel ──────────────────────────────────────────────────────
const COMPASS = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
// awsm: true => ikut tampil di stasiun bertipe AWSM (hanya 4 parameter)
const PARAMS = [
  { key: 'rain_rate', title: 'Intensitas Hujan', unit: 'mm/jam', d: 1, awsm: true },
  { key: 'temp', title: 'Suhu Udara', unit: '°C', d: 1, awsm: true },
  { key: 'dew_point', title: 'Suhu Titik Embun', unit: '°C', d: 1 },
  { key: 'humidity', title: 'Kelembapan Udara', unit: '%', d: 0, awsm: true },
  { key: 'solar', title: 'Radiasi Matahari', unit: 'W/m²', d: 1 },
  { key: 'sunshine', title: 'Lama Penyinaran', unit: 'jam/hari', d: 2 },
  { key: 'wind_speed', title: 'Kecepatan Angin', unit: 'm/s', d: 1 },
  { key: 'wind_dir', title: 'Arah Angin Dari', dir: true },
  { key: 'pressure', title: 'Tekanan Udara', unit: 'hPa', d: 1, awsm: true },
  { key: 'eto', title: 'Evapotranspirasi', unit: 'mm/hari', d: 1 },
];

// ── Peta ─────────────────────────────────────────────────────────────────
const MAP_BOUNDS = [[-13, 92], [10, 143]];
const map = L.map('map', { zoomControl: false, attributionControl: false, zoomSnap: 0.1, zoomDelta: 1.0, maxBounds: MAP_BOUNDS, maxBoundsViscosity: 1.0 }).setView([-2.5, 118.0], 5.2);
// Batas zoom-out mengikuti ukuran layar: peta tidak boleh lebih kecil dari area MAP_BOUNDS
const updateMinZoom = () => { map.setMinZoom(map.getBoundsZoom(MAP_BOUNDS, false)); };
updateMinZoom();
map.on('resize', updateMinZoom);
const voyager = L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_29cj_1_6fe470c5392f7473d8c31813', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/">CARTO</a>', subdomains: 'abcd', maxZoom: 19
}).addTo(map);
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
// Kontrol waktu (created_at terbaru, WIB) — diletakkan paling atas (topright)
const timeControl = L.control({ position: 'topright' });
timeControl.onAdd = () => {
  const div = L.DomUtil.create('div');
  div.className = 'bg-zinc-100 ring-1 ring-zinc-900/25 font-medium text-[12px] text-zinc-900 antialiased px-2 py-1.5 rounded';
  div.innerHTML = '<span>Waktu:</span> <span id="time-ctl">-</span>';
  return div;
};
timeControl.addTo(map);

// Jenis peta dipilih lewat modal Konfigurasi (tanpa kontrol layer di peta)
const BASEMAPS = [['voyager', 'CartoDB Voyager', voyager], ['satellite', 'ESRI World Imagery', satellite]];
let baseKey = 'voyager';
function setBaseMap(key) {
  const next = BASEMAPS.find((b) => b[0] === key);
  if (!next || key === baseKey) return;
  const prev = BASEMAPS.find((b) => b[0] === baseKey);
  map.removeLayer(prev[2]);
  next[2].addTo(map);
  baseKey = key;
  // Scale bar: hitam di Voyager, putih di citra satelit
  document.body.classList.toggle('basemap-satellite', key === 'satellite');
  map.fire('baselayerchange', { layer: next[2] }); // perbarui teks atribusi
}
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.locate({ position: 'topright' }).addTo(map);

// ── Scale bar vertikal (metrik): tinggi bar mengikuti jarak "bulat" terdekat
function setupVScale(el) {
  el.innerHTML = '<span class="vscale-label"></span><div class="vscale-bar"></div>';
  const bar = el.querySelector('.vscale-bar'), label = el.querySelector('.vscale-label');
  const nice = (m) => { const p = Math.pow(10, Math.floor(Math.log10(m))), d = m / p; return p * (d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1); };
  const update = () => {
    const maxPx = 90, sz = map.getSize(), y = sz.y / 2;
    const m = map.distance(map.containerPointToLatLng([sz.x / 2, y]), map.containerPointToLatLng([sz.x / 2, y - maxPx]));
    if (!m) return;
    const v = nice(m);
    bar.style.height = Math.round(maxPx * v / m) + 'px';
    label.textContent = v >= 1000 ? (v / 1000) + ' km' : v + ' m';
  };
  map.on('move zoom resize', update);
  update();
}

// ── Atribusi: tombol bulat kecil (ikon info); deskripsi muncul dari kanan ke kiri saat diklik
(function setupAttribution() {
  const ctl = L.control({ position: 'bottomright' });
  let wrap, bubble, current = voyager;
  const render = () => {
    const base = (current && current.options && current.options.attribution) || '';
    bubble.innerHTML = '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>' + (base ? ' | ' + base : '');
    bubble.querySelectorAll('a').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
  };
  const setOpen = (open) => { wrap.classList.toggle('open', open); wrap.querySelector('button').setAttribute('aria-expanded', open); };
  ctl.onAdd = () => {
    wrap = L.DomUtil.create('div', 'attr-wrap');
    wrap.innerHTML = `<div class="attr-bubble" role="note"></div>
      <div class="attr-scale"></div>
      <button type="button" title="Atribusi peta" aria-label="Atribusi peta" aria-expanded="false" class="attr-btn bg-zinc-100 ring-1 ring-zinc-900/25 hover:bg-zinc-200 transition-colors rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-[15px] w-[15px] text-zinc-700" viewBox="0 0 512 512" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      </button>`;
    bubble = wrap.querySelector('.attr-bubble');
    // Scale line di sebelah kiri tombol atribusi
    setupVScale(wrap.querySelector('.attr-scale'));
    render();
    setOpen(true); // atribusi terbuka secara default
    wrap.querySelector('button').addEventListener('click', () => setOpen(!wrap.classList.contains('open')));
    L.DomEvent.disableClickPropagation(wrap);
    L.DomEvent.disableScrollPropagation(wrap);
    return wrap;
  };
  ctl.addTo(map);
  // Ganti teks atribusi mengikuti basemap yang aktif; hanya tombol yang membuka/menutup
  map.on('baselayerchange', (e) => { current = e.layer; render(); });
})();


// Tombol cari & konfigurasi (topright, di bawah kontrol Locate)
function iconButton(id, title, svg, extra = '') {
  const c = L.control({ position: 'topright' });
  c.onAdd = () => {
    const el = L.DomUtil.create('div', extra);
    el.innerHTML = `<button id="${id}" type="button" title="${title}" class="bg-zinc-100 ring-1 ring-zinc-900/25 hover:bg-zinc-200 transition-colors rounded w-[33px] h-[33px] flex items-center justify-center cursor-pointer">${svg}</button>`;
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
    return el;
  };
  c.addTo(map);
}
iconButton('stationSearchBtn', 'Cari Stasiun',
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>');
// Ikon gear sama seperti halaman FWI
iconButton('configBtn', 'Konfigurasi',
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-700" viewBox="0 0 512 512" fill="currentColor"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L60.9 439.8c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C42.4 273.1 41.8 264.6 41.8 256s.6-17.1 1.7-25.4L.2 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C205.1 1.2 219.3 0 233.8 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>', 'mt-1.5');

// ── Tombol link (mobile saja, topleft) — sama seperti halaman FWI ─────────
// Tujuan link mengikuti domain (sinaubumi.org / awskomunitas.id) lewat APP.links
const LINK_BUTTONS = [
  { key: 'FWI', cls: 'fwiButtonLink', px: 'px-[7px] pt-1', pxAk: 'px-[8px] pt-1', h: 21, vb: '0 0 448 512', d: 'M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z' },
  { key: 'HPT', cls: 'hptButtonLink', px: 'px-[6px] pt-1', h: 21, vb: '0 0 576 512', d: 'M178.5 495.2c-7.5 9.6-21 12.1-31.3 5.3S133.5 480 138.9 469l1.2-2.2 36.2-58 0-41 .3-4c.6-3.9 2.2-7.7 4.6-10.9l39.3-52.2-66.2 59.5c-17 15.3-39 23.7-61.9 23.8l-8.1 0c-46.6 0-84.4-37.8-84.4-84.4 0-43 32.4-79.2 75.1-83.9l130.5-14.5-44.8-38.3-2.4-2.4c-5.3-6-7.3-14.4-5.3-22.3l13.3-53.4-25.9-38.9-1.3-2.1c-5.8-10.8-2.7-24.6 7.4-31.7 10.1-7.1 23.7-5.1 31.4 4.3l1.5 2 32 48 1.4 2.2c2.8 5.3 3.5 11.6 2.1 17.6l-12.3 49.2 53.3 45.7 0-28.8c0-11.8 6.5-22.1 16-27.7l0-60.5 .3-3.3c1.5-7.3 8-12.7 15.7-12.7s14.2 5.5 15.7 12.7l.3 3.2 0 60.5c9.6 5.5 16 15.8 16 27.7l0 28.9 53.4-45.8-12.3-49.2c-1.5-5.9-.7-12.2 2.1-17.6l1.4-2.2 32-48 1.5-2c7.7-9.4 21.3-11.5 31.4-4.3 10.1 7.1 13.1 20.9 7.4 31.7l-1.3 2.1-25.9 38.9 13.3 53.4c2 8-.1 16.3-5.3 22.3l-2.4 2.4-44.7 38.3 130.5 14.5c42.8 4.8 75.1 40.9 75.1 83.9 0 46.6-37.8 84.4-84.4 84.4l-8.1 0c-22.8 0-44.9-8.5-61.9-23.8l-66.1-59.5 39.2 52.2c2.4 3.2 4 7 4.6 10.9l.3 4 0 41 36.2 58 1.2 2.1c5.4 11 2 24.7-8.3 31.5s-23.8 4.4-31.3-5.3l-1.4-2-40-64-1.6-3.1c-1.4-3.1-2.1-6.6-2.1-10.1l0-39.8-32.4-43.1 0 74.7c0 17.7-14.3 32-32 32-17.7 0-32-14.3-32-32l0-74.6-32.3 43 0 39.8c0 3.5-.7 6.9-2.1 10.1l-1.6 3.1-40 64-1.4 2z' },
  { key: 'KAT', cls: 'katButtonLink', px: 'px-[7px] pt-1', h: 22, vb: '0 0 640 640', d: 'M576 96C576 204.1 499.4 294.3 397.6 315.4C389.7 257.3 363.6 205 325.1 164.5C365.2 104 433.9 64 512 64L544 64C561.7 64 576 78.3 576 96zM64 160C64 142.3 78.3 128 96 128L128 128C251.7 128 352 228.3 352 352L352 544C352 561.7 337.7 576 320 576C302.3 576 288 561.7 288 544L288 384C164.3 384 64 283.7 64 160z' },
  { key: 'DBD', cls: 'dbdButtonLink', px: 'px-[6.5px] pt-1 pb-[2px]', h: 20, vb: '0 0 384 512', d: 'M192 512C86 512 0 426 0 320 0 228.8 130.2 45.9 166.6-3.5 172.5-11.5 181.8-16 191.8-16l.4 0c10 0 19.3 4.5 25.2 12.5 36.4 49.4 166.6 232.3 166.6 323.5 0 106-86 192-192 192zM112 312c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 75.1 60.9 136 136 136 13.3 0 24-10.7 24-24s-10.7-24-24-24c-48.6 0-88-39.4-88-88z' },
];
LINK_BUTTONS.forEach((b) => {
  const href = (APP.links || {})[b.key];
  if (!href) return;
  const px = (b.pxAk && href.includes('awskomunitas')) ? b.pxAk : b.px;
  const c = L.control({ position: 'topleft' });
  c.onAdd = () => {
    const div = L.DomUtil.create('div', `${b.cls} lg:hidden`);
    div.innerHTML = `<button class="bg-zinc-100 ring-1 ring-zinc-900/25 ${px} rounded"><a href="${esc(href)}" target="_blank" rel="noopener" class="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-[${b.h}px] w-auto" viewBox="${b.vb}"><path d="${b.d}"/></svg><p class="text-[12px] font-semibold text-zinc-900">${b.key}</p></a></button>`;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  c.addTo(map);
});

// ── Marker windbarb ──────────────────────────────────────────────────────
// Z-index marker = posisi-y piksel + offset. Offset harus jauh lebih besar dari selisih
// posisi-y antar stasiun (bisa ribuan piksel saat zoom dekat) agar online selalu di atas offline.
// Online = status API online DAN tidak ada catatan/kendala alat; selain itu dianggap Offline/Kendala Alat
const isOnline = (m) => !!m.is_active && !m.notes;
const ONLINE_Z = 100000;
// Urutan tumpukan: online (suhu ada) > offline (suhu ada) > suhu null (online maupun offline)
const zOffsetFor = (m) => (m.temp === null || m.temp === undefined) ? -ONLINE_Z : (isOnline(m) ? ONLINE_Z : 0);

// Catatan otomatis untuk stasiun offline
const OFFLINE_NOTE = 'Konsol AWS tidak tersambung dengan listrik atau internet. Segera cek kelistrikan atau kondisi internet konsol AWS!';
// Konsol offline sekaligus sensor outdoor bermasalah
const OFFLINE_SENSOR_NOTE = 'Konsol AWS tidak tersambung dengan listrik atau internet dan sensor AWS outdoor habis baterai atau terlalu jauh dari konsol. Segera cek kelistrikan atau kondisi internet konsol AWS dan Segera ganti baterai sensor AWS outdoor!';
const entries = new Map();   // slug -> { m, layer }
let activeSlug = null;
let firstFit = true;

let _warnedBarb = false;
// Pembulatan suhu: desimal < 0.5 ke bawah, >= 0.5 ke atas; tidak ada data → "-"
const roundTemp = (t) => (t === null || t === undefined) ? '-' : Math.round(t);
// Hujan > 0.5 mm/jam DAN stasiun online → angka suhu di marker biru (.marker-temp.is-rain).
// Stasiun offline tetap putih walau data terakhirnya hujan.
const isRaining = (m) => isOnline(m) && m.rain_rate !== null && m.rain_rate !== undefined && m.rain_rate > 0.5;
function makeIcon(m) {
  const windKnot = m.wind_knot ?? 0;
  const fill = getColorByTemperature(m.temp, isOnline(m));
  const label = roundTemp(m.temp);
  const labelClass = isRaining(m) ? 'is-rain' : '';
  // AWSM tidak punya arah/kecepatan angin → marker kotak polos (tanpa windbarb)
  if (m.type === 'AWSM') {
  return L.divIcon({ className: '', iconSize: [23, 23], iconAnchor: [11.5, 11.5], html: `<svg width="23" height="23" style="display:block"><rect x="1.25" y="1.25" width="20.5" height="20.5" rx="2.5" fill="${fill}"/></svg><span class="marker-temp ${labelClass}" style="width:23px;height:23px;font-size:11px">${label}</span>` });
  }
  if (!L.WindBarb) { // fallback jika leaflet-windbarb.js belum diisi
    if (!_warnedBarb) { _warnedBarb = true; console.error('[AWS] L.WindBarb tidak ditemukan. Isi assets/js/leaflet-windbarb.js dengan kode windbarb.'); }
    return L.divIcon({ className: '', iconSize: [26, 26], iconAnchor: [13, 13], html: `<svg width="26" height="26" style="display:block"><circle cx="13" cy="13" r="11" fill="${fill}" stroke="#18181b" stroke-width="1.5"/></svg><span class="marker-temp ${labelClass}" style="width:26px;height:26px">${label}</span>` });
  }
  return L.WindBarb.icon({
    deg: m.wind_dir ?? 0,
    speed: windKnot,
    pointRadius: 11,
    strokeWidth: 1.5,
    strokeLength: 10,
    barbHeight: 10,
    fillColor: fill,
    label,
    labelClass,
    forceDir: windKnot > 0.194384,
    mirrorVel: m.lat < 0,
  });
}

// ── Tooltip (sistem sama seperti halaman FWI) ────────────────────────────
// Isi tooltip hanya nama stasiun. Saat hover: tooltip biasa; stasiun yang
// sedang dipilih: tooltip permanen terpisah (L.tooltip) sampai panel ditutup.
// Tooltip hover di-bind SEKALI saat marker dibuat dan tidak pernah di-unbind:
// Leaflet 1.9.x tidak melepas listener 'focus' saat unbindTooltip(), sehingga
// fokus pada marker yang tooltip-nya sudah di-unbind memicu error
// "Cannot set properties of null (setting '_source')".
const TIP_OPTS = { direction: 'top', offset: [0, -14] };
let activeTip = null;
const tipHtml = (m) => esc(m.name);

function setActiveTip(e) {
  clearActiveTip();
  e.layer.closeTooltip(); // tooltip hover ditutup, diganti yang permanen
  activeTip = L.tooltip({ permanent: true, direction: 'top', offset: [0, -14], interactive: false, className: 'active-station-tooltip' })
    .setLatLng([e.m.lat, e.m.lon])
    .setContent(tipHtml(e.m))
    .addTo(map);
}
function clearActiveTip() {
  if (activeTip) { map.removeLayer(activeTip); activeTip = null; }
}

// ── Filter stasiun ───────────────────────────────────────────────────────
let stationFilter = 'online';
const FILTERS = [['all', 'Semua Stasiun'], ['online', 'Online'], ['offline', 'Offline/Kendala Alat']];
// filterHides: murni berdasarkan filter. isHidden: stasiun yang sedang dibuka panelnya (mis. lewat URL ?stasiun=slug
// atau pencarian) tetap tampil walau di luar filter, lalu kembali tersembunyi saat panel ditutup / pindah stasiun.
const filterHides = (m) => (stationFilter === 'online' && !isOnline(m)) || (stationFilter === 'offline' && isOnline(m));
const isHidden = (m) => filterHides(m) && m.slug !== activeSlug;
const filterCount = (v) => { let n = 0, on = 0; entries.forEach(({ m }) => { n++; if (isOnline(m)) on++; }); return v === 'all' ? n : v === 'online' ? on : n - on; };

function applyVisibility() {
  entries.forEach(({ m, layer }) => {
    if (isHidden(m)) { if (map.hasLayer(layer)) map.removeLayer(layer); }
    else if (!map.hasLayer(layer)) layer.addTo(map);
  });
}

window.openConfigModal = () => {
  $('configBasemapOptions').innerHTML = BASEMAPS.map(([v, l]) => `
    <label class="config-option flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-zinc-400">
      <input type="radio" name="basemap" value="${v}" ${v === baseKey ? 'checked' : ''} class="w-4 h-4 accent-zinc-700">
      <span class="text-sm font-medium text-slate-700">${l}</span></label>`).join('');
  $('configStationFilterOptions').innerHTML = FILTERS.map(([v, l]) => `
    <label class="config-option flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-zinc-400">
      <input type="radio" name="stationFilter" value="${v}" ${v === stationFilter ? 'checked' : ''} class="w-4 h-4 accent-zinc-700">
      <span class="text-sm font-medium text-slate-700">${l} (${filterCount(v)})</span></label>`).join('');
  $('configModal').classList.remove('modal-hidden');
};
window.closeConfigModal = () => $('configModal').classList.add('modal-hidden');
window.applyConfigSelection = () => {
  const r = document.querySelector('input[name="stationFilter"]:checked');
  stationFilter = r ? r.value : 'online';
  const b = document.querySelector('input[name="basemap"]:checked');
  if (b) setBaseMap(b.value);
  applyVisibility();
  const a = entries.get(activeSlug);
  if (a && filterHides(a.m)) closePanel();
  closeConfigModal();
};
$('configBtn').addEventListener('click', (e) => { e.stopPropagation(); openConfigModal(); });

// ── Terapkan data baru (marker + panel + waktu ikut ter-update) ──────────
function applyData(p) {
  const seen = new Set();
  p.stations.forEach((m) => {
    seen.add(m.slug);
    let e = entries.get(m.slug);
    if (!e) {
      const layer = L.marker([m.lat, m.lon], { icon: makeIcon(m), zIndexOffset: zOffsetFor(m) })
        .bindTooltip(tipHtml(m), TIP_OPTS)
        .on('click', () => openPanel(m.slug))
        // stasiun terpilih sudah punya tooltip permanen → jangan tampilkan tooltip hover ganda
        .on('tooltipopen', function () { if (m.slug === activeSlug) this.closeTooltip(); });
      e = { m, layer };
      entries.set(m.slug, e);
    } else {
      e.m = m;
      e.layer.setLatLng([m.lat, m.lon]);
      e.layer.setIcon(makeIcon(m));
      e.layer.setZIndexOffset(zOffsetFor(m));
    }
    e.layer.setTooltipContent(tipHtml(m));
  });
  entries.forEach((e, slug) => {
    if (!seen.has(slug)) { map.removeLayer(e.layer); entries.delete(slug); }
  });
  if (activeSlug && !entries.has(activeSlug)) { clearActiveTip(); }
  applyVisibility();
  $('time-ctl').textContent = p.time_wib || '-';

  if (firstFit && p.stations.length) {
    const lats = p.stations.map(s => s.lat), lons = p.stations.map(s => s.lon);
    map.setView([(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2], 5.2);
    firstFit = false;
  }
  if (activeSlug) {
    const e = entries.get(activeSlug);
    if (e) { renderPanel(e.m); setActiveTip(e); } else closePanel();
  }
}

// ── Panel samping ────────────────────────────────────────────────────────
// Format angka: pembulatan d desimal; jika desimalnya 0 tampilkan bilangan bulat (3.0 → 3, 3.5 → 3.5)
const fmtNum = (v, d) => String(Number(Number(v).toFixed(d)));
function renderPanel(m) {
  $('panel-name').textContent = m.name;
  const t2 = (v) => (Math.trunc(v * 100) / 100).toFixed(2);
  $('panel-meta').textContent = `Lat : ${t2(m.lat)} | Lon : ${t2(m.lon)} | Alt : ${m.elevation ?? '-'} MDPL`;

  const dot = '<span style="width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block"></span>';
  const badge = (cls, html) => `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}">${html}</span>`;
  $('panel-badges').innerHTML =
    badge(isOnline(m) ? 'bg-green-600 text-zinc-100' : 'bg-red-600 text-zinc-100', dot + (isOnline(m) ? 'Online' : 'Offline')) +
    badge(m.type === 'AWSM' ? 'bg-amber-600 text-zinc-100' : 'bg-sky-600 text-zinc-100', esc(m.type === 'AWSM' ? 'ARG' : m.type)) +
    badge('bg-slate-100 text-slate-500', '📅 ' + esc(m.created_display));

  // AWSM hanya menampilkan 4 parameter
  const cards = PARAMS.filter((p) => m.type !== 'AWSM' || p.awsm).map((p) => {
    let val = '-';
    if (p.dir) {
      if (m.wind_dir !== null && m.wind_dir !== undefined) val = COMPASS[Math.round(m.wind_dir / 45) % 8];
    } else if (m[p.key] !== null && m[p.key] !== undefined) {
      val = fmtNum(m[p.key], p.d) + (p.unit ? ` ${p.unit}` : '');
      // Kecepatan angin: tambahkan nilai knot dalam kurung, mis. "3.5 m/s (6.8 kt)"
      if (p.key === 'wind_speed' && m.wind_knot !== null && m.wind_knot !== undefined) val += ` (${fmtNum(m.wind_knot, p.d)} kt)`;
    }
    // Judul semibold, nilai (+ satuan) normal; ukuran & warna sama
    return `<div class="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center py-3.5 px-2 gap-1.5">
      <div class="text-[14px] font-semibold text-zinc-900 leading-tight">${p.title}</div>
      <div class="text-[14px] font-medium text-zinc-900 leading-tight break-words">${esc(val)}</div></div>`;
  }).join('');

  // Stasiun offline: catatan otomatis menggantikan catatan dari API (kendala sensor tidak relevan jika konsol mati)
  // Konsol online tetapi sensor outdoor bermasalah → awali dengan keterangan bahwa konsol online
  const sensorIssue = /^Sensor AWS outdoor/.test(m.notes || '');
  const noteText = !m.is_active ? (sensorIssue ? OFFLINE_SENSOR_NOTE : OFFLINE_NOTE)
    : sensorIssue ? 'Konsol AWS dalam keadaan online, tetapi s' + m.notes.slice(1).replace(/baterai sensor AWS outdoor\.$/, 'baterai sensor AWS outdoor!')
    : m.notes;
  const notes = noteText
    ? `<div class="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
        <div class="text-[12px] font-bold text-amber-800 mb-1">⚠ Catatan / Kendala Alat</div>
        <p class="text-[12px] text-amber-900 leading-relaxed text-justify whitespace-pre-line">${esc(noteText)}</p></div>` : '';

  // Button group tautan di bawah card (AWSM tanpa tombol prediksi); tombol tanpa tautan tidak ditampilkan
  const dash = (m.link_dashboard || '').replace(/\/+$/, '');
  const linkItems = [['Halaman Utama', m.link || ''], ['Lihat Dashboard', dash]];
  if (m.type !== 'AWSM') linkItems.push(['Prediksi Harian', dash && dash + '/forecast/hourly'], ['Prediksi 10 Harian', dash && dash + '/forecast/daily']);
  const shown = linkItems.filter(([, u]) => u);
  const linkGrid = shown.length
    ? `<h3 class="text-[13px] font-bold text-zinc-800 mt-4 mb-2.5">Link Dashboard Data ${esc(m.type)}</h3>
       <div class="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-sm">${shown.map(([t, u], i) =>
        `<a href="${esc(u)}" target="_blank" rel="noopener" class="${shown.length % 2 && i === shown.length - 1 ? 'col-span-2 ' : ''}bg-white text-zinc-900 text-[13px] font-medium py-2.5 px-2 text-center hover:bg-slate-50 transition-colors inline-flex items-center justify-center group"><span class="inline-block w-0 overflow-hidden opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-150" aria-hidden="true">&rarr;</span><span class="underline underline-offset-2 decoration-zinc-400">${t}</span></a>`).join('')}</div>` : '';

  const body = $('panel-body'), st = body.scrollTop;
  const heading = `<h3 class="text-[13px] font-bold text-zinc-800 mb-2.5">Pemantauan Realtime Data ${esc(m.type)}</h3>`;
  body.innerHTML = `${notes}${heading}<div class="grid grid-cols-2 gap-2">${cards}</div>${linkGrid}`;
  body.scrollTop = st;
}

function openPanel(slug, updateUrl = true) {
  const e = entries.get(slug);
  if (!e) return;
  clearActiveTip();
  activeSlug = slug;
  document.body.classList.add('panel-open');
  if (updateUrl) setStationUrl(slug);
  applyVisibility();
  setActiveTip(e);
  renderPanel(e.m);
}
window.closePanel = function (updateUrl = true) {
  document.body.classList.remove('panel-open');
  clearActiveTip();
  activeSlug = null;
  applyVisibility();
  if (updateUrl !== false) clearStationUrl();
};

// ── Sinkronisasi URL (?stasiun=slug) ─────────────────────────────────────
function setStationUrl(slug) {
  const url = new URL(window.location.href);
  url.searchParams.set('stasiun', slug);
  history.pushState({ stasiun: slug }, '', url);
}
function clearStationUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('stasiun')) return;
  url.searchParams.delete('stasiun');
  history.pushState({}, '', url);
}
function openBySlug(slug, updateUrl = true) {
  const e = entries.get(slug);
  if (!e) return false;
  openPanel(slug, updateUrl);
  map.setView([e.m.lat, e.m.lon], Math.max(map.getZoom(), 8));
  return true;
}
window.addEventListener('popstate', () => {
  const slug = new URLSearchParams(location.search).get('stasiun');
  if (slug) openBySlug(slug, false); else closePanel(false);
});

// ── Pencarian stasiun ────────────────────────────────────────────────────
(function setupSearch() {
  const modal = $('stationSearchModal'), input = $('stationSearchInput'), results = $('stationSearchResults');
  let matches = [], active = -1;
  const msg = (t) => results.innerHTML = `<div class="flex items-center justify-center text-zinc-400 text-sm text-center px-6 py-14">${t}</div>`;
  const setActive = (i) => {
    active = i;
    results.querySelectorAll('.station-search-item').forEach((el, k) => el.classList.toggle('is-active', k === i));
  };
  const close = () => { modal.classList.add('modal-hidden'); input.value = ''; matches = []; active = -1; };
  const open = () => { modal.classList.remove('modal-hidden'); msg('Ketik minimal 3 huruf untuk mencari stasiun'); setTimeout(() => input.focus(), 30); };
  const pick = (i) => {
    const m = matches[i]; if (!m) return;
    openPanel(m.slug);
    map.setView([m.lat, m.lon], Math.max(map.getZoom(), 8));
    close();
  };

  $('stationSearchBtn').addEventListener('click', (e) => { e.stopPropagation(); open(); });
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal.classList.contains('modal-hidden') ? open() : input.focus(); }
    if (e.key === 'Escape') {
      if (!modal.classList.contains('modal-hidden')) close();
      closeConfigModal(); closeCreditsModal();
    }
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 3) { matches = []; active = -1; return msg('Ketik minimal 3 huruf untuk mencari stasiun'); }
    matches = [...entries.values()].map(e => e.m).filter(m => m.name.toLowerCase().includes(q) && !filterHides(m)).slice(0, 5);
    if (!matches.length) { active = -1; return msg('Stasiun tidak ditemukan'); }
    active = 0;
    results.innerHTML = matches.map((m, i) => `
      <button type="button" data-i="${i}" class="station-search-item${i === 0 ? ' is-active' : ''}">
        <span class="dot" style="background:${getColorByTemperature(m.temp, isOnline(m))}"></span>
        <span class="truncate flex-1">${esc(m.name)}</span>
        <span class="text-[10px] text-zinc-400 flex-shrink-0">${isOnline(m) ? 'Online' : 'Offline/Kendala Alat'}</span></button>`).join('');
    results.querySelectorAll('.station-search-item').forEach((el) => {
      el.addEventListener('mouseenter', () => setActive(+el.dataset.i));
      el.addEventListener('click', () => pick(+el.dataset.i));
    });
  });
  input.addEventListener('keydown', (e) => {
    if (!matches.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % matches.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + matches.length) % matches.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) pick(active); }
  });
})();

// ── Legenda ──────────────────────────────────────────────────────────────
// Default: tertutup di mobile (< 768px), terbuka di tablet dan desktop (>= 768px)
let legendVisible = window.matchMedia('(min-width: 768px)').matches;
function syncLegend() {
  $('legend').classList.toggle('hidden', !legendVisible);
  $('legend-toggle-icon').textContent = legendVisible ? '▼' : '▲';
}
syncLegend();
window.toggleLegend = () => {
  legendVisible = !legendVisible;
  syncLegend();
};

// ── Auto-update: tiap 5 menit + 20 detik (00:00:20, 00:05:20, 00:10:20, ...)
const SLOT = 5 * 60 * 1000, OFFSET = 20 * 1000;
let lastOk = Date.now();

async function refresh() {
  try {
    const r = await fetch(APP.endpoint, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const p = await r.json();
    if (!Array.isArray(p.stations)) throw new Error('Format data tidak valid');
    applyData(p);
    lastOk = Date.now();
  } catch (err) {
    console.warn('[AWS] Gagal update data, memakai data sebelumnya:', err);
  }
}
function msUntilNext() {
  const now = Date.now();
  return (Math.floor((now - OFFSET) / SLOT) * SLOT + SLOT + OFFSET) - now;
}
function schedule() {
  setTimeout(async () => { await refresh(); schedule(); }, msUntilNext());
}
// Tab kembali aktif setelah lama di background → langsung segarkan
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() - lastOk > SLOT) refresh();
});

// ── Start ────────────────────────────────────────────────────────────────
(async () => {
  if (APP.initial && Array.isArray(APP.initial.stations)) applyData(APP.initial);
  else await refresh();
  const slug = new URLSearchParams(location.search).get('stasiun');
  if (slug) openBySlug(slug, false);
  schedule();
})();
})();