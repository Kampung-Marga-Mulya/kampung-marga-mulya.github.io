#!/usr/bin/env python3
"""
Robot video Marga Mulya On Site.

Dijalankan otomatis oleh GitHub Actions (.github/workflows/video-otomatis.yml).
Mencari video yang membahas Kampung Marga Mulya (Distrik Semangga, Merauke) di
YouTube, TikTok, Instagram, dan Facebook, memastikan judul/keterangan videonya
benar-benar menyebut kampung ini, menyimpan sampulnya ke assets/img/video/,
lalu menulis daftar video ke data/video-otomatis.json. Website membaca file itu
dan menampilkannya sebagai deretan video yang bergulir seperti berita.

Sumber pencarian:
- YouTube: halaman hasil pencarian YouTube (urutan relevansi dan terbaru) lalu
  halaman video untuk keterangan lengkap, tanggal, dan jumlah tayangan.
- TikTok, Instagram, Facebook: mesin pencari (Bing web, Bing Video, DuckDuckGo)
  dengan filter site:, lalu data publik tiap video (oEmbed TikTok, halaman
  embed Instagram, tag og: Facebook).

Urutan tampil ("algoritma"): skor = relevansi (seberapa jelas video menyebut
Marga Mulya) + kesegaran (video baru naik) + popularitas (jumlah tayangan bila ada).

Video yang keliru bisa disembunyikan dengan menambahkan tautannya ke
data/video-abaikan.json. Video yang wajib tampil (misalnya video resmi kampung)
ditambahkan ke video.pilihan di assets/js/data.js (bisa lewat Portal Admin);
video pilihan tidak perlu lolos saringan.
"""
import datetime as dt
import html
import io
import json
import math
import os
import re
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "video-otomatis.json")
ABAIKAN = os.path.join(ROOT, "data", "video-abaikan.json")
DATAJS = os.path.join(ROOT, "assets", "js", "data.js")
THUMB_DIR = os.path.join(ROOT, "assets", "img", "video")
THUMB_URL = "assets/img/video/"
WIT = dt.timezone(dt.timedelta(hours=9))
MAKS = 40                       # jumlah video maksimal yang disimpan
UA_BROWSER = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
              "Accept-Language": "id-ID,id;q=0.9,en;q=0.6"}
UA_PRATINJAU = {"User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
                "Accept-Language": "id-ID,id;q=0.9,en;q=0.6"}
COOKIE_YT = {"CONSENT": "YES+cb", "SOCS": "CAI"}

KUERI_YT = ['"marga mulya" merauke', '"marga mulya" semangga', 'kampung marga mulya merauke', 'margamulya merauke',
            'semangga 3 merauke', 'kampung marga mulya distrik semangga']
KUERI_WEB = ['"marga mulya" merauke', '"marga mulya" semangga', '"kampung marga mulya"', 'margamulya merauke']
SITUS = {"tiktok": "tiktok.com", "instagram": "instagram.com", "facebook": "facebook.com", "youtube": "youtube.com"}

# Saringan isi: wajib menyebut Marga Mulya dan lokasinya; tolak desa bernama sama di provinsi lain
WAJIB_NAMA = re.compile(r"marga\s*-?\s*mulya", re.I)
WAJIB_LOKASI = re.compile(r"merauke|semangga|papua", re.I)
DESA_LAIN = re.compile(r"\b(lahat|tangerang|mauk|kikim|rambah|rokan hulu|kutai timur|sungai bahar|muaro jambi|bekasi|bandung|"
                       r"bogor|garut|tasik|cianjur|sumedang|karawang|lampung|jambi|bengkulu|palembang|riau|kalimantan)\b", re.I)

POLA = {
    "youtube": re.compile(r"(?:youtube\.com/(?:watch\?(?:[^\s\"'<>]*&)?v=|shorts/|embed/|live/)|youtu\.be/)([A-Za-z0-9_-]{11})"),
    "tiktok": re.compile(r"tiktok\.com/@([A-Za-z0-9_.]+)/video/(\d{15,22})"),
    "instagram": re.compile(r"instagram\.com/(?:[A-Za-z0-9_.]+/)?(p|reel|reels|tv)/([A-Za-z0-9_-]{5,40})"),
    "facebook": re.compile(r"facebook\.com/(?:(?:[A-Za-z0-9_.-]+/videos/(?:[^/\s\"'<>]+/)?(\d{8,22}))|(?:reel/(\d{8,22}))|"
                           r"(?:watch/?\?v=(\d{8,22}))|(?:share/(?:v|r)/([A-Za-z0-9]{6,30})))"),
}


