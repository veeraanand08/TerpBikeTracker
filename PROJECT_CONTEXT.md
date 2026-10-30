# UMD Bike & Scooter Theft Reporting App — Project Context

> **Read this first.** This file is the shared memory for our team project. Any teammate or AI assistant (Claude, ChatGPT, etc.) picking up the work should read this whole file before doing anything, and update it before stopping. See [How to use this file](#how-to-use-this-file-for-ai-assistants--teammates).

| | |
|---|---|
| **Course** | ENES256 (Fall 2026), University of Maryland — AI Team Project |
| **GitHub repo** | _Not created yet — add link here once it exists_ |
| **Shared portfolio** | Google Drive folder `UMD-Bike-Theft-Project` (link: _add here_) |
| **Current phase** | Phase 3 — Bare-bones website prototype (home, info, report form, campus map) |
| **App name** | TerpBikeTrack |
| **Last updated** | 2026-10-30 |

---

## 1. The problem

Bike and electric scooter theft is a real, year-round problem at the University of Maryland, College Park. Many students depend on micro-mobility to get around campus, but:

- **Official data doesn't show it.** The UMPD Daily Crime and Fire Log uses broad classifications like "theft," so bike and scooter thefts can't be separated from other property crimes.
- **Many thefts go unreported.** Students often feel traditional channels aren't worth it for a "minor" theft, or worry about privacy.
- **Students have no resource** that shows where and when thefts happen, or what they can do to protect themselves.

**Key consequence:** because no existing dataset identifies bike/scooter thefts, **our app's own student reports are the dataset.** We are building a new reporting system, not analyzing an existing one.

## 2. Research question

How can a collaborative human+AI system turn crowdsourced student theft reports into an accurate, trustworthy picture of bike and scooter theft at UMD — one that helps students avoid theft, helps police recover stolen vehicles, and makes reporting fast and worthwhile?

## 3. Goals

### Product goals
1. **Fast reporting.** A student can submit a theft report in **under 60 seconds**.
2. **Theft density map (for students).** An anonymous public map showing where and when thefts happen, so students can make safer parking and locking choices.
3. **Police exports (for UMPD).** A sorted, detailed database of reports that we send to UMPD as exports/reports, to help them recover stolen bikes and scooters.
4. **Monthly theft report (for campus).** A one-page public summary each month — hotspots, times, which lock types failed, and one recommendation — that shows reporters their report made a difference.
5. **Trustworthy data.** Every report is reviewed before it reaches the map or police.

### Project goals (course)
- Build a working prototype and show it in our Progress Reports.
- Use multiple AI systems as teammates (assistant, expert, coach, creative) while humans stay accountable for every decision and output.
- Document our process in the shared portfolio.

### Milestone: Progress Report 1
- Interactive map + reporting form prototype.
- Usability tested with **at least 5 student riders**.
- Report submission timed against the 60-second goal.

## 4. Scope

**In scope**
- Bicycle and electric scooter thefts on the UMD College Park campus.
- Student reporting, review, density map, police exports, monthly summary report.

**Out of scope (for now)**
- Identifying suspects.
- Cross-referencing serial numbers against online marketplaces.
- Route planning / "safe route" navigation.
- Predicting future thefts with a trained model (we don't have enough data).
- Thefts off campus.

> Note: our original proposal listed "recovering stolen bikes" as out of scope. That has changed — police exports are explicitly meant to help recovery, though **we** don't do the recovering.

## 5. Users

| User | What they use | What they need |
|---|---|---|
| **Student who had a theft** | Reporting form, report status | Fast, easy reporting; proof the report went somewhere |
| **Any student rider** | Density map, monthly report | Know where/when thefts happen and how to lock safely |
| **UMPD** | Exports/reports we send them (they do **not** log into the app) | Detailed, sorted, trustworthy reports with owner contact info |
| **Our team (reviewers)** | Review queue | See AI-flagged reports and make final calls |
| **DOTS / campus decision-makers** | Monthly report | Evidence for racks, lighting, cameras |

## 6. System design (decided)

### 6.1 Report fields

| Field | Required? | Notes |
|---|---|---|
| Location | **Required** | Map pin and/or pick from campus building/rack list |
| Theft time window | **Required** | "Last seen" → "discovered missing", not one exact time |
| Vehicle type | **Required** | Bike, e-scooter (others TBD) |
| Reporter name | **Required** | Tied to the report; **only appears in police exports** |
| Lock type | Optional | e.g., U-lock, cable, chain, none |
| Serial / ID number | Optional | Many students won't know it |
| Photo | Optional | |
| Brand | Optional | |
| Description | Optional | Color, accessories, distinguishing marks |

### 6.2 Privacy rules
- Reporter's **name is never shown on the map** or in the monthly report.
- The map shows only **location** and **time reported** (and possibly vehicle type).
- Names appear **only in exports sent to UMPD**.
- Collect the minimum data needed.

### 6.3 Review pipeline

```
Student submits report
        │
        ▼
AI first-pass review ── checks: ──► wrong/off-campus location
        │                          ► impossible time window (in the future, or theft > 2 weeks ago)
        │                          ► duplicate of an existing report
        │                          ► description doesn't match vehicle type
        │
   ┌────┴─────┐
APPROVED     REJECTED
   │            │
   │            ▼
   │      Human (team member) reviews → approve or reject (final)
   │
   ▼
Goes onto map immediately
Goes into police export marked "AI approved"
        │
        ▼
A human can later upgrade it to "Human confirmed"
```

**Report statuses:** `pending` → `ai_approved` / `ai_rejected` → `human_confirmed` / `human_rejected`

**Rules**
- Reports submitted **more than 2 weeks after the theft** are rejected.
- Police exports show each report's status ("AI approved" vs "Human confirmed").
- The **monthly public report counts only human-confirmed reports.**

### 6.4 Student feedback loop
After submitting, a student should be able to see that their report mattered: its review status, that it was included in a police export, and where it appears on the map. (Design details TBD.)

### 6.5 Monthly theft report
One page, student-friendly:
1. Headline number (confirmed thefts, number shared with UMPD)
2. Top 3 hotspots with time-of-day
3. What failed (lock types involved)
4. One recommendation (e.g., "switch to a U-lock")
5. What happened next (recoveries, campus responses)
6. Anonymous credit to reporters

Safeguards:
- A location needs **≥ 3 confirmed reports** to be called a hotspot.
- Name **racks/parking areas**, never dorms or neighborhoods; never call an area "dangerous."
- Always include: "Based on student reports only. Busy areas may show more reports."
- **Two team members approve** each issue before release.
- A sample issue with synthetic data exists in the portfolio (`04_Prototypes`). It is clearly labeled SYNTHETIC.

## 7. How we build it (process plan)

We work in small phases. Each phase ends with something we can show and test.

| Phase | What | Done when | Status |
|---|---|---|---|
| **0. Research & proposal** | Problem evidence, proposal, AI role trials | Proposal submitted | ✅ Done |
| **1. System design** | Fields, privacy, review pipeline, monthly report concept | Section 6 of this file agreed by team | ✅ Mostly done (see open questions) |
| **2. Repo + tech stack** | Choose stack, create GitHub repo, add this file to it | Repo exists, link added above | 🟨 Stack chosen for prototype (section 8); GitHub repo not created yet |
| **3. Reporting form** | Working form with required/optional fields, map pin, time window | Teammates can submit made-up reports in < 60 s | 🟨 Built (`report.html`); not timed yet |
| **4. Storage** | Database for reports with statuses | Reports persist and can be listed by status | ⬜ (prototype uses browser localStorage only) |
| **5. AI review** | AI first-pass checks from 6.3 + human review queue | Tested on ~10–30 synthetic reports incl. deliberately bad ones | ⬜ |
| **6. Density map** | Public anonymous map from approved reports | Map shows synthetic reports correctly, no names | 🟨 Basic map built (`map.html`): bike parking + theft pins, no names. No density/heatmap yet |
| **7. Police export** | Export (CSV/PDF) with names + status | Export generated from synthetic data | ⬜ |
| **8. Usability testing** | Test with ≥ 5 student riders | Timing + trust/usability feedback recorded | ⬜ (Progress Report 1) |
| **9. Monthly report generator** | Auto-draft monthly report from confirmed reports | Matches safeguards in 6.5 | ⬜ Later |
| **10. Outside feedback** | Show fields + exports to UMPD and DOTS | Feedback recorded in portfolio | ⬜ Ongoing |

### How we work as a human+AI team
- **AI roles:** Assistant (build/organize), Expert (research, check facts), Coach (critique, find gaps/bias), Creative (generate options). Claude is mainly used for code and drafting; ChatGPT mainly for research. Roles can change.
- **Every AI output is reviewed by a human.** Anything touching privacy, safety or campus data is reviewed by two people.
- **Code from AI is run and tested before it's merged.**
- **Citations from AI are opened and checked** before use. Fabricated or unverifiable content is rejected.
- **No real student personal data goes into AI chat tools.** Use synthetic data for development and testing.
- **Synthetic data is always labeled** as synthetic.
- Log significant AI contributions in the portfolio's `06_AI_Log` sheet (date, tool, task, kept/changed/rejected, reviewer).

## 8. Tech stack

**Current prototype (decided 2026-10-30):** a plain static website — HTML, CSS and JavaScript, no build step. Chosen so it runs anywhere (including free GitHub Pages hosting) with nothing to install.

| Part | Now | Planned later |
|---|---|---|
| Pages | `index.html`, `info.html`, `report.html`, `map.html` | Same pages, possibly moved to a framework (e.g., Next.js) if needed |
| Map | Leaflet 1.9.4 + OpenStreetMap tiles (CDN) | Add heatmap/density layer |
| Bike parking data | Snapshot from OpenStreetMap in `data/bike-parking.json` (231 spots, 2026-10-30) | Refresh with `python scripts/update_bike_parking.py` |
| Report storage | Browser **localStorage** — each person sees only their own test reports | Shared database (planned: Supabase free tier) |
| AI review | Not built | Server-side call to Claude/ChatGPT API with the name removed |
| Hosting | Local: `python -m http.server 8000` | GitHub Pages (static) → Vercel if a server is needed |

**Code layout**
```
index.html  info.html  report.html  map.html
css/style.css
js/common.js     shared settings: CAMPUS_BOUNDS, MAX_REPORT_AGE_DAYS (14), storage helpers
js/report.js     form: map pin picker, validation, save
js/map.js        campus map: bike parking layer + reported theft layer
data/bike-parking.json
scripts/update_bike_parking.py
README.md        how to run locally + deploy to GitHub Pages
```

**What the form does now**
- Required: map pin (must be inside campus bounds), last seen + discovered missing times, vehicle type, name.
- Optional: lock type, brand, serial, description, photo (photo not saved yet).
- Blocks: missing required fields, off-campus pin, future times, "last seen" after "discovered," discovered > 14 days ago.
- Saves with `status: "pending"`. Since review isn't built, pending reports show on the map labeled "pending review (shown for testing)."

Constraints to keep in mind:
- Must be buildable by a small student team in a semester.
- Prefer free tiers / simple hosting.
- Must work on phones (students report from the rack).

## 9. Open questions

- [ ] **AI review vs. privacy:** our rule says no identifiable student data goes into AI tools, but the AI reviews reports that include a name. Plan: strip the name before sending a report to the AI. Confirm.
- [ ] How exactly is a "duplicate" defined? (Same location + overlapping time window + same vehicle type/description?)
- [ ] What counts as "on campus" — what boundary do we use?
- [ ] Should approved reports really go on the map with no human check? Risk: AI errors become public immediately.
- [ ] Student feedback loop: how does a student see their report's status (account, email, link)?
- [ ] Who is the monthly report mainly for — students (short, visual) or DOTS/UMPD (data-heavy)? Sample assumed students.
- [ ] How will students find out about the app? No reports = no data.
- [ ] Has UMPD agreed to receive exports? What format do they want?
- [ ] Campus bounds in `js/common.js` are a rough rectangle — replace with the real campus outline?
- [ ] The form currently blocks reports > 14 days old outright; the design (6.3) says the AI rejects them and a human reviews. Keep the hard block or let them through to review?

## 10. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-10 | Focus on a reporting app (not heat-mapping only) | We had identified data sources; more manageable start |
| 2026-10 | Student reports are the main dataset, not the UMPD log | UMPD log can't distinguish bike/scooter thefts from other thefts |
| 2026-10 | Name required but only shown in police exports | Police need follow-up; students need privacy on the public map |
| 2026-10 | AI first-pass review; humans review rejections; statuses shown in police exports | Balance speed with accuracy and accountability |
| 2026-10 | Required: location, time window, vehicle type. Everything else optional | Keep reporting under 60 s; many students lack serials/photos |
| 2026-10 | Reports > 2 weeks after theft are rejected | Very old/wide time windows aren't useful; covers e.g. spring break |
| 2026-10 | Add a monthly public theft report | Shows students their reports matter; gives campus actionable evidence |
| 2026-10-30 | Prototype is a plain static website (HTML/CSS/JS + Leaflet), hostable on GitHub Pages | Works with nothing installed, free hosting, fast to iterate |
| 2026-10-30 | Bike parking comes from a saved OpenStreetMap snapshot, not a live query | Live Overpass API took 30–40 s to load |
| 2026-10-30 | App name is **TerpBikeTrack** (GitHub repo: `terpbiketrack`) | Team choice; replaces placeholder "TerpTrack" |

## 11. Current status

**Done**
- Proposal (Sections 1–5) and AI Contribution Statement.
- AI role sessions (Assistant, Expert, Coach, Creative) and reflections.
- System design (Section 6).
- Sample monthly report with synthetic data.
- Google Drive portfolio structure.
- Bare-bones website: home, info, report form and campus map (bike parking + theft pins). Tested locally.

**Next up**
1. Create the GitHub repo, push this folder, turn on GitHub Pages (steps in `README.md`). Add the link to the top of this file.
2. Time the report form with teammates against the 60-second goal.
3. Replace localStorage with a shared database (Supabase) so everyone sees the same reports.
4. Resolve the AI-review privacy question (strip names before AI review).

## 12. Changelog

| Date | Who (human / AI tool) | What changed |
|---|---|---|
| 2026-10-29 | Veera / Claude | Created this file from proposal + workshop sessions |
| 2026-10-30 | Veera / Claude | Built bare-bones static site (home, info, report, map), README, bike parking snapshot + update script; filled in tech stack, phase status, decisions, open questions |
| 2026-10-30 | Veera / Claude | Renamed app TerpTrack → TerpBikeTrack across site, README and script |

---

## How to use this file (for AI assistants & teammates)

**If you are an AI assistant starting a session:**
1. Read this entire file before writing any code or content.
2. Treat sections 6 (system design) and 10 (decision log) as decided. Don't change them without the human you're working with agreeing; if you think a decision is wrong, raise it as an open question instead.
3. Follow the rules in "How we work as a human+AI team" (section 7). In particular: use synthetic data only, label it as synthetic, and never put real student personal data into prompts.
4. Work on the current phase or the "Next up" list unless the human asks otherwise.
5. Before the session ends, update this file:
   - Phase table status (section 7)
   - Current status / Next up (section 11)
   - Any new decisions (section 10) or open questions (section 9)
   - A changelog line (section 12) with the date, who, and what changed
   - The "Last updated" date at the top
6. Keep this file the single source of truth. If something here conflicts with code or another doc, point it out to the human.

**If you are a teammate:**
- Paste or attach this file at the start of any AI chat so the AI has full context.
- Once the GitHub repo exists, this file lives at the repo root — commit your updates to it along with your work.
- Keep it short and current. Delete things that are no longer true instead of piling on.
