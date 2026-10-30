# TerpBikeTrack — UMD Bike & Scooter Theft Reporting (Prototype)

ENES256 AI Team Project. A website where UMD students can report bike and scooter thefts and see bike parking and reported thefts on a campus map.

**Start here:** read [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for the project goals, design decisions and current status.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Landing page linking to everything |
| Info | `info.html` | How reporting works, privacy, rules, safety tips |
| Report a Theft | `report.html` | Reporting form with map pin, time window, required/optional fields |
| Campus Map | `map.html` | Bike parking (OpenStreetMap) + reported thefts |

## How it's built

Plain HTML, CSS and JavaScript — no build step, no installs.

- **Map:** [Leaflet](https://leafletjs.com/) with OpenStreetMap tiles (loaded from a CDN)
- **Bike parking:** saved snapshot in `data/bike-parking.json`, from OpenStreetMap. Refresh with `python scripts/update_bike_parking.py`
- **Reports:** saved in the browser's localStorage **for now only** — each person only sees their own test reports. To be replaced with a real database.

```
index.html  info.html  report.html  map.html
css/style.css
js/common.js     shared settings (campus bounds, 2-week rule, storage helpers)
js/report.js     reporting form
js/map.js        campus map
data/bike-parking.json
scripts/update_bike_parking.py
```

## Run it on your computer

From this folder:

```
python -m http.server 8000
```

Then open http://localhost:8000

## Put it online (GitHub Pages, free)

1. Create a new **public** repository on GitHub (e.g., `terpbiketrack`).
2. Push this folder to it.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`** → Save.
4. After a minute the site is live at `https://<your-username>.github.io/terpbiketrack/`.

Every push to `main` updates the live site.

## Prototype limits

- Reports are **not** sent to UMPD and are only stored in your own browser.
- AI review, human review queue, police export and monthly report are not built yet.
- Use made-up test data only.
