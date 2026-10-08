// ==========================================================================
// CAMPUSFLOW PEER — MAIN APPLICATION ENGINE
// Team: ZanLeo Warrior (Mohammed Irfaan & Nivedha)
// Hackathon: PS06 – Smart Education | HACKNEXT'26 Series 2.0
// Archival Paper & Typewriter Theme • Full Production Prototype
// ==========================================================================

const App = {
  activeRole: "student",
  activeTab: "home",
  facultyFilterDept: "all",
  facultyFilterStatus: "all",
  extractedPendingSlots: [],
  currentSearchAction: null,

  init() {
    // 1. Subscribe to AppState updates
    AppState.subscribe((type) => {
      this.refreshCurrentView();
    });

    // 2. Setup Universal Search listeners
    const searchInput = document.getElementById("universalSearchInput");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.executeSearch(searchInput.value);
        }
      });
    }

    // 3. Pre-load timetable preset if state is empty so prototype is immediately impressive
    const timetable = AppState.getTimetable();
    if (timetable.length === 0) {
      AppState.loadPresetTimetable();
    }

    // 4. Initial Render
    this.refreshCurrentView();
    console.log("📜 CampusFlow Peer Archival Operating System Online — ZanLeo Warrior.");
  },

  // Role Switcher (Student, Faculty, Department, Admin)
  switchRole(roleId) {
    this.activeRole = roleId;

    // Update Role Switcher buttons
    document.querySelectorAll(".role-pill-btn").forEach(btn => {
      if (btn.getAttribute("data-role") === roleId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Toggle Role View Panels
    const studentWrapper = document.getElementById("roleViewStudent");
    const facultyWrapper = document.getElementById("roleViewFaculty");
    const deptWrapper = document.getElementById("roleViewDept");
    const adminWrapper = document.getElementById("roleViewAdmin");
    const sidebar = document.getElementById("mainSidebar");

    if (studentWrapper) studentWrapper.style.display = roleId === "student" ? "block" : "none";
    if (facultyWrapper) facultyWrapper.style.display = roleId === "faculty" ? "block" : "none";
    if (deptWrapper) deptWrapper.style.display = roleId === "department" ? "block" : "none";
    if (adminWrapper) adminWrapper.style.display = roleId === "admin" ? "block" : "none";
    
    // In faculty/admin modes, adjust sidebar view
    if (sidebar) {
      sidebar.style.display = roleId === "student" ? "flex" : "none";
    }

    if (roleId === "faculty") this.renderFacultyDesk();
    if (roleId === "admin") this.renderAdminPulse();
    if (roleId === "student") this.refreshCurrentView();

    this.showToast(`Switched view to ${roleId.toUpperCase()} Role`);
  },

  // Tab Switcher for Student View
  switchTab(tabId) {
    if (this.activeRole !== "student") {
      this.switchRole("student");
    }

    this.activeTab = tabId;

    // Update sidebar buttons
    document.querySelectorAll(".dossier-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Toggle Tab Panels
    document.querySelectorAll(".dossier-view-panel").forEach(panel => {
      panel.classList.remove("active");
    });

    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }

    this.refreshCurrentView();
  },

  // Theme Toggle (Paper Ivory vs Carbon Ink)
  toggleTheme() {
    const isCarbon = document.body.classList.toggle("theme-carbon");
    const btn = document.getElementById("btnThemeToggle");
    if (btn) {
      btn.textContent = isCarbon ? "🖨️ Carbon Mode" : "📜 Paper Mode";
    }
    this.showToast(isCarbon ? "Carbon Ink Mode Activated" : "Paper Ivory Mode Activated");
  },

  refreshCurrentView() {
    this.renderDispatchHome();
    this.renderTimetableGrid();
    this.renderFacultyGrid();
    this.renderFacultyMatrixTable();
    this.renderAttendanceView();
    this.renderAcademicsView();
    this.renderDocumentVault();
    this.renderRequestsQueue();
    this.renderDeadlineRadar();
  },

  // ========================================================================
  // 1. DISPATCH (HOME • TODAY / NOW / NEXT & TIMELINE)
  // ========================================================================
  renderDispatchHome() {
    const container = document.getElementById("journalEntriesContainer");
    if (!container) return;

    container.innerHTML = CampusData.todayTimeline.map(item => {
      let badgeHtml = "";
      if (item.isPast) {
        badgeHtml = `<span class="stamp-seal approved">COMPLETED</span>`;
      } else if (item.isNow) {
        badgeHtml = `<span class="stamp-seal action">IN SESSION</span>`;
      } else if (item.badge === "Up Next") {
        badgeHtml = `<span class="stamp-seal verified">UP NEXT</span>`;
      } else {
        badgeHtml = `<span class="stamp-seal pending">${item.badge}</span>`;
      }

      return `
        <div class="journal-entry-row">
          <div class="journal-time">${item.time}</div>
          <div class="journal-title">
            <h4>${item.title}</h4>
            <p>📍 ${item.location} ${item.faculty ? `• ${item.faculty}` : ""}</p>
            ${item.why ? `<div style="font-size:0.75rem; color:var(--stamp-blue); margin-top:0.25rem;">✦ ${item.why}</div>` : ""}
          </div>
          <div>${badgeHtml}</div>
        </div>
      `;
    }).join("");

    // Update Academic Twin Card Numbers
    const stats = AppState.getAttendanceStats();
    const attNum = document.getElementById("twinAttendanceNum");
    if (attNum) attNum.textContent = `${stats.percentage}%`;
  },

  // ========================================================================
  // 2. TIMETABLE AI & OPERATIONS SCHEDULE
  // ========================================================================
  renderTimetableGrid() {
    const timetable = AppState.getTimetable();
    const idleCard = document.getElementById("timetableIdleCard");
    const container = document.getElementById("timetableDaysGrid");

    if (timetable.length === 0) {
      if (idleCard) idleCard.style.display = "block";
      if (container) container.innerHTML = "";
      return;
    }

    if (idleCard) idleCard.style.display = "none";
    if (!container) return;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    container.innerHTML = days.map(dayName => {
      const slots = timetable
        .filter(s => s.day.toLowerCase() === dayName.toLowerCase())
        .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

      if (slots.length === 0) return "";

      const slotItems = slots.map(slot => `
        <div class="timetable-slot-entry" onclick="App.openOneContextModal('${slot.subject}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="font-family:var(--font-editorial); font-size:1.05rem; font-weight:700; color:var(--ink-primary);">
              ${slot.subject}
            </div>
            <button onclick="event.stopPropagation(); App.deleteTimetableSlot('${slot.id}')" style="background:none; border:none; cursor:pointer; color:var(--ink-muted); font-size:0.8rem;" title="Delete Slot">×</button>
          </div>
          <div style="font-size:0.76rem; color:var(--ink-muted); margin-top:0.25rem;">
            👤 ${slot.faculty || "Faculty"} • 📍 ${slot.room || "Room 205"}
          </div>
          <div style="margin-top:0.4rem; font-family:var(--font-stamp); font-size:0.75rem; color:var(--stamp-blue);">
            🕒 ${slot.startTime} – ${slot.endTime}
          </div>
        </div>
      `).join("");

      return `
        <div class="day-dossier-column">
          <div class="day-dossier-header">
            <span>${dayName.toUpperCase()}</span>
            <span style="font-size:0.72rem; color:var(--ink-muted);">${slots.length} SESSIONS</span>
          </div>
          <div>${slotItems}</div>
        </div>
      `;
    }).join("");
  },

  loadPresetSchedule() {
    AppState.loadPresetTimetable();
    this.renderTimetableGrid();
    this.showToast("⚡ SNS College CSE Timetable Loaded & Connected to Graph!");
  },

  async handleTimetableFile(input) {
    const file = input.files?.[0];
    if (!file) return;

    this.showToast("🤖 Preprocessing & Scanning Timetable via Gemini Vision...");

    try {
      const extracted = await GeminiService.extractTimetable(file);
      if (extracted && extracted.length > 0) {
        this.extractedPendingSlots = extracted;
        this.openVerificationModal(extracted);
      } else {
        alert("Could not detect lecture matrix. Please try another image or load the demo preset.");
      }
    } catch (err) {
      console.error(err);
      alert("Timetable extraction encountered an issue. Loading sample verification dataset.");
      this.extractedPendingSlots = GeminiService.generateAutonomousExtraction();
      this.openVerificationModal(this.extractedPendingSlots);
    } finally {
      input.value = "";
    }
  },

  openVerificationModal(slots) {
    const modal = document.getElementById("aiVerificationModal");
    const table = document.getElementById("extractedReviewTable");
    const countLabel = document.getElementById("extractedTotalSlotsCount");

    if (countLabel) countLabel.textContent = `${slots.length} Sessions Extracted`;
    if (!table || !modal) return;

    table.innerHTML = `
      <thead>
        <tr>
          <th>Day</th>
          <th>Time Window</th>
          <th>Subject Designation</th>
          <th>Faculty</th>
          <th>Room</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        ${slots.map(s => `
          <tr style="${s.needsVerification ? 'background:rgba(245, 158, 11, 0.1);' : ''}">
            <td><strong>${s.day}</strong></td>
            <td>${s.startTime} – ${s.endTime}</td>
            <td>${s.subject}</td>
            <td>${s.faculty}</td>
            <td>
              ${s.room}
              ${s.needsVerification ? `<span class="stamp-seal action" style="font-size:0.65rem; margin-left:4px;">VERIFY ROOM</span>` : ''}
            </td>
            <td>
              <span class="stamp-seal ${s.confidence >= 0.9 ? 'approved' : 'pending'}">
                ${Math.round(s.confidence * 100)}%
              </span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    `;

    modal.style.display = "flex";
  },

  closeVerificationModal() {
    const modal = document.getElementById("aiVerificationModal");
    if (modal) modal.style.display = "none";
  },

  commitExtractedTimetable() {
    if (this.extractedPendingSlots.length > 0) {
      AppState.setTimetable([...this.extractedPendingSlots]);
      this.closeVerificationModal();
      this.renderTimetableGrid();
      this.showToast(`✓ Committed ${this.extractedPendingSlots.length} sessions to Operations Schedule!`);
      this.extractedPendingSlots = [];
    }
  },

  deleteTimetableSlot(id) {
    AppState.removeTimetableEntry(id);
    this.renderTimetableGrid();
  },

  handleResetTimetable() {
    if (confirm("Reset current timetable sheet to empty?")) {
      AppState.clearTimetable();
      this.renderTimetableGrid();
      this.showToast("Timetable sheet cleared.");
    }
  },

  openAddEntryModal() {
    const sub = prompt("Enter Subject Name (e.g. Operating Systems):", "Operating Systems");
    if (!sub) return;
    const day = prompt("Enter Day (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday):", "Monday");
    if (!day) return;
    const room = prompt("Enter Room (e.g. Room 205):", "Room 205");

    AppState.addTimetableEntry({
      subject: sub,
      day: day,
      room: room || "Room 205",
      startTime: "09:00",
      endTime: "10:00"
    });
    this.renderTimetableGrid();
    this.showToast("Entry added to schedule!");
  },

  // ========================================================================
  // 3. FACULTY AVAILABILITY GRID (STRICTLY NO GRAPH)
  // ========================================================================
  filterFaculty(type, val) {
    if (type === "dept") this.facultyFilterDept = val;
    if (type === "status") this.facultyFilterStatus = val;

    // Update active pills
    document.querySelectorAll(`.filter-tab-stamp[data-${type}]`).forEach(btn => {
      if (btn.getAttribute(`data-${type}`) === val) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    this.renderFacultyGrid();
  },

  renderFacultyGrid() {
    const container = document.getElementById("facultyCardsContainer");
    if (!container) return;

    const filtered = CampusData.faculty.filter(f => {
      const matchDept = this.facultyFilterDept === "all" || f.department === this.facultyFilterDept;
      const matchStatus = this.facultyFilterStatus === "all" || f.status === this.facultyFilterStatus;
      return matchDept && matchStatus;
    });

    container.innerHTML = filtered.map(f => {
      let statusSeal = "";
      if (f.status === "available") {
        statusSeal = `<span class="stamp-seal approved">AVAILABLE IN CABIN</span>`;
      } else if (f.status === "class") {
        statusSeal = `<span class="stamp-seal action">IN LECTURE</span>`;
      } else {
        statusSeal = `<span class="stamp-seal pending">IN MEETING</span>`;
      }

      const freeChips = f.freeTimeSlots ? f.freeTimeSlots.map(slot => `
        <span class="typewriter-time-chip" onclick="App.planFacultyVisit('${f.id}', '${slot}')">🕒 ${slot}</span>
      `).join("") : "";

      return `
        <div class="faculty-dossier-card">
          <div>
            <div class="faculty-card-header">
              <div class="faculty-name-block">
                <h4>${f.name}</h4>
                <p>${f.department} • ${f.designation}</p>
              </div>
              <div>${statusSeal}</div>
            </div>

            <div class="faculty-cabin-row">
              📍 <strong>Cabin:</strong> ${f.cabin}
            </div>

            <div class="faculty-activity-box">
              <strong>STATUS DIRECTIVE:</strong> ${f.statusDetails}
            </div>

            <div style="font-size:0.75rem; color:var(--ink-muted); margin-bottom:0.35rem; font-family:var(--font-stamp); text-transform:uppercase;">
              DECLARED CONSULTATION SLOTS:
            </div>
            <div class="faculty-free-chips-wrap">
              ${freeChips}
            </div>
          </div>

          <div class="faculty-card-actions">
            <button class="btn-dossier-sm btn-primary-ink" onclick="App.openNewRequestModal('On-Duty (OD)', '${f.name}')">
              ✍️ Request OD
            </button>
            <button class="btn-dossier-sm btn-outline-ink" onclick="App.notifyWhenFree('${f.name}')">
              🔔 Notify Free
            </button>
            <button class="btn-dossier-sm btn-outline-ink" onclick="App.showLocationModal('${f.roomCode}')">
              🗺️ Locate
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  renderFacultyMatrixTable() {
    const table = document.getElementById("facultyMatrixTable");
    if (!table) return;

    table.innerHTML = `
      <thead>
        <tr>
          <th>Faculty Member</th>
          <th>Cabin Code</th>
          <th>P1 (09:00-10:00)</th>
          <th>P2 (10:00-11:00)</th>
          <th>P3 (11:15-12:15)</th>
          <th>P4 (01:00-02:00)</th>
          <th>P5 (02:00-03:00)</th>
          <th>P6 (03:15-04:15)</th>
        </tr>
      </thead>
      <tbody>
        ${CampusData.faculty.map(f => `
          <tr>
            <td><strong>${f.name}</strong><br><span style="font-size:0.72rem; color:var(--ink-muted);">${f.department}</span></td>
            <td><strong>${f.roomCode}</strong></td>
            ${f.scheduleToday.map(s => {
              let cls = s.status === 'available' ? 'approved' : (s.status === 'class' ? 'action' : 'pending');
              return `
                <td>
                  <span class="stamp-seal ${cls}" style="font-size:0.65rem;">
                    ${s.status.toUpperCase()}
                  </span>
                  <div style="font-size:0.7rem; color:var(--ink-muted); margin-top:2px;">${s.detail}</div>
                </td>
              `;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;
  },

  planFacultyVisit(facultyId, slotTime) {
    const fac = CampusData.faculty.find(f => f.id === facultyId) || CampusData.faculty[0];
    alert(`Consultation window booked with ${fac.name} for ${slotTime || fac.currentWindow}.\nLocation: ${fac.cabin}.\nPre-routing OD draft prepared.`);
    this.openNewRequestModal("On-Duty (OD)", fac.name);
  },

  notifyWhenFree(facultyName) {
    this.showToast(`🔔 Alert Registered! You will be notified when ${facultyName} returns to cabin.`);
  },

  // ========================================================================
  // 4. ATTENDANCE INTELLIGENCE & SCENARIO PLANNER
  // ========================================================================
  renderAttendanceView() {
    const stats = AppState.getAttendanceStats();
    const settings = AppState.getSettings();

    const pctText = document.getElementById("attendancePercentageText");
    const targetLabel = document.getElementById("attendanceTargetLabel");
    const seal = document.getElementById("attendanceComplianceSeal");
    const attendedEl = document.getElementById("attAttendedCount");
    const missedEl = document.getElementById("attMissedCount");
    const totalEl = document.getElementById("attTotalCount");
    const neededEl = document.getElementById("attNeededCount");
    const adviceBox = document.getElementById("attendanceAdviceBox");

    if (pctText) pctText.textContent = `${stats.percentage}%`;
    if (targetLabel) targetLabel.textContent = `INSTITUTIONAL TARGET: ${stats.targetPercentage}%`;
    if (attendedEl) attendedEl.textContent = stats.present;
    if (missedEl) missedEl.textContent = stats.absent;
    if (totalEl) totalEl.textContent = stats.total;

    const isCompliant = stats.percentage >= stats.targetPercentage;

    if (seal) {
      seal.className = `stamp-seal ${isCompliant ? 'approved' : 'action'}`;
      seal.textContent = isCompliant ? "COMPLIANT STANDING" : "ACTION REQUIRED";
    }

    if (neededEl) {
      neededEl.textContent = isCompliant ? `${stats.safeBuffer} Buffer Classes` : `${stats.requiredConsecutive} Consecutive Needed`;
      neededEl.style.color = isCompliant ? "var(--stamp-green)" : "var(--stamp-red)";
    }

    if (adviceBox) {
      adviceBox.innerHTML = isCompliant
        ? `<strong>SAFE BUFFER:</strong> You hold a buffer of <strong>${stats.safeBuffer} future classes</strong> while remaining above ${stats.targetPercentage}%. Use prudently for hackathons and project milestones.`
        : `<strong>MITIGATION DIRECTIVE:</strong> Attendance is <strong>${stats.percentage}%</strong>. Attend the next <strong>${stats.requiredConsecutive} consecutive sessions</strong> without absence to restore compliance.`;
    }

    // Precalculate scenario buttons
    const p5 = Number(((stats.present + 5) / (stats.total + 5) * 100).toFixed(1));
    const p10 = Number(((stats.present + 10) / (stats.total + 10) * 100).toFixed(1));
    const m1 = Number((stats.present / (stats.total + 1) * 100).toFixed(1));

    const s5 = document.getElementById("scenPlus5Val");
    const s10 = document.getElementById("scenPlus10Val");
    const sm1 = document.getElementById("scenMinus1Val");

    if (s5) s5.textContent = `${p5}%`;
    if (s10) s10.textContent = `${p10}%`;
    if (sm1) sm1.textContent = `${m1}%`;
  },

  runAttendanceScenario(attendN, missN) {
    const stats = AppState.getAttendanceStats();
    const box = document.getElementById("scenarioOutputBox");

    if (attendN === "reach") {
      const target = missN / 100;
      const needed = Math.max(0, Math.ceil((target * stats.total - stats.present) / (1 - target)));
      if (box) {
        box.innerHTML = `<strong>RECOVERY CALCULATION:</strong> To reach an overall attendance of <strong>80%</strong> from your current <strong>${stats.percentage}%</strong>, you must attend <strong>${needed} consecutive classes</strong> without missing any.`;
      }
      return;
    }

    const projectedTotal = stats.total + attendN + missN;
    const projectedPresent = stats.present + attendN;
    const projectedPct = Number((projectedPresent / projectedTotal * 100).toFixed(1));

    if (box) {
      box.innerHTML = `<strong>PROJECTED RESULT:</strong> If you ${attendN > 0 ? `attend the next ${attendN} classes` : `miss 1 upcoming class`}, your attendance shifts from <strong>${stats.percentage}%</strong> to <strong>${projectedPct}%</strong> (${projectedPresent}/${projectedTotal}). Target: <strong>${stats.targetPercentage}%</strong>.`;
    }
  },

  updateTargetThreshold(val) {
    const num = parseInt(val) || 75;
    AppState.updateSettings({ targetPercentage: num });
    const disp = document.getElementById("targetPercentSliderValue");
    if (disp) disp.textContent = `${num}%`;
    this.renderAttendanceView();
  },

  // ========================================================================
  // 5. ACADEMICS & WHAT-IF SIMULATOR
  // ========================================================================
  renderAcademicsView() {
    const grid = document.getElementById("subjectInternalsGrid");
    if (!grid) return;

    grid.innerHTML = CampusData.subjects.map(s => {
      let riskClass = s.riskStatus === "track" ? "approved" : (s.riskStatus === "attention" ? "pending" : "action");
      let riskLabel = s.riskStatus === "track" ? "ON TRACK" : (s.riskStatus === "attention" ? "NEEDS ATTENTION" : "ACTION REQUIRED");

      return `
        <div class="twin-index-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h4 style="font-family:var(--font-editorial); font-size:1.15rem; font-weight:700;">${s.name} (${s.short})</h4>
              <p style="font-size:0.75rem; color:var(--ink-muted);">${s.faculty} • ${s.credits} Credits</p>
            </div>
            <span class="stamp-seal ${riskClass}">${riskLabel}</span>
          </div>

          <div style="margin:0.85rem 0; font-size:0.8rem; line-height:1.7; border-top:1px dashed var(--paper-border); border-bottom:1px dashed var(--paper-border); padding:0.5rem 0;">
            <div>Internal 1: <strong>${s.internals.test1}/${s.internals.test1Max}</strong> • Internal 2: <strong>${s.internals.test2}/${s.internals.test2Max}</strong></div>
            <div>Assignment: <strong>${s.internals.assignment}/${s.internals.assignMax}</strong> • Quiz: <strong>${s.internals.quiz}/${s.internals.quizMax}</strong></div>
            <div>Internal Total: <strong>${s.internals.total}/${s.internals.max}</strong> (${Math.round(s.internals.total/s.internals.max*100)}%)</div>
            <div>Attendance: <strong>${s.attendance.percentage}%</strong> (${s.attendance.attended}/${s.attendance.conducted})</div>
          </div>

          <p style="font-size:0.78rem; color:var(--ink-secondary); line-height:1.4;">
            ✦ ${s.riskReason}
          </p>
        </div>
      `;
    }).join("");
  },

  updateWhatIfCgpa(val) {
    const sgpa = parseFloat(val);
    const disp = document.getElementById("whatIfSgpaDisplay");
    const resultBox = document.getElementById("whatIfResultBox");

    if (disp) disp.textContent = sgpa.toFixed(2);

    // Existing: 68 credits at 8.42 = 572.56 quality points
    // New sem: 24 credits at sgpa
    const existingPts = 68 * 8.42;
    const newPts = 24 * sgpa;
    const totalCredits = 68 + 24;
    const projectedCgpa = (existingPts + newPts) / totalCredits;

    if (resultBox) {
      resultBox.innerHTML = `
        With a <strong>${sgpa.toFixed(2)} SGPA</strong> in Semester 4 (24 credits), your Cumulative CGPA shifts from <strong>8.42</strong> to <strong>${projectedCgpa.toFixed(2)}</strong>.
        ${projectedCgpa >= 8.80 ? `<span style="color:var(--stamp-green); display:block; margin-top:0.35rem;">✓ Target of 8.80 CGPA achieved in this scenario!</span>` : `<span style="color:var(--stamp-amber); display:block; margin-top:0.35rem;">To hit 8.80, maintain a 9.15+ average through Semester 5.</span>`}
      `;
    }
  },

  // ========================================================================
  // 6. DOCUMENT VAULT ("FILL ONCE, REUSE SAFELY")
  // ========================================================================
  renderDocumentVault() {
    const grid = document.getElementById("documentVaultGrid");
    if (!grid) return;

    grid.innerHTML = CampusData.documents.map(doc => `
      <div class="paper-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <span class="stamp-seal ${doc.status === 'verified' ? 'approved' : 'pending'}">${doc.statusLabel}</span>
            <span style="font-size:0.72rem; color:var(--ink-muted); font-family:var(--font-stamp);">${doc.type}</span>
          </div>

          <h4 style="font-family:var(--font-editorial); font-size:1.25rem; font-weight:700; margin-bottom:0.35rem;">
            ${doc.name}
          </h4>
          <p style="font-size:0.78rem; color:var(--ink-muted);">Issued by: ${doc.issuedBy} • ${doc.date}</p>

          <div class="dispatch-why-box" style="margin:1rem 0; font-size:0.78rem;">
            "${doc.previewText}"
          </div>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn-dossier-sm btn-outline-ink" onclick="alert('Viewing secure local credential: ${doc.fileName}\\nPrivate student record verified.')">
            👁️ Inspect
          </button>
          <button class="btn-dossier-sm btn-primary-ink" onclick="App.openNewRequestModal('${doc.name}')">
            Autofill Use
          </button>
        </div>
      </div>
    `).join("");
  },

  // ========================================================================
  // 7. ROUTINE APPROVALS & SIGNATURE WORKFLOW
  // ========================================================================
  renderRequestsQueue() {
    const container = document.getElementById("requestsListContainer");
    if (!container) return;

    const requests = AppState.getRequests();

    container.innerHTML = requests.map(req => `
      <div class="paper-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="stamp-seal ${req.status === 'approved' ? 'approved' : (req.status === 'under_review' ? 'pending' : 'action')}">
              ${req.statusLabel}
            </span>
            <h3 style="font-family:var(--font-editorial); font-size:1.35rem; margin:0.4rem 0 0.2rem;">
              ${req.title}
            </h3>
            <p style="font-size:0.78rem; color:var(--ink-muted);">Submitted: ${req.dateSubmitted} • Impact: ${req.impactedLectures || "N/A"}</p>
          </div>
          <span style="font-family:var(--font-stamp); font-size:0.8rem; color:var(--ink-primary);">${req.type}</span>
        </div>

        <div class="dispatch-why-box" style="margin:1rem 0;">
          <strong>PURPOSE:</strong> ${req.purpose}
        </div>

        <!-- Workflow Stepper -->
        <div style="border-top:1px dashed var(--paper-border-dark); padding-top:0.85rem; margin-top:0.85rem;">
          <div style="font-family:var(--font-stamp); font-size:0.72rem; text-transform:uppercase; color:var(--ink-muted); margin-bottom:0.5rem;">
            APPROVAL STAGE PROGRESSION:
          </div>
          <div style="display:flex; gap:1.5rem; flex-wrap:wrap;">
            ${req.workflow.map(step => `
              <div style="font-size:0.78rem;">
                <div style="font-weight:700; color:${step.status === 'completed' ? 'var(--stamp-green)' : (step.status === 'current' ? 'var(--stamp-blue)' : 'var(--ink-muted)')};">
                  ${step.status === 'completed' ? '✓' : (step.status === 'current' ? '▶' : '○')} ${step.role}: ${step.name}
                </div>
                <div style="font-size:0.72rem; color:var(--ink-muted);">${step.action} (${step.timestamp})</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `).join("");

    const badge = document.getElementById("pendingRequestsBadge");
    if (badge) {
      const pendingCount = requests.filter(r => r.status === "under_review").length;
      badge.textContent = pendingCount;
    }
  },

  openNewRequestModal(defaultType = "On-Duty (OD)", targetFaculty = "Dr. Arun Sundaram") {
    const modal = document.getElementById("newRequestModal");
    const typeSelect = document.getElementById("newReqType");
    const facSelect = document.getElementById("newReqFaculty");

    if (typeSelect) typeSelect.value = defaultType;
    if (facSelect) facSelect.value = targetFaculty;

    if (modal) modal.style.display = "flex";
  },

  closeNewRequestModal() {
    const modal = document.getElementById("newRequestModal");
    if (modal) modal.style.display = "none";
  },

  submitNewRequest() {
    const type = document.getElementById("newReqType").value;
    const title = document.getElementById("newReqTitle").value.trim() || `${type} Exemption Request`;
    const faculty = document.getElementById("newReqFaculty").value;
    const hours = document.getElementById("newReqHours").value.trim() || "3 Periods";

    AppState.addRequest({
      type: type,
      title: title,
      targetFaculty: faculty,
      impactedLectures: hours,
      purpose: `Official student request for ${type} submitted with verified credentials.`
    });

    this.closeNewRequestModal();
    this.renderRequestsQueue();
    this.showToast("✓ Request pre-routed and delivered to Class Advisor desk!");
  },

  // ========================================================================
  // 8. DEADLINE RADAR
  // ========================================================================
  renderDeadlineRadar() {
    const container = document.getElementById("deadlinesListContainer");
    if (!container) return;

    container.innerHTML = CampusData.deadlines.map(dl => {
      let urgClass = dl.urgency === "today" ? "action" : (dl.urgency === "tomorrow" ? "pending" : "approved");

      return `
        <div class="paper-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <span class="stamp-seal ${urgClass}">${dl.urgencyLabel}</span>
            <span style="font-family:var(--font-stamp); font-size:0.75rem; color:var(--ink-muted);">${dl.subject}</span>
          </div>

          <h4 style="font-family:var(--font-editorial); font-size:1.25rem; font-weight:700; margin-bottom:0.35rem;">
            ${dl.title}
          </h4>
          <p style="font-size:0.8rem; color:var(--ink-secondary);">
            📅 ${dl.displayDate} • 🕒 ${dl.time} • 📍 ${dl.venue}
          </p>

          <div class="dispatch-why-box" style="margin:1rem 0 0.5rem; font-size:0.78rem;">
            <strong>IMPACT:</strong> ${dl.impact}
          </div>
        </div>
      `;
    }).join("");
  },

  // ========================================================================
  // 9. FACULTY DESK VIEW (DR. ARUN SUNDARAM)
  // ========================================================================
  renderFacultyDesk() {
    const container = document.getElementById("facultyQueueContainer");
    if (!container) return;

    const requests = AppState.getRequests();

    container.innerHTML = requests.map(req => `
      <div class="paper-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="stamp-seal ${req.status === 'approved' ? 'approved' : 'pending'}">${req.statusLabel}</span>
            <h4 style="font-family:var(--font-editorial); font-size:1.3rem; margin:0.35rem 0 0.15rem;">${req.title}</h4>
            <p style="font-size:0.78rem; color:var(--ink-muted);">From: ${req.studentName} (${req.studentRoll}) • ${req.department}</p>
          </div>
          <span style="font-family:var(--font-stamp); font-size:0.8rem;">${req.type}</span>
        </div>

        <div class="dispatch-why-box" style="margin:1rem 0;">
          <strong>STUDENT JUSTIFICATION:</strong> ${req.purpose}
        </div>

        ${req.status === 'under_review' ? `
          <div style="display:flex; gap:0.75rem; justify-content:flex-end;">
            <button class="btn-dossier-sm btn-outline-ink" onclick="App.handleFacultyAction('${req.id}', 'rejected')">
              Decline
            </button>
            <button class="btn-dossier-sm btn-outline-ink" onclick="App.handleFacultyAction('${req.id}', 'correction')">
              Request Correction
            </button>
            <button class="btn-dispatch-action" onclick="App.handleFacultyAction('${req.id}', 'approved')">
              ✓ Approve & Digitally Seal
            </button>
          </div>
        ` : `
          <div style="font-size:0.8rem; color:var(--stamp-green); font-family:var(--font-stamp);">
            ✓ ACTION COMPLETED • SEALED IN STUDENT AUDIT TRAIL
          </div>
        `}
      </div>
    `).join("");
  },

  setFacultyDeclaredStatus(status) {
    const fac = CampusData.faculty.find(f => f.id === "fac_arun");
    if (fac) {
      fac.status = status;
      fac.statusLabel = status === "available" ? "Available in Cabin" : (status === "class" ? "In Class" : "In Meeting");
    }
    this.showToast(`Broadcasted new status: ${fac.statusLabel}`);
  },

  handleFacultyAction(reqId, newStatus) {
    let reason = "";
    if (newStatus === "correction") reason = prompt("Enter correction note for student:", "Clarify impacted hours");
    if (newStatus === "rejected") reason = prompt("Enter reason for declining:", "Schedule conflict");

    AppState.updateRequestStatus(reqId, newStatus, "Dr. Arun Sundaram", reason);
    this.renderFacultyDesk();
    this.showToast(`Request marked as ${newStatus.toUpperCase()}`);
  },

  // ========================================================================
  // 10. CAMPUS PULSE & "WHY ARE STUDENTS ASKING THIS?" (ADMIN VIEW)
  // ========================================================================
  renderAdminPulse() {
    const container = document.getElementById("adminQueriesContainer");
    if (!container) return;

    container.innerHTML = CampusData.repeatedQueries.map(q => `
      <div class="paper-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <span class="stamp-seal action">${q.count} STUDENTS ASKED</span>
          <span style="font-size:0.72rem; color:var(--ink-muted); font-family:var(--font-stamp);">${q.department}</span>
        </div>

        <h4 style="font-family:var(--font-editorial); font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">
          "${q.query}"
        </h4>

        <div class="dispatch-why-box" style="margin:0.75rem 0; font-size:0.78rem;">
          <strong>DIAGNOSED BOTTLENECK:</strong> ${q.gapIdentified}
        </div>

        <div style="font-size:0.8rem; color:var(--stamp-green);">
          <strong>RECOMMENDED ACTION:</strong> ${q.recommendation}
        </div>
      </div>
    `).join("");
  },

  // ========================================================================
  // 11. UNIVERSAL SEARCH ENGINE
  // ========================================================================
  runSampleSearch(query) {
    const input = document.getElementById("universalSearchInput");
    if (input) input.value = query;
    this.executeSearch(query);
  },

  async executeSearch(query) {
    if (!query || !query.trim()) return;

    this.showToast("🔎 Querying Campus Knowledge Graph...");
    const res = await GeminiService.interpretCampusQuery(query);

    const modal = document.getElementById("searchResultModal");
    const title = document.getElementById("searchModalTitle");
    const dept = document.getElementById("searchModalDept");
    const badge = document.getElementById("searchModalStatusBadge");
    const whyList = document.getElementById("searchModalWhyList");
    const actionBtn = document.getElementById("searchModalActionButton");

    if (title) title.textContent = res.title;
    if (dept) dept.textContent = `${res.department} • ${res.location}`;
    if (badge) {
      badge.textContent = res.status;
      badge.style.color = res.statusColor;
    }
    if (whyList) {
      whyList.innerHTML = res.why.map(w => `<li>${w}</li>`).join("");
    }
    if (actionBtn) {
      actionBtn.textContent = res.actionLabel;
      this.currentSearchAction = res.actionFn;
    }

    if (modal) modal.style.display = "flex";
  },

  closeSearchModal() {
    const modal = document.getElementById("searchResultModal");
    if (modal) modal.style.display = "none";
  },

  triggerSearchAction() {
    this.closeSearchModal();
    if (this.currentSearchAction) {
      try {
        eval(this.currentSearchAction);
      } catch (e) {
        console.error(e);
      }
    }
  },

  // ========================================================================
  // 12. INDOOR ROUTE & LOCATION MODAL
  // ========================================================================
  showLocationModal(roomCode) {
    const loc = CampusData.locations.find(l => l.code === roomCode) || CampusData.locations[0];
    const modal = document.getElementById("locationModal");
    const headerTitle = document.getElementById("locModalTitle");
    const blockFloor = document.getElementById("locModalBlockFloor");
    const roomName = document.getElementById("locModalRoomName");
    const directions = document.getElementById("locModalDirections");

    if (headerTitle) headerTitle.textContent = `CAMPUS ROUTE: ${loc.code}`;
    if (blockFloor) blockFloor.textContent = `${loc.block.toUpperCase()} • ${loc.floor.toUpperCase()}`;
    if (roomName) roomName.textContent = loc.name;
    if (directions) directions.textContent = loc.directions;

    if (modal) modal.style.display = "flex";

    // Also update inline box in Navigator tab if active
    const inlineBox = document.getElementById("inlineLocationDetails");
    if (inlineBox) {
      inlineBox.innerHTML = `<strong>${loc.name} (${loc.block}, ${loc.floor}):</strong><br>${loc.directions}`;
    }
  },

  closeLocationModal() {
    const modal = document.getElementById("locationModal");
    if (modal) modal.style.display = "none";
  },

  // ========================================================================
  // 13. ONE-CONTEXT MODAL
  // ========================================================================
  openOneContextModal(subjectCodeOrName) {
    const sub = CampusData.subjects.find(s => s.code === subjectCodeOrName || s.name.includes(subjectCodeOrName) || s.short === subjectCodeOrName) || CampusData.subjects[0];
    const modal = document.getElementById("oneContextModal");
    const header = document.getElementById("oneCtxHeader");
    const body = document.getElementById("oneCtxBodyContent");

    if (header) header.textContent = `ONE-CONTEXT VIEW: ${sub.name}`;
    if (body) {
      body.innerHTML = `
        <div style="margin-bottom:1.25rem;">
          <span class="stamp-seal approved">${sub.code} • ${sub.credits} CREDITS</span>
          <h3 style="font-family:var(--font-editorial); font-size:1.6rem; margin:0.4rem 0;">${sub.name}</h3>
          <p style="font-size:0.82rem; color:var(--ink-muted);">Instructor: ${sub.faculty} • Allocated Hall: ${sub.room}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
          <div class="dispatch-why-box">
            <strong>ATTENDANCE TELEMETRY:</strong><br>
            Current: <strong>${sub.attendance.percentage}%</strong> (${sub.attendance.attended}/${sub.attendance.conducted} sessions)<br>
            Compliance Status: <strong>${sub.attendance.percentage >= 75 ? 'Compliant' : 'Needs Attendance'}</strong>
          </div>
          <div class="dispatch-why-box">
            <strong>INTERNAL SCORE PROFILE:</strong><br>
            Test 1: <strong>${sub.internals.test1}/${sub.internals.test1Max}</strong> • Test 2: <strong>${sub.internals.test2}/${sub.internals.test2Max}</strong><br>
            Current Internal Sum: <strong>${sub.internals.total}/${sub.internals.max}</strong>
          </div>
        </div>

        <div class="dispatch-why-box" style="margin-bottom:1.5rem;">
          <strong>NEXT UPCOMING ASSESSMENT:</strong><br>
          Cycle Test II approaching in 3 days. Focus on Unit 3 (Transactions) & Unit 4 (NoSQL).
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
          <button class="btn-dossier-sm btn-outline-ink" onclick="App.closeOneContextModal()">Dismiss</button>
          <button class="btn-dispatch-action" onclick="App.closeOneContextModal(); App.showLocationModal('205')">Show Room Route</button>
        </div>
      `;
    }

    if (modal) modal.style.display = "flex";
  },

  closeOneContextModal() {
    const modal = document.getElementById("oneContextModal");
    if (modal) modal.style.display = "none";
  },

  // ========================================================================
  // 14. PRESENTATION PITCH DECK MODAL
  // ========================================================================
  openPitchDeckModal() {
    const modal = document.getElementById("pitchDeckModal");
    if (modal) modal.style.display = "flex";
  },

  closePitchDeckModal() {
    const modal = document.getElementById("pitchDeckModal");
    if (modal) modal.style.display = "none";
  },

  // ========================================================================
  // 15. PREFERENCES & CRYPTOGRAPHY
  // ========================================================================
  savePreferences() {
    const name = document.getElementById("prefStudentName").value.trim() || "Nivedha";
    const roll = document.getElementById("prefRollNo").value.trim() || "7376231CS204";
    const target = parseInt(document.getElementById("prefTargetPercent").value) || 75;

    AppState.updateSettings({ studentName: name, rollNo: roll, targetPercentage: target });
    this.showToast("✓ System preferences updated in Local Node.");
  },

  handleFormatNode() {
    if (confirm("Format local storage node? All cached records will be reseeded.")) {
      AppState.resetAll();
      window.location.reload();
    }
  },

  // ========================================================================
  // 16. TOAST HELPER
  // ========================================================================
  showToast(msg, duration = 3200) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;

    toast.textContent = msg;
    toast.style.display = "block";

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.display = "none";
    }, duration);
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
