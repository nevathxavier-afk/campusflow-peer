// ==========================================================================
// CAMPUSFLOW PEER — MAIN CONTROLLER & APPLICATION ENGINE
// 100% Faithful LastbencherOS Architecture & Tactical Cyberpunk Workflows
// ==========================================================================

const App = {
  activeTab: "dashboard",
  activeFilter: "all",
  calendarMonth: new Date(),
  selectedDate: new Date(),
  resetTimer: null,
  isResetConfirming: false,
  chatHistory: [],

  init() {
    // 1. Subscribe to AppState updates
    AppState.subscribe(() => {
      this.renderCurrentView();
      this.updateHeaderBadges();
    });

    // 2. Setup navigation links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.getAttribute("data-tab");
        if (tab) this.switchTab(tab);
      });
    });

    // 3. Setup time filter buttons on Dashboard
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeFilter = btn.getAttribute("data-filter") || "all";
        this.renderDashboard();
      });
    });

    // 4. Initial Render
    this.renderCurrentView();
    this.updateHeaderBadges();
    this.setupTimetableListeners();
    this.setupSettingsListeners();
    this.setupChatListeners();

    console.log("🚀 CampusFlow Peer HUD Online — LastbencherOS Architecture Activated.");
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-tab") === tabId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update panels
    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) targetPanel.classList.add("active");

    // Update Header title
    const titles = {
      dashboard: "DASHBOARD",
      timetable: "OPERATIONS SCHEDULE",
      attendance: "ATTENDANCE LEDGER",
      companion: "CAMPUS AI INTELLIGENCE",
      faculty: "FACULTY ACCESSIBILITY",
      approvals: "ROUTINE APPROVALS",
      events: "CAMPUS CIRCULARS & EVENTS",
      settings: "SYSTEM PREFERENCES"
    };
    const titleEl = document.getElementById("headerViewTitle");
    if (titleEl) titleEl.textContent = titles[tabId] || tabId.toUpperCase();

    this.renderCurrentView();
  },

  updateHeaderBadges() {
    const stats = AppState.getAttendanceStats();
    const settings = AppState.getSettings();

    const goalBadge = document.getElementById("headerGoalBadge");
    if (goalBadge) {
      goalBadge.textContent = `GOAL: ${settings.targetPercentage}%`;
    }

    const userHandle = document.getElementById("sidebarUserHandle");
    if (userHandle) {
      userHandle.textContent = settings.name || "Student";
    }

    const userInitial = document.getElementById("sidebarUserInitial");
    if (userInitial) {
      userInitial.textContent = (settings.name || "S").charAt(0).toUpperCase();
    }
  },

  renderCurrentView() {
    switch (this.activeTab) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "timetable":
        this.renderTimetable();
        break;
      case "attendance":
        this.renderAttendance();
        break;
      case "settings":
        this.renderSettings();
        break;
      case "companion":
        this.renderCompanion();
        break;
      case "faculty":
        this.renderFaculty();
        break;
      case "approvals":
        this.renderApprovals();
        break;
      case "events":
        this.renderEvents();
        break;
    }
  },

  // ========================================================================
  // 1. DASHBOARD VIEW (System Efficiency, Bunk Capacity, Integrity, Trends)
  // ========================================================================
  renderDashboard() {
    const stats = AppState.getAttendanceStats(this.activeFilter);
    const settings = AppState.getSettings();
    const isStable = stats.percentage >= settings.targetPercentage;

    // 1. Radial Percentage & Ring
    const pctNumEl = document.getElementById("radialPercentageNum");
    if (pctNumEl) {
      pctNumEl.textContent = `${Math.round(stats.percentage)}%`;
      pctNumEl.style.color = isStable ? "var(--color-brand-green)" : "var(--color-brand-red)";
      pctNumEl.style.textShadow = isStable ? "0 0 20px rgba(0, 255, 102, 0.4)" : "0 0 20px rgba(255, 0, 68, 0.4)";
    }

    const statusTextEl = document.getElementById("radialStatusText");
    if (statusTextEl) {
      statusTextEl.textContent = stats.totalClasses === 0 ? "SCHEDULE IDLE" : (isStable ? "SYSTEM STABLE" : "CRITICAL FAILURE");
      statusTextEl.style.color = stats.totalClasses === 0 ? "var(--color-zinc-500)" : (isStable ? "var(--color-brand-green)" : "var(--color-brand-red)");
    }

    const dividerEl = document.getElementById("radialDivider");
    if (dividerEl) {
      dividerEl.style.backgroundColor = isStable ? "var(--color-brand-green)" : "var(--color-brand-red)";
      dividerEl.style.boxShadow = isStable ? "var(--glow-green)" : "var(--glow-red)";
    }

    const fillCircle = document.getElementById("radialFillCircle");
    if (fillCircle) {
      const circum = 691;
      const offset = stats.totalClasses === 0 ? circum : Math.max(0, circum - (circum * stats.percentage / 100));
      fillCircle.style.strokeDashoffset = offset;
      fillCircle.style.stroke = isStable ? "var(--color-brand-green)" : "var(--color-brand-red)";
      fillCircle.style.filter = isStable ? "drop-shadow(0 0 8px rgba(0, 255, 102, 0.5))" : "drop-shadow(0 0 8px rgba(255, 0, 68, 0.5))";
    }

    const glowBackdrop = document.getElementById("radialGlowBackdrop");
    if (glowBackdrop) {
      glowBackdrop.style.backgroundColor = stats.totalClasses === 0 ? "rgba(0, 170, 255, 0.05)" : (isStable ? "rgba(0, 255, 102, 0.15)" : "rgba(255, 0, 68, 0.15)");
    }

    // 2. Tactical Guidance Box
    const guidanceTextEl = document.getElementById("tacticalGuidanceText");
    if (guidanceTextEl) {
      if (stats.totalClasses === 0) {
        guidanceTextEl.textContent = "No academic commitments logged yet. Establish timetable directives or manual entries to activate predictive bunk telemetry.";
      } else if (isStable) {
        guidanceTextEl.textContent = `Operational redundancy active. ${stats.canBunk} sessions may be deferred while maintaining compliance.`;
      } else {
        guidanceTextEl.textContent = `Immediate mitigation required. Register attendance for the next ${stats.requiredToReachTarget} sessions without absence.`;
      }
    }

    const efficiencyTargetEl = document.getElementById("efficiencyTargetLabel");
    if (efficiencyTargetEl) {
      efficiencyTargetEl.textContent = `Target: ${settings.targetPercentage}%`;
    }

    // 3. Bunk Capacity Card
    const bunkCard = document.getElementById("bunkCapacityCard");
    const bunkNumEl = document.getElementById("bunkCapacityNum");
    const bunkPill = document.getElementById("bunkStatusPill");
    const bunkSubtext = document.getElementById("bunkSubtext");
    const bunkBottomBar = document.getElementById("bunkBottomBar");

    if (bunkNumEl) {
      bunkNumEl.textContent = stats.canBunk;
      bunkNumEl.style.color = isStable ? "#fff" : "var(--color-brand-red)";
      bunkNumEl.style.textShadow = isStable ? "0 0 20px rgba(0, 170, 255, 0.4)" : "0 0 20px rgba(255, 0, 68, 0.4)";
    }

    if (bunkPill) {
      if (isStable) {
        bunkPill.textContent = "ACTIVE";
        bunkPill.style.backgroundColor = "rgba(0, 170, 255, 0.2)";
        bunkPill.style.color = "var(--color-brand-blue)";
        bunkPill.style.boxShadow = "var(--glow-blue)";
      } else {
        bunkPill.textContent = "LOCKED";
        bunkPill.style.backgroundColor = "rgba(255, 0, 68, 0.2)";
        bunkPill.style.color = "var(--color-brand-red)";
        bunkPill.style.boxShadow = "var(--glow-red)";
      }
    }

    if (bunkSubtext) {
      bunkSubtext.textContent = isStable ? "Sessions remaining in safe-zone." : "Zero session redundancy.";
    }

    if (bunkBottomBar) {
      bunkBottomBar.style.backgroundColor = isStable ? "var(--color-brand-blue)" : "var(--color-brand-red)";
      bunkBottomBar.style.boxShadow = isStable ? "var(--glow-blue)" : "var(--glow-red)";
    }

    if (bunkCard) {
      bunkCard.style.backgroundColor = isStable ? "var(--color-zinc-900)" : "var(--color-zinc-950)";
      bunkCard.style.borderColor = isStable ? "rgba(39, 39, 42, 0.8)" : "rgba(255, 0, 68, 0.3)";
    }

    // 4. Session Integrity Donut & Stats
    const presentCountEl = document.getElementById("presentCountVal");
    if (presentCountEl) presentCountEl.textContent = stats.presentCount;

    const absentCountEl = document.getElementById("absentCountVal");
    if (absentCountEl) absentCountEl.textContent = stats.absentCount;

    const donutPresentArc = document.getElementById("donutPresentArc");
    const donutAbsentArc = document.getElementById("donutAbsentArc");
    if (donutPresentArc && donutAbsentArc) {
      const circum = 2 * Math.PI * 45; // ~282.7
      if (stats.totalClasses === 0) {
        donutPresentArc.style.strokeDashoffset = circum;
        donutAbsentArc.style.strokeDashoffset = circum;
      } else {
        const presentPct = stats.presentCount / stats.totalClasses;
        donutPresentArc.style.strokeDasharray = circum;
        donutPresentArc.style.strokeDashoffset = circum - (circum * presentPct);

        donutAbsentArc.style.strokeDasharray = circum;
        donutAbsentArc.style.strokeDashoffset = circum * presentPct;
      }
    }

    // 5. Weekly Activity Trend Bar Chart
    this.renderActivityBars();

    // 6. Heatmap 21-Day Tactical Grid
    this.renderHeatmap(stats);
  },

  renderActivityBars() {
    const barsWrap = document.getElementById("trendBarsContainer");
    if (!barsWrap) return;

    const attendance = AppState.getAttendance();
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = this.formatDate(d);
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const presentCount = attendance.filter(a => a.date === dateStr && a.status === "present").length;
      days.push({ dateStr, dayLabel, count: presentCount, isToday: i === 0 });
    }

    const maxCount = Math.max(1, ...days.map(d => d.count));

    barsWrap.innerHTML = days.map(d => {
      const heightPct = d.count === 0 ? 8 : Math.max(12, Math.round((d.count / maxCount) * 90));
      return `
        <div class="bar-col">
          <div class="bar-track">
            <div class="bar-fill ${d.isToday ? 'active' : ''}" style="height:${heightPct}%;"></div>
          </div>
          <span class="bar-label">${d.dayLabel}</span>
        </div>
      `;
    }).join("");
  },

  renderHeatmap(stats) {
    const grid = document.getElementById("heatmapGrid");
    if (!grid) return;

    const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];
    let html = dayHeaders.map(h => `<div class="heatmap-day-label">${h}</div>`).join("");

    const attendance = AppState.getAttendance();
    const today = new Date();

    for (let i = 20; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = this.formatDate(d);
      const records = attendance.filter(a => a.date === dateStr);
      const hasPresent = records.some(a => a.status === "present");
      const hasAbsent = records.some(a => a.status === "absent");

      let cellClass = "";
      if (hasPresent) cellClass = "status-green";
      else if (hasAbsent) cellClass = "status-red";

      html += `<div class="heatmap-cell ${cellClass}" title="${dateStr}"></div>`;
    }

    grid.innerHTML = html;

    const avgEl = document.getElementById("heatmapAvgDaily");
    if (avgEl) {
      avgEl.textContent = `${Math.round(stats.presentCount / 7)} Classes`;
    }
  },

  // ========================================================================
  // 2. TIMETABLE VIEW (Zero Preload • Schedule Idle • AI Extraction)
  // ========================================================================
  renderTimetable() {
    const timetable = AppState.getTimetable();
    const container = document.getElementById("timetableDaysContainer");
    const idleCard = document.getElementById("timetableIdleCard");
    const resetBtn = document.getElementById("btnResetTimetable");

    if (resetBtn) {
      resetBtn.style.display = timetable.length > 0 ? "flex" : "none";
    }

    if (timetable.length === 0) {
      if (idleCard) idleCard.style.display = "flex";
      if (container) container.innerHTML = "";
      return;
    }

    if (idleCard) idleCard.style.display = "none";
    if (!container) return;

    container.innerHTML = DAYS_OF_WEEK.map(dayName => {
      const slots = timetable
        .filter(item => item.day.toLowerCase() === dayName.toLowerCase())
        .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

      if (slots.length === 0) return "";

      const slotItems = slots.map(slot => `
        <div class="slot-item-card">
          <div class="slot-subject-row">
            <div class="slot-subject-title">${this.escapeHtml(slot.subject)}</div>
            <button class="btn-delete-slot" onclick="App.deleteTimetableSlot('${slot.id}')" title="Delete slot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
          <div class="slot-time-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${slot.startTime}</span>
            <span style="opacity:0.3;">/</span>
            <span>${slot.endTime}</span>
          </div>
        </div>
      `).join("");

      return `
        <div class="day-column-card">
          <div class="day-card-header">
            <h5>${dayName}</h5>
            <div class="day-header-pill"></div>
          </div>
          <div class="day-slots-list">
            ${slotItems}
          </div>
        </div>
      `;
    }).join("");
  },

  deleteTimetableSlot(id) {
    AppState.removeTimetableEntry(id);
    this.renderTimetable();
  },

  setupTimetableListeners() {
    // 1. Reset All button with 3-second red countdown confirmation
    const resetBtn = document.getElementById("btnResetTimetable");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (this.isResetConfirming) {
          clearTimeout(this.resetTimer);
          this.isResetConfirming = false;
          AppState.clearTimetable();
          resetBtn.classList.remove("confirming");
          resetBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Reset All</span>
          `;
          this.renderTimetable();
        } else {
          this.isResetConfirming = true;
          resetBtn.classList.add("confirming");
          resetBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Confirm Reset?</span>
          `;
          this.resetTimer = setTimeout(() => {
            this.isResetConfirming = false;
            resetBtn.classList.remove("confirming");
            resetBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              <span>Reset All</span>
            `;
          }, 3000);
        }
      });
    }

    // 2. AI Intelligence file upload
    const fileInput = document.getElementById("timetableFileInput");
    const aiBtn = document.getElementById("btnAiIntel");
    if (fileInput && aiBtn) {
      aiBtn.addEventListener("click", () => fileInput.click());

      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        aiBtn.innerHTML = `
          <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Analyzing...</span>
        `;
        aiBtn.disabled = true;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const dataUrl = event.target.result;
            const base64Data = dataUrl.split(",")[1];
            const mimeType = file.type || "image/jpeg";

            const extracted = await GeminiService.extractTimetable(base64Data, mimeType);
            if (extracted && extracted.length > 0) {
              const current = AppState.getTimetable();
              AppState.setTimetable([...current, ...extracted]);
              this.renderTimetable();
            } else {
              alert("No lecture slots detected in timetable image. Please try a clearer picture or add entries manually.");
            }
          } catch (err) {
            console.error("AI schedule extraction failed:", err);
            alert("AI schedule extraction failed. Please check network connectivity or try another image.");
          } finally {
            aiBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
              <span>AI Intelligence</span>
            `;
            aiBtn.disabled = false;
            fileInput.value = "";
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // 3. Add Entry Modal
    const modal = document.getElementById("entryModal");
    const openBtn = document.getElementById("btnOpenAddEntry");
    const abortBtn = document.getElementById("btnAbortEntry");
    const commitBtn = document.getElementById("btnCommitEntry");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        document.getElementById("entrySubject").value = "";
        document.getElementById("entrySubject").focus();
      });
    }

    if (abortBtn && modal) {
      abortBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (commitBtn && modal) {
      commitBtn.addEventListener("click", () => {
        const subject = document.getElementById("entrySubject").value.trim();
        const day = document.getElementById("entryDay").value;
        const startTime = document.getElementById("entryStartTime").value;
        const endTime = document.getElementById("entryEndTime").value;

        if (!subject || !startTime || !endTime) {
          alert("Please fill in Designation, Commence time, and Conclude time.");
          return;
        }

        AppState.addTimetableEntry({ subject, day, startTime, endTime });
        modal.style.display = "none";
        this.renderTimetable();
      });
    }
  },

  // ========================================================================
  // 3. ATTENDANCE VIEW (Chronicle Ledger & Daily Manifest Marking)
  // ========================================================================
  renderAttendance() {
    this.renderCalendarLedger();
    this.renderDailyManifest();
  },

  renderCalendarLedger() {
    const titleEl = document.getElementById("calendarMonthTitle");
    if (titleEl) {
      titleEl.textContent = this.calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }

    const grid = document.getElementById("calendarDaysGrid");
    if (!grid) return;

    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayIndex = firstDay.getDay(); // 0 is Sunday
    const daysInMonth = lastDay.getDate();

    const attendance = AppState.getAttendance();
    const todayStr = this.formatDate(new Date());
    const selectedStr = this.formatDate(this.selectedDate);

    let html = "";

    // Blank cells before month start
    for (let i = 0; i < startDayIndex; i++) {
      html += `<div class="cal-day-cell inactive-month"></div>`;
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const dateStr = this.formatDate(cellDate);
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedStr;

      const records = attendance.filter(a => a.date === dateStr);
      const hasPresent = records.some(a => a.status === "present");
      const hasAbsent = records.some(a => a.status === "absent");

      html += `
        <button class="cal-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="App.selectDate('${dateStr}')">
          <div class="day-num-badge">${d}</div>
          <div class="day-pills-row">
            ${hasPresent ? '<div class="dot-present"></div>' : ''}
            ${hasAbsent ? '<div class="dot-absent"></div>' : ''}
          </div>
        </button>
      `;
    }

    grid.innerHTML = html;
  },

  changeMonth(delta) {
    this.calendarMonth.setMonth(this.calendarMonth.getMonth() + delta);
    this.renderCalendarLedger();
  },

  selectDate(dateStr) {
    const parts = dateStr.split("-");
    this.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    this.renderAttendance();
  },

  renderDailyManifest() {
    const dateStr = this.formatDate(this.selectedDate);
    const dayName = this.selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    // Date Titles
    const titleEl = document.getElementById("manifestDateTitle");
    if (titleEl) {
      const dayNum = this.selectedDate.getDate();
      const suffix = this.getDaySuffix(dayNum);
      const monthName = this.selectedDate.toLocaleDateString("en-US", { month: "long" });
      titleEl.textContent = `${dayNum}${suffix} ${monthName}`;
    }

    const dayNameEl = document.getElementById("manifestDayName");
    if (dayNameEl) dayNameEl.textContent = dayName;

    // Saturday Phase Configuration Box
    const phaseBox = document.getElementById("saturdayPhaseBox");
    const isSaturday = this.selectedDate.getDay() === 6;

    let targetDay = dayName;
    if (isSaturday) {
      if (phaseBox) phaseBox.style.display = "flex";
      const followDay = AppState.getSaturdayFollowDay(dateStr);
      targetDay = followDay === "Default" ? "Saturday" : followDay;
      this.updatePhaseButtons(followDay);
    } else {
      if (phaseBox) phaseBox.style.display = "none";
    }

    // Slots for that day
    const timetable = AppState.getTimetable();
    const daySlots = targetDay === "Holiday" ? [] : timetable.filter(t => t.day.toLowerCase() === targetDay.toLowerCase());

    const totalBadge = document.getElementById("missionScopeTotalBadge");
    if (totalBadge) totalBadge.textContent = `${daySlots.length} TOTAL`;

    const scopeList = document.getElementById("missionScopeSlotsList");
    if (!scopeList) return;

    if (daySlots.length === 0) {
      scopeList.innerHTML = `
        <div class="zero-constraints-box">
          <div class="zero-icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
          </div>
          <h5>Zero Constraints</h5>
          <p>No academic commitments found in the timetable for this cycle.</p>
        </div>
      `;
      return;
    }

    scopeList.innerHTML = daySlots.map(slot => {
      const status = AppState.getSlotStatus(slot.id, dateStr);
      const isPresent = status === "present";
      const isAbsent = status === "absent";

      return `
        <div class="attendance-slot-card ${isPresent ? 'is-present' : ''} ${isAbsent ? 'is-absent' : ''}">
          <div class="slot-content-row">
            <div class="slot-text-info">
              <div class="slot-subject-name">${this.escapeHtml(slot.subject)}</div>
              <div class="slot-time-info">
                <div class="slot-time-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <span>${slot.startTime}</span>
                <span style="opacity:0.3;">|</span>
                <span>${slot.endTime}</span>
              </div>
            </div>
            <div class="slot-actions-toggles">
              <button class="btn-toggle-att btn-present ${isPresent ? 'active' : ''}" onclick="App.toggleAttendance('${slot.id}', 'present')" title="Mark Present">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button class="btn-toggle-att btn-absent ${isAbsent ? 'active' : ''}" onclick="App.toggleAttendance('${slot.id}', 'absent')" title="Mark Absent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
          <div class="slot-bottom-accent-bar">
            <div class="slot-bottom-accent-fill ${isPresent ? 'present-fill' : (isAbsent ? 'absent-fill' : '')}"></div>
          </div>
        </div>
      `;
    }).join("");
  },

  toggleAttendance(slotId, status) {
    const dateStr = this.formatDate(this.selectedDate);
    AppState.markAttendance(slotId, dateStr, status);
    this.renderAttendance();
  },

  setPhaseOverride(followDay) {
    const dateStr = this.formatDate(this.selectedDate);
    AppState.setSaturdayOverride(dateStr, followDay);
    this.renderDailyManifest();
  },

  updatePhaseButtons(currentFollow) {
    document.querySelectorAll(".phase-btn").forEach(btn => {
      const val = btn.getAttribute("data-day");
      if (val === currentFollow) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  // ========================================================================
  // 4. SETTINGS VIEW (Identity & Target Percentage Slider)
  // ========================================================================
  renderSettings() {
    const settings = AppState.getSettings();

    const handleInput = document.getElementById("settingHandleInput");
    if (handleInput) handleInput.value = settings.name;

    const slider = document.getElementById("targetPercentSlider");
    const numDisplay = document.getElementById("targetPercentVal");
    const barFill = document.getElementById("targetPercentFill");

    if (slider) slider.value = settings.targetPercentage;
    if (numDisplay) numDisplay.textContent = settings.targetPercentage;
    if (barFill) barFill.style.width = `${settings.targetPercentage}%`;
  },

  setupSettingsListeners() {
    const slider = document.getElementById("targetPercentSlider");
    const numDisplay = document.getElementById("targetPercentVal");
    const barFill = document.getElementById("targetPercentFill");

    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        if (numDisplay) numDisplay.textContent = val;
        if (barFill) barFill.style.width = `${val}%`;
      });
    }

    const syncBtn = document.getElementById("btnSyncSettings");
    if (syncBtn) {
      syncBtn.addEventListener("click", () => {
        const handle = document.getElementById("settingHandleInput").value.trim() || "Student";
        const target = parseInt(document.getElementById("targetPercentSlider").value) || 78;

        AppState.updateSettings({ name: handle, targetPercentage: target });

        syncBtn.textContent = "Preferences Updated!";
        syncBtn.style.backgroundColor = "var(--color-brand-green)";
        syncBtn.style.color = "#000";

        setTimeout(() => {
          syncBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            <span>Synchronize Configuration</span>
          `;
          syncBtn.style.backgroundColor = "var(--color-brand-blue)";
          syncBtn.style.color = "#fff";
        }, 2000);
      });
    }

    const formatBtn = document.getElementById("btnFormatNode");
    if (formatBtn) {
      formatBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
          AppState.resetAllData();
          window.location.reload();
        }
      });
    }
  },

  // ========================================================================
  // 5. EXTENDED CONNECTED CAMPUSFLOW PEER VIEWS (Companion, Faculty, etc.)
  // ========================================================================
  renderCompanion() {
    const container = document.getElementById("companionMessagesList");
    if (!container) return;

    if (this.chatHistory.length === 0) {
      this.chatHistory.push({
        role: "model",
        text: "⚡ **CampusFlow Neural Agent Active.** Ask me anything about your timetable, bunk safety margins, required sessions, faculty accessibility, or routine approvals."
      });
    }

    container.innerHTML = this.chatHistory.map(msg => `
      <div class="chat-msg ${msg.role}">
        ${this.formatChatText(msg.text)}
      </div>
    `).join("");

    container.scrollTop = container.scrollHeight;
  },

  setupChatListeners() {
    const sendBtn = document.getElementById("btnSendChat");
    const input = document.getElementById("companionInput");

    const doSend = async () => {
      const query = (input.value || "").trim();
      if (!query) return;

      this.chatHistory.push({ role: "user", text: query });
      input.value = "";
      this.renderCompanion();

      try {
        const reply = await GeminiService.chatWithAI(query, this.chatHistory);
        this.chatHistory.push({ role: "model", text: reply });
      } catch (err) {
        this.chatHistory.push({ role: "model", text: "Tactical connection error. Please try again." });
      }
      this.renderCompanion();
    };

    if (sendBtn) sendBtn.addEventListener("click", doSend);
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") doSend();
      });
    }
  },

  renderFaculty() {
    const grid = document.getElementById("facultyListGrid");
    if (!grid) return;

    grid.innerHTML = CampusData.faculty.map(f => {
      const isFree = f.status === "free";
      const badgeColor = isFree ? "var(--color-brand-green)" : (f.status === "class" ? "var(--color-brand-blue)" : "var(--color-brand-amber)");

      return `
        <div class="faculty-card">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
              <div>
                <h4 style="font-size:1.15rem; font-weight:800; color:#fff; font-style:italic;">${f.name}</h4>
                <p style="font-size:11px; font-weight:700; color:var(--color-zinc-500); text-transform:uppercase; margin-top:2px;">${f.designation}</p>
              </div>
              <span style="font-size:9px; font-weight:900; padding:0.35rem 0.65rem; border-radius:0.5rem; text-transform:uppercase; letter-spacing:0.1em; background:rgba(255,255,255,0.05); color:${badgeColor}; border:1px solid ${badgeColor};">
                ${f.statusLabel}
              </span>
            </div>
            <div style="font-size:12px; color:var(--color-zinc-400); margin-bottom:1rem;">
              📍 <strong>Cabin:</strong> ${f.cabin}
            </div>
            <div style="font-size:11px; color:var(--color-zinc-500); margin-bottom:1.25rem;">
              🕒 <strong>Free Slots:</strong> ${f.freeTimeSlots.join(", ")}
            </div>
          </div>
          <button style="width:100%; padding:0.75rem; border-radius:0.85rem; background:var(--color-zinc-900); border:1px solid var(--color-zinc-700); color:#fff; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; cursor:pointer;" onclick="alert('Digital routine query routed to ${f.name}. Notification queued.')">
            Route Action Query
          </button>
        </div>
      `;
    }).join("");
  },

  renderApprovals() {
    const container = document.getElementById("approvalsListContainer");
    if (!container) return;

    container.innerHTML = CampusData.requests.map(req => `
      <div class="tactical-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
          <div>
            <span style="font-size:10px; font-weight:900; color:var(--color-brand-blue); text-transform:uppercase; letter-spacing:0.2em;">${req.type}</span>
            <h4 style="font-size:1.25rem; font-weight:800; color:#fff; margin-top:0.25rem;">${req.title}</h4>
          </div>
          <span style="font-size:10px; font-weight:900; padding:0.4rem 0.75rem; border-radius:0.6rem; background:rgba(245,158,11,0.15); color:var(--color-brand-amber); border:1px solid rgba(245,158,11,0.3);">
            ${req.statusLabel}
          </span>
        </div>
        <div style="font-size:12px; color:var(--color-zinc-400); margin-bottom:1.5rem;">
          📅 Event Date: ${req.eventDate} &nbsp;|&nbsp; ⏱️ Impacted: ${req.impactedSessions}
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${req.steps.map(step => `
            <div style="display:flex; align-items:center; justify-content:space-between; background:var(--color-zinc-950); padding:0.75rem 1.25rem; border-radius:1rem; border:1px solid var(--color-zinc-800);">
              <span style="font-size:11px; font-weight:700; color:var(--color-zinc-300);">${step.role}: ${step.name}</span>
              <span style="font-size:10px; font-weight:900; text-transform:uppercase; color:${step.status === 'approved' ? 'var(--color-brand-green)' : (step.status === 'pending' ? 'var(--color-brand-amber)' : 'var(--color-zinc-500)')};">
                ${step.status.toUpperCase()}
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  },

  renderEvents() {
    const container = document.getElementById("eventsListContainer");
    if (!container) return;

    container.innerHTML = CampusData.events.map(evt => `
      <div class="tactical-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div>
            <span style="font-size:10px; font-weight:900; color:var(--color-brand-green); text-transform:uppercase; letter-spacing:0.2em;">${evt.type}</span>
            <h4 style="font-size:1.35rem; font-weight:800; color:#fff; margin-top:0.25rem;">${evt.title}</h4>
            <p style="font-size:11px; color:var(--color-zinc-500); margin-top:2px;">Organized by: ${evt.organizer}</p>
          </div>
          ${evt.requiresOD ? '<span style="font-size:10px; font-weight:900; padding:0.4rem 0.75rem; border-radius:0.6rem; background:rgba(0,170,255,0.15); color:var(--color-brand-blue); border:1px solid rgba(0,170,255,0.3);">OD REQUIRED</span>' : ''}
        </div>
        <div style="font-size:12px; color:var(--color-zinc-400); margin-bottom:1rem;">
          📍 ${evt.venue} &nbsp;|&nbsp; 🗓️ ${evt.date} &nbsp;|&nbsp; ⏱️ ${evt.time}
        </div>
        ${evt.hasConflict ? `
          <div style="background:rgba(255,0,68,0.1); border:1px solid rgba(255,0,68,0.25); border-radius:1rem; padding:0.85rem 1.25rem; font-size:12px; color:var(--color-brand-red); font-weight:600; display:flex; justify-content:space-between; align-items:center;">
            <span>⚠️ Conflict Detected: ${evt.conflictDetails}</span>
            <button style="background:var(--color-brand-blue); color:#fff; border:none; padding:0.5rem 1rem; border-radius:0.65rem; font-size:10px; font-weight:900; cursor:pointer;" onclick="App.switchTab('approvals')">Auto-Draft OD</button>
          </div>
        ` : ''}
      </div>
    `).join("");
  },

  // Helpers
  formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  getDaySuffix(n) {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  },

  escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  },

  formatChatText(txt) {
    if (!txt) return "";
    return txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
};

window.App = App;

// Bootstrap on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