def log(*a):
    print(*a, file=sys.stderr)


def get(url, headers=None, **kw):
    return requests.get(url, headers=headers or UA_BROWSER, timeout=25, allow_redirects=True, **kw)


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def bersih(t):
    return re.sub(r"\s+", " ", html.unescape(t or "")).strip()


def kunci(v):
    return v["platform"] + "-" + v["id"]


# ---------------- Pengenal video dari sebuah URL ----------------
def kenali(url):
    """Kembalikan (platform, id, url_baku) atau None."""
    u = html.unescape(urllib.parse.unquote(url or ""))
    m = POLA["youtube"].search(u)
    if m:
        return "youtube", m.group(1), "https://www.youtube.com/watch?v=" + m.group(1)
    m = POLA["tiktok"].search(u)
    if m:
        return "tiktok", m.group(2), "https://www.tiktok.com/@%s/video/%s" % (m.group(1), m.group(2))
    m = POLA["instagram"].search(u)
    if m:
        jenis = "reel" if m.group(1) in ("reel", "reels") else m.group(1)
        return "instagram", m.group(2), "https://www.instagram.com/%s/%s/" % (jenis, m.group(2))
    m = POLA["facebook"].search(u)
    if m:
        vid = next(g for g in m.groups() if g)
        if m.group(4):
            return "facebook", vid, "https://www.facebook.com/share/v/%s/" % vid
        return "facebook", vid, "https://www.facebook.com/watch/?v=" + vid
    return None


def kumpulkan_url(teks):
    """Semua URL video yang muncul di sebuah halaman (termasuk yang tersandi di tautan pengalih)."""
    teks = html.unescape(teks)
    teks = teks + " " + urllib.parse.unquote(teks)
    hasil = []
    for pola in POLA.values():
        for m in pola.finditer(teks):
            hasil.append(m.group(0))
    return hasil


# ---------------- Mesin pencari ----------------
def bing_web(q):
    r = get("https://www.bing.com/search?" + urllib.parse.urlencode({"q": q, "format": "rss", "setlang": "id", "count": 50}))
    r.raise_for_status()
    out = []
    try:
        root = ET.fromstring(r.content)
        for it in root.iter("item"):
            out.append((it.findtext("link") or "", bersih(it.findtext("title")) + " " + bersih(it.findtext("description"))))
    except ET.ParseError:
        out = [(u, "") for u in kumpulkan_url(r.text)]
    return out


def bing_video(q):
    r = get("https://www.bing.com/videos/search?" + urllib.parse.urlencode({"q": q, "setlang": "id"}))
    r.raise_for_status()
    out = []
    # Tiap hasil Bing Video memuat data JSON di atribut vrhm / mmeta
    for blok in re.findall(r"(?:vrhm|mmeta)=\"([^\"]+)\"", r.text):
        try:
            d = json.loads(html.unescape(blok))
        except ValueError:
            continue
        u = d.get("murl") or d.get("purl") or ""
        out.append((u, bersih(d.get("vt") or d.get("t") or "")))
    if not out:
        out = [(u, "") for u in kumpulkan_url(r.text)]
    return out


def ddg(q):
    r = requests.post("https://html.duckduckgo.com/html/", data={"q": q, "kl": "id-id"}, headers=UA_BROWSER, timeout=25)
    r.raise_for_status()
    out = []
    for m in re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?class="result__snippet"[^>]*>(.*?)</a>', r.text, re.S):
        link = html.unescape(m.group(1))
        qs = urllib.parse.parse_qs(urllib.parse.urlsplit(link).query)
        link = qs.get("uddg", [link])[0]
        out.append((link, bersih(re.sub("<[^>]+>", " ", m.group(2) + " " + m.group(3)))))
    if not out:
        out = [(u, "") for u in kumpulkan_url(r.text)]
    return out


