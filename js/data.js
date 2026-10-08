// ==========================================================================
// CAMPUSFLOW PEER — DATA ENGINE & CAMPUS KNOWLEDGE GRAPH
// Team: ZanLeo Warrior (Mohammed Irfaan & Nivedha)
// Hackathon: PS06 – Smart Education | HACKNEXT'26 Series 2.0
// Concept: From Scattered Campus Information to Connected Campus Action
// ==========================================================================

const CampusData = {
  // 1. Current Active Demo User
  currentUser: {
    id: "stu_nivedha",
    name: "Nivedha",
    role: "student", // "student" | "faculty" | "department" | "admin"
    department: "Computer Science & Engineering",
    deptCode: "CSE",
    year: "3rd Year",
    semester: 5,
    section: "A",
    rollNo: "7376231CS204",
    email: "nivedha.cse23@snsct.edu.in",
    avatar: "N",
    cgpa: 8.42,
    creditsCompleted: 68,
    advisor: "Dr. Arun Sundaram"
  },

  // 2. Demo Roles configuration for judge testing
  roles: [
    { id: "student", label: "Student", user: "Nivedha (3rd Year CSE)", icon: "🎓" },
    { id: "faculty", label: "Faculty", user: "Dr. Arun Sundaram (Assoc. Prof)", icon: "👨‍🏫" },
    { id: "department", label: "Department", user: "CSE Dept Office / HOD Desk", icon: "🏛️" },
    { id: "admin", label: "Administrator", user: "Campus Pulse & Dean Office", icon: "📊" }
  ],

  // 3. Campus Faculty Directory (Digitalized Availability Grid)
  faculty: [
    {
      id: "fac_arun",
      name: "Dr. Arun Sundaram",
      designation: "Associate Professor & Class Advisor",
      department: "CSE",
      email: "arun.s@snsct.edu.in",
      cabin: "Room 304, 3rd Floor (Main Academic Block)",
      roomCode: "304",
      block: "Main Academic Block",
      floor: "3rd Floor",
      status: "available", // "available" | "class" | "meeting" | "break"
      statusLabel: "Available in Cabin",
      statusDetails: "Free for project consultations, academic queries & OD endorsements",
      currentWindow: "02:30 PM – 04:15 PM",
      declaredFreeWindows: ["11:30 AM - 12:30 PM", "02:30 PM - 04:15 PM"],
      coursesTaught: ["Database Management Systems", "Cloud Infrastructure"],
      avatarColor: "#00aaff",
      scheduleToday: [
        { period: 1, time: "09:00 - 10:00", status: "class", detail: "DBMS (Room 205)" },
        { period: 2, time: "10:00 - 11:00", status: "class", detail: "Cloud Lab (Lab 3)" },
        { period: 3, time: "11:15 - 12:15", status: "available", detail: "In Cabin (Room 304)" },
        { period: 4, time: "01:00 - 02:00", status: "meeting", detail: "Faculty Council" },
        { period: 5, time: "02:00 - 03:00", status: "available", detail: "In Cabin (Room 304)" },
        { period: 6, time: "03:15 - 04:15", status: "available", detail: "In Cabin (Room 304)" }
      ]
    },
    {
      id: "fac_meena",
      name: "Prof. Meena Krishnan",
      designation: "Assistant Professor (Sr.G)",
      department: "CSE",
      email: "meena.k@snsct.edu.in",
      cabin: "Room 214, 2nd Floor (Main Academic Block)",
      roomCode: "214",
      block: "Main Academic Block",
      floor: "2nd Floor",
      status: "class",
      statusLabel: "In Lecture (Room 205)",
      statusDetails: "Teaching DBMS to CSE 3rd Year Section A",
      currentWindow: "Free at 11:15 AM",
      declaredFreeWindows: ["11:15 AM - 12:30 PM", "03:30 PM - 04:30 PM"],
      coursesTaught: ["Data Structures & Algorithms", "DBMS"],
      avatarColor: "#8b5cf6",
      scheduleToday: [
        { period: 1, time: "09:00 - 10:00", status: "available", detail: "In Cabin (Room 214)" },
        { period: 2, time: "10:00 - 11:00", status: "class", detail: "DBMS (Room 205)" },
        { period: 3, time: "11:15 - 12:15", status: "available", detail: "In Cabin (Room 214)" },
        { period: 4, time: "01:00 - 02:00", status: "class", detail: "DSA (Room 302)" },
        { period: 5, time: "02:00 - 03:00", status: "meeting", detail: "Curriculum Cell" },
        { period: 6, time: "03:15 - 04:15", status: "available", detail: "In Cabin (Room 214)" }
      ]
    },
    {
      id: "fac_karthik",
      name: "Dr. Karthik Narayanan",
      designation: "Professor & Head of Department",
      department: "CSE",
      email: "hod.cse@snsct.edu.in",
      cabin: "HOD Suite 301, 3rd Floor (Main Academic Block)",
      roomCode: "301",
      block: "Main Academic Block",
      floor: "3rd Floor",
      status: "meeting",
      statusLabel: "In Dept Council Meeting",
      statusDetails: "NBA Accreditation & Industry Advisory Board Review",
      currentWindow: "Free at 03:45 PM",
      declaredFreeWindows: ["03:45 PM - 04:45 PM"],
      coursesTaught: ["Compiler Design", "Advanced Algorithms"],
      avatarColor: "#f59e0b",
      scheduleToday: [
        { period: 1, time: "09:00 - 10:00", status: "class", detail: "Compiler Design (Room 401)" },
        { period: 2, time: "10:00 - 11:00", status: "available", detail: "HOD Office" },
        { period: 3, time: "11:15 - 12:15", status: "available", detail: "HOD Office" },
        { period: 4, time: "01:00 - 02:00", status: "meeting", detail: "NBA Review" },
        { period: 5, time: "02:00 - 03:00", status: "meeting", detail: "Academic Council" },
        { period: 6, time: "03:15 - 04:15", status: "available", detail: "HOD Office (Signatures)" }
      ]
    },
    {
      id: "fac_divya",
      name: "Prof. Divya Bharathi",
      designation: "Assistant Professor",
      department: "IT",
      email: "divya.b@snsct.edu.in",
      cabin: "Room 108, 1st Floor (Tech Park Building)",
      roomCode: "108",
      block: "Tech Park Building",
      floor: "1st Floor",
      status: "available",
      statusLabel: "Available in Cabin",
      statusDetails: "Open for network laboratory doubts & viva preparation",
      currentWindow: "10:30 AM – 12:30 PM",
      declaredFreeWindows: ["10:30 AM - 12:30 PM", "02:15 PM - 03:30 PM"],
      coursesTaught: ["Computer Networks", "Cyber Security"],
      avatarColor: "#00ff66",
      scheduleToday: [
        { period: 1, time: "09:00 - 10:00", status: "available", detail: "In Cabin (Room 108)" },
        { period: 2, time: "10:00 - 11:00", status: "available", detail: "In Cabin (Room 108)" },
        { period: 3, time: "11:15 - 12:15", status: "available", detail: "In Cabin (Room 108)" },
        { period: 4, time: "01:00 - 02:00", status: "class", detail: "Networks (Room 102)" },
        { period: 5, time: "02:00 - 03:00", status: "class", detail: "Networks Lab" },
        { period: 6, time: "03:15 - 04:15", status: "break", detail: "Faculty Lounge" }
      ]
    },
    {
      id: "fac_suresh",
      name: "Dr. Suresh Kumar",
      designation: "Professor & AI Research Lead",
      department: "AI & DS",
      email: "suresh.ai@snsct.edu.in",
      cabin: "AI Centre of Excellence, Ground Floor (Innovation Block)",
      roomCode: "AI-10",
      block: "Innovation Block",
      floor: "Ground Floor",
      status: "class",
      statusLabel: "In Lab Evaluation",
      statusDetails: "Conducting Capstone Phase-I Project Reviews",
      currentWindow: "Free at 04:00 PM",
      declaredFreeWindows: ["04:00 PM - 05:00 PM"],
      coursesTaught: ["Machine Learning", "Deep Learning Architectures"],
      avatarColor: "#ec4899",
      scheduleToday: [
        { period: 1, time: "09:00 - 10:00", status: "class", detail: "ML Theory (Room 210)" },
        { period: 2, time: "10:00 - 11:00", status: "class", detail: "ML Theory (Room 210)" },
        { period: 3, time: "11:15 - 12:15", status: "meeting", detail: "Research Grant Sync" },
        { period: 4, time: "01:00 - 02:00", status: "class", detail: "AI Lab Phase-I" },
        { period: 5, time: "02:00 - 03:00", status: "class", detail: "AI Lab Phase-I" },
        { period: 6, time: "03:15 - 04:15", status: "available", detail: "AI Innovation Lab" }
      ]
    }
  ],

  // 4. Subjects & Academic Courses
  subjects: [
    {
      code: "CS3501",
      name: "Database Management Systems",
      short: "DBMS",
      faculty: "Prof. Meena Krishnan",
      credits: 4,
      room: "Room 205",
      type: "Theory + Lab",
      attendance: { attended: 26, conducted: 35, percentage: 74.3 },
      internals: { test1: 18, test1Max: 25, test2: 21, test2Max: 25, assignment: 9, assignMax: 10, quiz: 8, quizMax: 10, total: 56, max: 70 },
      riskStatus: "attention", // "track" | "attention" | "action"
      riskReason: "Attendance (74.3%) is marginally under your 75% target. Cycle Test II is in 3 days."
    },
    {
      code: "CS3502",
      name: "Data Structures & Algorithms",
      short: "DSA",
      faculty: "Dr. Arun Sundaram",
      credits: 4,
      room: "Room 302",
      type: "Theory",
      attendance: { attended: 31, conducted: 36, percentage: 86.1 },
      internals: { test1: 23, test1Max: 25, test2: 24, test2Max: 25, assignment: 10, assignMax: 10, quiz: 9, quizMax: 10, total: 66, max: 70 },
      riskStatus: "track",
      riskReason: "Strong performance. Attendance is 86.1% with comfortable buffer."
    },
    {
      code: "CS3503",
      name: "Operating Systems",
      short: "OS",
      faculty: "Prof. Priya Ramachandran",
      credits: 3,
      room: "Room 401",
      type: "Theory",
      attendance: { attended: 24, conducted: 34, percentage: 70.6 },
      internals: { test1: 16, test1Max: 25, test2: 19, test2Max: 25, assignment: 8, assignMax: 10, quiz: 7, quizMax: 10, total: 50, max: 70 },
      riskStatus: "action",
      riskReason: "Attendance (70.6%) requires 6 consecutive attendances to recover to 75% target."
    },
    {
      code: "CS3504",
      name: "Computer Networks",
      short: "Networks",
      faculty: "Prof. Divya Bharathi",
      credits: 3,
      room: "Room 102",
      type: "Theory + Lab",
      attendance: { attended: 28, conducted: 32, percentage: 87.5 },
      internals: { test1: 22, test1Max: 25, test2: 21, test2Max: 25, assignment: 9, assignMax: 10, quiz: 9, quizMax: 10, total: 61, max: 70 },
      riskStatus: "track",
      riskReason: "Consistent scores and solid attendance buffer."
    },
    {
      code: "MA3354",
      name: "Discrete Mathematics",
      short: "Discrete Maths",
      faculty: "Dr. V. Ramanathan",
      credits: 4,
      room: "Room 208",
      type: "Theory",
      attendance: { attended: 27, conducted: 38, percentage: 71.0 },
      internals: { test1: 14, test1Max: 25, test2: 17, test2Max: 25, assignment: 7, assignMax: 10, quiz: 7, quizMax: 10, total: 45, max: 70 },
      riskStatus: "action",
      riskReason: "Internal 1 was low (14/25) and attendance is 71%. Attend next 5 classes."
    },
    {
      code: "CS3511",
      name: "Cloud & DevOps Lab",
      short: "Cloud Lab",
      faculty: "Dr. Arun Sundaram",
      credits: 2,
      room: "Lab 3 (3rd Floor)",
      type: "Practical Lab",
      attendance: { attended: 12, conducted: 13, percentage: 92.3 },
      internals: { test1: 24, test1Max: 25, test2: 25, test2Max: 25, assignment: 10, assignMax: 10, quiz: 10, quizMax: 10, total: 69, max: 70 },
      riskStatus: "track",
      riskReason: "Top laboratory performance with 92.3% attendance."
    }
  ],

  // 5. Semester History & CGPA
  academicRecord: {
    targetCgpa: 8.80,
    currentCgpa: 8.42,
    totalCredits: 68,
    semesters: [
      { semester: "Semester 1", sgpa: 8.10, credits: 22, status: "Completed" },
      { semester: "Semester 2", sgpa: 8.40, credits: 23, status: "Completed" },
      { semester: "Semester 3", sgpa: 8.75, credits: 23, status: "Completed" },
      { semester: "Semester 4", sgpa: 8.45, credits: 24, status: "In Progress (Current)" }
    ]
  },

  // 6. Connected Today's Campus Timeline (Dynamic Schedule)
  todayTimeline: [
    {
      time: "08:30 AM",
      title: "Campus Arrival & Turnstile Check-in",
      location: "Main Gate • North Entrance",
      category: "arrival",
      isPast: true,
      badge: "Completed"
    },
    {
      time: "09:00 AM",
      title: "Data Structures & Algorithms (CS3502)",
      location: "Room 302 (3rd Floor)",
      faculty: "Dr. Arun Sundaram",
      category: "lecture",
      isPast: true,
      badge: "Attended (Present)"
    },
    {
      time: "10:00 AM",
      title: "Database Management Systems (CS3501)",
      location: "Room 205 (2nd Floor)",
      faculty: "Prof. Meena Krishnan",
      category: "lecture",
      isNow: true,
      startsInMin: 0,
      badge: "Now In Session",
      action: "View Room & Material"
    },
    {
      time: "11:15 AM",
      title: "Computer Networks (CS3504)",
      location: "Room 102 (1st Floor)",
      faculty: "Prof. Divya Bharathi",
      category: "lecture",
      startsInMin: 45,
      badge: "Up Next",
      action: "Check Pre-Read"
    },
    {
      time: "12:30 PM",
      title: "Lunch & Peer Hackathon Sync",
      location: "Central Student Food Court",
      category: "break",
      badge: "Break"
    },
    {
      time: "02:00 PM",
      title: "Operating Systems (CS3503)",
      location: "Room 401 (4th Floor)",
      faculty: "Prof. Priya Ramachandran",
      category: "lecture",
      badge: "Mandatory Session",
      note: "Needed to boost OS attendance to 75%"
    },
    {
      time: "03:15 PM",
      title: "Recommended Consultation: Meet Dr. Arun Sundaram",
      location: "Room 304 (3rd Floor)",
      faculty: "Dr. Arun Sundaram",
      category: "advisory",
      badge: "Optimal Slot",
      why: "Prof. Arun is free in cabin 02:30–04:15 PM with zero conflicts.",
      action: "Plan Visit / OD Signature"
    },
    {
      time: "04:15 PM",
      title: "CSE Department Circular Sync: HACKNEXT'26 Briefing",
      location: "Auditorium Hall B",
      category: "event",
      badge: "Event"
    }
  ],

  // 7. Deadline & Assessment Radar
  deadlines: [
    {
      id: "dl_1",
      title: "DBMS Cycle Test II (Units 3 & 4)",
      subject: "DBMS (CS3501)",
      date: "2026-10-11",
      displayDate: "Friday, 11 Oct",
      time: "10:00 AM",
      urgency: "today", // "today" | "tomorrow" | "week" | "later"
      urgencyLabel: "3 Days Remaining",
      venue: "Exam Hall 3",
      impact: "High Weightage (25 Marks)"
    },
    {
      id: "dl_2",
      title: "Cloud & DevOps Phase-1 YAML Manifest Submission",
      subject: "Cloud Lab (CS3511)",
      date: "2026-10-10",
      displayDate: "Thursday, 10 Oct",
      time: "11:59 PM",
      urgency: "tomorrow",
      urgencyLabel: "Tomorrow Deadline",
      venue: "GitHub Classroom Portal",
      impact: "Lab Internal Component"
    },
    {
      id: "dl_3",
      title: "HACKNEXT'26 Series 2.0 Team Final Registration",
      subject: "Smart Education PS06",
      date: "2026-10-13",
      displayDate: "Sunday, 13 Oct",
      time: "06:00 PM",
      urgency: "week",
      urgencyLabel: "This Weekend",
      venue: "Innovation Hub Portal",
      impact: "Official OD Clearance Required"
    },
    {
      id: "dl_4",
      title: "Discrete Mathematics Tutorial Sheet 4",
      subject: "Discrete Maths (MA3354)",
      date: "2026-10-16",
      displayDate: "Next Wednesday",
      time: "09:00 AM",
      urgency: "later",
      urgencyLabel: "Next Week",
      venue: "Submit to Class Rep",
      impact: "Assignment 10 Marks"
    }
  ],

  // 8. Campus Document Vault
  documents: [
    {
      id: "doc_1",
      name: "Institutional Identity Card",
      type: "Identity",
      issuedBy: "Office of Student Affairs",
      date: "14 Aug 2024",
      status: "verified",
      statusLabel: "Active / Verified",
      fileName: "student_id_nivedha.pdf",
      previewText: "SNS College of Technology • Student ID: 7376231CS204 • Valid 2023-2027",
      isPrivate: true
    },
    {
      id: "doc_2",
      name: "Semester 3 Official Grade Sheet",
      type: "Academic",
      issuedBy: "Controller of Examinations (COE)",
      date: "12 Jan 2026",
      status: "verified",
      statusLabel: "Official COE Verified",
      fileName: "sem3_grade_report.pdf",
      previewText: "SGPA: 8.75 • Credits: 23 • Result: ALL CLEARED (First Class with Distinction)",
      isPrivate: true
    },
    {
      id: "doc_3",
      name: "Bonafide Certificate (Passport / Bank Verification)",
      type: "College",
      issuedBy: "Dean Academic Office",
      date: "04 Sep 2026",
      status: "verified",
      statusLabel: "Digitally Sealed",
      fileName: "bonafide_certificate_demo.pdf",
      previewText: "Certified that Ms. Nivedha is a bonafide student of 3rd Year B.E. Computer Science...",
      isPrivate: true
    },
    {
      id: "doc_4",
      name: "Paper Presentation Winner Certificate (IIT Madras Shaastra)",
      type: "Activities",
      issuedBy: "Shaastra Tech Committee",
      date: "08 Jan 2026",
      status: "verified",
      statusLabel: "Verified Activity",
      fileName: "shaastra_winner_cert.pdf",
      previewText: "First Prize • Edge AI on Autonomous Campus Fleets • Certificate #SH-26-904",
      isPrivate: true
    },
    {
      id: "doc_5",
      name: "HACKNEXT'26 On-Duty (OD) Attendance Exemption Request",
      type: "College",
      issuedBy: "Pending Advisor & HOD Review",
      date: "08 Oct 2026",
      status: "pending",
      statusLabel: "In Workflow (Advisor Sign)",
      fileName: "od_request_hacknext.pdf",
      previewText: "DRAFT / DEMO • Requesting 3 lecture hours OD for Smart Education Hackathon track...",
      isPrivate: true
    }
  ],

  // 9. Routine Approval Requests Queue (OD, Bonafide, Signatures)
  requests: [
    {
      id: "req_od_101",
      type: "On-Duty (OD)",
      title: "HACKNEXT'26 Hackathon Attendance Exemption",
      studentName: "Nivedha",
      studentRoll: "7376231CS204",
      department: "CSE",
      dateSubmitted: "08 Oct 2026, 09:15 AM",
      eventDate: "2026-10-15",
      impactedLectures: "3 Periods (DBMS, OS, Discrete Maths)",
      targetFaculty: "Dr. Arun Sundaram",
      targetFacultyId: "fac_arun",
      status: "under_review", // "submitted" | "under_review" | "approved" | "correction" | "rejected"
      statusLabel: "Awaiting Advisor Endorsement",
      purpose: "Representing SNSCT at HACKNEXT'26 Series 2.0 (PS06 Smart Education). Team: ZanLeo Warrior.",
      workflow: [
        { role: "Student", name: "Nivedha", action: "Submitted Draft", timestamp: "08 Oct 09:15 AM", status: "completed" },
        { role: "Class Advisor", name: "Dr. Arun Sundaram", action: "Pending Review", timestamp: "Active Now", status: "current" },
        { role: "HOD", name: "Dr. Karthik Narayanan", action: "Final Sign-off", timestamp: "Waiting", status: "waiting" },
        { role: "Academic Dean", name: "Dean Office", action: "COE Attendance Sync", timestamp: "Waiting", status: "waiting" }
      ],
      auditTrail: [
        { time: "08 Oct 09:15 AM", text: "Student Nivedha generated OD request with event poster verified." },
        { time: "08 Oct 09:16 AM", text: "Automated conflict check passed: zero exam clashes detected." },
        { time: "08 Oct 09:20 AM", text: "Routed to Class Advisor Dr. Arun Sundaram's queue." }
      ]
    },
    {
      id: "req_bona_102",
      type: "Bonafide Certificate",
      title: "Bonafide Request for Passport Application",
      studentName: "Nivedha",
      studentRoll: "7376231CS204",
      department: "CSE",
      dateSubmitted: "06 Oct 2026, 02:40 PM",
      status: "approved",
      statusLabel: "Approved • Ready for Collection",
      purpose: "Official proof of enrollment for Regional Passport Office.",
      workflow: [
        { role: "Student", name: "Nivedha", action: "Submitted", timestamp: "06 Oct 02:40 PM", status: "completed" },
        { role: "Department Office", name: "CSE Dept Admin", action: "Verified Records", timestamp: "06 Oct 03:15 PM", status: "completed" },
        { role: "HOD", name: "Dr. Karthik Narayanan", action: "Approved", timestamp: "06 Oct 04:30 PM", status: "completed" }
      ],
      auditTrail: [
        { time: "06 Oct 02:40 PM", text: "Form pre-filled via Smart Vault and submitted." },
        { time: "06 Oct 04:30 PM", text: "Approved by Dr. Karthik Narayanan. Official sealed copy ready at Room 301." }
      ]
    }
  ],

  // 10. Campus Location / Light Navigation Graph
  locations: [
    { code: "205", name: "Lecture Hall 205", block: "Main Academic Block", floor: "2nd Floor", directions: "Main Entrance -> Take East Staircase to 2nd Floor -> Turn right -> Second room on left (Opposite Seminar Hall 1)" },
    { code: "304", name: "Faculty Cabin 304 (Dr. Arun Sundaram)", block: "Main Academic Block", floor: "3rd Floor", directions: "Main Entrance -> Take Central Lift to 3rd Floor -> Walk down CSE Faculty Corridor -> Cabin 304 on right" },
    { code: "214", name: "Faculty Cabin 214 (Prof. Meena Krishnan)", block: "Main Academic Block", floor: "2nd Floor", directions: "Take East Staircase to 2nd Floor -> CSE Staff Room A -> Desk 214" },
    { code: "301", name: "HOD Office Suite (Dr. Karthik Narayanan)", block: "Main Academic Block", floor: "3rd Floor", directions: "Directly opposite Central Lift lobby, 3rd Floor CSE Wing" },
    { code: "401", name: "Smart Lecture Hall 401", block: "Main Academic Block", floor: "4th Floor", directions: "Take Lift to 4th Floor -> North Wing Room 401" },
    { code: "Lab 3", name: "Cloud & Systems Computing Lab 3", block: "Tech Park Block", floor: "3rd Floor", directions: "Tech Park Skywalk -> Enter 3rd Floor Lab Suite -> Lab 3 on left" },
    { code: "Auditorium", name: "Sri Meenakshi Auditorium", block: "Central Auditorium Block", floor: "Ground Floor", directions: "Campus Main Quadrangle -> Grand entrance opposite Fountain" }
  ],

  // 11. "Why Are Students Asking This?" Operational Insights (Admin & Dept)
  repeatedQueries: [
    {
      query: "When is the next Cycle Test II timetable coming?",
      count: 48,
      department: "CSE & IT",
      gapIdentified: "Information Gap: Timetable notification scattered in PDF circular.",
      recommendation: "Auto-sync COE exam circular directly into student timeline.",
      status: "Resolved via CampusFlow"
    },
    {
      query: "Where can I find the Bonafide / OD request form?",
      count: 37,
      department: "All Engineering Branches",
      gapIdentified: "Navigation Gap: Students walking to office to collect physical paper slips.",
      recommendation: "Queue-less digital pre-routing via Smart Vault.",
      status: "Live in Prototype"
    },
    {
      query: "Is Dr. Arun Sundaram free for signing project synopsis?",
      count: 29,
      department: "CSE",
      gapIdentified: "Coordination Delay: Students waiting outside faculty cabin during class hours.",
      recommendation: "Digitized Faculty Availability Grid with declared consultation windows.",
      status: "Live in Prototype"
    }
  ],

  // 12. Realistic Preset Weekly Timetable (Monday - Saturday)
  presetTimetable: [
    // Monday
    { id: "slot_mon_1", day: "Monday", startTime: "09:00", endTime: "10:00", subject: "Database Management Systems", faculty: "Prof. Meena Krishnan", room: "Room 205" },
    { id: "slot_mon_2", day: "Monday", startTime: "10:00", endTime: "11:00", subject: "Data Structures & Algorithms", faculty: "Dr. Arun Sundaram", room: "Room 302" },
    { id: "slot_mon_3", day: "Monday", startTime: "11:15", endTime: "12:15", subject: "Operating Systems", faculty: "Prof. Priya Ramachandran", room: "Room 401" },
    { id: "slot_mon_4", day: "Monday", startTime: "01:00", endTime: "02:00", subject: "Discrete Mathematics", faculty: "Dr. V. Ramanathan", room: "Room 208" },
    { id: "slot_mon_5", day: "Monday", startTime: "02:00", endTime: "03:00", subject: "Computer Networks", faculty: "Prof. Divya Bharathi", room: "Room 102" },
    { id: "slot_mon_6", day: "Monday", startTime: "03:15", endTime: "04:15", subject: "Cloud & DevOps Lab", faculty: "Dr. Arun Sundaram", room: "Lab 3" },

    // Tuesday
    { id: "slot_tue_1", day: "Tuesday", startTime: "09:00", endTime: "10:00", subject: "Computer Networks", faculty: "Prof. Divya Bharathi", room: "Room 102" },
    { id: "slot_tue_2", day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "Operating Systems", faculty: "Prof. Priya Ramachandran", room: "Room 401" },
    { id: "slot_tue_3", day: "Tuesday", startTime: "11:15", endTime: "12:15", subject: "Database Management Systems", faculty: "Prof. Meena Krishnan", room: "Room 205" },
    { id: "slot_tue_4", day: "Tuesday", startTime: "01:00", endTime: "02:00", subject: "Data Structures & Algorithms", faculty: "Dr. Arun Sundaram", room: "Room 302" },
    { id: "slot_tue_5", day: "Tuesday", startTime: "02:00", endTime: "04:00", subject: "DBMS Laboratory", faculty: "Prof. Meena Krishnan", room: "Lab 2" },

    // Wednesday (Today)
    { id: "slot_wed_1", day: "Wednesday", startTime: "09:00", endTime: "10:00", subject: "Data Structures & Algorithms", faculty: "Dr. Arun Sundaram", room: "Room 302" },
    { id: "slot_wed_2", day: "Wednesday", startTime: "10:00", endTime: "11:00", subject: "Database Management Systems", faculty: "Prof. Meena Krishnan", room: "Room 205" },
    { id: "slot_wed_3", day: "Wednesday", startTime: "11:15", endTime: "12:15", subject: "Computer Networks", faculty: "Prof. Divya Bharathi", room: "Room 102" },
    { id: "slot_wed_4", day: "Wednesday", startTime: "01:00", endTime: "02:00", subject: "Discrete Mathematics", faculty: "Dr. V. Ramanathan", room: "Room 208" },
    { id: "slot_wed_5", day: "Wednesday", startTime: "02:00", endTime: "03:00", subject: "Operating Systems", faculty: "Prof. Priya Ramachandran", room: "Room 401" },
    { id: "slot_wed_6", day: "Wednesday", startTime: "03:15", endTime: "04:15", subject: "Project Mentorship & OD Review", faculty: "Dr. Arun Sundaram", room: "Room 304" },

    // Thursday
    { id: "slot_thu_1", day: "Thursday", startTime: "09:00", endTime: "10:00", subject: "Operating Systems", faculty: "Prof. Priya Ramachandran", room: "Room 401" },
    { id: "slot_thu_2", day: "Thursday", startTime: "10:00", endTime: "11:00", subject: "Discrete Mathematics", faculty: "Dr. V. Ramanathan", room: "Room 208" },
    { id: "slot_thu_3", day: "Thursday", startTime: "11:15", endTime: "12:15", subject: "Database Management Systems", faculty: "Prof. Meena Krishnan", room: "Room 205" },
    { id: "slot_thu_4", day: "Thursday", startTime: "01:00", endTime: "03:00", subject: "Networks & Security Lab", faculty: "Prof. Divya Bharathi", room: "Lab 1" },
    { id: "slot_thu_5", day: "Thursday", startTime: "03:15", endTime: "04:15", subject: "Library & Self-Study Seminar", faculty: "Dept Faculty", room: "Library" },

    // Friday
    { id: "slot_fri_1", day: "Friday", startTime: "09:00", endTime: "10:00", subject: "Discrete Mathematics", faculty: "Dr. V. Ramanathan", room: "Room 208" },
    { id: "slot_fri_2", day: "Friday", startTime: "10:00", endTime: "11:00", subject: "Data Structures & Algorithms", faculty: "Dr. Arun Sundaram", room: "Room 302" },
    { id: "slot_fri_3", day: "Friday", startTime: "11:15", endTime: "12:15", subject: "Operating Systems", faculty: "Prof. Priya Ramachandran", room: "Room 401" },
    { id: "slot_fri_4", day: "Friday", startTime: "01:00", endTime: "02:00", subject: "Computer Networks", faculty: "Prof. Divya Bharathi", room: "Room 102" },
    { id: "slot_fri_5", day: "Friday", startTime: "02:00", endTime: "04:00", subject: "Cloud & DevOps Lab", faculty: "Dr. Arun Sundaram", room: "Lab 3" },

    // Saturday
    { id: "slot_sat_1", day: "Saturday", startTime: "09:00", endTime: "10:00", subject: "Technical Seminar & Hackathon Sync", faculty: "HOD & Mentors", room: "Auditorium" },
    { id: "slot_sat_2", day: "Saturday", startTime: "10:00", endTime: "12:00", subject: "Industry Elective Workshop", faculty: "Industry Guest", room: "Seminar Hall 2" }
  ]
};

