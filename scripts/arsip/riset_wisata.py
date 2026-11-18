"""Riset sekali jalan: mencari lokasi wisata di Distrik Tanah Miring & Semangga
dari OpenStreetMap (Overpass, Nominatim, Photon) dan pencarian web sederhana.
Hasil disimpan ke riset-wisata.json (cabang "riset-wisata"), bukan ke situs."""
import json, re, time, html
import requests

UA = {"User-Agent": "MargaMulyaOnSite/1.0 (riset wisata; github.com/Kampung-Marga-Mulya)"}
NAMA = [
    "Taman Wisata Alam Mandira Loka", "Mandira Loka", "Mandira Agro Park", "Taman Bambu Mandira",
    "Romans Garden", "Roman Garden Merauke", "Hokkaido Farm", "Kebun Percontohan Porang",
    "Porang Tanah Miring", "Akerezki Farm", "Kebun Pisang Akerezki", "Kebun Coklat Tanah Miring",
    "Kebun Anggur Rahe Grape",
]
BBOX = (-8.62, 140.30, -8.05, 140.80)  # s, w, n, e  (Semangga, Tanah Miring, Kurik selatan)
hasil = {"overpass": [], "nominatim": {}, "photon": {}, "web": {}, "kampung": [], "bps": []}

def aman(f, *a, **k):
    try:
        return f(*a, **k)
    except Exception as e:  # noqa
        return {"galat": str(e)}

# 1. Overpass: semua fitur bernama yang berbau wisata/taman/kebun/kolam
q = f"""[out:json][timeout:90];
(
  nwr["tourism"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  nwr["leisure"~"park|garden|swimming_pool|water_park|fishing|playground|resort"]["name"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  nwr["name"~"Mandira|Roman|Hokkaido|Porang|Akerezki|Rezki|Farm|Garden|Kebun|Taman|Wisata|Kolam|Pancing|Agro|Pisang|Bambu",i]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  nwr["landuse"="orchard"]["name"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
);
out center tags;"""
for srv in ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]:
    r = aman(requests.post, srv, data={"data": q}, headers=UA, timeout=120)
    if hasattr(r, "json"):
        try:
            for el in r.json().get("elements", []):
                c = el.get("center") or {"lat": el.get("lat"), "lon": el.get("lon")}
                hasil["overpass"].append({"id": f'{el["type"]}/{el["id"]}', "lat": c.get("lat"), "lng": c.get("lon"), "tags": el.get("tags", {})})
            break
        except Exception as e:
            hasil["overpass_galat"] = str(e)

# 2. Kampung-kampung di Tanah Miring & Semangga (titik desa)
qk = f"""[out:json][timeout:60];
nwr["place"~"village|hamlet|neighbourhood|suburb"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
out center tags;"""
r = aman(requests.post, "https://overpass-api.de/api/interpreter", data={"data": qk}, headers=UA, timeout=90)
if hasattr(r, "json"):
    try:
        for el in r.json().get("elements", []):
            c = el.get("center") or {"lat": el.get("lat"), "lon": el.get("lon")}
            hasil["kampung"].append({"nama": el.get("tags", {}).get("name"), "place": el.get("tags", {}).get("place"), "lat": c.get("lat"), "lng": c.get("lon"), "tags": el.get("tags", {})})
    except Exception as e:
        hasil["kampung_galat"] = str(e)

# 3. Nominatim + Photon per nama
for n in NAMA:
    r = aman(requests.get, "https://nominatim.openstreetmap.org/search", params={"q": n + ", Merauke", "format": "jsonv2", "limit": 5, "countrycodes": "id"}, headers=UA, timeout=30)
    hasil["nominatim"][n] = r.json() if hasattr(r, "json") else r
    time.sleep(1.2)
    r = aman(requests.get, "https://photon.komoot.io/api/", params={"q": n + " Merauke", "limit": 5, "lat": -8.40, "lon": 140.47}, headers=UA, timeout=30)
    try:
        hasil["photon"][n] = [{"nama": f["properties"].get("name"), "lng": f["geometry"]["coordinates"][0], "lat": f["geometry"]["coordinates"][1], "props": f["properties"]} for f in r.json().get("features", [])]
    except Exception as e:
        hasil["photon"][n] = str(e)
    time.sleep(1)

# 4. Pencarian web (DuckDuckGo HTML) untuk petunjuk lokasi
for n in NAMA + ["wisata Distrik Tanah Miring Merauke", "agrowisata Tanah Miring Merauke", "taman wisata Semangga Merauke"]:
    r = aman(requests.post, "https://html.duckduckgo.com/html/", data={"q": n + " Merauke"}, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
    out = []
    if hasattr(r, "text"):
        for m in re.finditer(r'class="result__a" href="([^"]+)"[^>]*>(.*?)</a>.*?class="result__snippet"[^>]*>(.*?)</a>', r.text, re.S):
            out.append({"url": html.unescape(m.group(1)), "judul": re.sub("<.*?>", "", html.unescape(m.group(2))), "cuplikan": re.sub("<.*?>", "", html.unescape(m.group(3)))})
    hasil["web"][n] = out[:8]
    time.sleep(2)

# 5. BPS Kecamatan Tanah Miring Dalam Angka 2025: cari baris tentang wisata
r = aman(requests.get, "https://meraukekab.bps.go.id/id/publication/2025/09/26/990ad63f69bb8f16a1f2c435/kecamatan-tanah-miring-dalam-angka-2025.html", headers={"User-Agent": "Mozilla/5.0"}, timeout=60)
if hasattr(r, "text"):
    links = sorted(set(re.findall(r'https://web-api\.bps\.go\.id/download\.php\?f=[^"\'\s<>]+', r.text)))
    hasil["bps_links"] = links[:5]
    for L in links[:2]:
        p = aman(requests.get, html.unescape(L), headers={"User-Agent": "Mozilla/5.0"}, timeout=120)
        if hasattr(p, "content") and p.content[:4] == b"%PDF":
            open("/tmp/bps.pdf", "wb").write(p.content)
            from pypdf import PdfReader
            teks = "\n".join((pg.extract_text() or "") for pg in PdfReader("/tmp/bps.pdf").pages)
            baris = teks.splitlines()
            for i, b in enumerate(baris):
                if re.search(r"wisata|rekreasi|tourism|objek", b, re.I):
                    hasil["bps"].append("\n".join(baris[max(0, i - 2): i + 6]))
            break

json.dump(hasil, open("riset-wisata.json", "w"), ensure_ascii=False, indent=1)
print("overpass", len(hasil["overpass"]), "kampung", len(hasil["kampung"]), "bps", len(hasil["bps"]))
