#!/usr/bin/env python3
"""
Robot berita Marga Mulya On Site.

Dijalankan otomatis oleh GitHub Actions (.github/workflows/berita-otomatis.yml).
Mencari berita baru tentang Kampung Marga Mulya (Distrik Semangga, Merauke) di
Bing News dan Google News, memastikan isi artikel benar-benar menyebut kampung
ini, mengambil gambar sampulnya, lalu menyimpannya ke data/berita-otomatis.json.
Website membaca file itu dan langsung menampilkan berita barunya di slider.

Selain berita utama (yang menyebut Kampung Marga Mulya), robot juga mengumpulkan
"berita terkait" harian: kabar Distrik Semangga, pertanian, harga gabah/beras/cabai,
peternakan, dan transmigrasi di Kabupaten Merauke. Berita terkait disimpan di kunci
"terkait", hanya yang terbit 30 hari terakhir, paling banyak 24 berita.

Berita yang keliru bisa disembunyikan dengan menambahkan tautannya ke
data/berita-abaikan.json.
"""
import datetime as dt
import email.utils
import html
import json
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "berita-otomatis.json")
IGNORE = os.path.join(ROOT, "data", "berita-abaikan.json")
DATAJS = os.path.join(ROOT, "assets", "js", "data.js")
WIT = dt.timezone(dt.timedelta(hours=9))
MAX_TAHUN = 5                      # hanya berita 5 tahun terakhir
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "id-ID,id;q=0.9,en;q=0.6"}
TERBLOKIR = "terblokir"   # artikel tidak bisa dibaca robot (situs menolak / kosong)

KUERI = ['"Marga Mulya" Merauke', '"Marga Mulya" Semangga', '"Margamulya" Merauke', '"Kampung Marga Mulya"',
         '"Semangga 3" Merauke', '"SD Inpres Semangga III" OR "SD Inpres Semangga 3"']
# Media lokal & pemerintah yang dicari langsung (Bing: site:)
MEDIA_LOKAL = ["metromerauke.co", "papuaselatanpos.com", "suara.merauke.go.id", "portal.merauke.go.id",
               "papuaselatan.go.id", "tiffanews.co.id", "barometer99.com", "suaramediaa.id", "rri.co.id",
               "antaranews.com", "jubi.id", "kodim1707merauke.com", "matapapua.com", "suryapapua.com",
               "tribunnews.com", "mediatni-polri.com", "kompas.com", "detik.com"]
KUERI_SITUS = ['"Marga Mulya" site:' + d for d in MEDIA_LOKAL]
# Kata yang wajib ada di isi artikel
WAJIB_NAMA = re.compile(r"marga\s*-?\s*mulya", re.I)
WAJIB_LOKASI = re.compile(r"merauke|semangga", re.I)
# Desa bernama sama di provinsi lain
DESA_LAIN = re.compile(r"\b(lahat|tangerang|mauk|kikim|rambah|rokan hulu|kutai timur|sungai bahar|muaro jambi)\b", re.I)


# ---------------- Berita terkait (harian) ----------------
# (kueri, kategori). Google News memakai operator when:Nd agar hasilnya terbaru.
KUERI_TERKAIT = [
    ('"Semangga" Merauke', "Semangga"), ('"Distrik Semangga"', "Semangga"),
    ('harga gabah Merauke', "Harga pangan"), ('harga beras Merauke', "Harga pangan"),
    ('harga cabai Merauke', "Harga pangan"), ('harga pangan Merauke', "Harga pangan"),
    ('petani Merauke', "Pertanian Merauke"), ('panen padi Merauke', "Pertanian Merauke"),
    ('sawah Merauke', "Pertanian Merauke"), ('pupuk petani Merauke', "Pertanian Merauke"),
    ('jagung Merauke', "Pertanian Merauke"), ('peternak Merauke', "Peternakan"),
    ('transmigrasi Merauke', "Transmigrasi"), ('kampung Merauke dana desa', "Kampung Merauke"),
]
TERKAIT_HARI = 30          # umur maksimal berita terkait
TERKAIT_MAKS = 24          # jumlah maksimal yang disimpan
LOKAL = re.compile(r"merauke|semangga|papua selatan", re.I)
TOPIK = re.compile(r"petani|pertanian|padi|beras|gabah|cabai|cabe|sawah|panen|tanam|pupuk|jagung|kedelai|hortikultura|"
                   r"ternak|peternak|sapi|ayam|telur|pangan|harga|inflasi|transmigra|irigasi|alsintan|bulog|semangga|"
                   r"kampung|distrik|bumkam|dana desa|swasembada|food estate|lumbung|nelayan|pasar", re.I)
