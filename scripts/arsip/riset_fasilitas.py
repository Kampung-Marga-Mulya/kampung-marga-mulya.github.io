#!/usr/bin/env python3
"""Riset sekali jalan: fasilitas umum di sekitar Kampung Marga Mulya (OSM + data PAUD Kemendikdasmen)."""
import json, re, sys, html
import requests
UA = {"User-Agent": "Mozilla/5.0 (MargaMulyaOnSite; https://kampung-marga-mulya.github.io)"}
LAT, LON, R = -8.409726, 140.463722, 4000
Q = f"""[out:json][timeout:120];
(
  nwr["amenity"](around:{R},{LAT},{LON});
  nwr["shop"](around:{R},{LAT},{LON});
  nwr["building"~"^(church|mosque|chapel|school|kindergarten|public|government|clinic|hospital|temple)$"](around:{R},{LAT},{LON});
  nwr["leisure"](around:{R},{LAT},{LON});
  nwr["office"](around:{R},{LAT},{LON});
  nwr["healthcare"](around:{R},{LAT},{LON});
);
out center tags;"""
res = {"osm": [], "paud": [], "dikdas_html_marga": []}
for ep in ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]:
    try:
        r = requests.post(ep, data={"data": Q}, headers=UA, timeout=180); r.raise_for_status()
        for e in r.json()["elements"]:
            c = e.get("center") or {}
            res["osm"].append({"osm": f'{e["type"]}/{e["id"]}', "lat": e.get("lat", c.get("lat")), "lon": e.get("lon", c.get("lon")), "tags": e.get("tags", {})})
        break
    except Exception as ex:
        print("overpass gagal", ep, ex, file=sys.stderr)
for url in ["https://referensi.data.kemendikdasmen.go.id/pendidikan/paud/370105/3",
            "https://referensi.data.kemendikdasmen.go.id/pendidikan/paud/370105/3/jf/1/all",
            "https://referensi.data.kemendikdasmen.go.id/pendidikan/dikmen/370105/3"]:
    try:
        t = requests.get(url, headers=UA, timeout=60).text
        rows = re.findall(r"<tr.*?</tr>", t, re.S | re.I)
        for row in rows:
            txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", row))).strip()
            npsn = re.findall(r"/npsn/(\d+)", row)
            if txt:
                res["paud"].append({"src": url, "row": txt, "npsn": npsn})
    except Exception as ex:
        print("gagal", url, ex, file=sys.stderr)
# detail NPSN untuk baris yang menyebut Marga Mulya
for r_ in list(res["paud"]):
    if "MARGA MULYA" in r_["row"].upper() and r_["npsn"]:
        n = r_["npsn"][0]
        try:
            t = requests.get(f"https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/{n}", headers=UA, timeout=60).text
            txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"<script.*?</script>", " ", t, flags=re.S))))
            res["dikdas_html_marga"].append({"npsn": n, "text": txt[:4000]})
        except Exception as ex:
            print("npsn gagal", n, ex, file=sys.stderr)
json.dump(res, open("riset-fasilitas.json", "w"), ensure_ascii=False, indent=1)
print("osm", len(res["osm"]), "paud rows", len(res["paud"]), "detail", len(res["dikdas_html_marga"]))
