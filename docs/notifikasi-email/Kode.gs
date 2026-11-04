/**
 * Notifikasi email Layanan Surat — Marga Mulya On Site
 * ----------------------------------------------------
 * Skrip ini dipasang di Google Apps Script (script.google.com) memakai akun Google
 * yang akan MENGIRIM email (boleh akun kampung). Website hanya mengirim jenis surat dan
 * waktu pengajuan — TIDAK ADA data pribadi (nama, NIK, alamat) yang dikirim ke sini.
 * Skrip tidak menyimpan apa pun.
 *
 * Cara pasang: lihat PANDUAN.md di folder yang sama.
 */
const EMAIL_TUJUAN = 'seldiozora3@gmail.com';   // alamat yang menerima notifikasi
const NOMOR_WA = '+62 856-2492-4834';
const BATAS_PER_JAM = 30;                        // pengaman spam sederhana

function doPost(e) {
  const p = (e && e.parameter) || {};
  const bersih = (v, n) => String(v || '').replace(/[<>]/g, '').slice(0, n);
  const jenis = bersih(p.jenis, 120) || 'Surat';
  const waktu = bersih(p.waktu, 80);

  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('jumlah') || 0);
  if (n >= BATAS_PER_JAM) return ContentService.createTextOutput('batas');
  cache.put('jumlah', String(n + 1), 3600);

  const teks = 'Ada pengajuan surat baru dari website Marga Mulya On Site.\n\n' +
    'Jenis surat: ' + jenis + '\n' +
    'Waktu pengajuan: ' + waktu + '\n\n' +
    'Buka WhatsApp ' + NOMOR_WA + ' untuk melihat data lengkap pemohon dan dokumen persyaratannya.\n\n' +
    'Email ini sengaja tidak memuat data pribadi pemohon.';
  MailApp.sendEmail({ to: EMAIL_TUJUAN, subject: 'Pengajuan surat baru: ' + jenis, body: teks, name: 'Marga Mulya On Site' });
  return ContentService.createTextOutput('ok');
}

/** Jalankan sekali dari editor (tombol Run) untuk memberi izin dan mengirim email uji. */
function ujiEmail() {
  doPost({ parameter: { jenis: 'Uji notifikasi', waktu: new Date().toString() } });
}
