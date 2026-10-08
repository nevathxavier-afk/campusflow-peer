// ==========================================================================
// FEATURE 7: INTERACTIVE CONNECTED WORKFLOW VISUALIZER (CANVAS HUD)
// Inspired by Paperino Node Graph & LastbencherOS Cyber HUD
// ==========================================================================

const WorkflowGraph = {
  canvas: null,
  ctx: null,
  nodes: [],
  edges: [],
  hoveredNode: null,
  draggingNode: null,
  dragOffset: { x: 0, y: 0 },
  animationId: null,

  init() {
    this.canvas = document.getElementById('workflowCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupDataNodes();
    this.setupInteractions();

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animate();
  },

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  },

  setupDataNodes() {
    const w = this.canvas.parentElement.clientWidth || 900;
    const h = this.canvas.parentElement.clientHeight || 380;

    // Build connected semantic graph
    this.nodes = [
      {
        id: "node_tt",
        label: "Timetable: 19CS501",
        sub: "DBMS (10:00 AM)",
        category: "timetable",
        x: w * 0.18,
        y: h * 0.35,
        color: "#8b5cf6",
        radius: 42
      },
      {
        id: "node_fac",
        label: "Dr. Arun Sundaram",
        sub: "Status: 🟢 Available",
        category: "faculty",
        x: w * 0.45,
        y: h * 0.28,
        color: "#00f59b",
        radius: 48
      },
      {
        id: "node_cabin",
        label: "Cabin Room 304",
        sub: "Main Block, 3rd Floor",
        category: "location",
        x: w * 0.72,
        y: h * 0.22,
        color: "#00d2ff",
        radius: 40
      },
      {
        id: "node_sig",
        label: "OD Approval Flow",
        sub: "Token: CFP-OD-904",
        category: "signature",
        x: w * 0.76,
        y: h * 0.65,
        color: "#facc15",
        radius: 44
      },
      {
        id: "node_evt",
        label: "HACKNEXT'26 2.0",
        sub: "Oct 15 (Smart Ed PS06)",
        category: "event",
        x: w * 0.48,
        y: h * 0.78,
        color: "#ff3366",
        radius: 46
      },
      {
        id: "node_att",
        label: "Attendance: 73.8%",
        sub: "Attend +2 Classes",
        category: "attendance",
        x: w * 0.20,
        y: h * 0.72,
        color: "#38bdf8",
        radius: 42
      }
    ];

    // Edges linking related entities
    this.edges = [
      { from: "node_tt", to: "node_fac", label: "Teaches" },
      { from: "node_fac", to: "node_cabin", label: "Present In" },
      { from: "node_fac", to: "node_sig", label: "Reviews & Signs" },
      { from: "node_evt", to: "node_sig", label: "Requires OD" },
      { from: "node_evt", to: "node_tt", label: "⚠️ Class Conflict" },
      { from: "node_tt", to: "node_att", label: "Attendance Impact" }
    ];
  },

  setupInteractions() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.draggingNode) {
        this.draggingNode.x = mouseX - this.dragOffset.x;
        this.draggingNode.y = mouseY - this.dragOffset.y;
        return;
      }

      this.hoveredNode = null;
      for (let n of this.nodes) {
        const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (dist <= n.radius) {
          this.hoveredNode = n;
          this.canvas.style.cursor = 'pointer';
          break;
        }
      }
      if (!this.hoveredNode) {
        this.canvas.style.cursor = 'grab';
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (let n of this.nodes) {
        const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (dist <= n.radius) {
          this.draggingNode = n;
          this.dragOffset = { x: mouseX - n.x, y: mouseY - n.y };
          this.canvas.style.cursor = 'grabbing';
          break;
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.draggingNode) {
        this.draggingNode = null;
        this.canvas.style.cursor = 'grab';
      }
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredNode) {
        this.handleNodeClick(this.hoveredNode);
      }
    });
  },

  handleNodeClick(node) {
    if (node.category === 'timetable') App.switchTab('timetable');
    else if (node.category === 'faculty' || node.category === 'location') App.switchTab('faculty');
    else if (node.category === 'signature') App.switchTab('signatures');
    else if (node.category === 'event') App.switchTab('events');
    else if (node.category === 'attendance') App.switchTab('attendance');

    App.showToast(`Navigated to active workflow for ${node.label}`, 'info');
  },

  animate() {
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  draw() {
    const w = this.canvas.parentElement.clientWidth;
    const h = this.canvas.parentElement.clientHeight;
    this.ctx.clearRect(0, 0, w, h);

    const now = Date.now() / 1000;

    // Draw Edges
    this.edges.forEach(edge => {
      const src = this.nodes.find(n => n.id === edge.from);
      const dst = this.nodes.find(n => n.id === edge.to);
      if (!src || !dst) return;

      const isConflict = edge.label.includes('Conflict');

      this.ctx.beginPath();
      this.ctx.moveTo(src.x, src.y);
      this.ctx.lineTo(dst.x, dst.y);
      this.ctx.strokeStyle = isConflict ? 'rgba(255, 51, 102, 0.5)' : 'rgba(139, 92, 246, 0.25)';
      this.ctx.lineWidth = isConflict ? 2.5 : 1.5;
      if (isConflict) this.ctx.setLineDash([6, 4]);
      else this.ctx.setLineDash([]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Flowing particle effect
      const t = (now * 0.6) % 1;
      const px = src.x + (dst.x - src.x) * t;
      const py = src.y + (dst.y - src.y) * t;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      this.ctx.fillStyle = isConflict ? '#ff3366' : '#00d2ff';
      this.ctx.shadowColor = isConflict ? '#ff3366' : '#00d2ff';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Edge Label
      const midX = (src.x + dst.x) / 2;
      const midY = (src.y + dst.y) / 2;
      this.ctx.font = '10px JetBrains Mono, monospace';
      this.ctx.fillStyle = isConflict ? '#fca5a5' : '#94a3b8';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(edge.label, midX, midY - 6);
    });

    // Draw Nodes
    this.nodes.forEach(node => {
      const isHovered = this.hoveredNode === node;
      const rad = isHovered ? node.radius + 4 : node.radius;

      // Outer Glow
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, rad + 6, 0, Math.PI * 2);
      this.ctx.fillStyle = `${node.color}15`;
      this.ctx.fill();

      // Node Body
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, rad, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0f132a';
      this.ctx.fill();
      this.ctx.strokeStyle = isHovered ? '#ffffff' : node.color;
      this.ctx.lineWidth = isHovered ? 2.5 : 1.8;
      this.ctx.shadowColor = node.color;
      this.ctx.shadowBlur = isHovered ? 20 : 10;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Node Label
      this.ctx.font = '600 11px Outfit, sans-serif';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x, node.y - 2);

      // Subtitle
      this.ctx.font = '9px JetBrains Mono, monospace';
      this.ctx.fillStyle = node.color;
      this.ctx.fillText(node.sub, node.x, node.y + 13);
    });
  }
};

window.WorkflowGraph = WorkflowGraph;