TOPIK_TAJAM = re.compile(r"petani|pertanian|padi|beras|gabah|cabai|cabe|sawah|panen|pupuk|jagung|ternak|peternak|pangan|"
                         r"harga|transmigra|irigasi|alsintan|bulog|semangga|swasembada|lumbung|kampung", re.I)


# Halaman yang bukan artikel (tag, kategori, lowongan, lampiran foto WordPress, dsb.)
SKIP_URL = re.compile(r"/(tag|tags|category|kategori|topik|search|cari|page|author|indeks)/|cariin-kerja|lowongan|"
                      r"/\d{4}/\d{2}/\d{2}/[^/]+/[^/]+/?$|jadwal-sholat|jadwal-imsak|/live-?report|/video/", re.I)
NAMA_MEDIA = {"papuaselatanpos.com": "Papua Selatan Pos", "metromerauke.co": "Metro Merauke", "papua.tribunnews.com": "Tribun Papua",
              "tribunnews.com": "Tribunnews", "suara.merauke.go.id": "Suara Merauke (Pemkab Merauke)",
              "portal.merauke.go.id": "Pemkab Merauke", "tiffanews.co.id": "Tiffa News", "barometer99.com": "Barometer99",
              "suaramediaa.id": "Suara Media", "rri.co.id": "RRI", "antaranews.com": "ANTARA", "jubi.id": "Jubi",
              "kodim1707merauke.com": "Kodim 1707/Merauke", "matapapua.com": "MataPapua", "suryapapua.com": "Surya Papua",
              "mediatni-polri.com": "Media TNI Polri", "kompas.com": "Kompas.com", "mongabay.co.id": "Mongabay Indonesia"}


def nama_media(url, fallback=None):
    host = urllib.parse.urlsplit(url).netloc.lower().removeprefix("www.")
    for dom, nama in NAMA_MEDIA.items():
        if host == dom or host.endswith("." + dom):
            return nama
    return fallback or host


def rapikan_judul(judul, sumber):
    judul = re.sub(r"\s+", " ", html.unescape(judul or "")).strip()
    for n in {sumber, sumber.split(" (")[0]} if sumber else set():
        for pola in (r"^\s*" + re.escape(n) + r"\s*[-|–:]\s*", r"\s*[-|–]\s*" + re.escape(n) + r"\s*$"):
            judul = re.sub(pola, "", judul, flags=re.I)
    return judul.strip()


def log(*a):
    print(*a, file=sys.stderr)


def norm(url):
    """Bentuk sederhana sebuah URL untuk mendeteksi berita ganda."""
    p = urllib.parse.urlsplit(url.strip())
    host = p.netloc.lower().removeprefix("www.").removeprefix("m.")
    return host + p.path.rstrip("/").lower()


def norm_title(t):
    return re.sub(r"[^a-z0-9]+", " ", (t or "").lower()).strip()


def get(url, **kw):
    return requests.get(url, headers=UA, timeout=20, allow_redirects=True, **kw)


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


