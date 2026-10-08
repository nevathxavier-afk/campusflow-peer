// ==========================================================================
// CAMPUSFLOW PEER — DATA ENGINE & PERSISTENCE LAYER
// Exact LastbencherOS Architecture + Connected Campus Knowledge Graph
// Zero Preloaded Timetables — 100% Dynamic User & AI Directives
// ==========================================================================

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AppState = {
  // Storage Keys matching LastbencherOS for full ecosystem parity
  KEYS: {
    TIMETABLE: "lastbencher_timetable",
    ATTENDANCE: "lastbencher_attendance",
    SATURDAY_OVERRIDES: "lastbencher_saturday_overrides",
    SETTINGS: "lastbencher_settings"
  },

  // 1. Timetable: Initialized clean and EMPTY (zero preload)
  getTimetable() {
    try {
      const data = localStorage.getItem(this.KEYS.TIMETABLE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  setTimetable(list) {
    localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(list || []));
    this.notifyUpdate("timetable");
  },

  addTimetableEntry(entry) {
    const list = this.getTimetable();
    const newEntry = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : ('slot_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
      subject: (entry.subject || "Academic Session").trim(),
      day: entry.day || "Monday",
      startTime: entry.startTime || "09:00",
      endTime: entry.endTime || "10:00"
    };
    list.push(newEntry);
    this.setTimetable(list);
    return newEntry;
  },

  removeTimetableEntry(id) {
    const list = this.getTimetable().filter(item => item.id !== id);
    this.setTimetable(list);
  },

  clearTimetable() {
    this.setTimetable([]);
  },

  // 2. Attendance Records: Initialized clean and EMPTY
  getAttendance() {
    try {
      const data = localStorage.getItem(this.KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  setAttendance(list) {
    localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(list || []));
    this.notifyUpdate("attendance");
  },

  markAttendance(slotId, dateStr, status) {
    const list = this.getAttendance();
    const index = list.findIndex(item => item.date === dateStr && item.slotId === slotId);

    if (index > -1) {
      if (list[index].status === status) {
        // Toggle off if clicked again
        list.splice(index, 1);
      } else {
        list[index].status = status;
      }
    } else {
      list.push({ date: dateStr, slotId: slotId, status: status });
    }

    this.setAttendance(list);
  },

  getSlotStatus(slotId, dateStr) {
    const list = this.getAttendance();
    const found = list.find(item => item.date === dateStr && item.slotId === slotId);
    return found ? found.status : null; // "present" | "absent" | null
  },

  // 3. Saturday Overrides (Phase Configuration)
  getSaturdayOverrides() {
    try {
      const data = localStorage.getItem(this.KEYS.SATURDAY_OVERRIDES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  setSaturdayOverride(dateStr, followDay) {
    let list = this.getSaturdayOverrides().filter(item => item.date !== dateStr);
    if (followDay !== "Default") {
      list.push({ date: dateStr, followDay: followDay });
    }
    localStorage.setItem(this.KEYS.SATURDAY_OVERRIDES, JSON.stringify(list));
    this.notifyUpdate("overrides");
  },

  getSaturdayFollowDay(dateStr) {
    const list = this.getSaturdayOverrides();
    const found = list.find(item => item.date === dateStr);
    return found ? found.followDay : "Default";
  },

  // 4. Settings (Identity & Customizable Attendance Target)
  getSettings() {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      name: "Mohammed Irfaan",
      targetPercentage: 78
    };
  },

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyUpdate("settings");
    return updated;
  },

  // 5. Exact Attendance Math Engine from LastbencherOS (`sce` formula)
  getAttendanceStats(filter = "all") {
    const attendance = this.getAttendance();
    const settings = this.getSettings();
    const targetPct = settings.targetPercentage || 78;

    const now = new Date();
    const filtered = attendance.filter(item => {
      if (filter === "all") return true;
      const d = new Date(item.date);
      if (filter === "day") {
        return d.toDateString() === now.toDateString();
      }
      if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo && d <= now;
      }
      if (filter === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const present = filtered.filter(i => i.status === "present").length;
    const absent = filtered.filter(i => i.status === "absent").length;
    const total = present + absent;
    const percentage = total === 0 ? 0 : (present / total) * 100;

    const p = targetPct / 100;
    let required = 0;
    if (percentage < targetPct && total > 0) {
      // Required consecutive attendances to recover to target
      required = Math.max(0, Math.ceil((p * total - present) / (1 - p)));
    }

    let canBunk = 0;
    if (percentage >= targetPct && total > 0) {
      // Max sessions safe to defer while staying at/above target
      canBunk = Math.max(0, Math.floor((present - p * total) / p));
    }

    return {
      totalClasses: total,
      presentCount: present,
      absentCount: absent,
      percentage: percentage,
      requiredToReachTarget: required,
      canBunk: canBunk,
      targetPercentage: targetPct
    };
  },

  // 6. Reset / Wipe Local Node Data
  resetAllData() {
    localStorage.removeItem(this.KEYS.TIMETABLE);
    localStorage.removeItem(this.KEYS.ATTENDANCE);
    localStorage.removeItem(this.KEYS.SATURDAY_OVERRIDES);
    localStorage.removeItem(this.KEYS.SETTINGS);
    this.notifyUpdate("reset");
  },

  // Event dispatching for real-time reactivity
  subscribers: [],
  subscribe(fn) {
    this.subscribers.push(fn);
  },
  notifyUpdate(type) {
    this.subscribers.forEach(fn => {
      try { fn(type); } catch (e) { console.error(e); }
    });
  }
};

// Campus Knowledge Graph Entities (Faculty, Routine Approvals & Circulars)
const CampusData = {
  faculty: [
    {
      id: "fac_arun",
      name: "Dr. Arun Sundaram",
      designation: "Associate Professor & Class Advisor",
      department: "CSE",
      cabin: "Room 304, 3rd Floor (Main Block)",
      status: "free",
      statusLabel: "Available in Cabin",
      statusNote: "Working on project reviews",
      freeTimeSlots: ["11:30 AM - 12:30 PM", "03:00 PM - 04:15 PM"],
      coursesTaught: ["Database Systems", "Cloud Computing"]
    },
    {
      id: "fac_priya",
      name: "Prof. Priya Ramachandran",
      designation: "Assistant Professor (Sr.G)",
      department: "CSE",
      cabin: "Room 214, 2nd Floor (Main Block)",
      status: "class",
      statusLabel: "In Class (Room 205)",
      statusNote: "Teaching Operating Systems",
      freeTimeSlots: ["01:45 PM - 02:45 PM", "04:00 PM - 04:45 PM"],
      coursesTaught: ["Operating Systems"]
    },
    {
      id: "fac_karthik",
      name: "Dr. Karthik Narayanan",
      designation: "HOD & Professor",
      department: "CSE",
      cabin: "HOD Cabin, 3rd Floor (Main Block)",
      status: "meeting",
      statusLabel: "In Dept Meeting",
      statusNote: "NBA Accreditation Review",
      freeTimeSlots: ["03:30 PM - 04:30 PM"],
      coursesTaught: ["Compiler Design"]
    },
    {
      id: "fac_divya",
      name: "Prof. Divya Bharathi",
      designation: "Assistant Professor",
      department: "IT",
      cabin: "Room 108, 1st Floor (Tech Park)",
      status: "free",
      statusLabel: "Available in Cabin",
      statusNote: "Student doubt clearing",
      freeTimeSlots: ["10:30 AM - 11:30 AM", "02:15 PM - 03:15 PM"],
      coursesTaught: ["Computer Networks"]
    },
    {
      id: "fac_suresh",
      name: "Dr. Suresh Kumar",
      designation: "Professor (AI & ML Lab)",
      department: "AI & DS",
      cabin: "AI Centre of Excellence, Ground Floor",
      status: "busy",
      statusLabel: "In Lab Evaluation",
      statusNote: "Final Year Capstone Phase-I",
      freeTimeSlots: ["04:15 PM - 05:00 PM"],
      coursesTaught: ["Machine Learning"]
    }
  ],

  events: [
    {
      id: "evt_1",
      title: "HACKNEXT'26 Series 2.0 (Smart Education PS06)",
      type: "Hackathon",
      organizer: "SNS College of Technology - Autonomous",
      date: "2026-10-15",
      time: "09:00 AM - 05:00 PM",
      venue: "Main Auditorium & Innovation Hub",
      requiresOD: true,
      hasConflict: true,
      conflictDetails: "Auto-OD route available to safeguard attendance."
    },
    {
      id: "evt_2",
      title: "Cycle Test II — CSE 3rd Year Timetable",
      type: "Official Exam",
      organizer: "Controller of Examinations (COE)",
      date: "2026-10-21",
      time: "10:00 AM - 11:30 AM",
      venue: "Allocated Exam Halls",
      requiresOD: false,
      hasConflict: false,
      conflictDetails: null
    }
  ],

  requests: [
    {
      id: "req_od_1",
      type: "On-Duty (OD)",
      title: "HACKNEXT'26 Hackathon Attendance Exemption",
      eventDate: "2026-10-15",
      impactedSessions: "3 Lecture Hours",
      status: "pending_advisor",
      statusLabel: "Awaiting Advisor Signature",
      steps: [
        { role: "Class Advisor", name: "Dr. Arun Sundaram", status: "pending", time: null },
        { role: "HOD", name: "Dr. Karthik Narayanan", status: "waiting", time: null },
        { role: "Academic Dean", name: "Dr. R. Venkat", status: "waiting", time: null }
      ]
    }
  ]
};

window.DAYS_OF_WEEK = DAYS_OF_WEEK;
window.AppState = AppState;
window.CampusData = CampusData;
