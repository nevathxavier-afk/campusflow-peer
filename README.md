# 📜 CampusFlow Peer — Connected Campus Operating System

> **“From Scattered Campus Information to Connected Campus Action.”**  
> *Archival Paper & Typewriter Theme • Tactical Academic Dossier • Connected Campus Action Graph*

**Team:** ZanLeo Warrior  
**Members:** Mohammed Irfaan | Nivedha  
**Hackathon:** PS06 – Smart Education | HACKNEXT'26 Series 2.0  
**Institution:** SNS College of Technology (Autonomous)  
**Live Endpoint:** `http://localhost:8080/` | **GitHub Repo:** `https://github.com/nevathxavier-afk/campusflow-peer`

---

## 🌟 1. The Core Vision

In a college, information is not missing — it is **scattered, disconnected, and difficult to turn into action**.

Students chase information across:
- Timetable images & PDFs
- WhatsApp circulars & department notices
- Attendance records & internal marks
- Faculty cabins & physical door notices
- Paper leave forms & multi-tier signature slips

```
SCATTERED INFORMATION
        ↓
  UNDERSTANDING (AI OCR)
        ↓
  CONNECTION (Campus Knowledge Graph)
        ↓
  CONTEXT (One-Context View)
        ↓
  INTELLIGENCE (Scenario Telemetry)
        ↓
  RECOMMENDATION (Why This Answer?)
        ↓
  CONNECTED ACTION (Plan / Route / Sign / Verify)
```

> **“Existing systems store information. CampusFlow Peer connects information to action.”**

---

## 📜 2. Unique Aesthetic: "Archival Paper & Typewriter Dossier"

Instead of generic blue-and-white college ERP software, CampusFlow Peer features an elevated **Editorial Paper & Typewriter Design System**:
- **Warm Ivory Parchment (`#FAF7F0`)** with authentic ruled notebook grain and tactile index cards.
- **Charcoal Typewriter Ribbon Ink (`#1C1917`)** using `Courier Prime`, `Special Elite`, and `Newsreader`.
- **Rubber Stamp Seals**: Stamped in double/dashed inks (`APPROVED`, `OPERATIONAL DIRECTIVE`, `ACTION REQUIRED`, `VERIFIED`).
- **Dark Carbon Paper Mode**: One-click toggle between Paper Ivory (`📜`) and Carbon Ink (`🖨️`).

---

## 🎭 3. Four User Roles (Live Demo Selector)

The prototype includes an instant 1-click **Demo Role Selector** in the global header:
1. **🎓 Student (Nivedha, 3rd Year CSE)**: Today/Now/Next dispatch, campus timeline, academic twin, attendance scenario simulator, timetable AI, CGPA what-if, document vault, routine approvals.
2. **👨‍🏫 Faculty (Dr. Arun Sundaram, Assoc. Prof & Advisor)**: Live cabin status broadcast (Available in Cabin, In Class, In Meeting, Break), incoming student requests queue, 1-click digital approval endorsements.
3. **🏛️ Department (CSE Office)**: Room & laboratory allocations, circular dispatches, faculty consultation telemetry.
4. **📊 Administrator (Campus Pulse)**: Institutional bottlenecks, "Why Are Students Asking This?" repeated query diagnostics.

---

## ⚡ 4. Core Modules & Production Features

### 🔍 Universal Campus Search ("Ask your campus anything...")
- Natural language query box interpreting questions with explainable reasoning (**"Why This Answer?"**) and 1-click executable actions:
  - *"When can I meet Prof. Arun?"* ➔ Shows Dr. Arun Sundaram free 02:30–04:15 PM in Room 304, zero class clashes, with `[Plan Visit / Request OD]`.
  - *"Where is my next class?"* ➔ Step-by-step walking route to Room 205 (Main Block 2nd Floor).
  - *"How is my attendance?"* ➔ Auditable percentage, safe buffer vs required consecutive sessions.
  - *"What tests do I have this week?"* ➔ Cycle Test II schedule approaching in 3 days.

