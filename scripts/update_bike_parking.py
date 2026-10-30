"""Download UMD campus bike parking from OpenStreetMap and save it to data/bike-parking.json.

The map page loads this saved file, because the live OpenStreetMap (Overpass) API can take
30+ seconds to respond. Rerun this script whenever you want fresher data:

    python scripts/update_bike_parking.py
"""

import json
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

# Must match CAMPUS_BOUNDS in js/common.js: south, west, north, east
BBOX = "38.9800,-76.9560,38.9980,-76.9310"
QUERY = f"""[out:json][timeout:60];
(node["amenity"="bicycle_parking"]({BBOX});
 way["amenity"="bicycle_parking"]({BBOX}););
out center tags;"""

OUT_FILE = Path(__file__).resolve().parent.parent / "data" / "bike-parking.json"


def main():
    request = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=urllib.parse.urlencode({"data": QUERY}).encode(),
        headers={"User-Agent": "TerpBikeTrack-UMD-student-project/0.1"},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        elements = json.load(response)["elements"]

    spots = []
    for el in elements:
        lat = el.get("lat", el.get("center", {}).get("lat"))
        lng = el.get("lon", el.get("center", {}).get("lon"))
        if lat is None or lng is None:
            continue
        tags = el.get("tags", {})
        spot = {"lat": round(lat, 6), "lng": round(lng, 6)}
        if "name" in tags:
            spot["name"] = tags["name"]
        if "capacity" in tags:
            spot["capacity"] = tags["capacity"]
        if "bicycle_parking" in tags:
            spot["type"] = tags["bicycle_parking"]
        if tags.get("covered") == "yes":
            spot["covered"] = True
        spots.append(spot)

    OUT_FILE.parent.mkdir(exist_ok=True)
    OUT_FILE.write_text(json.dumps({
        "source": "OpenStreetMap contributors (ODbL), via Overpass API",
        "downloaded": date.today().isoformat(),
        "spots": spots,
    }, indent=1))
    print(f"Saved {len(spots)} bike parking spots to {OUT_FILE}")


if __name__ == "__main__":
    main()
