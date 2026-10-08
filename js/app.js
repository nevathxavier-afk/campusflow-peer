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
    // 0. Purge any stale legacy storage from previous prototypes
    if (typeof AppState.purgeLegacyStorage === "function") {
      AppState.purgeLegacyStorage();
    }

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

    // 3. Timetable starts strictly NILL ([]) — no preload on initial startup!
    // Prototype only populates when user uploads or clicks Try Demo Upload.

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
    this.renderWorkflowGraph();
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
    const timetable = AppState.getTimetable();
    const nillBanner = document.getElementById("homeNillBanner");
    const activeContent = document.getElementById("homeActiveContent");

    if (timetable.length === 0) {
      if (nillBanner) nillBanner.style.display = "block";
      if (activeContent) activeContent.style.display = "none";
      return;
    }

    if (nillBanner) nillBanner.style.display = "none";
    if (activeContent) activeContent.style.display = "block";

    const container = document.getElementById("journalEntriesContainer");
    if (!container) return;

    container.innerHTML = (CampusData.todayTimeline || []).map(item => {
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
    if (attNum) attNum.textContent = stats.isNill ? "NILL" : `${stats.percentage}%`;
  },

  // ========================================================================
  // INTERACTIVE CONNECTED WORKFLOW GRAPH ENGINE
  // ========================================================================
  selectedWorkflowNode: "ai_ocr",
  workflowViewMode: "mesh",
  workflowFilterCategory: "all",
  workflowPulseTimer: null,

  workflowNodes: [
    // STAGE 1: RAW INFLUX (x: 75)
    {
      id: "doc_tt",
      title: "Timetable Photo",
      sub: "SNS CSE-3A Grid",
      category: "input",
      stage: 1,
      icon: "📸",
      badge: "RAW INFLUX",
      accent: "#B91C1C",
      x: 75,
      y: 90,
      w: 165,
      h: 68,
      connectedTo: ["ai_ocr"],
      role: "Physical timetable snapshot uploaded via smartphone camera or college notice PDF.",
      telemetry: { source: "Camera / Upload", format: "JPEG / PDF", slotsCaptured: "36 Potential", status: "UNSTRUCTURED" },
      actionLabel: "Upload New Snap",
      actionTab: "timetable"
    },
    {
      id: "doc_circ",
      title: "Dean Circular",
      sub: "75% Policy & Exam Dates",
      category: "input",
      stage: 1,
      icon: "📢",
      badge: "CIRCULAR",
      accent: "#B91C1C",
      x: 75,
      y: 220,
      w: 165,
      h: 68,
      connectedTo: ["ai_ocr"],
      role: "Institutional academic directive mandating 75% attendance threshold & cycle test windows.",
      telemetry: { source: "Dean Academic Desk", issued: "01 Oct 2026", policy: "75% Minimum", status: "SYNCHRONIZED" },
      actionLabel: "View Policy Circular",
      actionTab: "vault"
    },
    {
      id: "doc_fac",
      title: "Faculty Manifest",
      sub: "Cabins & Consult Hours",
      category: "input",
      stage: 1,
      icon: "📜",
      badge: "DIRECTORY",
      accent: "#B91C1C",
      x: 75,
      y: 360,
      w: 165,
      h: 68,
      connectedTo: ["ai_linker"],
      role: "Department faculty directory mapping faculty cabins, consultation windows & designations.",
      telemetry: { source: "CSE Office", cabinsMapped: "100%", professors: "6 Active", status: "VERIFIED" },
      actionLabel: "View Faculty Grid",
      actionTab: "faculty"
    },

    // STAGE 2: MULTIMODAL AI & EXTRACTION (x: 295)
    {
      id: "ai_ocr",
      title: "Vision OCR Segmenter",
      sub: "Period Detection (8:45-4:45)",
      category: "ai",
      stage: 2,
      icon: "🤖",
      badge: "NEURAL VISION",
      accent: "#D97706",
      x: 295,
      y: 150,
      w: 180,
      h: 70,
      connectedTo: ["sub_dbms", "sub_dsa", "ai_linker"],
      role: "Multimodal neural vision parser segmenting the timetable grid, recognizing days and 8:45 AM - 4:45 PM periods.",
      telemetry: { model: "Multimodal Vision AI", accuracy: "98.4%", parsedPeriods: "36 Sessions", latency: "1.2s" },
      actionLabel: "Inspect AI Extractor",
      actionTab: "timetable"
    },
    {
      id: "ai_linker",
      title: "Entity Cross-Linker",
      sub: "Cabin & Room Matcher",
      category: "ai",
      stage: 2,
      icon: "🔍",
      badge: "CONTEXT GRAPH",
      accent: "#D97706",
      x: 295,
      y: 330,
      w: 180,
      h: 70,
      connectedTo: ["fac_arun", "fac_meena", "loc_campus"],
      role: "Disambiguates timetable abbreviations to real instructors, cabin numbers, and campus rooms.",
      telemetry: { matchEngine: "Fuzzy Graph Matcher", confidence: "99.1%", entitiesResolved: "6 Instructors", latency: "18ms" },
      actionLabel: "Verify Entities",
      actionTab: "faculty"
    },

    // STAGE 3: ACADEMIC KNOWLEDGE MESH (x: 525)
    {
      id: "sub_dsa",
      title: "CS3502 DSA",
      sub: "Room 302 • 4 Credits",
      category: "mesh",
      stage: 3,
      icon: "📚",
      badge: "COURSE ENTITY",
      accent: "#1E3A8A",
      x: 525,
      y: 80,
      w: 165,
      h: 66,
      connectedTo: ["fac_arun", "att_ledger"],
      role: "Core Data Structures & Algorithms lecture entity instructed by Dr. Arun Sundaram.",
      telemetry: { code: "CS3502", credits: 4, room: "Room 302", advisor: "Dr. Arun Sundaram" },
      actionLabel: "Open One-Context",
      actionTab: "timetable"
    },
    {
      id: "sub_dbms",
      title: "CS3501 DBMS",
      sub: "Room 205 • 4 Credits",
      category: "mesh",
      stage: 3,
      icon: "📚",
      badge: "COURSE ENTITY",
      accent: "#1E3A8A",
      x: 525,
      y: 190,
      w: 165,
      h: 66,
      connectedTo: ["fac_meena", "att_ledger"],
      role: "Database Management Systems core theory session taught by Prof. Meena Krishnan.",
      telemetry: { code: "CS3501", credits: 4, room: "Room 205", instructor: "Prof. Meena Krishnan" },
      actionLabel: "Locate Room 205",
      actionTab: "map"
    },
    {
      id: "fac_arun",
      title: "Dr. Arun Sundaram",
      sub: "Cabin 304 • Advisor",
      category: "mesh",
      stage: 3,
      icon: "👨‍🏫",
      badge: "AVAILABLE NOW",
      accent: "#15803D",
      x: 525,
      y: 310,
      w: 165,
      h: 66,
      connectedTo: ["act_od", "act_nav", "act_alert"],
      role: "Class Advisor & Associate Professor currently available in Cabin 304 for academic signatures and OD.",
      telemetry: { status: "AVAILABLE IN CABIN", cabin: "Room 304", floor: "3rd Floor Main Block", freeWindow: "2:30 - 4:15 PM" },
      actionLabel: "Draft OD Petition",
      actionTab: "requests"
    },
    {
      id: "fac_meena",
      title: "Prof. Meena Krishnan",
      sub: "Cabin 214 • In Lecture",
      category: "mesh",
      stage: 3,
      icon: "👩‍🏫",
      badge: "IN LECTURE",
      accent: "#B45309",
      x: 525,
      y: 420,
      w: 165,
      h: 66,
      connectedTo: ["act_alert"],
      role: "Assistant Professor currently conducting lecture in Room 205; free at 11:15 AM in Cabin 214.",
      telemetry: { status: "IN CLASS (Room 205)", cabin: "Room 214", floor: "2nd Floor Main Block", freeAt: "11:15 AM" },
      actionLabel: "Notify When Free",
      actionTab: "faculty"
    },

    // STAGE 4: PERIOD ATTENDANCE LEDGER (x: 745)
    {
      id: "att_ledger",
      title: "Period Attendance Ledger",
      sub: "P1-P6 Dynamic Sync",
      category: "attendance",
      stage: 4,
      icon: "📈",
      badge: "AUDITABLE MATH",
      accent: "#15803D",
      x: 745,
      y: 130,
      w: 175,
      h: 68,
      connectedTo: ["att_buffer"],
      role: "Daily period-by-period attendance manifest derived directly from extracted timetable periods.",
      telemetry: { mathFormula: "P / (P + A)", loggedClasses: "50 Conducted", present: "36", absent: "14" },
      actionLabel: "Mark Periods",
      actionTab: "attendance"
    },
    {
      id: "att_buffer",
      title: "75% Compliance Buffer",
      sub: "Safe Bunks / Recovery",
      category: "attendance",
      stage: 4,
      icon: "🧮",
      badge: "SCE FORMULA",
      accent: "#15803D",
      x: 745,
      y: 280,
      w: 175,
      h: 68,
      connectedTo: ["act_od"],
      role: "Mathematical engine computing safe bunk buffer or consecutive mandatory classes required to regain compliance.",
      telemetry: { threshold: "75%", standing: "72.0% (Action Required)", consecutiveNeeded: "6 Classes", safeBuffer: "0" },
      actionLabel: "Run What-If Scenario",
      actionTab: "attendance"
    },
    {
      id: "loc_campus",
      title: "Campus Spatial Mesh",
      sub: "Main Academic Block",
      category: "mesh",
      stage: 3,
      icon: "📍",
      badge: "TOPOLOGY",
      accent: "#4338CA",
      x: 745,
      y: 420,
      w: 175,
      h: 66,
      connectedTo: ["act_nav"],
      role: "Topological indoor graph of campus corridors, floors, stairs, and academic rooms.",
      telemetry: { indexedRooms: "48 Cabins & Labs", block: "Main Academic Block", walkAvg: "2.4 minutes", status: "ROUTED" },
      actionLabel: "Open Navigator",
      actionTab: "map"
    },

    // STAGE 5: AUTONOMOUS ACTION (x: 965)
    {
      id: "act_od",
      title: "1-Click OD Routing",
      sub: "Pre-filled #REQ-737",
      category: "action",
      stage: 5,
      icon: "✍️",
      badge: "DISPATCH READY",
      accent: "#6D28D9",
      x: 965,
      y: 130,
      w: 165,
      h: 68,
      connectedTo: [],
      role: "Automatically prepares OD petition pre-citing timetable periods and routes to available advisor Dr. Arun Sundaram.",
      telemetry: { formId: "REQ-737", endorsementTarget: "Dr. Arun Sundaram", student: "Nivedha", status: "READY FOR DRAFT" },
      actionLabel: "Review OD Petition",
      actionTab: "requests"
    },
    {
      id: "act_nav",
      title: "Corridor Route Guide",
      sub: "Turn-by-turn to 304",
      category: "action",
      stage: 5,
      icon: "🗺️",
      badge: "WAYFINDING",
      accent: "#6D28D9",
      x: 965,
      y: 280,
      w: 165,
      h: 68,
      connectedTo: [],
      role: "Provides step-by-step corridor wayfinding from current lecture (Room 205) to faculty cabin (Room 304).",
      telemetry: { route: "Room 205 ➔ Stair B ➔ 3rd Fl ➔ Cabin 304", distance: "65m", estimatedWalk: "90s", status: "OPTIMAL" },
      actionLabel: "View Navigation Route",
      actionTab: "map"
    },
    {
      id: "act_alert",
      title: "Free Window Ping",
      sub: "Telegram / Push Broadcast",
      category: "action",
      stage: 5,
      icon: "📱",
      badge: "LIVE TRIGGER",
      accent: "#6D28D9",
      x: 965,
      y: 420,
      w: 165,
      h: 68,
      connectedTo: [],
      role: "Dispatches automated notification when faculty finishes class and arrives at office cabin.",
      telemetry: { webhook: "Telegram / Push Alert", condition: "Prof returns to cabin", recipients: "Nivedha", status: "ACTIVE" },
      actionLabel: "Configure Alerts",
      actionTab: "preferences"
    }
  ],

  renderWorkflowGraph() {
    const svg = document.getElementById("workflowSvgCanvas");
    if (!svg) return;

    // Filter nodes by category if active
    const activeNodes = this.workflowNodes.filter(n => 
      this.workflowFilterCategory === "all" || n.category === this.workflowFilterCategory
    );
    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    // Build unique edges
    const edges = [];
    this.workflowNodes.forEach(source => {
      source.connectedTo.forEach(targetId => {
        const target = this.workflowNodes.find(n => n.id === targetId);
        if (target) {
          edges.push({
            id: `edge_${source.id}_${target.id}`,
            source,
            target,
            isActive: activeNodeIds.has(source.id) && activeNodeIds.has(target.id)
          });
        }
      });
    });

    // Generate SVG Edges
    let edgesHtml = `<g id="wfEdgesGroup">`;
    edges.forEach(e => {
      const x1 = e.source.x + e.source.w;
      const y1 = e.source.y + (e.source.h / 2);
      const x2 = e.target.x;
      const y2 = e.target.y + (e.target.h / 2);
      const dx = Math.max(30, (x2 - x1) * 0.45);
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      
      let edgeClass = "wf-edge";
      if (!e.isActive) edgeClass += " dimmed";

      edgesHtml += `
        <path id="${e.id}" class="${edgeClass}" d="${d}" data-source="${e.source.id}" data-target="${e.target.id}" />
      `;
    });
    edgesHtml += `</g>`;

    // Generate SVG Nodes
    let nodesHtml = `<g id="wfNodesGroup">`;
    this.workflowNodes.forEach(n => {
      let nodeClass = "wf-node-group";
      if (!activeNodeIds.has(n.id)) nodeClass += " dimmed";
      if (this.selectedWorkflowNode === n.id) nodeClass += " selected";

      nodesHtml += `
        <g class="${nodeClass}" id="node_${n.id}" data-id="${n.id}" onclick="App.selectWorkflowNode('${n.id}')">
          <!-- Card Base -->
          <rect class="wf-node-card" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" />
          
          <!-- Category Accent Stripe -->
          <rect x="${n.x}" y="${n.y}" width="4" height="${n.h}" fill="${n.accent}" rx="2" />

          <!-- Top Row: Icon + Stamped Badge -->
          <text x="${n.x + 10}" y="${n.y + 18}" font-size="12">${n.icon}</text>
          <text x="${n.x + 28}" y="${n.y + 17}" font-family="var(--font-stamp)" font-size="8.5" fill="${n.accent}" font-weight="bold" letter-spacing="0.05em">
            ${n.badge}
          </text>

          <!-- Middle Row: Title -->
          <text x="${n.x + 10}" y="${n.y + 36}" font-family="var(--font-editorial)" font-size="12" font-weight="700" fill="var(--ink-primary)">
            ${n.title}
          </text>

          <!-- Bottom Row: Subtitle -->
          <text x="${n.x + 10}" y="${n.y + 52}" font-family="var(--font-typewriter)" font-size="9" fill="var(--ink-secondary)">
            ${n.sub}
          </text>
        </g>
      `;
    });
    nodesHtml += `</g>`;

    svg.innerHTML = `
      <defs>
        <pattern id="wfGridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(180, 160, 130, 0.15)" stroke-width="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wfGridPattern)" />
      ${edgesHtml}
      ${nodesHtml}
    `;

    // Highlight active connections for current selected node
    if (this.selectedWorkflowNode) {
      this.highlightNodeConnections(this.selectedWorkflowNode);
    } else {
      this.selectWorkflowNode("ai_ocr", false);
    }
  },

  highlightNodeConnections(nodeId) {
    const node = this.workflowNodes.find(n => n.id === nodeId);
    if (!node) return;

    const outgoingIds = new Set(node.connectedTo);
    const incomingIds = new Set();
    this.workflowNodes.forEach(other => {
      if (other.connectedTo.includes(nodeId)) {
        incomingIds.add(other.id);
      }
    });

    const allNeighborIds = new Set([...outgoingIds, ...incomingIds, nodeId]);

    // Update edges
    document.querySelectorAll(".wf-edge").forEach(edgeEl => {
      const src = edgeEl.getAttribute("data-source");
      const tgt = edgeEl.getAttribute("data-target");
      if (src === nodeId || tgt === nodeId) {
        edgeEl.classList.remove("dimmed");
        edgeEl.classList.add("active");
      } else {
        edgeEl.classList.remove("active");
        edgeEl.classList.add("dimmed");
      }
    });

    // Update node groups
    document.querySelectorAll(".wf-node-group").forEach(nodeEl => {
      const id = nodeEl.getAttribute("data-id");
      nodeEl.classList.remove("selected", "connected", "dimmed");
      if (id === nodeId) {
        nodeEl.classList.add("selected");
      } else if (allNeighborIds.has(id)) {
        nodeEl.classList.add("connected");
      } else {
        nodeEl.classList.add("dimmed");
      }
    });
  },

  selectWorkflowNode(nodeId, updateTicker = true) {
    this.selectedWorkflowNode = nodeId;
    const node = this.workflowNodes.find(n => n.id === nodeId);
    if (!node) return;

    this.highlightNodeConnections(nodeId);

    // Update Ticker
    if (updateTicker) {
      const ticker = document.getElementById("workflowTickerText");
      if (ticker) {
        ticker.textContent = `[INSPECT] Selected ${node.title} (${node.badge}) • Category: ${node.category.toUpperCase()} • Direct Links: ${node.connectedTo.length} Outbound.`;
      }
    }

    // Populate Inspection Details Sheet
    const sheet = document.getElementById("workflowInspectionDetails");
    if (!sheet) return;

    const outgoingNodes = this.workflowNodes.filter(n => node.connectedTo.includes(n.id));
    const incomingNodes = this.workflowNodes.filter(n => n.connectedTo.includes(node.id));

    const outPills = outgoingNodes.length > 0 ? outgoingNodes.map(o => `
      <span class="workflow-tag-pill" onclick="App.selectWorkflowNode('${o.id}')">
        ${o.icon} ${o.title}
      </span>
    `).join("") : `<span style="font-size:0.75rem; color:var(--ink-muted);">Terminal Endpoint (Actions Generated)</span>`;

    const inPills = incomingNodes.length > 0 ? incomingNodes.map(i => `
      <span class="workflow-tag-pill" onclick="App.selectWorkflowNode('${i.id}')">
        ${i.icon} ${i.title}
      </span>
    `).join("") : `<span style="font-size:0.75rem; color:var(--ink-muted);">Root Source (External Physical Influx)</span>`;

    const telemetryEntries = Object.entries(node.telemetry).map(([k, v]) => `
      <div style="background:var(--paper-card-subtle); border:1px dashed var(--paper-border-dark); padding:0.6rem 0.8rem; border-radius:var(--radius-tag);">
        <div style="font-family:var(--font-stamp); font-size:0.68rem; text-transform:uppercase; color:var(--ink-muted);">${k}</div>
        <div style="font-family:var(--font-typewriter); font-size:0.85rem; font-weight:700; color:var(--ink-primary); margin-top:2px;">${v}</div>
      </div>
    `).join("");

    sheet.innerHTML = `
      <div class="workflow-inspection-header">
        <div>
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem;">
            <span style="font-size:1.5rem;">${node.icon}</span>
            <h3 style="font-family:var(--font-editorial); font-size:1.4rem; font-weight:700; margin:0; color:var(--ink-primary);">
              ${node.title}
            </h3>
            <span class="stamp-seal approved" style="color:${node.accent}; border-color:${node.accent};">
              ${node.badge}
            </span>
          </div>
          <p style="font-size:0.82rem; color:var(--ink-muted); font-family:var(--font-typewriter);">
            ${node.sub} • Category: ${node.category.toUpperCase()} • Stage ${node.stage} of 5
          </p>
        </div>

        <div>
          <button class="btn-dossier-sm btn-primary-ink" onclick="App.switchTab('${node.actionTab}')">
            <span>⚡</span> ${node.actionLabel}
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.6rem; margin-bottom:1.25rem;">
        ${telemetryEntries}
      </div>

      <div class="dispatch-why-box" style="margin-bottom:1.25rem;">
        <strong>OPERATIONAL ROLE:</strong> ${node.role}
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; border-top:1px dashed var(--paper-border); padding-top:1rem;">
        <div>
          <h5 style="font-family:var(--font-stamp); font-size:0.75rem; text-transform:uppercase; color:var(--ink-muted); margin-bottom:0.5rem;">
            ← Inbound Feeds (${incomingNodes.length}):
          </h5>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${inPills}
          </div>
        </div>

        <div>
          <h5 style="font-family:var(--font-stamp); font-size:0.75rem; text-transform:uppercase; color:var(--ink-muted); margin-bottom:0.5rem;">
            → Outbound Connected Actions (${outgoingNodes.length}):
          </h5>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${outPills}
          </div>
        </div>
      </div>
    `;
  },

  resetWorkflowGraphSelection() {
    this.selectedWorkflowNode = null;
    this.workflowFilterCategory = "all";
    document.querySelectorAll("#workflowCategoryBar .typewriter-time-chip").forEach(c => {
      c.classList.toggle("active", c.textContent.includes("All Nodes"));
    });
    this.renderWorkflowGraph();
    const ticker = document.getElementById("workflowTickerText");
    if (ticker) {
      ticker.textContent = "Graph reset. All 15 nodes and relations restored. Click any node to inspect context.";
    }
  },

  filterWorkflowNodes(cat, btnEl) {
    this.workflowFilterCategory = cat;
    if (btnEl) {
      document.querySelectorAll("#workflowCategoryBar .typewriter-time-chip").forEach(b => b.classList.remove("active"));
      btnEl.classList.add("active");
    }
    this.renderWorkflowGraph();
  },

  setWorkflowViewMode(mode) {
    this.workflowViewMode = mode;
    const meshView = document.getElementById("workflowMeshView");
    const pipeView = document.getElementById("workflowPipelineView");
    const btnMesh = document.getElementById("btnGraphViewMesh");
    const btnPipe = document.getElementById("btnGraphViewPipeline");
    const catBar = document.getElementById("workflowCategoryBar");

    if (mode === "mesh") {
      if (meshView) meshView.style.display = "block";
      if (pipeView) pipeView.style.display = "none";
      if (btnMesh) btnMesh.classList.add("active");
      if (btnPipe) btnPipe.classList.remove("active");
      if (catBar) catBar.style.display = "flex";
      this.renderWorkflowGraph();
    } else {
      if (meshView) meshView.style.display = "none";
      if (pipeView) pipeView.style.display = "grid";
      if (btnMesh) btnMesh.classList.remove("active");
      if (btnPipe) btnPipe.classList.add("active");
      if (catBar) catBar.style.display = "none";
      this.inspectWorkflowStage(1);
    }
  },

  triggerWorkflowPulse() {
    const pulseSequence = [
      { id: "doc_tt", log: "[PULSE 1/6] Ingested physical timetable snap (SNS CSE-3A Matrix)" },
      { id: "ai_ocr", log: "[PULSE 2/6] Multimodal Neural Vision segmented 36 lecture slots (8:45 AM - 4:45 PM)" },
      { id: "sub_dsa", log: "[PULSE 3/6] Context Graph linked CS3502 DSA ➔ Dr. Arun Sundaram (Cabin 304, Available)" },
      { id: "att_ledger", log: "[PULSE 4/6] Attendance Ledger dynamically updated: 50 sessions registered (72.0%)" },
      { id: "att_buffer", log: "[PULSE 5/6] 75% boundary calculated: -3.0% deficit ➔ 6 consecutive classes needed" },
      { id: "act_od", log: "[PULSE 6/6] Autonomous Action: Pre-filled OD Exemption #REQ-737 ready for signature!" }
    ];

    let step = 0;
    const ticker = document.getElementById("workflowTickerText");

    if (this.workflowPulseTimer) clearInterval(this.workflowPulseTimer);

    const runStep = () => {
      if (step >= pulseSequence.length) {
        clearInterval(this.workflowPulseTimer);
        this.workflowPulseTimer = null;
        if (ticker) {
          ticker.textContent = "✦ Flow Pulse Complete: End-to-end operational pipeline executed with zero human chasing.";
        }
        this.showToast("⚡ Operational Workflow Pulse Complete!");
        return;
      }

      const item = pulseSequence[step];
      this.selectWorkflowNode(item.id, false);
      if (ticker) ticker.textContent = item.log;

      if (step > 0) {
        const prevId = pulseSequence[step - 1].id;
        const edgeEl = document.getElementById(`edge_${prevId}_${item.id}`) ||
                       document.querySelector(`[data-source="${prevId}"][data-target="${item.id}"]`);
        if (edgeEl) {
          edgeEl.classList.add("pulse-active");
          setTimeout(() => edgeEl.classList.remove("pulse-active"), 700);
        }
      }

      step++;
    };

    runStep();
    this.workflowPulseTimer = setInterval(runStep, 950);
  },

  inspectWorkflowStage(stageNum) {
    document.querySelectorAll(".workflow-stage-card").forEach(c => c.classList.remove("active"));
    const card = document.getElementById(`stageCard-${stageNum}`);
    if (card) card.classList.add("active");

    const stageData = {
      1: {
        title: "STAGE 1: SCATTERED PHYSICAL & DIGITAL INPUTS",
        seal: "SOURCE CAPTURE",
        desc: "Raw, unstructured physical timetable photos, WhatsApp circular screenshots, PDF curriculum sheets, and faculty cabin door slips. Information is fragmented across platforms, requiring constant manual decoding.",
        telemetry: { inputTypes: "Images, PDFs, Text", segmentation: "Autonomous", humanEffort: "0 Manual Entry", latency: "0ms" },
        formula: "Raw Capture ➔ Table Bounding Box Detection ➔ OCR Preprocessing",
        actionText: "Upload Timetable",
        actionTab: "timetable"
      },
      2: {
        title: "STAGE 2: MULTIMODAL NEURAL UNDERSTANDING",
        seal: "OCR & VISION AI",
        desc: "High-precision vision models process the timetable grid, identifying days, slot intervals (8:45 AM to 4:45 PM), subject acronyms, course codes, and instructor designations with per-slot confidence scores.",
        telemetry: { model: "Multimodal Vision AI", accuracy: "98.4%", verificationFlag: "< 85% Auto-Flag", latency: "1.2s" },
        formula: "f(Image) = { Day_i, TimeWindow_j, Subject_k, Staff_m } with Confidence C_ijk",
        actionText: "Inspect AI Extractor",
        actionTab: "timetable"
      },
      3: {
        title: "STAGE 3: CONNECTED ACADEMIC GRAPH SYNTHESIS",
        seal: "RELATIONAL GRAPH",
        desc: "Eliminates academic silos by connecting every course period to its corresponding professor, office cabin number, and real-time faculty availability window. Turns flat schedules into living campus intelligence.",
        telemetry: { entitiesLinked: "14 Nodes", cabinsMapped: "100%", freeSlotsTracked: "Live", silos: "0 Remaining" },
        formula: "Course ⟷ Instructor ⟷ Cabin ⟷ TimeWindow ⟷ Student Schedule",
        actionText: "Explore Faculty Grid",
        actionTab: "faculty"
      },
      4: {
        title: "STAGE 4: DYNAMIC PERIOD ATTENDANCE LEDGER",
        seal: "PRECISION AUDIT",
        desc: "Converts the extracted schedule into an auditable period-by-period attendance manifest. Automatically computes exact compliance percentages against the 75% institutional policy, calculating consecutive recovery classes or safe bunk buffer hours.",
        telemetry: { mathEngine: "SCE Policy", threshold: "75% Target", bufferClasses: "Live Dynamic", auditTrail: "100% Local" },
        formula: "Consecutive Needed = ⌈(0.75 × Total - Present) / (1 - 0.75)⌉",
        actionText: "View Attendance Ledger",
        actionTab: "attendance"
      },
      5: {
        title: "STAGE 5: AUTONOMOUS ACTION & DISPATCH LAYER",
        seal: "CONNECTED ACTION",
        desc: "When attendance deficits or timetable conflicts arise, CampusFlow Peer generates pre-filled On-Duty petitions, routes drafts to available class advisors, maps turn-by-turn indoor corridor paths, and issues alerts without chasing.",
        telemetry: { oneClickOD: "Pre-filled #REQ-737", wayfinding: "Corridor Turn-by-Turn", telegramAlerts: "Instant", chasingSaved: "3+ Hours/Week" },
        formula: "Context ➔ Recommendation ➔ 1-Click Action Dispatch",
        actionText: "Open Requests Queue",
        actionTab: "requests"
      }
    };

    const d = stageData[stageNum] || stageData[1];
    const sheet = document.getElementById("workflowInspectionDetails");
    if (!sheet) return;

    const telemHtml = Object.entries(d.telemetry).map(([k, v]) => `
      <div style="background:var(--paper-card-subtle); border:1px dashed var(--paper-border-dark); padding:0.6rem 0.8rem; border-radius:var(--radius-tag);">
        <div style="font-family:var(--font-stamp); font-size:0.68rem; text-transform:uppercase; color:var(--ink-muted);">${k}</div>
        <div style="font-family:var(--font-typewriter); font-size:0.85rem; font-weight:700; color:var(--ink-primary); margin-top:2px;">${v}</div>
      </div>
    `).join("");

    sheet.innerHTML = `
      <div class="workflow-inspection-header">
        <div>
          <h3 style="font-family:var(--font-editorial); font-size:1.4rem; font-weight:700; margin:0 0 0.35rem; color:var(--ink-primary);">
            ${d.title}
          </h3>
          <span class="stamp-seal approved">${d.seal}</span>
        </div>
        <div>
          <button class="btn-dossier-sm btn-primary-ink" onclick="App.switchTab('${d.actionTab}')">
            <span>⚡</span> ${d.actionText}
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.6rem; margin-bottom:1.25rem;">
        ${telemHtml}
      </div>

      <div class="dispatch-why-box" style="margin-bottom:1.25rem;">
        <strong>OPERATIONAL PIPELINE DIRECTIVE:</strong> ${d.desc}
      </div>

      <div style="border-top:1px dashed var(--paper-border); padding-top:0.85rem; font-family:var(--font-typewriter); font-size:0.8rem; color:var(--ink-secondary);">
        <strong>ALGORITHMIC PIPELINE MAPPING:</strong> <code>${d.formula}</code>
      </div>
    `;
  },

  // ========================================================================
  // 2. TIMETABLE AI & OPERATIONS SCHEDULE
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
    const slots = GeminiService.generateAutonomousExtraction();
    AppState.setTimetable(slots);
    this.refreshCurrentView();
    this.showToast("⚡ SNS College CSE Timetable Loaded & Connected to Graph!");
  },

  simulateDemoUpload() {
    this.showToast("📸 Ingesting SNS College CSE Timetable Slip...");
    setTimeout(() => {
      this.showToast("🤖 Running Multimodal Period Segmentation (8:45 AM - 4:45 PM)...");
      setTimeout(() => {
        const slots = GeminiService.generateAutonomousExtraction();
        this.extractedPendingSlots = slots;
        this.openVerificationModal(slots);
      }, 700);
    }, 400);
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
      this.refreshCurrentView();
      this.showToast(`✓ Extracted ${this.extractedPendingSlots.length} lecture periods into Attendance Ledger!`);
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
  selectedAttendanceDay: "Wednesday",

  selectAttendanceDay(dayName) {
    this.selectedAttendanceDay = dayName;

    // Update Day Pills
    document.querySelectorAll("#attendanceDayPills .filter-tab-stamp").forEach(btn => {
      if (btn.textContent.toLowerCase().includes(dayName.toLowerCase())) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    this.renderPeriodAttendanceMarker();
  },

  renderAttendanceView() {
    const timetable = AppState.getTimetable();
    const stats = AppState.getAttendanceStats();
    const nillBanner = document.getElementById("attendanceNillBanner");
    const activeSection = document.getElementById("attendanceActiveSection");

    // Strictly NILL state if timetable is empty
    if (timetable.length === 0 || stats.isNill) {
      if (nillBanner) nillBanner.style.display = "block";
      if (activeSection) activeSection.style.display = "none";
      return;
    }

    if (nillBanner) nillBanner.style.display = "none";
    if (activeSection) activeSection.style.display = "block";

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

    // Render period marker & subject breakdown
    this.renderPeriodAttendanceMarker();
    this.renderSubjectAttendanceTable();
  },

  renderPeriodAttendanceMarker() {
    const container = document.getElementById("periodSlotsContainer");
    if (!container) return;

    const timetable = AppState.getTimetable();
    if (timetable.length === 0) {
      container.innerHTML = `<p style="color:var(--ink-muted); font-size:0.82rem; text-align:center; padding:1.5rem;">Awaiting timetable upload...</p>`;
      return;
    }

    const daySlots = timetable
      .filter(s => s.day.toLowerCase() === this.selectedAttendanceDay.toLowerCase())
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

    if (daySlots.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--ink-muted); font-size:0.85rem;">
        No lecture periods extracted for ${this.selectedAttendanceDay}. Select another day above or check your timetable.
      </div>`;
      return;
    }

    const todayDateStr = new Date().toISOString().split("T")[0];

    container.innerHTML = daySlots.map((slot, idx) => {
      const periodNum = slot.periodNum || (idx + 1);
      const status = AppState.getSlotStatus(todayDateStr, slot.id);

      return `
        <div class="period-slot-row">
          <div class="period-label-col">
            PERIOD ${periodNum}
            <span>${slot.startTime} – ${slot.endTime}</span>
          </div>

          <div class="period-details-col">
            <h4>${slot.subject}</h4>
            <p>👤 ${slot.faculty || "Faculty"} • 📍 ${slot.room || "Room 205"}</p>
          </div>

          <div class="period-actions-col">
            <button class="btn-att-toggle present ${status === 'present' ? 'active' : ''}" 
                    onclick="App.toggleSlotAttendance('${todayDateStr}', '${slot.id}', 'present', ${JSON.stringify(slot).replace(/"/g, '&quot;')})">
              <span>✓</span> Present
            </button>
            <button class="btn-att-toggle absent ${status === 'absent' ? 'active' : ''}" 
                    onclick="App.toggleSlotAttendance('${todayDateStr}', '${slot.id}', 'absent', ${JSON.stringify(slot).replace(/"/g, '&quot;')})">
              <span>✗</span> Absent
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  toggleSlotAttendance(dateStr, slotId, status, slotMeta) {
    AppState.markSlotAttendance(dateStr, slotId, status, slotMeta);
    this.renderAttendanceView();
    const stats = AppState.getAttendanceStats();
    this.showToast(`Marked ${slotMeta.subject || 'Class'} as ${status.toUpperCase()} (${stats.percentage}%)`);
  },

  renderSubjectAttendanceTable() {
    const table = document.getElementById("subjectAttendanceTable");
    if (!table) return;

    const stats = AppState.getAttendanceStats();
    if (!stats.subjectBreakdown || stats.subjectBreakdown.length === 0) {
      table.innerHTML = `<tr><td style="text-align:center; padding:1rem; color:var(--ink-muted);">No subject breakdown records extracted yet.</td></tr>`;
      return;
    }

    table.innerHTML = `
      <thead>
        <tr>
          <th>Course Designation</th>
          <th>Attended / Conducted</th>
          <th>Percentage</th>
          <th>Target (75%)</th>
          <th>Status Standing</th>
        </tr>
      </thead>
      <tbody>
        ${stats.subjectBreakdown.map(sub => `
          <tr>
            <td><strong>${sub.subject}</strong></td>
            <td>${sub.present} / ${sub.total} classes</td>
            <td>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="font-family:var(--font-stamp); font-weight:700;">${sub.percentage}%</span>
                <div style="flex:1; height:6px; background:var(--paper-border); border-radius:3px; max-width:100px; overflow:hidden;">
                  <div style="height:100%; width:${Math.min(100, sub.percentage)}%; background:${sub.isCompliant ? 'var(--stamp-green)' : 'var(--stamp-red)'};"></div>
                </div>
              </div>
            </td>
            <td>${stats.targetPercentage}%</td>
            <td>
              <span class="stamp-seal ${sub.isCompliant ? 'approved' : 'action'}">
                ${sub.isCompliant ? 'COMPLIANT' : 'DEFICIT'}
              </span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    `;
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

    grid.innerHTML = (CampusData.subjects || []).map(s => {
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
  // 6. DOCUMENT VAULT
  // ========================================================================
  renderDocumentVault() {
    const grid = document.getElementById("documentVaultGrid");
    if (!grid) return;

    grid.innerHTML = (CampusData.documents || []).map(doc => `
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

    const requests = AppState.getRequests() || [];

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
            ${((req && req.workflow) || []).map(step => `
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

    container.innerHTML = (CampusData.deadlines || []).map(dl => {
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

    const requests = AppState.getRequests() || [];

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
    const fac = (CampusData.faculty || []).find(f => f.id === "fac_arun");
    if (fac) {
      fac.status = status;
      fac.statusLabel = status === "available" ? "Available in Cabin" : (status === "class" ? "In Class" : "In Meeting");
    }
    this.showToast(`Broadcasted new status: ${fac ? fac.statusLabel : status}`);
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

    container.innerHTML = (CampusData.repeatedQueries || []).map(q => `
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
      whyList.innerHTML = ((res && res.why) || []).map(w => `<li>${w}</li>`).join("");
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

// Safe bootstrap: runs immediately if DOM is ready, or on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
} else {
  App.init();
}
