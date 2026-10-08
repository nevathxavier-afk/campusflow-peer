# 🚀 CampusFlow Peer — Autonomous Student Operating System

> **From Scattered Campus Information to Connected Campus Action**  
> *Tactical Academic Operating System, Real-time Attendance Telemetry & Multimodal Gemini Intelligence*

**Team:** ZanLeo Warrior  
**Members:** Mohammed Irfaan | Nivedha  
**Hackathon:** PS06 – Smart Education | HACKNEXT'26 Series 2.0  
**Institution:** SNS College of Technology (Autonomous)  

---

## 🌟 Overview

CampusFlow Peer transforms disconnected campus communications (WhatsApp timetable photos, circular PDFs, portal percentages, physical cabin visits) into a **reactive, local-first tactical HUD**.

Built with complete design parity to **LastbencherOS** (`https://lastbencheros.netlify.app/`), CampusFlow Peer provides:
- **Zero Preloaded Timetables**: Starts in a clean `Schedule Idle` state. 100% derived dynamically from the student's timetable.
- **Multimodal AI Timetable Extraction**: Direct image/PDF OCR powered by Google Gemini Flash (`gemini-3.5-flash-lite` & `gemini-3.8-flash`).
- **Mathematical Compliance Engine**: Exact LastbencherOS `sce` formula calculation for Safe-to-Bunk and Required Attendance Margins.
- **Interactive Attendance Customizer**: Real-time slider (50%–100%) dynamically updating compliance metrics across the entire application.
- **Connected Action Graph**: Bridges academic schedules with faculty cabin accessibility, OD digital approvals, and official circulars.

---

## ⚡ Core Modules

### 1. 📊 Tactical Dashboard
- **System Efficiency Ring**: Circular radial gauge with dynamic color shifting (`#00ff66` neon emerald for `SYSTEM STABLE` vs `#ff0044` crimson red for `CRITICAL FAILURE`).
- **Bunk Capacity Telemetry**: Big 8xl display calculating safe classes to bunk while staying above threshold.
- **Session Integrity**: Mini donut visualization with live Present and Absent counters.
- **Weekly Activity Trend**: 7-day activity bar chart with animated bars.
- **Engagement Heatmap**: 21-cell tactical calendar matrix.

### 2. 📅 Operations Schedule (Timetable)
- **Schedule Idle State**: Clean dashed HUD banner awaiting user directives or AI extraction.
- **AI Intelligence**: File upload feeding timetable images into Gemini multimodal extraction returning:
  ```json
  [
    { "subject": "Operating Systems", "day": "Monday", "startTime": "09:00", "endTime": "10:00" }
  ]
  ```
- **Reset All**: Tactical button with a 3-second `Confirm Reset?` red countdown confirmation.
- **Manual Entry Modal**: Designation, Temporal Day, Commence & Conclude time pickers.

### 3. ⚡ Chronicle Ledger & Daily Manifest (Attendance)
- **Monthly Interactive Calendar**: Month navigation controls (`<` / `>`) with Present (green) and Absent (red) day dots.
- **Saturday Phase Configuration**: Overrides to align special working Saturdays with another timetable day (*Default, Monday, Tuesday, Wednesday, Thursday, Friday, Holiday*).
- **Mission Scope**: Daily lecture slots with glowing `[Present]` and `[Absent]` toggle buttons and live bottom accent progress indicators.

### 4. 🤖 Campus AI Intelligence
- Pre-connected Gemini 3.5 Flash-Lite & 3.8 Flash agent for real-time bunk counselor questions, timetable queries, and campus advice.

### 5. 👥 Faculty Accessibility Matrix
- Eliminates physical searches by displaying real-time cabin locations, free time slots, and status (*Available in Cabin, In Class, In Dept Meeting*).

### 6. ✍️ Smart Routine Approvals
- Multi-tier digital signatures for On-Duty (OD) forms and Hall Ticket clearances.

### 7. 📢 Events & Circulars Hub
- Official circular notifications with automatic timetable conflict detection and one-click OD draft creation.

---

## 🧮 Mathematical Formulas (`sce` Engine)

$$\text{Total Recorded} = \text{Present} + \text{Absent}$$

$$\text{Percentage} = \frac{\text{Present}}{\text{Total Recorded}} \times 100$$

$$\text{Required Classes} = \max\left(0, \left\lceil \frac{p \times \text{Total} - \text{Present}}{1 - p} \right\rceil\right) \quad \text{where } p = \frac{\text{Target}}{100}$$

$$\text{Safe Bunks} = \max\left(0, \left\lfloor \frac{\text{Present} - p \times \text{Total}}{p} \right\rfloor\right)$$

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Vanilla HTML5, Modern CSS (Cyberpunk Tactical Dark Design System, CSS Variables, SVG Gauges), Vanilla JavaScript (ES6+ Modules, Event Reactive Store).
- **AI Engine**: Google Gemini Flash Multimodal API (`gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-3-flash-preview`).
- **Storage**: Local Node Browser Storage (`localStorage`) with zero external telemetry for 100% student privacy.
- **Hosting**: Local-first or static deployment (GitHub Pages, Vercel, Netlify).

---

## 🚀 Getting Started

1. Clone or download the repository:
   ```bash
   git clone https://github.com/<your-username>/campusflow-peer.git
   cd campusflow-peer
   ```
2. Open `index.html` in any modern web browser or start a local server:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start-server.ps1 -Port 8080
   ```
3. Visit `http://localhost:8080/`.

---

## 👥 Authors & Credits

- **Mohammed Irfaan** — Technical Lead & AI Architect
- **Nivedha** — UI/UX & Workflow Engineer
- **Team ZanLeo Warrior** — PS06 Smart Education | HACKNEXT'26 Series 2.0
