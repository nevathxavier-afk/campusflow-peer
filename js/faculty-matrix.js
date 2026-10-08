// ==========================================================================
// FEATURE 3: LIVE FACULTY ACCESSIBILITY & STATUS MATRIX
// ==========================================================================

const FacultyMatrix = {
  facultyList: [],
  selectedDept: "ALL",

  init() {
    const cached = localStorage.getItem('cfp_faculty_list');
    if (cached) {
      try {
        this.facultyList = JSON.parse(cached);
      } catch (e) {
        this.facultyList = CampusData.faculty;
      }
    } else {
      this.facultyList = JSON.parse(JSON.stringify(CampusData.faculty));
    }

    this.renderFacultyCards();
    this.setupDeptFilter();
  },

  renderFacultyCards() {
    const container = document.getElementById('facultyGrid');
    if (!container) return;

    container.innerHTML = '';

    const filtered = this.selectedDept === "ALL" 
      ? this.facultyList 
      : this.facultyList.filter(f => f.department === this.selectedDept);

    filtered.forEach(f => {
      const card = document.createElement('div');
      card.className = 'faculty-card';

      let statusPillClass = 'status-pill-free';
      let statusIcon = '🟢';
      if (f.status === 'class') { statusPillClass = 'status-pill-class'; statusIcon = '🔵'; }
      if (f.status === 'meeting') { statusPillClass = 'status-pill-meeting'; statusIcon = '🟣'; }
      if (f.status === 'busy') { statusPillClass = 'status-pill-busy'; statusIcon = '🔴'; }

      // Faculty role self-toggle controls
      let facultyControls = '';
      if (App.currentRole === 'faculty') {
        facultyControls = `
          <div style="margin-top:0.75rem; padding-top:0.6rem; border-top:1px dashed var(--border-subtle); display:flex; gap:0.4rem; flex-wrap:wrap;">
            <span style="font-size:0.7rem; color:#94a3b8; width:100%;">Change My Status:</span>
            <button class="btn-preset" onclick="FacultyMatrix.updateStatus('${f.id}', 'free', 'Available in Cabin')">🟢 Free</button>
            <button class="btn-preset" onclick="FacultyMatrix.updateStatus('${f.id}', 'class', 'In Class (Room 205)')">🔵 Class</button>
            <button class="btn-preset" onclick="FacultyMatrix.updateStatus('${f.id}', 'meeting', 'In Meeting')">🟣 Meeting</button>
            <button class="btn-preset" onclick="FacultyMatrix.updateStatus('${f.id}', 'busy', 'Unavailable')">🔴 Busy</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="fac-header">
            <div class="fac-avatar">${f.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
            <div class="fac-details">
              <h4>${f.name}</h4>
              <div class="fac-desig">${f.designation} • Dept of ${f.department}</div>
              <div class="fac-status-pill ${statusPillClass}">
                <span>${statusIcon}</span>
                <span>${f.statusLabel}</span>
              </div>
            </div>
          </div>

          <div class="fac-location-row">
            <span>📍</span>
            <span><strong>Cabin:</strong> ${f.cabin}</span>
          </div>

          <div class="fac-windows-list">
            <strong>Today's Free Windows:</strong><br>
            ${f.freeTimeSlots.map(s => `• ${s}`).join('<br>')}
          </div>
        </div>

        <div>
          <button class="btn-meet-req" onclick="FacultyMatrix.initiateRequest('${f.id}', '${f.name.replace("'", "")}')">
            <span>✍️</span>
            <span>Request Signature / Meeting</span>
          </button>
          ${facultyControls}
        </div>
      `;

      container.appendChild(card);
    });
  },

  setupDeptFilter() {
    const filterSelect = document.getElementById('facultyDeptFilter');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', (e) => {
      this.selectedDept = e.target.value;
      this.renderFacultyCards();
    });
  },

  updateStatus(facultyId, newStatus, newLabel) {
    const f = this.facultyList.find(x => x.id === facultyId);
    if (!f) return;

    f.status = newStatus;
    f.statusLabel = newLabel;
    localStorage.setItem('cfp_faculty_list', JSON.stringify(this.facultyList));
    this.renderFacultyCards();
    App.showToast(`Updated status for ${f.name} to "${newLabel}"`, 'success');
    if (window.WorkflowGraph) WorkflowGraph.init();
  },

  initiateRequest(facultyId, facultyName) {
    App.switchTab('signatures');
    setTimeout(() => {
      const select = document.getElementById('reqFacultySelect');
      if (select) {
        select.value = facultyId;
        App.showToast(`Selected ${facultyName} for signature workflow`, 'info');
      }
    }, 100);
  }
};

window.FacultyMatrix = FacultyMatrix;