// ==========================================================================
// PERSISTENT STATE MANAGER
// ==========================================================================
const AppState = {
  KEYS: {
    TIMETABLE: "cfp_timetable",
    ATTENDANCE: "cfp_attendance",
    SETTINGS: "cfp_settings",
    REQUESTS: "cfp_requests",
    ROLE: "cfp_active_role",
    DOCUMENTS: "cfp_documents"
  },

  // Role Management
  getActiveRole() {
    return localStorage.getItem(this.KEYS.ROLE) || "student";
  },

  setActiveRole(role) {
    localStorage.setItem(this.KEYS.ROLE, role);
    this.notifyUpdate("role");
  },

  // Timetable
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

  loadPresetTimetable() {
    this.setTimetable([...CampusData.presetTimetable]);
    return CampusData.presetTimetable;
  },

  clearTimetable() {
    this.setTimetable([]);
  },

  addTimetableEntry(entry) {
    const list = this.getTimetable();
    const newEntry = {
      id: "slot_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      subject: (entry.subject || "Academic Lecture").trim(),
      faculty: entry.faculty || "Faculty Advisor",
      room: entry.room || "Room 205",
      day: entry.day || "Monday",
      startTime: entry.startTime || "09:00",
      endTime: entry.endTime || "10:00"
    };
    list.push(newEntry);
    this.setTimetable(list);
    return newEntry;
  },

  removeTimetableEntry(id) {
    const list = this.getTimetable().filter(i => i.id !== id);
    this.setTimetable(list);
  },

  // Attendance
  getAttendance() {
    try {
      const data = localStorage.getItem(this.KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : this.getSeedAttendance();
    } catch (e) {
      return this.getSeedAttendance();
    }
  },

  setAttendance(list) {
    localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(list || []));
    this.notifyUpdate("attendance");
  },

  getSeedAttendance() {
    // Generates a realistic 50-class seed history (36 attended, 14 missed = 72%)
    const seed = [];
    const baseDate = new Date();
    for (let i = 25; i >= 1; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      // 2 periods per day
      seed.push({ id: `att_${i}_1`, date: dateStr, slot: "P1", status: i % 4 === 0 ? "absent" : "present" });
      seed.push({ id: `att_${i}_2`, date: dateStr, slot: "P2", status: i % 5 === 0 ? "absent" : "present" });
    }
    return seed;
  },

  markAttendance(dateStr, slotId, status) {
    const list = this.getAttendance();
    const idx = list.findIndex(item => item.date === dateStr && item.slot === slotId);
    if (idx > -1) {
      if (list[idx].status === status) {
        list.splice(idx, 1); // toggle off
      } else {
        list[idx].status = status;
      }
    } else {
      list.push({ id: "att_" + Date.now(), date: dateStr, slot: slotId, status: status });
    }
    this.setAttendance(list);
  },

  getAttendanceStats() {
    const records = this.getAttendance();
    const settings = this.getSettings();
    const targetPct = settings.targetPercentage || 75;

    const present = records.filter(r => r.status === "present").length;
    const absent = records.filter(r => r.status === "absent").length;
    const total = present + absent;
    const percentage = total === 0 ? 72.0 : (present / total) * 100;

    const p = targetPct / 100;
    let requiredConsecutive = 0;
    if (percentage < targetPct && total > 0) {
      requiredConsecutive = Math.max(0, Math.ceil((p * total - present) / (1 - p)));
    }

    let safeBuffer = 0;
    if (percentage >= targetPct && total > 0) {
      safeBuffer = Math.max(0, Math.floor((present - p * total) / p));
    }

    return {
      total,
      present,
      absent,
      percentage: Number(percentage.toFixed(1)),
      targetPercentage: targetPct,
      requiredConsecutive,
      safeBuffer
    };
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      studentName: "Nivedha",
      rollNo: "7376231CS204",
      department: "CSE",
      targetPercentage: 75,
      targetCgpa: 8.80
    };
  },

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyUpdate("settings");
    return updated;
  },

  // Requests
  getRequests() {
    try {
      const data = localStorage.getItem(this.KEYS.REQUESTS);
      return data ? JSON.parse(data) : CampusData.requests;
    } catch (e) {
      return CampusData.requests;
    }
  },

  addRequest(req) {
    const list = this.getRequests();
    const newReq = {
      id: "req_" + Date.now(),
      status: "under_review",
      statusLabel: "Awaiting Advisor Endorsement",
      dateSubmitted: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      workflow: [
        { role: "Student", name: req.studentName || "Nivedha", action: "Submitted Draft", timestamp: "Just now", status: "completed" },
        { role: "Class Advisor", name: req.targetFaculty || "Dr. Arun Sundaram", action: "Pending Review", timestamp: "Active Now", status: "current" },
        { role: "HOD", name: "Dr. Karthik Narayanan", action: "Final Sign-off", timestamp: "Waiting", status: "waiting" }
      ],
      auditTrail: [
        { time: "Just now", text: `Submitted request: ${req.title} for review.` }
      ],
      ...req
    };
    list.unshift(newReq);
    localStorage.setItem(this.KEYS.REQUESTS, JSON.stringify(list));
    this.notifyUpdate("requests");
    return newReq;
  },

  updateRequestStatus(reqId, newStatus, actorName = "Dr. Arun Sundaram", reason = "") {
    const list = this.getRequests();
    const item = list.find(r => r.id === reqId);
    if (item) {
      item.status = newStatus;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (newStatus === "approved") {
        item.statusLabel = "Approved • Sealed Digitally";
        item.auditTrail.push({ time: nowStr, text: `Approved by ${actorName}.` });
        item.workflow.forEach(w => w.status = "completed");
      } else if (newStatus === "correction") {
        item.statusLabel = "Correction Requested";
        item.auditTrail.push({ time: nowStr, text: `Correction requested by ${actorName}: ${reason || "Update impacted hours"}` });
      } else if (newStatus === "rejected") {
        item.statusLabel = "Declined";
        item.auditTrail.push({ time: nowStr, text: `Declined by ${actorName}: ${reason || "Schedule conflict"}` });
      }
      localStorage.setItem(this.KEYS.REQUESTS, JSON.stringify(list));
      this.notifyUpdate("requests");
    }
  },

  // Reset Everything to fresh prototype state
  resetAll() {
    localStorage.clear();
    this.notifyUpdate("reset");
  },

  // Pub/Sub
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

window.CampusData = CampusData;
window.AppState = AppState;
