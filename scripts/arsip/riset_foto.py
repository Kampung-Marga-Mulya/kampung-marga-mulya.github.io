"""Riset sekali jalan: cari foto berlisensi bebas di Wikimedia Commons untuk kartu potensi.
Hasil (metadata + thumbnail) disimpan ke cabang 'riset-foto', bukan ke situs."""
import json, os, re, time, requests
UA = {"User-Agent": "MargaMulyaOnSite/1.0 (https://kampung-marga-mulya.github.io; riset foto potensi)"}
API = "https://commons.wikimedia.org/w/api.php"
Q = {
  "jeruk": ["citrus orchard Indonesia", "kebun jeruk", "orange plantation Indonesia", "Citrus nobilis tree fruit"],
  "cabai": ["chili plantation Indonesia", "kebun cabai", "Capsicum annuum field Indonesia"],
  "padi": ["sawah Merauke", "rice field Merauke", "padi Merauke", "rice harvest Papua"],
  "sapi": ["Bali cattle", "sapi Bali", "cattle Merauke", "sapi Papua"],
  "ayam": ["ayam petelur", "laying hens cage Indonesia", "chicken farm Indonesia"],
  "airminum": ["depot air minum isi ulang", "galon air minum", "water refill station Indonesia"],
  "umkm": ["warung Indonesia village", "kios kelontong", "traditional market Merauke"],
  "wisata": ["bamboo park Indonesia", "taman bambu", "Merauke tourism", "Wasur National Park", "agrotourism Indonesia"],
  "merauke": ["Merauke"],
}
os.makedirs("out", exist_ok=True)
hasil = {}
for kunci, qs in Q.items():
    hasil[kunci] = []
    seen = set()
    for q in qs:
        try:
            r = requests.get(API, params={"action": "query", "format": "json", "generator": "search", "gsrsearch": q, "gsrnamespace": 6,
                "gsrlimit": 12, "prop": "imageinfo", "iiprop": "url|extmetadata|size|mime", "iiurlwidth": 1000}, headers=UA, timeout=40).json()
        except Exception as e:
            print("gagal", q, e); continue
        for p in (r.get("query", {}).get("pages", {}) or {}).values():
            ii = (p.get("imageinfo") or [{}])[0]
            if ii.get("mime") not in ("image/jpeg", "image/png") or p["title"] in seen: continue
            m = ii.get("extmetadata", {})
            lic = (m.get("LicenseShortName", {}) or {}).get("value", "")
            if not re.search(r"CC0|CC BY|Public domain|PD", lic, re.I) or re.search(r"NC|ND", lic): continue
            seen.add(p["title"])
            art = re.sub("<[^>]+>", "", (m.get("Artist", {}) or {}).get("value", "")).strip()
            desc = re.sub("<[^>]+>", "", (m.get("ImageDescription", {}) or {}).get("value", "")).strip()[:300]
            hasil[kunci].append({"q": q, "title": p["title"], "thumb": ii.get("thumburl"), "page": ii.get("descriptionurl"),
                                 "lisensi": lic, "lisensiUrl": (m.get("LicenseUrl", {}) or {}).get("value", ""), "pembuat": art,
                                 "desk": desc, "w": ii.get("width"), "h": ii.get("height")})
        time.sleep(1)
    # unduh maksimal 8 thumbnail per kunci
    for i, it in enumerate(hasil[kunci][:8]):
        try:
            b = requests.get(it["thumb"], headers=UA, timeout=60).content
            fn = f"out/{kunci}-{i}.jpg"; open(fn, "wb").write(b); it["file"] = fn
        except Exception as e:
            print("unduh gagal", it["title"], e)
        time.sleep(.5)
json.dump(hasil, open("out/foto.json", "w"), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in hasil.items()})
