#!/usr/bin/env python3
"""Refresh the merch section from the LIVE Printify storefront.

Reads src/data/merch-picks.json (product id, display name, kind), checks each
product on the public storefront API, and writes src/data/merch.json with the
live price, link and a local copy of the main image (public/merch/<id>.jpg).
Any product that is not live (404, hidden, no image, nothing in stock) is
dropped and printed as DROPPED, so the site never links a dead product.
Run before every deploy:  python3 scripts/refresh_merch.py && npm run build
"""
import io, json, os, sys, urllib.request, urllib.error
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG = "rogue-ai"
STORE = f"https://{SLUG}.printify.me"
UA = {"User-Agent": "Mozilla/5.0"}

def get(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30)
        return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b""

picks = json.load(open(f"{ROOT}/src/data/merch-picks.json"))
out, dropped = [], []
os.makedirs(f"{ROOT}/public/merch", exist_ok=True)
for p in picks:
    s, b = get(f"https://api.printify.me/api/{SLUG}/product/{p['id']}")
    if s != 200:
        dropped.append((p, f"storefront API {s}")); continue
    j = json.loads(b)
    stock = [v for v in j.get("variants", []) if not v.get("out_of_stock")]
    if not j.get("image") or not stock:
        dropped.append((p, "no image or nothing in stock")); continue
    page = f"{STORE}/product/{p['id']}"
    ps, _ = get(page)
    if ps != 200:
        dropped.append((p, f"product page {ps}")); continue
    s, img = get(j["image"])
    if s != 200:
        dropped.append((p, f"image {s}")); continue
    im = Image.open(io.BytesIO(img)).convert("RGB")
    im.thumbnail((600, 600))
    im.save(f"{ROOT}/public/merch/{p['id']}.jpg", quality=82, optimize=True)
    cents = min(v["retail_price"] for v in stock)
    out.append({**p, "price": f"${cents/100:.2f}", "url": page,
                "image": f"/merch/{p['id']}.jpg", "printifyTitle": j["title"]})
    print("LIVE   ", p["id"], p["name"], p["kind"], out[-1]["price"])
for p, why in dropped:
    print("DROPPED", p["id"], p["name"], why)
keep = {f"{x['id']}.jpg" for x in out}
for f in os.listdir(f"{ROOT}/public/merch"):
    if f not in keep: os.remove(f"{ROOT}/public/merch/{f}")
json.dump(out, open(f"{ROOT}/src/data/merch.json", "w"), indent=1)
print(f"{len(out)} live, {len(dropped)} dropped")
sys.exit(0 if out else 1)
