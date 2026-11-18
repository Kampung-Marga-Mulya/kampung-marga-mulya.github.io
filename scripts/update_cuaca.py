"""Perbarui data cuaca & pertanian Kampung Marga Mulya dari Sinau Bumi (IPB University).

Sumber: stasiun cuaca otomatis (AWS) PAT-1 Desa Waninggap Kai, Merauke — stasiun terdekat
dari Kampung Marga Mulya (± 6 km). Data diambil dari:
  - map.sinaubumi.org  : kondisi cuaca terkini (per 5–30 menit)
  - pat.cwssibu.org     : grafik harian per 5 menit (dasbor stasiun)
  - kat.sinaubumi.org   : neraca air / kelembapan tanah (SMI), hujan 60 hari & prakiraan 16 hari
  - hpt.sinaubumi.org   : risiko hama & penyakit tanaman (padi, jagung)
  - fwi.sinaubumi.org   : indeks bahaya kebakaran (Fire Weather Index)
  - pat.cwssibu.org/dashboard/aws-pat1/forecast/daily : prakiraan 10 hari (AWS komunitas & Wunderground)
Hasil ditulis ke data/cuaca.json. Bila satu sumber gagal, data lama bagian itu dipertahankan.
"""
import html as htmllib, json, os, re, sys, datetime as dt
import requests

SLUG = "pat-1-desa-waninggap-kai-merauke"
DASH = "https://pat.cwssibu.org/dashboard/aws-pat1"
OUT = sys.argv[1] if len(sys.argv) > 1 else "data/cuaca.json"
UA = {"User-Agent": "Mozilla/5.0 (MargaMulyaOnSite; +https://kampung-marga-mulya.github.io/)"}
WIT = dt.timezone(dt.timedelta(hours=9))
s = requests.Session(); s.headers.update(UA)


def angka(v):
    try:
        return None if v is None or v == "" else float(v)
    except (TypeError, ValueError):
        return None


def markers(url, nama="MARKERS"):
    html = s.get(url, timeout=60).text
    i = html.find("const " + nama)
    if i < 0:
        raise ValueError(nama + " tidak ditemukan di " + url)
    j = html.find("[", i) if nama == "MARKERS" else html.find("{", i)
    obj, _ = json.JSONDecoder().raw_decode(html[j:])
    return obj, html


def ambil_stasiun(daftar):
    for m in daftar:
        if m.get("slug") == SLUG:
            return m
    raise ValueError("stasiun PAT-1 tidak ada")


def bagian_terkini():
    d = s.get("https://map.sinaubumi.org/index.php?action=data", timeout=60).json()
    m = ambil_stasiun(d["stations"])
    k = {x: m.get(x) for x in ["temp", "dew_point", "humidity", "pressure", "solar", "sunshine", "wind_speed", "wind_dir", "rain_rate", "eto"]}
    return {"waktu": m.get("created_display"), "aktif": m.get("is_active"), **k}, {
        "nama": m.get("name"), "lat": m.get("lat"), "lon": m.get("lon"), "elevasi": m.get("elevation"), "dasbor": m.get("link_dashboard")}


def bagian_harian():
    """Data per 5 menit hari ini dari dasbor stasiun → ringkasan & per jam."""
    r = s.get(DASH, timeout=60)
    js = re.search(r'src="([^"]+/build/assets/app-[^"]+\.js)"', r.text) or re.search(r'href="([^"]+/build/assets/app-[^"]+\.js)"', r.text)
    kode = None
    if js:
        b = s.get(js.group(1), timeout=60).text
        mk = re.search(r'loadData\(\)\{try\{const s=\{code:"([^"]+)"', b) or re.search(r'code:"([A-Za-z0-9+/=]{20,})"', b)
        kode = mk.group(1) if mk else None
    if not kode:
        raise ValueError("kode dasbor tidak ditemukan")
    xsrf = requests.utils.unquote(s.cookies.get("XSRF-TOKEN", ""))
    csrf = re.search(r'name="csrf-token" content="([^"]+)"', r.text)
    h = {"X-Requested-With": "XMLHttpRequest", "Accept": "application/json", "Content-Type": "application/json", "Referer": DASH}
    if xsrf: h["X-XSRF-TOKEN"] = xsrf
    if csrf: h["X-CSRF-TOKEN"] = csrf.group(1)
    data = s.post(DASH, data=json.dumps({"code": kode}), headers=h, timeout=60).json()
    rows = [x for x in data[0] if angka(x.get("temperature")) is not None]
    if not rows:
        raise ValueError("data harian kosong")
    tgl = rows[-1]["created_at"][:10]
    T = [angka(x["temperature"]) for x in rows]
    H = [angka(x["humidity"]) for x in rows if angka(x.get("humidity")) is not None]
    W = [angka(x["wind_speed"]) for x in rows if angka(x.get("wind_speed")) is not None]
    hujan = sum((angka(x.get("rain_rate")) or 0) * 5 / 60 for x in rows)  # mm/jam tiap 5 menit → mm
    jam = {}
    for x in rows:
        j = int(x["created_at"][11:13])
        g = jam.setdefault(j, {"t": [], "h": [], "r": 0.0, "s": []})
        g["t"].append(angka(x["temperature"]))
        if angka(x.get("humidity")) is not None: g["h"].append(angka(x["humidity"]))
        if angka(x.get("solar")) is not None: g["s"].append(angka(x["solar"]))
        g["r"] += (angka(x.get("rain_rate")) or 0) * 5 / 60
    per_jam = [{"jam": j, "suhu": round(sum(g["t"]) / len(g["t"]), 1), "lembap": round(sum(g["h"]) / len(g["h"])) if g["h"] else None,
                "hujan": round(g["r"], 1), "radiasi": round(max(g["s"])) if g["s"] else None} for j, g in sorted(jam.items())]
    sun = data[1][0].get("sunshine_duration") if len(data) > 1 and data[1] else None
    return {"tanggal": tgl, "suhuMin": min(T), "suhuMaks": max(T), "lembapRata": round(sum(H) / len(H)) if H else None,
            "anginMaks": max(W) if W else None, "hujan": round(hujan, 1), "penyinaran": angka(sun), "perJam": per_jam,
            "terakhir": rows[-1]["created_at"]}


