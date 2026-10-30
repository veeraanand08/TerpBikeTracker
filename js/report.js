// Reporting form: location picker + validation + save.

const pickerMap = L.map("picker-map").setView(CAMPUS_CENTER, 16);
addBaseTiles(pickerMap);
L.rectangle(CAMPUS_BOUNDS, { color: "#e21833", weight: 1, fill: false, dashArray: "4" }).addTo(pickerMap);

let pin = null;

pickerMap.on("click", (e) => {
  if (pin) pin.setLatLng(e.latlng);
  else pin = L.marker(e.latlng).addTo(pickerMap);
  document.getElementById("location-text").textContent =
    `Pin dropped at ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}. Tap again to move it.`;
});

const form = document.getElementById("report-form");
const errorBox = document.getElementById("form-errors");

function value(id) {
  return document.getElementById(id).value.trim();
}

function validate() {
  const errors = [];
  const now = new Date();

  if (!pin) {
    errors.push("Drop a pin on the map where it was stolen.");
  } else if (!isOnCampus(pin.getLatLng().lat, pin.getLatLng().lng)) {
    errors.push("The location must be on the UMD College Park campus (inside the dashed box).");
  }

  const lastSeen = value("last-seen") ? new Date(value("last-seen")) : null;
  const discovered = value("discovered") ? new Date(value("discovered")) : null;
  if (!lastSeen || !discovered) {
    errors.push("Enter both when you last saw it and when you discovered it missing.");
  } else {
    if (lastSeen > now || discovered > now) errors.push("Times can't be in the future.");
    if (lastSeen > discovered) errors.push("\"Last seen\" must be before \"Discovered missing\".");
    const ageDays = (now - discovered) / (1000 * 60 * 60 * 24);
    if (ageDays > MAX_REPORT_AGE_DAYS) {
      errors.push(`Reports must be filed within ${MAX_REPORT_AGE_DAYS} days of discovering the theft.`);
    }
  }

  if (!value("vehicle-type")) errors.push("Choose a vehicle type.");
  if (!value("reporter-name")) errors.push("Enter your name.");

  return errors;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const errors = validate();

  if (errors.length) {
    errorBox.innerHTML = "<strong>Please fix:</strong><ul>" +
      errors.map((msg) => `<li>${msg}</li>`).join("") + "</ul>";
    errorBox.classList.remove("hidden");
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  errorBox.classList.add("hidden");

  const { lat, lng } = pin.getLatLng();
  const report = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    submittedAt: new Date().toISOString(),
    status: "pending", // later: ai_approved / ai_rejected / human_confirmed / human_rejected
    location: { lat, lng },
    lastSeen: new Date(value("last-seen")).toISOString(),
    discovered: new Date(value("discovered")).toISOString(),
    vehicleType: value("vehicle-type"),
    reporterName: value("reporter-name"), // police exports only; never shown on the map
    lockType: value("lock-type") || null,
    brand: value("brand") || null,
    serial: value("serial") || null,
    description: value("description") || null,
  };

  if (!saveReport(report)) {
    errorBox.textContent = "Couldn't save the report in this browser (storage may be blocked).";
    errorBox.classList.remove("hidden");
    return;
  }

  form.classList.add("hidden");
  document.getElementById("success").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