# ---------------- YouTube ----------------
def json_setelah(teks, penanda):
    i = teks.find(penanda)
    if i < 0:
        return None
    i = teks.find("{", i)
    try:
        return json.JSONDecoder().raw_decode(teks[i:])[0]
    except ValueError:
        return None


def jelajah(o, kunci_dicari):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in kunci_dicari:
                yield k, v
            yield from jelajah(v, kunci_dicari)
    elif isinstance(o, list):
        for v in o:
            yield from jelajah(v, kunci_dicari)


def teks_runs(o):
    if not o:
        return ""
    if isinstance(o, str):
        return o
    if "simpleText" in o:
        return o["simpleText"]
    if "content" in o:
        return o["content"]
    return "".join(r.get("text", "") for r in o.get("runs", []))


YT_INFO = {}          # data ringkas dari halaman pencarian (cadangan bila halaman video dibatasi)
YT_DIBATASI = [False]
SATUAN = {"detik": 0, "second": 0, "menit": 0, "minute": 0, "jam": 0, "hour": 0, "hari": 1, "day": 1,
          "minggu": 7, "week": 7, "bulan": 30, "month": 30, "tahun": 365, "year": 365}


def tanggal_kira(teks):
    """'3 bulan yang lalu' / '3 months ago' → tanggal perkiraan (ISO)."""
    m = re.search(r"(\d+)\s+(detik|menit|jam|hari|minggu|bulan|tahun|second|minute|hour|day|week|month|year)", teks or "", re.I)
    if not m:
        return None
    hari = int(m.group(1)) * SATUAN[m.group(2).lower()]
    return (dt.datetime.now(WIT).date() - dt.timedelta(days=hari)).isoformat()


def angka_tayang(teks):
    t = (teks or "").lower().replace(".", "").replace(",", "")
    m = re.search(r"(\d+)\s*(rb|jt|k|m)?", t)
    if not m:
        return None
    n = int(m.group(1))
    return n * {"rb": 1000, "k": 1000, "jt": 1000000, "m": 1000000}.get(m.group(2) or "", 1)


def detik_durasi(teks):
    try:
        p = [int(x) for x in (teks or "").split(":")]
    except ValueError:
        return None
    d = 0
    for x in p:
        d = d * 60 + x
    return d or None


def cari_youtube(q, terbaru=False):
    p = {"search_query": q, "hl": "id", "gl": "ID"}
    if terbaru:
        p["sp"] = "CAI="
    r = get("https://www.youtube.com/results?" + urllib.parse.urlencode(p), cookies=COOKIE_YT)
    r.raise_for_status()
    data = json_setelah(r.text, "ytInitialData")
    hasil = []
    if not data:
        return [(u, "") for u in kumpulkan_url(r.text)]
    for k, v in jelajah(data, {"videoRenderer", "reelItemRenderer", "shortsLockupViewModel"}):
        vid, teks = None, ""
        if k == "videoRenderer":
            vid = v.get("videoId")
            teks = teks_runs(v.get("title")) + " " + " ".join(teks_runs(s.get("snippetText")) for s in v.get("detailedMetadataSnippets", []))
            if vid:
                YT_INFO.setdefault(vid, {"judul": teks_runs(v.get("title")), "kanal": teks_runs(v.get("ownerText")),
                                         "tanggal": tanggal_kira(teks_runs(v.get("publishedTimeText"))),
                                         "tayang": angka_tayang(teks_runs(v.get("viewCountText"))),
                                         "durasi": detik_durasi(teks_runs(v.get("lengthText"))), "rasio": "16:9"})
        elif k == "reelItemRenderer":
            vid = v.get("videoId")
            teks = teks_runs(v.get("headline"))
            if vid:
                YT_INFO.setdefault(vid, {"judul": teks, "rasio": "9:16"})
        else:
            try:
                vid = v["onTap"]["innertubeCommand"]["reelWatchEndpoint"]["videoId"]
            except (KeyError, TypeError):
                vid = None
            teks = teks_runs((v.get("overlayMetadata") or {}).get("primaryText"))
            if vid:
                YT_INFO.setdefault(vid, {"judul": teks, "rasio": "9:16"})
        if vid:
            hasil.append(("https://www.youtube.com/watch?v=" + vid, bersih(teks)))
    return hasil