def bagian_kat():
    mk, _ = markers("https://kat.sinaubumi.org/")
    m = ambil_stasiun(mk)
    n = 30
    return {"status": m.get("status"), "smi": m.get("smi_val"),
            "hist": {"tanggal": m["datesHist"][-n:], "hujan": m["rainHist"][-n:], "et0": m["et0Hist"][-n:], "smi": m["smiHist"][-n:]},
            "prakiraan": {"tanggal": m["datesFc"], "hujan": m["rainFc"], "et0": m["et0Fc"], "smi": m["smiFc"]}}


def bagian_hpt():
    mk, html = markers("https://hpt.sinaubumi.org/")
    meta = json.JSONDecoder().raw_decode(html[html.find("{", html.find("const CROP_META")):])[0]
    m = ambil_stasiun(mk)
    hasil = {"tanggal": m.get("created_at_display"), "tanaman": {}}
    for crop in ["padi", "jagung"]:
        c = (m.get("crops") or {}).get(crop)
        cm = meta.get(crop) or {}
        if not c:
            continue
        hama = []
        for key, v in c["pests"].items():
            pm = (cm.get("pests") or {}).get(key, {})
            hama.append({"kode": key, "nama": pm.get("label", key), "latin": pm.get("latin"), "nilai": v.get("value"), "kategori": v.get("category"),
                         "saran": (pm.get("actions") or {}).get(v.get("category"))})
        hama.sort(key=lambda x: -(x["nilai"] or 0))
        hasil["tanaman"][crop] = {"nama": cm.get("label", crop), "latin": cm.get("deskripsi"), "puncak": c.get("top_value"), "kategori": c.get("top_category"), "hama": hama}
    return hasil


def bagian_fwi():
    mk, _ = markers("https://fwi.sinaubumi.org/")
    m = ambil_stasiun(mk)
    return {"tanggal": m.get("created_at_display"), "status": m.get("status"), "nilai": m.get("fwi_val"), "detail": m.get("detail")}


def bagian_ramalan():
    r = s.get(DASH + "/forecast/daily", timeout=60)
    m = re.search(r'data-page="([^"]+)"', r.text)
    fc = json.loads(htmllib.unescape(m.group(1)))["props"]["forecast"]
    hari = []
    for x in fc.get("data") or []:
        d, n = x.get("day") or {}, x.get("night") or {}
        pilih = d if d.get("iconCode") is not None else n
        hujan = [v for v in (d.get("precipChance"), n.get("precipChance")) if v is not None]
        jumlah = [v for v in (d.get("precipAmount"), n.get("precipAmount")) if v is not None]
        hari.append({"tanggal": (x.get("date") or "")[:10], "maks": x.get("tempMax"), "min": x.get("tempMin"),
                     "peluangHujan": max(hujan) if hujan else None, "hujan": round(sum(jumlah), 1) if jumlah else None,
                     "ikon": pilih.get("iconCode"), "kondisi": pilih.get("condition"), "lembap": pilih.get("humidity"),
                     "angin": pilih.get("windSpeed"), "arahAngin": pilih.get("windDirection"), "awan": pilih.get("cloudCover"), "uv": d.get("uvIndex"),
                     "terbit": (x.get("sunriseTime") or "")[11:16], "terbenam": (x.get("sunsetTime") or "")[11:16]})
    if not hari:
        raise ValueError("prakiraan kosong")
    return {"diambil": fc.get("cached_at"), "sumber": "AWS komunitas & Wunderground", "hari": hari}


def main():
    lama = {}
    if os.path.exists(OUT):
        try:
            lama = json.load(open(OUT, encoding="utf-8"))
        except Exception:
            lama = {}
    out = dict(lama)
    galat = []
    try:
        out["kini"], out["stasiun"] = bagian_terkini()
    except Exception as e:
        galat.append("kini: %s" % e)
    for kunci, fn in [("hariIni", bagian_harian), ("air", bagian_kat), ("hpt", bagian_hpt), ("fwi", bagian_fwi), ("ramalan", bagian_ramalan)]:
        try:
            out[kunci] = fn()
        except Exception as e:
            galat.append("%s: %s" % (kunci, e))
    out["sumber"] = {"nama": "Sinau Bumi & IPB University — AWS PAT-1 Desa Waninggap Kai (Ekspedisi Patriot)", "url": "https://map.sinaubumi.org/", "dasbor": DASH}
    out["diperbarui"] = dt.datetime.now(WIT).strftime("%Y-%m-%dT%H:%M+09:00")
    os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("selesai; galat:", galat or "tidak ada")
    if len(galat) >= 6:
        sys.exit(1)


if __name__ == "__main__":
    main()
