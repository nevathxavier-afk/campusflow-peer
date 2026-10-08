// ==========================================================================
// FEATURE 4: SMART SIGNATURE & ROUTINE APPROVAL WORKFLOW
// ==========================================================================

const SignatureFlow = {
  requests: [],

  init() {
    const cached = localStorage.getItem('cfp_signature_requests');
    if (cached) {
      try {
        this.requests = JSON.parse(cached);
      } catch (e) {
        this.requests = CampusData.initialRequests;
      }
    } else {
      this.requests = JSON.parse(JSON.stringify(CampusData.initialRequests));
    }

    this.populateFacultyDropdown();
    this.renderRequestsList();
    this.setupForm();
  },

  populateFacultyDropdown() {
    const select = document.getElementById('reqFacultySelect');
    if (!select) return;

    select.innerHTML = '';
    CampusData.faculty.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.name} (${f.designation} - ${f.cabin})`;
      select.appendChild(opt);
    });
  },

  setupForm() {
    const form = document.getElementById('signatureRequestForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleNewRequest();
    });
  },

  handleNewRequest() {
    const type = document.getElementById('reqTypeSelect').value;
    const purpose = document.getElementById('reqPurposeInput').value;
    const date = document.getElementById('reqDateInput').value;
    const facultyId = document.getElementById('reqFacultySelect').value;
    const note = document.getElementById('reqNoteInput').value;

    const faculty = CampusData.faculty.find(f => f.id === facultyId) || { name: "Faculty In-Charge" };
    const randToken = `CFP-${type.substring(0,2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newReq = {
      id: `req_${Date.now()}`,
      studentName: CampusData.currentStudent.name,
      studentId: CampusData.currentStudent.id,
      type: type,
      purpose: purpose,
      eventDate: date || new Date().toISOString().split('T')[0],
      facultyId: facultyId,
      facultyName: faculty.name,
      status: "pending",
      token: randToken,
      submittedAt: "Just now",
      reviewedAt: null,
      note: note || "Routine academic clearance requested via CampusFlow Peer."
    };

    this.requests.unshift(newReq);
    localStorage.setItem('cfp_signature_requests', JSON.stringify(this.requests));

    this.renderRequestsList();
    App.showToast(`Request submitted to ${faculty.name}! Assigned token: ${randToken}`, 'success');

    // Reset form
    document.getElementById('reqPurposeInput').value = '';
    document.getElementById('reqNoteInput').value = '';
    if (window.WorkflowGraph) WorkflowGraph.init();
  },

  renderRequestsList() {
    const container = document.getElementById('signatureRequestsList');
    if (!container) return;

    container.innerHTML = '';

    if (this.requests.length === 0) {
      container.innerHTML = '<div style="color:#94a3b8; font-size:0.85rem; padding:1rem;">No approval requests filed yet.</div>';
      return;
    }

    this.requests.forEach(req => {
      const card = document.createElement('div');
      card.className = 'request-item-card';

      let statusBadge = '';
      if (req.status === 'approved') {
        statusBadge = `<span class="chip-free stat-chip">🟢 Approved</span>`;
      } else if (req.status === 'rejected') {
        statusBadge = `<span style="background:rgba(255,51,102,0.15); color:var(--status-busy); border:1px solid rgba(255,51,102,0.3);" class="stat-chip">🔴 Rejected</span>`;
      } else {
        statusBadge = `<span class="chip-pending stat-chip">🟡 Pending Review</span>`;
      }

      // Faculty action buttons if role is Faculty or Admin
      let facultyReviewActions = '';
      if ((App.currentRole === 'faculty' || App.currentRole === 'admin') && req.status === 'pending') {
        facultyReviewActions = `
          <div class="faculty-action-btn-row">
            <button class="btn-action-approve" onclick="SignatureFlow.updateStatus('${req.id}', 'approved')">✓ Approve (Sign)</button>
            <button class="btn-action-reject" onclick="SignatureFlow.updateStatus('${req.id}', 'rejected')">✕ Reject</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="req-item-header">
          <div>
            <span class="req-purpose">${req.type}</span>
            <div style="font-size:0.8rem; color:#cbd5e1; margin-top:0.15rem;">${req.purpose}</div>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>

        <div class="req-meta-line">
          <span>Student: <strong>${req.studentName} (${req.studentId})</strong></span> • 
          <span>Target: <strong>${req.facultyName}</strong></span> • 
          <span>Date: <strong>${req.eventDate}</strong></span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#94a3b8; background:rgba(255,255,255,0.02); padding:0.4rem 0.6rem; border-radius:6px;">
          <span>Token: <strong class="req-token-badge">${req.token}</strong></span>
          <span>Submitted: ${req.submittedAt}</span>
        </div>

        ${facultyReviewActions}
      `;

      container.appendChild(card);
    });
  },

  updateStatus(reqId, newStatus) {
    const target = this.requests.find(r => r.id === reqId);
    if (!target) return;

    target.status = newStatus;
    target.reviewedAt = "Just now by Faculty In-Charge";
    localStorage.setItem('cfp_signature_requests', JSON.stringify(this.requests));

    this.renderRequestsList();
    App.showToast(`Request ${target.token} has been ${newStatus}!`, newStatus === 'approved' ? 'success' : 'warning');
    if (window.WorkflowGraph) WorkflowGraph.init();
  }
};

window.SignatureFlow = SignatureFlow;