### 📅 AI Timetable Intelligence (Rock-Solid & Verified)
- **Multimodal Document Understanding**: Accepts image/PDF uploads with automatic client-side canvas compression (prevents payload crashes).
- **Verification Review Sheet**: Displays extracted slots with OCR confidence scores and highlights sessions below 85% for student verification.
- **1-Click Demo Preset**: Instant **"⚡ Load SNS College CSE Timetable"** button for immediate demonstration.
- **Operations Schedule**: Complete Monday through Saturday day columns with add and delete capabilities.

### 👥 Digitalized Faculty Availability Grid (Strictly No Graph)
- **Clean Interactive Grid**:
  - Filter pills by Department (`All`, `CSE`, `IT`, `AI & DS`) and Status (`Available in Cabin`, `In Class`, `In Meeting`).
  - Faculty cards featuring cabin locations, declared free consultation windows, and courses taught.
  - 1-click actions: `[✍️ Request OD]`, `[🔔 Notify When Free]`, `[🗺️ Locate Cabin]`.
- **Daily Consultation Slot-Matrix**: Tabular period-by-period matrix (Period 1 to Period 6) comparing all professors across the day.

### 📈 Smart Attendance Engine & Scenario Planner
- **Deterministic & Auditable**: Calculates exact compliance against configurable institutional threshold (50%–100%).
- **Interactive Scenarios**:
  - *Attend Next 5?* ➔ Projected boost (+2.5%)
  - *Attend Next 10?* ➔ Reaches target (+4.7%)
  - *Miss 1 Future Class?* ➔ Projected drop (-1.4%)
  - *Reach 80%?* ➔ Exact consecutive classes required.

### 📊 Academics & What-If CGPA Simulator
- Displays cumulative CGPA (8.42) and semester progression (Sem 1: 8.10, Sem 2: 8.40, Sem 3: 8.75).
- **What-If Slider**: Simulate projected Semester 4 SGPA to calculate cumulative trajectory across 92 credits.
- **Academic Risk Radar**: Evaluates each subject (DBMS, DSA, OS, Networks, Maths, Cloud Lab) across attendance and internal marks.

### 📁 Smart Document Vault & Requests ("Fill Once, Reuse Safely")
- Stores verified credentials (Student ID, Sem 3 Grade Sheet, Bonafide, Certificates) securely in local node storage.
- Auto-fills routine OD and Bonafide request forms without repetitive manual entry.
- Multi-tier approval workflow tracking (Student ➔ Advisor ➔ HOD ➔ Dean) with audit trail timestamps.

### 🎯 Deadline Radar & Campus Navigator
- Sorts upcoming assessments and events by temporal urgency: Today, Tomorrow, This Week, Later.
- Lightweight indoor navigator with step-by-step directions to lecture halls, faculty cabins, and laboratories.

### 📊 Campus Pulse & "Why Are Students Asking This?" Engine
- Institutional bottleneck diagnostics: Groups repeated student questions (e.g. 48 queries about Cycle Test II) to recommend central announcements and eliminate corridor delays.

### ★ Presentation Pitch Deck Modal
- Interactive 5-step slide presentation built right into the header for hackathon judges!

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Vanilla HTML5, Custom Archival Paper & Typewriter CSS, Vanilla JavaScript (ES6+ Modules, Event Reactive Store).
- **Typography**: Google Fonts (`Courier Prime`, `Special Elite`, `Newsreader`, `JetBrains Mono`).
- **AI Engine**: Google Gemini Flash Multimodal Intelligence + Zero-Fail Autonomous Vision Fallback.
- **Local-First Resilience**: Stored 100% in browser storage with zero external tracking for student privacy.
- **Server**: Running locally on `http://localhost:8080/`.

---

## 🚀 Quick Start

1. Start the local server:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start-server.ps1 -Port 8080
   ```
2. Open `http://localhost:8080/` in your browser.
3. Use the header role switcher to explore Student, Faculty, Department, and Admin views!