# ---------------- Sumber RSS ----------------
def bing(q):
    url = "https://www.bing.com/news/search?" + urllib.parse.urlencode({"q": q, "format": "rss", "setlang": "id"})
    r = get(url)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    ns = {"News": "https://www.bing.com/news/search?q=rss"}
    items = []
    for it in root.iter("item"):
        link = it.findtext("link") or ""
        qs = urllib.parse.parse_qs(urllib.parse.urlsplit(link).query)
        real = qs.get("url", [link])[0]
        img = None
        for child in it:
            tag = child.tag.split("}")[-1]
            if tag == "Image" and child.text:
                img = child.text.strip().replace("http://", "https://", 1)
                img += ("&" if "?" in img else "?") + "w=640&h=360&c=14"
        src = None
        for child in it:
            if child.tag.split("}")[-1] == "Source":
                src = (child.text or "").strip()
        items.append({"judul": it.findtext("title"), "url": real, "pub": it.findtext("pubDate"),
                      "desk": it.findtext("description"), "sumber": src, "cover": img})
    return items


def google(q):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": q, "hl": "id", "gl": "ID", "ceid": "ID:id"})
    r = get(url)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    items = []
    for it in root.iter("item"):
        src_el = it.find("source")
        items.append({"judul": it.findtext("title"), "url": it.findtext("link"), "pub": it.findtext("pubDate"),
                      "desk": None, "sumber": src_el.text if src_el is not None else None, "cover": None,
                      "google": True})
    return items


def decode_google(url):
    """Ubah tautan news.google.com menjadi tautan artikel asli (jika bisa)."""
    try:
        from googlenewsdecoder import gnewsdecoder  # pip install googlenewsdecoder
        res = gnewsdecoder(url, interval=1)
        if res.get("status"):
            return res["decoded_url"]
    except Exception as e:  # noqa: BLE001
        log("  gagal decode Google News:", e)
    return None


# ---------------- Periksa artikel ----------------
def meta(page, *names):
    for n in names:
        m = re.search(r'<meta[^>]+(?:property|name)=["\']' + re.escape(n) + r'["\'][^>]*content=["\']([^"\']+)', page, re.I) \
            or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']' + re.escape(n) + r'["\']', page, re.I)
        if m:
            return html.unescape(m.group(1)).strip()
    return None


def periksa(url):
    """Buka artikel, pastikan membahas Marga Mulya Merauke, ambil judul/gambar/ringkasan."""
    r = get(url)
    if r.status_code >= 400:
        return TERBLOKIR
    r.encoding = r.apparent_encoding or r.encoding
    page = r.text
    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", page, flags=re.S | re.I)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    if len(re.sub(r"\s+", " ", text).strip()) < 400:
        return TERBLOKIR
    if not (WAJIB_NAMA.search(text) and WAJIB_LOKASI.search(text)):
        return None
    # Kalimat di sekitar "Marga Mulya" harus terkait Merauke/Semangga, bukan desa lain
    sekitar = " ".join(text[max(0, m.start() - 400): m.end() + 400] for m in WAJIB_NAMA.finditer(text))
    if DESA_LAIN.search(sekitar) and not WAJIB_LOKASI.search(sekitar):
        return None
    if re.search(r"distrik\s+kurik", sekitar, re.I) and not re.search(r"semangga", sekitar, re.I):
        return None   # Marga Mulya di Distrik Kurik bukan kampung ini
    img = meta(page, "og:image", "twitter:image")
    if img:
        img = urllib.parse.urljoin(r.url, img)
    return {
        "url_akhir": r.url,
        "judul": meta(page, "og:title", "twitter:title"),
        "desk": meta(page, "og:description", "description", "twitter:description"),
        "sumber": meta(page, "og:site_name"),
        "cover": img,
        "terbit": meta(page, "article:published_time", "og:published_time", "datePublished"),
    }


