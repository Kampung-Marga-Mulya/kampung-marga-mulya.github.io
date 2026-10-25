#!/usr/bin/env python3
"""
Robot berita Marga Mulya On Site.

Dijalankan otomatis oleh GitHub Actions (.github/workflows/berita-otomatis.yml).
Mencari berita baru tentang Kampung Marga Mulya (Distrik Semangga, Merauke) di
Bing News dan Google News, memastikan isi artikel benar-benar menyebut kampung
ini, mengambil gambar sampulnya, lalu menyimpannya ke data/berita-otomatis.json.
Website membaca file itu dan langsung menampilkan berita barunya di slider.

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
UA = {"User-Agent": "Mozilla/5.0 (compatible; MargaMulyaOnSite/1.0; +https://kampung-marga-mulya.github.io)",
      "Accept-Language": "id-ID,id;q=0.9,en;q=0.6"}

KUERI = ['"Marga Mulya" Merauke', '"Marga Mulya" Semangga', '"Margamulya" Merauke', '"Kampung Marga Mulya"']
# Kata yang wajib ada di isi artikel
WAJIB_NAMA = re.compile(r"marga\s*-?\s*mulya", re.I)
WAJIB_LOKASI = re.compile(r"merauke|semangga", re.I)
# Desa bernama sama di provinsi lain
DESA_LAIN = re.compile(r"\b(lahat|tangerang|mauk|kikim|rambah|rokan hulu|kutai timur|sungai bahar|muaro jambi)\b", re.I)


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
        return None
    r.encoding = r.apparent_encoding or r.encoding
    page = r.text
    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", page, flags=re.S | re.I)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    if not (WAJIB_NAMA.search(text) and WAJIB_LOKASI.search(text)):
        return None
    # Kalimat di sekitar "Marga Mulya" harus terkait Merauke/Semangga, bukan desa lain
    sekitar = " ".join(text[max(0, m.start() - 400): m.end() + 400] for m in WAJIB_NAMA.finditer(text))
    if DESA_LAIN.search(sekitar) and not WAJIB_LOKASI.search(sekitar):
        return None
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
    sudah = {norm(b["url"]) for b in store["berita"]} | kurasi | abaikan
    judul_sudah = {norm_title(b["judul"]) for b in store["berita"]}

    calon = []
    for q in KUERI:
        for fn in (bing, google):
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
        if norm(url) in sudah or norm_title(bersihkan_judul(c["judul"], c["sumber"])) in judul_sudah:
            continue
        sudah.add(norm(url))
        try:
            info = periksa(url)
        except Exception as e:  # noqa: BLE001
            log("  gagal membuka", url, e)
            continue
        if not info:
            log("  dilewati (tidak membahas Marga Mulya Merauke):", url)
            continue
        tgl = tanggal(c["pub"], info["terbit"])
        if not tgl or tgl < batas:
            continue
        sumber = c["sumber"] or info["sumber"] or urllib.parse.urlsplit(url).netloc.removeprefix("www.")
        judul = bersihkan_judul(info["judul"] or c["judul"], sumber)
        if norm_title(judul) in judul_sudah:
            continue
        judul_sudah.add(norm_title(judul))
        item = {"tanggal": tgl, "sumber": sumber, "judul": judul,
                "ringkas": ringkas(info["desk"] or c["desk"]), "url": info["url_akhir"] or url,
                "cover": info["cover"] or c["cover"] or "", "otomatis": True,
                "ditemukan": now.date().isoformat()}
        log("  + BARU:", tgl, judul)
        baru.append(item)

    store["berita"] = sorted(store["berita"] + baru, key=lambda b: b["tanggal"], reverse=True)
    store["diperiksa"] = now.date().isoformat()   # cukup per hari agar tidak commit tiap jam
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{len(baru)} berita baru; total otomatis {len(store['berita'])}")


if __name__ == "__main__":
    main()
