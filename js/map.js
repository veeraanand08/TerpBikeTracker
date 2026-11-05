// Campus map: bike parking (from OpenStreetMap) + reported thefts (from saved reports).
// Two views: "Regular map" shows each theft as a pin, "Heat map" shows where thefts cluster.

const map = L.map("campus-map").fitBounds(CAMPUS_BOUNDS);
addBaseTiles(map);

const parkingLayer = L.layerGroup().addTo(map);
const theftLayer = L.layerGroup().addTo(map);
// One report shows faintly; HOTSPOT_MIN_REPORTS overlapping reports show full red (matches the 3-report hotspot rule).
// maxZoom = the starting campus zoom, so reports count at full strength at the default view.
const HOTSPOT_MIN_REPORTS = 3;
const heatLayer = L.heatLayer([], { radius: 35, blur: 25, maxZoom: map.getZoom(), max: HOTSPOT_MIN_REPORTS, minOpacity: 0.3 });
L.control.layers(null, { "Bike parking": parkingLayer }).addTo(map);

const statusEl = document.getElementById("map-status");

// ---------- Bike parking (saved snapshot of OpenStreetMap data) ----------
// Loaded from data/bike-parking.json because the live OpenStreetMap API can take 30+ seconds.
// Refresh the snapshot with: python scripts/update_bike_parking.py
async function loadBikeParking() {
  try {
    const res = await fetch("data/bike-parking.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { spots, downloaded } = await res.json();

    spots.forEach((s) => {
      const lines = ["<strong>Bike parking</strong>"];
      if (s.name) lines.push(s.name);
      if (s.capacity) lines.push(`Capacity: ${s.capacity}`);
      if (s.type) lines.push(`Type: ${s.type.replace(/_/g, " ")}`);
      if (s.covered) lines.push("Covered");

      L.circleMarker([s.lat, s.lng], {
        radius: 5, color: "#1a73e8", weight: 1, fillColor: "#1a73e8", fillOpacity: 0.7,
      }).bindPopup(lines.join("<br>")).addTo(parkingLayer);
    });

    statusEl.textContent = `${spots.length} bike parking spots (OpenStreetMap data from ${downloaded}) · ${theftCount} reported ${theftCount === 1 ? "theft" : "thefts"}.`;
  } catch (err) {
    console.error("Bike parking load failed:", err);
    statusEl.textContent = "Couldn't load bike parking data.";
  }
}

// ---------- Reported thefts ----------
// The name is never shown here. Only location, time reported, vehicle type and status.
function showThefts() {
  // TODO: once AI review exists, only show approved reports here (prototype shows pending ones for testing).
  const reports = loadReports();
  heatLayer.setLatLngs(reports.map((r) => [r.location.lat, r.location.lng]));
  reports.forEach((r) => {
    const popup = [
      `<strong>Reported theft</strong>`,
      `Vehicle: ${r.vehicleType}`,
      `Reported: ${formatDateTime(r.submittedAt)}`,
      r.status === "pending" ? `<em>Pending review (shown for testing)</em>` : "",
    ].filter(Boolean).join("<br>");

    L.circleMarker([r.location.lat, r.location.lng], {
      radius: 8, color: "#b5122a", weight: 2, fillColor: "#e21833", fillOpacity: 0.85,
    }).bindPopup(popup).addTo(theftLayer);
  });
  return reports.length;
}

// ---------- Regular map / Heat map switch ----------
function setView(view) {
  const heat = view === "heat";
  if (heat) { map.removeLayer(theftLayer); heatLayer.addTo(map); }
  else { map.removeLayer(heatLayer); theftLayer.addTo(map); }
  // Dim bike parking in heat view so hotspots stand out
  parkingLayer.eachLayer((m) => m.setStyle({ opacity: heat ? 0.4 : 1, fillOpacity: heat ? 0.3 : 0.7 }).setRadius(heat ? 3 : 5));
  document.getElementById("legend-pins").classList.toggle("hidden", heat);
  document.getElementById("legend-heat").classList.toggle("hidden", !heat);
  document.querySelectorAll(".view-toggle button").forEach((b) => {
    const on = b.dataset.view === view;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on);
  });
}
document.querySelectorAll(".view-toggle button").forEach((b) => {
  b.addEventListener("click", () => setView(b.dataset.view));
});

const theftCount = showThefts();
loadBikeParking();