def periksa_terkait(url):
    """Buka artikel terkait: harus berlokasi Merauke/Semangga dan bertopik pertanian/kampung."""
    r = get(url)
    if r.status_code >= 400:
        return TERBLOKIR
    r.encoding = r.apparent_encoding or r.encoding
    page = r.text
    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", page, flags=re.S | re.I)
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text))).strip()
    if len(text) < 400:
        return TERBLOKIR
    judul = meta(page, "og:title", "twitter:title") or ""
    desk = meta(page, "og:description", "description", "twitter:description") or ""
    kepala = judul + " " + desk
    if len(LOKAL.findall(text)) < 2 or not (LOKAL.search(kepala) or LOKAL.search(text[:3000])):
        return None
    if not TOPIK_TAJAM.search(kepala):
        return None
    img = meta(page, "og:image", "twitter:image")
    if img:
        img = urllib.parse.urljoin(r.url, img)
    return {"url_akhir": r.url, "judul": judul or None, "desk": desk or None, "sumber": meta(page, "og:site_name"),
            "cover": img, "terbit": meta(page, "article:published_time", "og:published_time", "datePublished"),
            "marga_mulya": bool(WAJIB_NAMA.search(text) and not DESA_LAIN.search(text)),
            "kategori": kategori_isi(kepala, text)}


def kategori_isi(kepala, text):
    """Kategori dari isi berita, bukan dari kata kunci pencarian."""
    if re.search(r"semangga", kepala + " " + text, re.I):
        return "Semangga"
    if re.search(r"harga|inflasi|hpp|het\b", kepala, re.I) and re.search(r"beras|gabah|cabai|cabe|pangan|bawang|jagung|telur|daging", kepala, re.I):
        return "Harga pangan"
    if re.search(r"ternak|peternak|sapi|ayam|kambing|unggas", kepala, re.I):
        return "Peternakan"
    if re.search(r"transmigra", kepala, re.I):
        return "Transmigrasi"
    if re.search(r"petani|pertanian|padi|beras|gabah|sawah|panen|pupuk|jagung|cabai|hortikultura|pangan|irigasi|alsintan", kepala, re.I):
        return "Pertanian Merauke"
    return "Kampung Merauke"


def mirip(judul, daftar):
    """True bila judul sangat mirip dengan judul lain (berita sama dari media berbeda)."""
    a = set(w for w in norm_title(judul).split() if len(w) > 3)
    if len(a) < 3:
        return False
    for b in daftar:
        sama = len(a & b)
        if sama >= 4 and sama / max(1, min(len(a), len(b))) >= 0.5:
            return True
    return False


def cari_terkait(now, sudah, judul_sudah, abaikan):
    batas = (now - dt.timedelta(days=TERKAIT_HARI)).date().isoformat()
    calon = []
    for q, kat in KUERI_TERKAIT:
        for fn, kueri in ((google, q + " when:7d"), (bing, q)):
            try:
                hasil = fn(kueri)
                log(f"[terkait] {fn.__name__} {kueri!r}: {len(hasil)} hasil")
                for h in hasil[:12]:
                    h["kategori"] = kat
                calon += hasil[:12]
            except Exception as e:  # noqa: BLE001
                log(f"[terkait] {fn.__name__} {kueri!r} gagal:", e)
    # dahulukan yang terbaru menurut RSS
    def pubkey(c):
        return tanggal(c.get("pub"), None) or ""
    calon.sort(key=pubkey, reverse=True)
    baru, utama = [], []
    token_sudah = [set(w for w in t.split() if len(w) > 3) for t in judul_sudah]
    for c in calon:
        if len(baru) >= TERKAIT_MAKS * 2:
            break
        tgl_rss = pubkey(c)
        if tgl_rss and tgl_rss < batas:
            continue
        rss_teks = (c["judul"] or "") + " " + (c["desk"] or "")
        if not (TOPIK.search(rss_teks) or LOKAL.search(rss_teks)):
            continue
        url = c["url"]
        if not url:
            continue
        if c.get("google"):
            url = decode_google(url)
            if not url:
                continue
        if SKIP_URL.search(url) or norm(url) in sudah or norm(url) in abaikan:
            continue
        if norm_title(bersihkan_judul(c["judul"], c["sumber"])) in judul_sudah:
            continue
        sudah.add(norm(url))
        try:
            info = periksa_terkait(url)
        except Exception as e:  # noqa: BLE001
            log("  [terkait] gagal membuka", url, e)
            info = TERBLOKIR
        if info == TERBLOKIR:
            if LOKAL.search(rss_teks) and TOPIK_TAJAM.search(rss_teks):
                info = {"url_akhir": url, "judul": None, "desk": None, "sumber": None, "cover": None, "terbit": None, "marga_mulya": False,
                        "kategori": kategori_isi(rss_teks, rss_teks)}
            else:
                continue
        if not info:
            log("  [terkait] dilewati (tidak lokal/tidak relevan):", url)
            continue
        tgl = tanggal(c["pub"], info["terbit"])
        if not tgl or tgl < batas:
            continue
        akhir = info["url_akhir"] or url
        if SKIP_URL.search(akhir):
            continue
        sumber = nama_media(akhir, c["sumber"] or info["sumber"])
        judul = rapikan_judul(bersihkan_judul(info["judul"] or c["judul"], c["sumber"] or ""), sumber)
        if norm_title(judul) in judul_sudah or mirip(judul, token_sudah):
            continue
        judul_sudah.add(norm_title(judul))
        token_sudah.append(set(w for w in norm_title(judul).split() if len(w) > 3))
        item = {"tanggal": tgl, "sumber": sumber, "judul": judul, "ringkas": ringkas(info["desk"] or c["desk"]),
                "url": akhir, "cover": info["cover"] or c["cover"] or "", "otomatis": True,
                "kategori": "Marga Mulya" if info.get("marga_mulya") else (info.get("kategori") or c["kategori"]), "ditemukan": now.date().isoformat()}
        (utama if info.get("marga_mulya") else baru).append(item)
        log("  + [terkait]" if not info.get("marga_mulya") else "  + [utama via terkait]", tgl, judul)
    return baru, utama


