import json, os, requests, time
UA = {"User-Agent": "MargaMulyaOnSite/1.0 (https://kampung-marga-mulya.github.io)"}
os.makedirs("out", exist_ok=True)
for it in json.load(open("scripts/foto_pilih.json")):
    open(f"out/{it['id']}.jpg", "wb").write(requests.get(it["thumb"], headers=UA, timeout=60).content); time.sleep(.5)
print("ok")
