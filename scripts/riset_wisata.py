#!/usr/bin/env python3
"""Riset sekali jalan: ambil tempat wisata/kuliner bernama dari OpenStreetMap di sekitar
Semangga–Merauke, lalu hitung jarak & waktu tempuh jalan dari Kampung Marga Mulya (OSRM)."""
import json, sys, time, urllib.parse
import requests

UA = {"User-Agent": "MargaMulyaOnSite/1.0 (https://kampung-marga-mulya.github.io)"}
BBOX = "-8.95,139.95,-8.15,141.15"   # selatan,barat,utara,timur
Q = f"""[out:json][timeout:120];
(
  nwr["amenity"~"^(restaurant|cafe|fast_food|food_court|marketplace|ice_cream)$"]["name"]({BBOX});
  nwr["leisure"~"^(swimming_pool|water_park|park|fishing|nature_reserve|garden|resort|beach_resort|playground|sports_centre|stadium)$"]["name"]({BBOX});
  nwr["tourism"~"^(attraction|viewpoint|museum|zoo|artwork|picnic_site|camp_site|theme_park|gallery)$"]["name"]({BBOX});
  nwr["natural"~"^(beach|water|wetland)$"]["name"]({BBOX});
  nwr["historic"]["name"]({BBOX});
  nwr["boundary"="protected_area"]["name"]({BBOX});
  node["place"~"^(village|hamlet|town|suburb|neighbourhood|city)$"]({BBOX});
);
out center tags;"""

def overpass():
    for ep in ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]:
        try:
            r = requests.post(ep, data={"data": Q}, headers=UA, timeout=180)
            r.raise_for_status()
            return r.json()["elements"]
        except Exception as e:
            print("overpass gagal", ep, e, file=sys.stderr)
    return []

els = overpass()
out = []
for e in els:
    t = e.get("tags", {})
    lat = e.get("lat") or (e.get("center") or {}).get("lat")
    lon = e.get("lon") or (e.get("center") or {}).get("lon")
    if lat is None:
        continue
    out.append({"osm": f'{e["type"]}/{e["id"]}', "name": t.get("name"), "lat": round(lat, 6), "lon": round(lon, 6),
                "tags": {k: v for k, v in t.items() if k in ("amenity","leisure","tourism","natural","historic","place","cuisine",
                         "addr:street","addr:full","opening_hours","website","phone","wikidata","wikipedia","image","wikimedia_commons","boundary","description")}})
print("elemen:", len(out), file=sys.stderr)

# Pusat: node place bernama Marga Mulya
pusat = next((o for o in out if o["tags"].get("place") and "marga" in (o["name"] or "").lower() and "mulya" in (o["name"] or "").lower()), None)
print("pusat:", pusat, file=sys.stderr)
res = {"pusat": pusat, "poi": [o for o in out if not o["tags"].get("place")], "places": [o for o in out if o["tags"].get("place")]}

if pusat:
    pois = res["poi"]
    for i in range(0, len(pois), 90):
        chunk = pois[i:i+90]
        coords = ";".join([f'{pusat["lon"]},{pusat["lat"]}'] + [f'{p["lon"]},{p["lat"]}' for p in chunk])
        url = f"https://router.project-osrm.org/table/v1/driving/{coords}?sources=0&annotations=distance,duration"
        try:
            r = requests.get(url, headers=UA, timeout=60); r.raise_for_status(); j = r.json()
            for p, d, s in zip(chunk, j["distances"][0][1:], j["durations"][0][1:]):
                p["jalan_km"] = round(d / 1000, 1) if d is not None else None
                p["jalan_menit"] = round(s / 60) if s is not None else None
        except Exception as e:
            print("osrm gagal", e, file=sys.stderr)
        time.sleep(1)

json.dump(res, open("riset-wisata.json", "w"), ensure_ascii=False, indent=1)