def detail_youtube(vid):
    """Halaman video (keterangan lengkap, tanggal pasti). Bila YouTube membatasi, pakai oEmbed + data pencarian."""
    if not YT_DIBATASI[0]:
        try:
            return detail_youtube_halaman(vid)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                YT_DIBATASI[0] = True
                log("  YouTube membatasi halaman video; beralih ke oEmbed")
            else:
                raise
    o = get("https://www.youtube.com/oembed?" + urllib.parse.urlencode({"url": "https://www.youtube.com/watch?v=" + vid, "format": "json"}))
    if o.status_code in (400, 401, 403, 404):
        return {"hilang": True}
    o.raise_for_status()
    o = o.json()
    info = dict(YT_INFO.get(vid, {}))
    info.update({"judul": o.get("title") or info.get("judul"), "kanal": o.get("author_name") or info.get("kanal"),
                 "keterangan": "", "sampul": "https://i.ytimg.com/vi/%s/hqdefault.jpg" % vid})
    return info


def detail_youtube_halaman(vid):
    r = get("https://www.youtube.com/watch?" + urllib.parse.urlencode({"v": vid, "hl": "id"}), cookies=COOKIE_YT)
    if r.status_code == 404:
        return {"hilang": True}
    r.raise_for_status()
    pr = json_setelah(r.text, "ytInitialPlayerResponse") or {}
    st = (pr.get("playabilityStatus") or {}).get("status")
    if st in ("ERROR", "UNPLAYABLE", "LOGIN_REQUIRED") and not pr.get("videoDetails"):
        return {"hilang": st == "ERROR"}
    vd = pr.get("videoDetails") or {}
    mf = ((pr.get("microformat") or {}).get("playerMicroformatRenderer")) or {}
    if not vd:
        # Cadangan: oEmbed (tanpa keterangan)
        o = get("https://www.youtube.com/oembed?" + urllib.parse.urlencode({"url": "https://www.youtube.com/watch?v=" + vid, "format": "json"}))
        if o.status_code in (400, 401, 403, 404):
            return {"hilang": True}
        o = o.json()
        return {"judul": o.get("title"), "kanal": o.get("author_name"), "keterangan": "", "sampul": o.get("thumbnail_url")}
    durasi = int(vd.get("lengthSeconds") or 0)
    pendek = durasi and durasi <= 180 and ("/shorts/" in r.text[:200000] or durasi <= 60)
    return {
        "judul": vd.get("title"), "kanal": vd.get("author"), "keterangan": vd.get("shortDescription") or "",
        "tayang": int(vd.get("viewCount") or 0), "durasi": durasi,
        "tanggal": (mf.get("publishDate") or mf.get("uploadDate") or "")[:10] or None,
        "sampul": "https://i.ytimg.com/vi/%s/hqdefault.jpg" % vid,
        "rasio": "9:16" if pendek else "16:9",
    }


# ---------------- TikTok, Instagram, Facebook ----------------
def detail_tiktok(url, vid):
    r = get("https://www.tiktok.com/oembed?" + urllib.parse.urlencode({"url": url}))
    if r.status_code in (400, 404):
        return {"hilang": True}
    r.raise_for_status()
    o = r.json()
    if o.get("status_msg") or not o.get("title") and not o.get("thumbnail_url"):
        return {"hilang": True}
    try:
        tgl = dt.datetime.fromtimestamp(int(vid) >> 32, dt.timezone.utc).astimezone(WIT).date().isoformat()
    except (ValueError, OverflowError, OSError):
        tgl = None
    return {"judul": o.get("title") or "", "kanal": o.get("author_name") or o.get("author_unique_id"),
            "keterangan": o.get("title") or "", "sampul": o.get("thumbnail_url"), "tanggal": tgl, "rasio": "9:16"}


def meta_og(teks):
    out = {}
    for m in re.finditer(r'<meta[^>]+(?:property|name)=["\'](og:[a-z:_]+|description)["\'][^>]+content=["\']([^"\']*)["\']', teks, re.I):
        out.setdefault(m.group(1).lower(), bersih(m.group(2)))
    for m in re.finditer(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\'](og:[a-z:_]+|description)["\']', teks, re.I):
        out.setdefault(m.group(2).lower(), bersih(m.group(1)))
    return out


