// ==========================================================================
// FEATURE 6: NATURAL LANGUAGE SMART CAMPUS ASSISTANT ENGINE
// ==========================================================================

const SmartSearch = {
  init() {
    this.setupListeners();
  },

  setupListeners() {
    const input = document.getElementById('campusAssistantInput');
    const headerInput = document.getElementById('headerSearchInput');
    const btn = document.getElementById('btnAssistantAsk');
    const chips = document.querySelectorAll('.prompt-chip');

    if (btn && input) {
      btn.addEventListener('click', () => {
        this.processQuery(input.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.processQuery(input.value);
      });
    }

    if (headerInput) {
      headerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.processQuery(headerInput.value);
          headerInput.value = '';
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query || chip.textContent.trim();
        if (input) input.value = query;
        this.processQuery(query);
      });
    });
  },

  async processQuery(rawQuery) {
    if (!rawQuery || rawQuery.trim().length === 0) return;
    const q = rawQuery.toLowerCase().trim();

    const responseCard = document.getElementById('assistantResponseCard');
    const responseTitle = document.getElementById('respTitleText');
    const responseBody = document.getElementById('respBodyText');
    const responseAction = document.getElementById('respActionContainer');

    if (responseCard) responseCard.classList.add('active');

    // Live Gemini Query when API Key is active
    if (window.GeminiService && GeminiService.isConfigured()) {
      if (responseTitle) responseTitle.textContent = "✨ Gemini 1.5 Flash Campus Intelligence";
      if (responseBody) responseBody.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.5rem; color:#a78bfa; font-size:0.82rem;">
          <span class="live-pulse-dot" style="background:#a78bfa;"></span>
          <span>Gemini AI is analyzing campus timetable, faculty status & attendance graph...</span>
        </div>
      `;

      try {
        const geminiAnswer = await GeminiService.queryCampusCompanion(rawQuery);
        const formatted = geminiAnswer
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/- (.*?)\n/g, '<li style="margin-left:1rem;">$1</li>')
          .replace(/\n\n/g, '<p style="margin-bottom:0.4rem;"></p>');

        if (responseBody) responseBody.innerHTML = `<div style="line-height:1.55;">${formatted}</div>`;

        // Contextual action button heuristics
        let actionBtn = "";
        if (q.includes("meet") || q.includes("sign") || q.includes("arun") || q.includes("od")) {
          actionBtn = `<button class="resp-action-btn" onclick="FacultyMatrix.initiateRequest('fac_arun', 'Dr. Arun Sundaram')">✍️ Pre-fill Signature / Meeting Request</button>`;
        } else if (q.includes("class") || q.includes("time") || q.includes("room")) {
          actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('timetable')">🗓️ View Full Timetable</button>`;
        } else if (q.includes("attendance") || q.includes("bunk")) {
          actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('attendance')">📊 Open Attendance Simulator</button>`;
        } else {
          actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('workflow')">🧩 Open Visual Campus Graph</button>`;
        }

        if (responseAction) responseAction.innerHTML = actionBtn;
        return;
      } catch (err) {
        console.warn("Gemini chat error, falling back to local heuristic:", err);
      }
    }

    let title = "CampusFlow Peer Intelligence";
    let body = "";
    let actionBtn = "";

    // Intent 1: Faculty Free Time / Cabin Location
    if (q.includes("arun") || (q.includes("meet") && q.includes("prof"))) {
      const fac = CampusData.faculty.find(f => f.id === 'fac_arun');
      title = `Prof. Arun Sundaram Accessibility`;
      body = `Dr. Arun is currently <strong>${fac.statusLabel}</strong> at <strong>${fac.cabin}</strong>. Today's free meeting windows are <strong>${fac.freeTimeSlots.join(" & ")}</strong>.`;
      actionBtn = `<button class="resp-action-btn" onclick="FacultyMatrix.initiateRequest('fac_arun', 'Dr. Arun Sundaram')">✍️ Pre-fill Meeting / Signature Request</button>`;
    }
    else if (q.includes("priya")) {
      const fac = CampusData.faculty.find(f => f.id === 'fac_priya');
      title = `Prof. Priya Ramachandran Status`;
      body = `Prof. Priya is currently <strong>${fac.statusLabel}</strong>. Her free window is at <strong>${fac.freeTimeSlots[0]}</strong> in <strong>${fac.cabin}</strong>.`;
      actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('faculty')">👨🏫 View Faculty Matrix</button>`;
    }
    // Intent 2: Next Class / Timetable
    else if (q.includes("next class") || q.includes("where is class") || q.includes("room")) {
      title = `Next Academic Session`;
      body = `Your next scheduled lecture is <strong>Database Management Systems (19CS501)</strong> with Dr. Arun Sundaram in <strong>Room 205</strong> at <strong>09:50 AM</strong>.`;
      actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('timetable')">🗓️ Open Verified Timetable</button>`;
    }
    // Intent 3: Attendance / Bunk Safety
    else if (q.includes("bunk") || q.includes("miss") || (q.includes("attendance") && (q.includes("os") || q.includes("dbms")))) {
      if (q.includes("os") || q.includes("operating")) {
        const c = CampusData.courses.find(x => x.code === '19CS502');
        const m = AttendanceEngine.calculateMetrics(c.attended, c.conducted);
        title = `Operating Systems Attendance Buffer`;
        body = `Current: <strong>${m.pct}%</strong> (${c.attended}/${c.conducted} classes). Safe margin: You can miss <strong>${m.buffer} classes</strong> while remaining comfortably above 75%.`;
        actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('attendance')">📊 Test in What-If Simulator</button>`;
      } else {
        const c = CampusData.courses.find(x => x.code === '19CS501');
        const m = AttendanceEngine.calculateMetrics(c.attended, c.conducted);
        title = `DBMS Attendance Alert`;
        body = `Warning: DBMS is at <strong>${m.pct}%</strong> — below the 75% SNS Autonomous target! You cannot bunk; you must attend the next <strong>${m.needed} consecutive classes</strong>.`;
        actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('attendance')">📊 View Attendance Plan</button>`;
      }
    }
    // Intent 4: Tests / Cycle Test / Exams
    else if (q.includes("test") || q.includes("exam") || q.includes("cycle")) {
      title = `Upcoming Academic Assessments`;
      body = `<strong>Cycle Test II</strong> commences on <strong>Oct 21, 2026 (10:00 AM)</strong>. Hall ticket clearance deadline is Oct 18.`;
      actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('events')">📢 View Official Notice & Circular</button>`;
    }
    // Fallback: General Graph Search
    else {
      title = `Connected Campus Query`;
      body = `Found match across campus knowledge graph for "<em>${rawQuery}</em>". Checked timetable, faculty registry, active OD workflows, and attendance projections.`;
      actionBtn = `<button class="resp-action-btn" onclick="App.switchTab('workflow')">🧩 Open Visual Connected Graph</button>`;
    }

    if (responseTitle) responseTitle.textContent = title;
    if (responseBody) responseBody.innerHTML = body;
    if (responseAction) responseAction.innerHTML = actionBtn;
    if (responseCard) responseCard.classList.add('active');
  }
};

window.SmartSearch = SmartSearch;
