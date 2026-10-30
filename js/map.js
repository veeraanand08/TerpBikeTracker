// Campus map: bike parking (from OpenStreetMap) + reported thefts (from saved reports).

const map = L.map("campus-map").fitBounds(CAMPUS_BOUNDS);
addBaseTiles(map);

const parkingLayer = L.layerGroup().addTo(map);
const theftLayer = L.layerGroup().addTo(map);
L.control.layers(null, { "Bike parking": parkingLayer, "Reported thefts": theftLayer }).addTo(map);

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

    statusEl.textContent = `${spots.length} bike parking spots (OpenStreetMap data from ${downloaded}).`;
  } catch (err) {
    console.error("Bike parking load failed:", err);
    statusEl.textContent = "Couldn't load bike parking data.";
  }
}

// ---------- Reported thefts ----------
// The name is never shown here. Only location, time reported, vehicle type and status.
function showThefts() {
  const reports = loadReports();
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

showThefts();
loadBikeParking();