def detail_instagram(url, kode):
    jenis = "reel" if "/reel/" in url else ("tv" if "/tv/" in url else "p")
    hasil = {"rasio": "9:16" if jenis == "reel" else "4:5"}
    try:
        r = get("https://www.instagram.com/%s/%s/embed/captioned/" % (jenis, kode))
        if r.status_code == 404:
            return {"hilang": True}
        t = r.text
        cap = re.search(r'class="Caption"[^>]*>(.*?)</div>', t, re.S)
        if cap:
            isi = re.sub(r'<a[^>]*class="CaptionUsername"[^>]*>.*?</a>', " ", cap.group(1), flags=re.S)
            hasil["keterangan"] = bersih(re.sub(r"<br\s*/?>", "\n", re.sub(r"<(?!br)[^>]+>", " ", isi)))
        u = re.search(r'class="UsernameText"[^>]*>([^<]+)<', t)
        if u:
            hasil["kanal"] = bersih(u.group(1))
        img = re.search(r'class="EmbeddedMediaImage"[^>]*src="([^"]+)"', t)
        if img:
            hasil["sampul"] = html.unescape(img.group(1))
    except requests.RequestException as e:
        log("  embed IG gagal:", e)
    if not hasil.get("keterangan") or not hasil.get("sampul"):
        try:
            og = meta_og(get(url, headers=UA_PRATINJAU).text)
            hasil.setdefault("keterangan", og.get("og:description") or og.get("description") or "")
            if not hasil.get("sampul"):
                hasil["sampul"] = og.get("og:image")
            if not hasil.get("kanal"):
                m = re.search(r"\(@([A-Za-z0-9_.]+)\)", og.get("og:title", ""))
                hasil["kanal"] = m.group(1) if m else None
        except requests.RequestException as e:
            log("  og IG gagal:", e)
    kap = hasil.get("keterangan") or ""
    hasil["judul"] = kap.split("\n")[0][:140] if kap else "Video Instagram"
    return hasil


def detail_facebook(url, vid):
    r = get(url, headers=UA_PRATINJAU)
    if r.status_code == 404:
        return {"hilang": True}
    og = meta_og(r.text)
    if not og:
        return {}
    judul = og.get("og:title") or ""
    ket = og.get("og:description") or og.get("description") or ""
    kanal = None
    m = re.match(r"^(.*?)\s*[|\-–]\s*(.+)$", judul)
    if m and len(m.group(2)) < 60:
        kanal = m.group(2)
    tujuan = og.get("og:url") or r.url
    return {"judul": judul or ket[:140] or "Video Facebook", "keterangan": ket, "kanal": kanal,
            "sampul": og.get("og:image"), "rasio": "9:16" if "/reel/" in (tujuan + url) else "16:9",
            "url_akhir": tujuan if "facebook.com" in tujuan else None}


DETAIL = {"tiktok": detail_tiktok, "instagram": detail_instagram, "facebook": detail_facebook}


# ---------------- Saringan, skor, dan sampul ----------------
def lolos(teks):
    if not WAJIB_NAMA.search(teks):
        return False
    if not WAJIB_LOKASI.search(teks):
        return False
    # Ada nama daerah lain dan tidak ada Merauke/Semangga sama sekali → desa lain
    if DESA_LAIN.search(teks) and not re.search(r"merauke|semangga", teks, re.I):
        return False
    return True


def skor(v, sekarang):
    j, k = v.get("judul") or "", v.get("keterangan") or ""
    rel = (3 if WAJIB_NAMA.search(j) else 0) + (1.5 if WAJIB_NAMA.search(k) else 0) + (1 if re.search(r"semangga|merauke", j, re.I) else 0)
    rel += min(1.5, 0.5 * len(WAJIB_NAMA.findall(j + " " + k)))
    umur = 365
    if v.get("tanggal"):
        try:
            umur = max(0, (sekarang.date() - dt.date.fromisoformat(v["tanggal"])).days)
        except ValueError:
            pass
    elif v.get("ditemukan"):
        try:
            umur = max(0, (sekarang.date() - dt.date.fromisoformat(v["ditemukan"][:10])).days) + 30
        except ValueError:
            pass
    segar = 3 * math.exp(-umur / 120)
    populer = math.log10((v.get("tayang") or 0) + 1) / 1.5
    return round(rel + segar + populer + (10 if v.get("pilihan") else 0), 3)