def tanggal(pub, terbit):
    for raw in (terbit, pub):
        if not raw:
            continue
        try:
            d = email.utils.parsedate_to_datetime(raw)
        except (TypeError, ValueError):
            try:
                d = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
            except ValueError:
                continue
        if d.tzinfo is None:
            d = d.replace(tzinfo=dt.timezone.utc)
        return d.astimezone(WIT).date().isoformat()
    return None


def ringkas(t, n=170):
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t or ""))).strip()
    return t if len(t) <= n else t[: n - 1].rsplit(" ", 1)[0] + "…"


def bersihkan_judul(judul, sumber):
    judul = re.sub(r"\s+", " ", html.unescape(judul or "")).strip()
    if sumber and judul.endswith(" - " + sumber):  # gaya judul Google News
        judul = judul[: -len(sumber) - 3]
    return judul


def main():
    now = dt.datetime.now(WIT)
    batas = (now - dt.timedelta(days=365 * MAX_TAHUN)).date().isoformat()
    store = load_json(OUT, {"diperiksa": None, "berita": []})
    abaikan = {norm(u) for u in load_json(IGNORE, {"abaikan": []}).get("abaikan", [])}
    try:
        kurasi = {norm(u) for u in re.findall(r'url:\s*"(https?://[^"]+)"', open(DATAJS, encoding="utf-8").read())}
    except OSError:
        kurasi = set()
    bersih = []
    for b in store["berita"]:
        if SKIP_URL.search(b["url"]) or norm(b["url"]) in abaikan:
            log("  dibuang (bukan artikel/diabaikan):", b["url"]); continue
        b["sumber"] = nama_media(b["url"], b.get("sumber"))
        b["judul"] = rapikan_judul(b["judul"], b["sumber"])
        bersih.append(b)
    store["berita"] = bersih
    sudah = {norm(b["url"]) for b in store["berita"]} | kurasi | abaikan
    judul_sudah = {norm_title(b["judul"]) for b in store["berita"]}

    calon = []
    for q, sumber_fn in [(q, (bing, google)) for q in KUERI] + [(q, (bing,)) for q in KUERI_SITUS]:
        for fn in sumber_fn:
            try:
                hasil = fn(q)
                log(f"{fn.__name__} {q!r}: {len(hasil)} hasil")
                calon += hasil
            except Exception as e:  # noqa: BLE001
                log(f"{fn.__name__} {q!r} gagal:", e)

    baru = []
    for c in calon:
        url = c["url"]
        if not url:
            continue
        if c.get("google"):
            asli = decode_google(url)
            if not asli:
                continue
            url = asli
        if SKIP_URL.search(url) or norm(url) in sudah or norm_title(bersihkan_judul(c["judul"], c["sumber"])) in judul_sudah:
            continue
        sudah.add(norm(url))
        try:
            info = periksa(url)
        except Exception as e:  # noqa: BLE001
            log("  gagal membuka", url, e)
            info = TERBLOKIR
        if info == TERBLOKIR:
            # Situs menolak robot: terima hanya bila judul/ringkasan RSS jelas menyebut Marga Mulya di Merauke/Semangga
            rss_teks = (c["judul"] or "") + " " + (c["desk"] or "")
            if WAJIB_NAMA.search(rss_teks) and WAJIB_LOKASI.search(rss_teks) and not DESA_LAIN.search(rss_teks):
                info = {"url_akhir": url, "judul": None, "desk": None, "sumber": None, "cover": None, "terbit": None}
                log("  diterima dari ringkasan RSS (situs menolak robot):", url)
            else:
                log("  dilewati (situs menolak robot, ringkasan tidak menyebut kampung):", url)
                continue
        if not info:
            log("  dilewati (tidak membahas Marga Mulya Merauke):", url)
            continue
        tgl = tanggal(c["pub"], info["terbit"])
        if not tgl or tgl < batas:
            continue
        akhir = info["url_akhir"] or url
        if SKIP_URL.search(akhir):
            continue
        sumber = nama_media(akhir, c["sumber"] or info["sumber"])
        judul = rapikan_judul(bersihkan_judul(info["judul"] or c["judul"], c["sumber"] or ""), sumber)
        if norm_title(judul) in judul_sudah:
            continue
        judul_sudah.add(norm_title(judul))
        item = {"tanggal": tgl, "sumber": sumber, "judul": judul,
                "ringkas": ringkas(info["desk"] or c["desk"]), "url": info["url_akhir"] or url,
                "cover": info["cover"] or c["cover"] or "", "otomatis": True, "kategori": "Marga Mulya",
                "ditemukan": now.date().isoformat()}
        log("  + BARU:", tgl, judul)
        baru.append(item)

    # Berita terkait harian (Semangga, pertanian, harga pangan Merauke)
    batas_t = (now - dt.timedelta(days=TERKAIT_HARI)).date().isoformat()
    lama, tok = [], []
    for b in sorted(store.get("terkait", []), key=lambda b: b["tanggal"]):
        if b.get("tanggal", "") < batas_t or norm(b["url"]) in abaikan or mirip(b["judul"], tok):
            continue
        b["kategori"] = kategori_isi(b["judul"] + " " + (b.get("ringkas") or ""), b["judul"] + " " + (b.get("ringkas") or "")) \
            if b.get("kategori") != "Marga Mulya" else b["kategori"]
        tok.append(set(w for w in norm_title(b["judul"]).split() if len(w) > 3))
        lama.append(b)
    sudah_t = sudah | {norm(b["url"]) for b in lama}
    judul_t = judul_sudah | {norm_title(b["judul"]) for b in lama}
    try:
        t_baru, t_utama = cari_terkait(now, sudah_t, judul_t, abaikan)
    except Exception as e:  # noqa: BLE001
        log("pencarian berita terkait gagal:", e)
        t_baru, t_utama = [], []
    baru += t_utama
    store["terkait"] = sorted(lama + t_baru, key=lambda b: b["tanggal"], reverse=True)[:TERKAIT_MAKS]

    store["berita"] = sorted(store["berita"] + baru, key=lambda b: b["tanggal"], reverse=True)
    store["diperiksa"] = now.date().isoformat()   # cukup per hari agar tidak commit tiap jam
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{len(baru)} berita utama baru; total utama otomatis {len(store['berita'])}; terkait {len(store['terkait'])} ({len(t_baru)} baru)")


if __name__ == "__main__":
    main()
