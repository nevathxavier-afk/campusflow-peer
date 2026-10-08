// ==========================================================================
// FEATURE 5: EVENT & CIRCULAR EXTRACTION HUB WITH CONFLICT DETECTION
// ==========================================================================

const EventHub = {
  events: [],

  init() {
    const cached = localStorage.getItem('cfp_campus_events');
    if (cached) {
      try {
        this.events = JSON.parse(cached);
      } catch (e) {
        this.events = CampusData.events;
      }
    } else {
      this.events = JSON.parse(JSON.stringify(CampusData.events));
    }

    this.renderEvents();
    this.setupPosterUpload();
  },

  renderEvents() {
    const container = document.getElementById('eventsGrid');
    if (!container) return;

    container.innerHTML = '';

    this.events.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-card';

      let conflictHtml = '';
      if (evt.hasConflict && evt.conflictDetails) {
        conflictHtml = `
          <div class="event-conflict-alert">
            <span>⚠️</span>
            <span>${evt.conflictDetails}</span>
          </div>
        `;
      }

      let odBtn = '';
      if (evt.requiresOD) {
        odBtn = `
          <button class="btn-event-od" onclick="EventHub.applyEventOD('${evt.id}', '${evt.title.replace(/'/g, "")}')">
            <span>✍️</span> Apply OD
          </button>
        `;
      }

      card.innerHTML = `
        <div class="event-card-banner">
          <span class="event-tag-pill">${evt.type}</span>
          <div style="font-size:0.75rem; color:#c4b5fd; font-family:var(--font-mono);">${evt.organizer}</div>
        </div>

        <div class="event-card-body">
          <h4>${evt.title}</h4>
          
          <div class="event-meta-info">
            <span>📅 <strong>Date:</strong> ${evt.date} (${evt.time})</span>
            <span>📍 <strong>Venue:</strong> ${evt.venue}</span>
            <span>⏰ <strong>Registration Deadline:</strong> ${evt.deadline}</span>
          </div>

          ${conflictHtml}
        </div>

        <div class="event-actions-row">
          <button class="btn-event-cal" onclick="EventHub.addToCalendar('${evt.title.replace(/'/g, "")}', '${evt.date}')">
            <span>📅</span> Add to Calendar
          </button>
          ${odBtn}
        </div>
      `;

      container.appendChild(card);
    });
  },

  setupPosterUpload() {
    const posterZone = document.getElementById('posterDropZone');
    const posterInput = document.getElementById('posterFileInput');

    if (!posterZone || !posterInput) return;

    posterZone.addEventListener('click', () => posterInput.click());

    posterZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      posterZone.classList.add('dragover');
    });

    posterZone.addEventListener('dragleave', () => {
      posterZone.classList.remove('dragover');
    });

    posterZone.addEventListener('drop', (e) => {
      e.preventDefault();
      posterZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.simulatePosterExtraction(e.dataTransfer.files[0].name);
      }
    });

    posterInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.simulatePosterExtraction(e.target.files[0].name);
      }
    });
  },

  simulatePosterExtraction(fileName) {
    App.showToast(`OCR Engine scanning event poster "${fileName}"...`, 'info');

    setTimeout(() => {
      const newEvt = {
        id: `evt_${Date.now()}`,
        title: "National AI & Robotics Conclave 2026",
        type: "Conclave",
        organizer: "SNS IIC & Dept of AI&DS",
        date: "2026-10-30",
        time: "10:00 AM - 03:30 PM",
        venue: "Tech Park Seminar Hall 1",
        deadline: "2026-10-27",
        requiresOD: true,
        hasConflict: true,
        conflictDetails: "Overlaps with Thursday Full Stack Lab (P1-P2). OD clearance recommended."
      };

      this.events.unshift(newEvt);
      localStorage.setItem('cfp_campus_events', JSON.stringify(this.events));
      this.renderEvents();
      App.showToast(`Extracted event: "${newEvt.title}" with automatic conflict scan!`, 'success');
      if (window.WorkflowGraph) WorkflowGraph.init();
    }, 1200);
  },

  addToCalendar(title, date) {
    App.showToast(`Synced "${title}" on ${date} to your local campus calendar with 24h reminder!`, 'success');
  },

  applyEventOD(eventId, eventTitle) {
    App.switchTab('signatures');
    setTimeout(() => {
      const typeSelect = document.getElementById('reqTypeSelect');
      const purposeInput = document.getElementById('reqPurposeInput');
      if (typeSelect) typeSelect.value = "On-Duty (OD) Permission";
      if (purposeInput) purposeInput.value = `OD for participation in ${eventTitle}`;
      App.showToast(`Prefilled OD application for "${eventTitle}"`, 'info');
    }, 100);
  }
};

window.EventHub = EventHub;
