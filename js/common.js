// Shared settings and helpers used by every page.

// Rough bounding box around the UMD College Park campus: [south, west], [north, east].
const CAMPUS_BOUNDS = [[38.9800, -76.9560], [38.9980, -76.9310]];
const CAMPUS_CENTER = [38.9869, -76.9426];

// Reports must be filed within this many days of discovering the theft.
const MAX_REPORT_AGE_DAYS = 14;

const STORAGE_KEY = "umdTheftReports";

// PROTOTYPE STORAGE: reports are saved only in this browser (localStorage).
// This will be replaced by a real database (planned: Supabase) so everyone sees the same reports.
function loadReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReport(report) {
  const reports = loadReports();
  reports.push(report);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch {
    return false;
  }
}

function isOnCampus(lat, lng) {
  const [[south, west], [north, east]] = CAMPUS_BOUNDS;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

function addBaseTiles(map) {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
