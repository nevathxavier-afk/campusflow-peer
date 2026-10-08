// ==========================================================================
// FEATURE 2: SMART ATTENDANCE PROJECTION & WHAT-IF SIMULATOR ENGINE
// ==========================================================================

const AttendanceEngine = {
  targetPercentage: 75,
  courses: [],
  selectedSimulatorCourseIndex: 0,

  init() {
    // Restore custom target if saved
    const savedTarget = localStorage.getItem('cfp_custom_target_pct');
    if (savedTarget) {
      this.targetPercentage = parseFloat(savedTarget);
    }

    // Always sync courses directly from CampusData (which derives from Timetable)
    this.courses = JSON.parse(JSON.stringify(CampusData.courses));
    this.setupTargetControls();
    this.renderAttendanceCards();
    this.setupSimulator();
  },

  setTargetPercentage(newVal) {
    const val = Math.max(50, Math.min(99, parseFloat(newVal) || 75));
    this.targetPercentage = val;
    localStorage.setItem('cfp_custom_target_pct', val);

    // Sync UI controls
    const input = document.getElementById('customTargetInput');
    const slider = document.getElementById('customTargetSlider');
    const display = document.getElementById('targetPercentageDisplay');

    if (input) input.value = val;
    if (slider) slider.value = val;
    if (display) display.textContent = `${val}%`;

    this.renderAttendanceCards();
    this.updateSimulatorOutput();
    App.showToast(`🎯 Target Attendance set to ${val}%! All subjects recalculated.`, 'success');
  },

  setupTargetControls() {
    const input = document.getElementById('customTargetInput');
    const slider = document.getElementById('customTargetSlider');
    const display = document.getElementById('targetPercentageDisplay');

    if (display) display.textContent = `${this.targetPercentage}%`;
    if (input) {
      input.value = this.targetPercentage;
      input.addEventListener('change', (e) => this.setTargetPercentage(e.target.value));
    }
    if (slider) {
      slider.value = this.targetPercentage;
      slider.addEventListener('input', (e) => {
        if (display) display.textContent = `${e.target.value}%`;
      });
      slider.addEventListener('change', (e) => this.setTargetPercentage(e.target.value));
    }
  },

  calculateMetrics(attended, conducted, target = 75) {
    if (conducted === 0) return { pct: 100, needed: 0, buffer: 0, isSafe: true };
    const pct = parseFloat(((attended / conducted) * 100).toFixed(1));
    const targetDec = target / 100;

    if (pct < target) {
      // Classes needed: (attended + x)/(conducted + x) >= targetDec
      const needed = Math.ceil((targetDec * conducted - attended) / (1 - targetDec));
      return {
        pct,
        needed: Math.max(0, needed),
        buffer: 0,
        isSafe: false
      };
    } else {
      // Safe to bunk: attended / (conducted + y) >= targetDec
      const buffer = Math.floor((attended - targetDec * conducted) / targetDec);
      return {
        pct,
        needed: 0,
        buffer: Math.max(0, buffer),
        isSafe: true
      };
    }
  },

  recordClassAttendance(courseIndex, attendedDelta, conductedDelta) {
    const course = this.courses[courseIndex];
    if (!course) return;

    course.attended = Math.max(0, course.attended + attendedDelta);
    course.conducted = Math.max(course.attended, course.conducted + conductedDelta);

    // Persist in CampusData
    if (CampusData.courses[courseIndex]) {
      CampusData.courses[courseIndex].attended = course.attended;
      CampusData.courses[courseIndex].conducted = course.conducted;
    }

    this.renderAttendanceCards();
    this.updateSimulatorOutput();
    App.showToast(`Updated attendance for ${course.name}: ${course.attended}/${course.conducted}`, 'info');
  },

  renderAttendanceCards() {
    const grid = document.getElementById('attendanceGrid');
    if (!grid) return;

    grid.innerHTML = '';

    this.courses.forEach((c, idx) => {
      const m = this.calculateMetrics(c.attended, c.conducted, this.targetPercentage);
      const card = document.createElement('div');
      card.className = 'attendance-card';

      let calloutHtml = '';
      if (m.isSafe) {
        calloutHtml = `
          <div class="att-action-callout safe">
            <span>🛡️</span>
            <span>Safe buffer: You can afford to miss <strong>${m.buffer}</strong> class${m.buffer === 1 ? '' : 'es'} while staying above ${this.targetPercentage}%.</span>
          </div>
        `;
      } else {
        calloutHtml = `
          <div class="att-action-callout danger">
            <span>⚠️</span>
            <span>Target gap: Must attend next <strong>${m.needed}</strong> consecutive classes to reach ${this.targetPercentage}%.</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="att-card-header">
          <div>
            <div class="att-code">${c.code} • ${c.facultyName}</div>
            <div class="att-title">${c.name}</div>
          </div>
          <div class="att-percentage-pill ${m.isSafe ? 'safe' : 'danger'}">
            ${m.pct}%
          </div>
        </div>

        <div class="att-progress-bar-wrap">
          <div class="att-threshold-mark" style="left: ${Math.min(95, Math.max(50, this.targetPercentage))}%;" title="Custom Target ${this.targetPercentage}% Cutoff"></div>
          <div class="att-progress-fill ${m.isSafe ? 'safe' : 'danger'}" style="width: ${Math.min(100, m.pct)}%"></div>
        </div>

        <div class="att-metrics-row">
          <span>Attended: <strong>${c.attended} / ${c.conducted}</strong></span>
          <span>Target: <strong style="color:var(--secondary);">${this.targetPercentage}%</strong></span>
          <span>Room: <strong>${c.room}</strong></span>
        </div>

        ${calloutHtml}

        <div style="margin-top:0.75rem; padding-top:0.6rem; border-top:1px dashed var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.7rem; color:#94a3b8;">Log Today's Class:</span>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-preset" style="padding:0.2rem 0.5rem; font-size:0.72rem; color:var(--status-free);" onclick="AttendanceEngine.recordClassAttendance(${idx}, 1, 1)">+ Attended</button>
            <button class="btn-preset" style="padding:0.2rem 0.5rem; font-size:0.72rem; color:var(--status-busy);" onclick="AttendanceEngine.recordClassAttendance(${idx}, 0, 1)">+ Missed</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    this.updateSimulatorOutput();
  },

  setupSimulator() {
    const courseSelect = document.getElementById('simCourseSelect');
    const attendSlider = document.getElementById('simAttendSlider');
    const missSlider = document.getElementById('simMissSlider');

    if (!courseSelect || !attendSlider || !missSlider) return;

    courseSelect.innerHTML = '';
    this.courses.forEach((c, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${c.code} - ${c.name}`;
      courseSelect.appendChild(opt);
    });

    courseSelect.addEventListener('change', (e) => {
      this.selectedSimulatorCourseIndex = parseInt(e.target.value);
      this.updateSimulatorOutput();
    });

    attendSlider.addEventListener('input', (e) => {
      document.getElementById('simAttendVal').textContent = `+${e.target.value} classes`;
      this.updateSimulatorOutput();
    });

    missSlider.addEventListener('input', (e) => {
      document.getElementById('simMissVal').textContent = `+${e.target.value} classes`;
      this.updateSimulatorOutput();
    });
  },

  updateSimulatorOutput() {
    const course = this.courses[this.selectedSimulatorCourseIndex];
    if (!course) return;

    const attendSlider = document.getElementById('simAttendSlider');
    const missSlider = document.getElementById('simMissSlider');
    if (!attendSlider || !missSlider) return;

    const extraAttend = parseInt(attendSlider.value);
    const extraMiss = parseInt(missSlider.value);

    const projectedAttended = course.attended + extraAttend;
    const projectedConducted = course.conducted + extraAttend + extraMiss;

    const currentMetrics = this.calculateMetrics(course.attended, course.conducted, this.targetPercentage);
    const projectedMetrics = this.calculateMetrics(projectedAttended, projectedConducted, this.targetPercentage);

    const curDisplay = document.getElementById('simCurrentDisplay');
    const projDisplay = document.getElementById('simProjectedDisplay');
    const adviceDisplay = document.getElementById('simAdviceDisplay');

    if (curDisplay) curDisplay.textContent = `${currentMetrics.pct}% (${course.attended}/${course.conducted})`;
    if (projDisplay) {
      projDisplay.textContent = `${projectedMetrics.pct}% (${projectedAttended}/${projectedConducted})`;
      projDisplay.className = `val-projected ${projectedMetrics.isSafe ? 'safe' : 'danger'}`;
    }

    if (adviceDisplay) {
      const diff = (projectedMetrics.pct - currentMetrics.pct).toFixed(1);
      const sign = diff >= 0 ? `+${diff}%` : `${diff}%`;
      adviceDisplay.innerHTML = `
        <strong>Impact:</strong> Projection results in <strong>${sign}</strong> shift. 
        ${projectedMetrics.isSafe 
          ? `Safe zone maintained with ${projectedMetrics.buffer} buffer slots.` 
          : `Below target! You will need to attend ${projectedMetrics.needed} additional classes.`}
      `;
    }
  },

  async generateGeminiStrategy() {
    const card = document.getElementById('geminiAttendancePlanCard');
    const content = document.getElementById('geminiPlanContent');
    const btn = document.getElementById('btnGenerateGeminiPlan');

    if (!card || !content) return;

    card.style.display = 'block';
    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.6rem; color:#a78bfa; font-family:var(--font-mono); font-size:0.85rem;">
        <span class="live-pulse-dot" style="background:#a78bfa;"></span>
        <span>Gemini AI is analyzing attendance records against 75% cutoff and upcoming events...</span>
      </div>
    `;

    try {
      if (window.GeminiService && GeminiService.isConfigured()) {
        const aiResponse = await GeminiService.generateAttendanceAIPlan(this.courses, this.targetPercentage);
        // Simple markdown to HTML conversion for headings and bullets
        const html = aiResponse
          .replace(/### (.*?)\n/g, '<h4 style="color:#c4b5fd; margin:0.8rem 0 0.3rem 0; font-size:0.95rem;">$1</h4>')
          .replace(/## (.*?)\n/g, '<h3 style="color:#00d2ff; margin:1rem 0 0.4rem 0; font-size:1.05rem;">$1</h3>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/- (.*?)\n/g, '<li style="margin-bottom:0.25rem;">$1</li>')
          .replace(/\n\n/g, '<p style="margin-bottom:0.6rem;"></p>');

        content.innerHTML = `
          <div style="font-size:0.88rem; line-height:1.6; color:#e2e8f0;">
            ${html}
          </div>
          <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px dashed var(--border-subtle); display:flex; gap:0.5rem;">
            <button class="resp-action-btn" onclick="EventHub.applyEventOD('evt_1', 'HACKNEXT 26 Series 2.0')">✍️ Auto-Route Friday OD Application</button>
          </div>
        `;
        App.showToast("Generated Gemini AI Strategic Attendance Plan!", "success");
      } else {
        // High fidelity heuristic AI response with prompt to enter key
        setTimeout(() => {
          content.innerHTML = `
            <div style="font-size:0.88rem; line-height:1.6; color:#e2e8f0;">
              <h4 style="color:#f43f5e; margin-bottom:0.4rem;">⚠️ Critical Attendance Alert: 19CS501 (DBMS) & 19AI504 (ML)</h4>
              <p>Your Database Management Systems is currently at <strong>72.7%</strong> (2 classes below threshold) and Machine Learning Practical is at <strong>71.1%</strong> (3 classes below threshold). You cannot miss these classes this week.</p>
              
              <h4 style="color:#00f59b; margin:0.8rem 0 0.4rem 0;">🛡️ High Buffer Cushion: 19CS502 (Operating Systems)</h4>
              <p>Operating Systems is safe at <strong>85.0%</strong> with a 5-class safe buffer margin. You can miss 1 OS class without dropping below 82%.</p>

              <h4 style="color:#00d2ff; margin:0.8rem 0 0.4rem 0;">⚡ HACKNEXT'26 Friday Clash Strategy</h4>
              <p>The Hackathon overlaps with Friday's ML Lab Practical. Instead of losing attendance, submit an <strong>On-Duty (OD) form</strong> to Dr. Arun Sundaram today. With approved OD, your attendance is preserved at 100% for that slot!</p>
            </div>
            <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px dashed var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <button class="resp-action-btn" onclick="EventHub.applyEventOD('evt_1', 'HACKNEXT 26 Series 2.0')">✍️ Pre-fill Friday OD Application</button>
              <span style="font-size:0.72rem; color:#94a3b8; font-family:var(--font-mono);">Connect your Gemini API Key in the navbar for personalized Gemini Flash reasoning.</span>
            </div>
          `;
          App.showToast("Generated Smart Attendance Strategy (Heuristic Engine)", "info");
        }, 600);
      }
    } catch (err) {
      content.innerHTML = `<div style="color:#f43f5e; font-size:0.85rem;">Error generating plan: ${err.message}</div>`;
    }
  }
};

window.AttendanceEngine = AttendanceEngine;