def simpan_sampul(v, sumber):
    """Unduh sampul, kecilkan (lebar maks. 480 px, rasio asli), simpan sebagai JPG."""
    if not sumber:
        return None
    nama = re.sub(r"[^A-Za-z0-9_-]", "_", kunci(v)) + ".jpg"
    path = os.path.join(THUMB_DIR, nama)
    try:
        from PIL import Image
        r = get(sumber, headers=UA_BROWSER)
        r.raise_for_status()
        im = Image.open(io.BytesIO(r.content)).convert("RGB")
        if im.width > 480:
            im = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
        os.makedirs(THUMB_DIR, exist_ok=True)
        im.save(path, "JPEG", quality=80, optimize=True, progressive=True)
        v["rasio_sampul"] = round(im.width / im.height, 3)
        return THUMB_URL + nama
    except Exception as e:  # noqa: BLE001 — sampul tidak wajib
        log("  sampul gagal:", kunci(v), e)
        return None


def norm_abaikan(daftar):
    out = set()
    for u in daftar:
        k = kenali(u)
        out.add(k[0] + "-" + k[1] if k else u.strip())
    return out


def video_pilihan():
    """Tautan video di bagian video.pilihan pada assets/js/data.js."""
    try:
        with open(DATAJS, encoding="utf-8") as f:
            s = f.read()
    except OSError:
        return []
    m = re.search(r"\n  video:\s*\{(.*?)\n  \}", s, re.S)
    if not m:
        return []
    isi = re.sub(r"//[^\n]*", "", m.group(1))     # abaikan contoh di komentar
    return kumpulkan_url(isi)


