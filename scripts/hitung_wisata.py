#!/usr/bin/env python3
"""
Hitung jarak & waktu tempuh jalan dari Kampung Marga Mulya ke setiap tempat di data/wisata.json.

- Tempat tanpa koordinat dicari lokasinya lewat OpenStreetMap (Nominatim) memakai kolom "cari".
  Hasilnya ditandai "perkiraan": true karena biasanya hanya sampai tingkat jalan/kelurahan.
- Jarak dan waktu dihitung dengan rute jalan OSRM (data OpenStreetMap). Waktu dikali 1,25
  agar lebih realistis untuk kondisi jalan di Merauke, lalu dibulatkan ke 5 menit.

Dijalankan otomatis oleh GitHub Actions setiap kali data/wisata.json diubah.
"""
import json, math, os, sys, time, urllib.parse
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "data", "wisata.json")
UA = {"User-Agent": "MargaMulyaOnSite/1.0 (https://kampung-marga-mulya.github.io)"}
VIEWBOX = "139.9,-8.1,141.2,-9.0"   # kiri,atas,kanan,bawah (sekitar Merauke)
FAKTOR_WAKTU = 1.25

def geocode(q):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"q": q, "format": "jsonv2", "limit": 1, "viewbox": VIEWBOX, "bounded": 1, "countrycodes": "id"})
    r = requests.get(url, headers=UA, timeout=30); r.raise_for_status()
    j = r.json(); time.sleep(1.1)   # aturan pemakaian Nominatim: maks 1 permintaan/detik
    return (float(j[0]["lat"]), float(j[0]["lon"])) if j else None

def haversine(a, b):
    R = 6371; la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2 * R * math.asin(math.sqrt(h))

data = json.load(open(PATH, encoding="utf-8"))
pusat = (data["pusat"]["lat"], data["pusat"]["lng"])
for t in data["tempat"]:
    if t.get("lat") is None and t.get("cari"):
        try:
            g = geocode(t["cari"])
        except Exception as e:
            print("geocode gagal", t["nama"], e, file=sys.stderr); g = None
        if g:
            t["lat"], t["lng"] = round(g[0], 6), round(g[1], 6); t["perkiraan"] = True
            print("lokasi perkiraan:", t["nama"], g, file=sys.stderr)

ada = [t for t in data["tempat"] if t.get("lat") is not None]
coords = ";".join([f"{pusat[1]},{pusat[0]}"] + [f'{t["lng"]},{t["lat"]}' for t in ada])
try:
    r = requests.get(f"https://router.project-osrm.org/table/v1/driving/{coords}?sources=0&annotations=distance,duration",
                     headers=UA, timeout=60); r.raise_for_status(); j = r.json()
    for t, d, s in zip(ada, j["distances"][0][1:], j["durations"][0][1:]):
        if d is None:
            continue
        t["jarak_km"] = round(d / 1000, 1)
        t["waktu_menit"] = max(5, int(round(s * FAKTOR_WAKTU / 60 / 5) * 5))
except Exception as e:
    print("OSRM gagal, pakai jarak garis lurus x1,3:", e, file=sys.stderr)
    for t in ada:
        km = haversine(pusat, (t["lat"], t["lng"])) * 1.3
        t["jarak_km"] = round(km, 1); t["waktu_menit"] = max(5, int(round(km / 40 * 60 / 5) * 5))
data["tempat"].sort(key=lambda t: t.get("jarak_km", 9999))
json.dump(data, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
open(PATH, "a").write("\n")
print("selesai:", sum(1 for t in data["tempat"] if "jarak_km" in t), "tempat berjarak")