def main():
    sekarang = dt.datetime.now(WIT)
    lama = load_json(OUT, {})
    abaikan = norm_abaikan(load_json(ABAIKAN, []))
    pilihan = video_pilihan()
    simpanan = {kunci(v): v for v in lama.get("video", [])}

    # 1) Kumpulkan kandidat: {kunci: {platform, id, url, cuplikan}}
    kandidat = {}

    def tambah(url, cuplikan, sumber, wajib_pilih=False):
        k = kenali(url)
        if not k:
            return
        plat, vid, baku = k
        kk = plat + "-" + vid
        if kk in abaikan:
            return
        c = kandidat.setdefault(kk, {"platform": plat, "id": vid, "url": baku, "cuplikan": "", "sumber": set()})
        if cuplikan and cuplikan not in c["cuplikan"]:
            c["cuplikan"] = (c["cuplikan"] + " " + cuplikan).strip()[:1500]
        c["sumber"].add(sumber)
        if wajib_pilih:
            c["pilihan"] = True

    for u in pilihan:
        tambah(u, "", "pilihan", True)

    for q in KUERI_YT:
        for terbaru in (False, True):
            try:
                for u, t in cari_youtube(q, terbaru):
                    tambah(u, t, "youtube")
            except Exception as e:  # noqa: BLE001
                log("YouTube gagal:", q, e)
            time.sleep(1)

    for q in KUERI_WEB:
        for plat, dom in SITUS.items():
            qq = q + " site:" + dom
            for nama, fn in (("bing", bing_web), ("bing-video", bing_video), ("ddg", ddg)):
                if nama == "bing-video" and plat == "youtube":
                    continue
                try:
                    hs = fn(qq)
                    log(" ", nama, qq, "→", len(hs), "hasil,", sum(1 for u, _ in hs if kenali(u)), "video")
                    for u, t in hs:
                        tambah(u, t, nama)
                except Exception as e:  # noqa: BLE001
                    log(nama, "gagal:", qq, e)
                time.sleep(1)
        # Bing Video tanpa site: juga memuat TikTok/Facebook/Instagram
        try:
            for u, t in bing_video(q):
                tambah(u, t, "bing-video")
        except Exception as e:  # noqa: BLE001
            log("bing-video gagal:", q, e)

    # Video lama tetap diperiksa ulang (agar yang dihapus pemiliknya ikut hilang)
    for kk, v in simpanan.items():
        if kk not in kandidat and kk not in abaikan:
            kandidat[kk] = {"platform": v["platform"], "id": v["id"], "url": v["url"], "cuplikan": "", "sumber": {"simpanan"},
                            "pilihan": False}

    log("Kandidat:", len(kandidat), {p: sum(1 for c in kandidat.values() if c["platform"] == p) for p in POLA})

    # 2) Ambil detail dan saring
    hasil = []
    for kk, c in kandidat.items():
        plat, vid = c["platform"], c["id"]
        lama_v = simpanan.get(kk)
        # Kandidat dari pencarian yang cuplikannya sama sekali tidak menyebut Marga Mulya: lewati agar hemat
        if not c.get("pilihan") and not lama_v and c["cuplikan"] and not WAJIB_NAMA.search(c["cuplikan"]):
            continue
        if plat == "youtube" and not c.get("pilihan") and not lama_v and not c["cuplikan"]:
            continue
        try:
            d = detail_youtube(vid) if plat == "youtube" else DETAIL[plat](c["url"], vid)
            time.sleep(1.5 if plat == "youtube" and not YT_DIBATASI[0] else 0.3)
        except Exception as e:  # noqa: BLE001
            log("  detail gagal:", kk, e)
            d = None
        if d and d.get("hilang"):
            log("  hilang:", kk)
            continue
        if not d:
            if lama_v:            # sementara gagal dibaca: pertahankan data lama
                hasil.append(lama_v)
            continue
        teks = " ".join([d.get("judul") or "", d.get("keterangan") or "", c["cuplikan"]])
        if not c.get("pilihan") and not lolos(teks):
            log("  tidak lolos:", kk, "|", teks[:120].replace("\n", " "))
            continue
        url = d.get("url_akhir") or c["url"]
        v = {"platform": plat, "id": vid, "url": url,
             "judul": bersih(d.get("judul"))[:200] or "Video " + plat.title(),
             "kanal": bersih(d.get("kanal")) or None,
             "keterangan": bersih(d.get("keterangan"))[:400],
             "tanggal": d.get("tanggal") or (lama_v or {}).get("tanggal"),
             "tayang": d.get("tayang"), "durasi": d.get("durasi"),
             "rasio": d.get("rasio") or "16:9",
             "ditemukan": (lama_v or {}).get("ditemukan") or sekarang.date().isoformat()}
        if c.get("pilihan"):
            v["pilihan"] = True
        v["sampul"] = simpan_sampul(v, d.get("sampul")) or (lama_v or {}).get("sampul")
        if v["sampul"] is None and lama_v is None and plat != "youtube":
            log("  tanpa sampul (tetap ditampilkan):", kk)
        v = {k: x for k, x in v.items() if x not in (None, "", 0)}
        hasil.append(v)
        log("  OK", kk, "|", v["judul"][:70])
        time.sleep(0.5)

    for v in hasil:
        v["skor"] = skor(v, sekarang)
    hasil.sort(key=lambda v: -v["skor"])
    hasil = hasil[:MAKS]

    # 3) Hapus sampul yang tidak dipakai lagi
    dipakai = {os.path.basename(v.get("sampul", "")) for v in hasil}
    if os.path.isdir(THUMB_DIR):
        for f in os.listdir(THUMB_DIR):
            if f.endswith(".jpg") and f not in dipakai:
                os.remove(os.path.join(THUMB_DIR, f))

    keluaran = {"diperiksa": sekarang.isoformat(timespec="minutes"),
                "catatan": "Dibuat otomatis oleh scripts/update_video.py. Jangan disunting manual; gunakan video.pilihan di assets/js/data.js atau data/video-abaikan.json.",
                "video": hasil}
    berubah = [ {k: x for k, x in v.items() if k != "skor"} for v in hasil] != [{k: x for k, x in v.items() if k != "skor"} for v in lama.get("video", [])]
    if berubah or not lama:
        with open(OUT, "w", encoding="utf-8") as f:
            json.dump(keluaran, f, ensure_ascii=False, indent=1)
            f.write("\n")
    log("Selesai:", len(hasil), "video;", "berubah" if berubah else "tidak berubah",
        {p: sum(1 for v in hasil if v["platform"] == p) for p in POLA})


if __name__ == "__main__":
    main()
