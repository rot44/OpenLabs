# Member 2 (Friend): Overpowered Frontend & UI/UX Master Plan

**Official Role:** Frontend Architecture, UI/UX Design System & Judge Experience Lead  
**Target Submission Score:** 100/100 Points on Official Judging Rubric  
**Stack:** React 19, Vite, Tailwind CSS, Lucide React, Framer Motion / View Transitions  
**Active Skills Arsenal:** `frontend-design`, `web-design-guidelines`, `vercel-composition-patterns`, `vercel-react-best-practices`, `vercel-react-view-transitions`, `a11y-debugging`

---

## 1. Executive Mission & Frontend Architecture

As **Member 2**, you are the public face of OpenLabs. When judges open the URL, **your design is what wins the hackathon within the first 30 seconds**. You are responsible for:

1. **The Linear / Vercel Dark-Zinc Engineering Aesthetic:** A modern, high-trust interface (`#09090b` canvas, `#10b981` emerald accents, `#06b6d4` cyan precision nodes, zero layout shift).
2. **The 1-Click Judge Experience Bar (The Hackathon Secret Weapon):** An anchored top bar allowing evaluators to switch between **Alex Chen (Student)**, **Dr. Elena Vance (Lab Owner)**, and **Marcus Thorne (Safety Admin)** in 1 click without logging in or refreshing.
3. **The Complete 10-Step Operational Journey in the UI:**
   - Catalog Discovery $\rightarrow$ 7-Day Calendar $\rightarrow$ Safety Cert Upload $\rightarrow$ Manager Approval $\rightarrow$ QR Check-in with Baseline Photos $\rightarrow$ Return with Photo Inspection $\rightarrow$ Side-by-Side Damage Diff Slider $\rightarrow$ Audit History.
4. **Interactive Multimodal Visual Diff Component:** A side-by-side comparison slider highlighting damage coordinates $[ymin, xmin, ymax, xmax]$ detected by VisionGuard AI.
5. **Parallel Development Independence:** You have a built-in mock state layer so you can build all 10 screens immediately, even while Member 1 is setting up the database.

---

## 2. Frontend Component Hierarchy Tree

```
App.jsx (Root)
├── JudgeBar.jsx (Persistent Top Bar: Persona Switcher + 1-Click Tour Button)
├── NavigationHeader.jsx (OpenLabs Logo, Nav Tabs, Active Role Badge)
└── Main Content Container
    ├── [Tab 1: Explore & Book]
    │   ├── ResourceCatalog.jsx (Search Bar, Category Chips, Quota Meters)
    │   ├── ResourceCard.jsx (Status Badge, Equipment Specs, Training Tag)
    │   ├── ResourceDetailModal.jsx (Deep Technical Specs, Location Map)
    │   ├── AvailabilityCalendar.jsx (7-Day Interactive Slot Grid)
    │   └── BookingModal.jsx (Purpose, Drag-and-Drop Cert Upload, TrustScan Badge)
    │
    ├── [Tab 2: My Custody & Bookings]
    │   ├── MyBookingsList.jsx (Active, Pending & Past Reservations)
    │   ├── CheckInModal.jsx (Animated QR Scanner, 2 Baseline Photos, 4 Checklist Toggles)
    │   └── ReturnAndInspectModal.jsx (Post-Use Photos, Condition Diff Slider, Incident Toggle)
    │
    ├── [Tab 3: Lab Manager Dashboard] (Dr. Elena Vance)
    │   ├── PendingApprovalsTable.jsx (Requester Avatar, Purpose, TrustScan Cert Inspection)
    │   ├── ActiveCustodyTracker.jsx (Machinery in Use, Live Countdown Timer)
    │   └── IncidentReviewDrawer.jsx (Visual Damage Diff, 1-Click Waive / Charge Actions)
    │
    └── [Tab 4: Audit History & Fairness Ledger] (Marcus Thorne)
        ├── AuditTimeline.jsx (Chronological Event Chain with SHA-256 Hashes)
        └── DepartmentalParityChart.jsx (30-Day Hours Bar Chart with 40% Parity Ceiling)
```

---

## 3. The 10 Granular Micro-Parts & Overpowered Prompts

Execute these prompts sequentially. Each prompt contains embedded skills, component blueprints, and verification rules.

---

### Part 2.1: Vite Setup, Tailwind Dark-Zinc Tokens & OpenLabs Logo
* **Target Directory:** `OpenLabs/frontend/`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines]
Context: OpenLabs Frontend (React 19 + Vite + Tailwind CSS + Lucide React).
Task:
1. In OpenLabs/frontend/, initialize Vite React with Tailwind CSS and Lucide React.
2. In tailwind.config.js, configure the institutional dark-zinc theme tokens:
   - colors.canvas: "#09090b" (Zinc 950)
   - colors.surface: "#18181b" (Zinc 900)
   - colors.border: "#27272a" (Zinc 800)
   - colors.primary: "#10b981" (Emerald 500)
   - colors.accent: "#06b6d4" (Cyan 500)
   - Statuses: approved (#10b981), waitlisted (#f59e0b), checked_in (#3b82f6), disputed (#ef4444)
3. Create src/components/common/OpenLabsLogo.jsx:
   - Renders the unlocked geometric aperture with the central lab node SVG.
   - Includes "OpenLabs AI" wordmark with emerald "AI" pill tag.
4. Set index.html title to "OpenLabs AI — Institutional Resource & Equipment Sharing".
Proof of Work: Run `npm run dev`, open http://localhost:5173, and verify the dark-zinc canvas renders with zero layout shift.
```

---

### Part 2.2: Persistent 1-Click Judge Experience Switcher Bar
* **Target File:** `OpenLabs/frontend/src/components/common/JudgeBar.jsx`
* **Skills Tag:** `[Skills: frontend-design, vercel-composition-patterns, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, vercel-composition-patterns, web-design-guidelines]
Context: Top-level evaluator control bar for CodeHack judges.
Task:
In src/components/common/JudgeBar.jsx:
1. Create a persistent banner anchored at the very top of the viewport (z-50):
   - Left: OpenLabs Logo + "CodeHack Evaluator Mode" pulse badge.
   - Center: 3 Segmented Persona Buttons:
     - 🎓 "Alex Chen (Student / Requester)"
     - 🔬 "Dr. Elena Vance (Lab Director / Owner)"
     - 🛡️ "Marcus Thorne (Campus Safety Admin)"
   - Right: "⚡ Run 1-Click Guided Tour" button with glowing emerald border.
2. Active persona displays an illuminated border ring and active badge.
3. Clicking any persona instantly switches the application state and adjusts navigation tabs without page reload.
Proof of Work: Click between the 3 personas and verify the active state pill animates smoothly.
```

---

### Part 2.3: Mock State Store & API Handshake Adapter
* **Target File:** `OpenLabs/frontend/src/context/AppContext.jsx`
* **Skills Tag:** `[Skills: vercel-composition-patterns, vercel-react-best-practices]`

#### The Prompt:
```text
[Skills: vercel-composition-patterns, vercel-react-best-practices]
Context: Zero-dependency state management for parallel frontend development.
Task:
In src/context/AppContext.jsx:
1. Build AppContext & useApp hook containing:
   - activePersona: Default Alex Chen ({ id, name, role, department, avatar, reputationScore: 0.94, weeklyHoursUsed: 6, safetyCertificates })
   - resources: 6 seeded flagship machines (Haas CNC, Nikon Microscope, Form 3L 3D Printer, RED 8K Camera, Cleanroom Bench, RF Spectrum Analyzer).
   - bookings: Sample approved booking for Haas CNC Mill.
   - auditLogs: Seeded chronological logs.
2. Implement actions:
   - switchPersona(role)
   - submitBookingRequest(data)
   - approveBooking(id, note)
   - checkInBooking(id, checkInData)
   - returnBooking(id, returnData)
   - completeBooking(id, note)
3. Set up fetch calls to backend (/api/v1/*) with automatic fallback to local mock state if backend is offline.
Proof of Work: Confirm calling switchPersona('owner') updates persona state across the entire app.
```

---

### Part 2.4: Resource Catalog Explorer & Smart Filter Hub
* **Target File:** `OpenLabs/frontend/src/components/catalog/ResourceCatalog.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines, vercel-react-best-practices]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines, vercel-react-best-practices]
Context: The discovery hub where researchers find equipment.
Task:
In src/components/catalog/ResourceCatalog.jsx:
1. Search Bar with natural language intent chips ("Biohood with Centrifuge", "High-Speed Aluminum CNC", "8K Raw Camera").
2. Category Filter Bar: All, Machinery, Lab Spaces, Prototyping, Media, Testing/RF.
3. ResourceCard.jsx:
   - High-resolution equipment photo with hover zoom transition.
   - Status badge ("Available" in emerald, "In Use" in amber).
   - Location tag: e.g. "Engineering High Bay, Shop 104".
   - Required Qualification Pill: "Requires Haas CNC Safety Level 2".
   - Fair-Usage Quota Meter: Progress bar showing "6/10 hrs used this week".
   - Hourly rate or Free badge.
   - "Request Access" action button.
Proof of Work: Filter by "Machinery" and assert only CNC and 3D printing equipment cards are visible.
```

---

### Part 2.5: Equipment Detail View & 7-Day Slot Availability Calendar
* **Target File:** `OpenLabs/frontend/src/components/catalog/ResourceDetailModal.jsx`
* **Skills Tag:** `[Skills: frontend-design, vercel-react-view-transitions]`

#### The Prompt:
```text
[Skills: frontend-design, vercel-react-view-transitions]
Context: Modal displaying technical specifications and time slot reservations.
Task:
In src/components/catalog/ResourceDetailModal.jsx:
1. Technical Specs Grid: Spindle RPM, work envelope, laser wavelength, build volume.
2. Interactive 7-Day Calendar Grid:
   - Displays days (Mon-Sun) and hours (08:00 to 20:00).
   - Color coding: Green = Available, Slate = In Use, Amber = 30-min Maintenance/Turnaround Buffer.
3. Clicking a slot selects start/end time, calculates duration in hours, and checks against user's remaining weekly quota.
4. "Proceed to Safety Verification" primary button.
Proof of Work: Click a 3-hour slot and verify duration and quota consumption calculate accurately.
```

---

### Part 2.6: Booking Modal & Drag-and-Drop Safety Cert Upload
* **Target File:** `OpenLabs/frontend/src/components/booking/BookingModal.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines]
Context: Step 3 & 4 of sharing lifecycle: Purpose and credential check.
Task:
In src/components/booking/BookingModal.jsx:
1. Project Purpose Textarea with sample capstone placeholder.
2. "Safety Qualification Verification" section:
   - Shows required certificate name (e.g. "Haas CNC Safety Level 2").
   - If user already holds cert (Alex Chen): Displays "✅ Haas Level 2 on file (Exp: Dec 2027, Issued by Makerspace Board)".
   - If missing: Drag-and-drop file uploader (PDF/PNG) with simulated "TrustScan AI Scanning..." animation.
3. Submitting triggers booking action and presents feedback:
   - If within quota: "Request Submitted -> Awaiting Lab Manager Approval".
   - If quota exceeded: "Placed on Fair-Share Waitlist (#1) due to weekly hour cap."
Proof of Work: Test submitting with Alex Chen and verify instant transition to REQUESTED status.
```

---

### Part 2.7: Physical Custody Check-In Screen (QR Scanner & Photos)
* **Target File:** `OpenLabs/frontend/src/components/custody/CheckInModal.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines]
Context: Step 7 of the sharing lifecycle: Physical check-in.
Task:
In src/components/custody/CheckInModal.jsx:
1. Animated QR Code Scanner / Verification Pin: Shows booking token with active scanner line.
2. "Baseline Equipment Condition Record":
   - 2 Camera / Upload boxes: Spindle/Work Area and Tooling Assembly.
   - Pre-seeded with realistic baseline lab photos for instant testing.
3. Mandatory 4-Point Safety Checklist:
   - [ ] Cleanliness verified (free of chips and oil spills)
   - [ ] No visible structural cracks or damage
   - [ ] All tooling collets and accessories accounted for
   - [ ] Power cycle and safety emergency stops verified
4. "Confirm Check-In & Take Custody" button: Enabled only when all 4 checkboxes are ticked.
5. On confirm: Transitions status to CHECKED_IN and starts live custody timer.
Proof of Work: Verify button is disabled when only 3 checkboxes are checked; enables when 4th is checked.
```

---

### Part 2.8: Return & Visual Damage Diff Inspector
* **Target File:** `OpenLabs/frontend/src/components/custody/ReturnAndInspectModal.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines, vercel-composition-patterns]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines, vercel-composition-patterns]
Context: Steps 8 & 9 of sharing lifecycle: Return and AI damage diffing.
Task:
In src/components/custody/ReturnAndInspectModal.jsx:
1. Post-use return photo upload and return checklist.
2. "VisionGuard AI Condition Diff" Interactive Component:
   - Side-by-side comparison slider: [Baseline Check-In Photo] vs [Return Photo].
   - Interactive draggable center divider comparing the two images.
   - Anomaly Bounding Box: SVG overlay drawing a red/amber highlight box at coordinates { ymin: 420, xmin: 380, ymax: 560, xmax: 540 } around the spindle collet.
   - VisionGuard AI Card: "Risk Severity: NORMAL_WEAR (Confidence: 93%). Minor tool abrasion detected near collet edge. Recommended: Flag for manager review."
3. Two Resolution Buttons:
   - "Submit Clean Return"
   - "Flag Damage / Request Manager Review"
Proof of Work: Drag the slider divider left and right to confirm smooth photo diffing without layout shift.
```

---

### Part 2.9: Lab Manager Approval & Active Custody Dashboard
* **Target File:** `OpenLabs/frontend/src/components/dashboard/ManagerDashboard.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines]
Context: Lab Director oversight interface for Dr. Elena Vance.
Task:
In src/components/dashboard/ManagerDashboard.jsx:
1. Header Stats: 6 Registered Assets, 1 Pending Request, 1 Active Custody, 98% Utilization Rate.
2. "Pending Access Requests" Table:
   - Requester avatar & department.
   - Requested machine and time slot.
   - TrustScan Credential Badge: "✅ Haas CNC Level 2 (Verified)".
   - 1-Click Action Buttons: "Approve Access" (generates QR), "Waitlist", and "Reject".
3. "Active Custody Monitor":
   - Machinery currently in possession of researchers.
   - Live countdown timer showing remaining time in reservation.
4. "Damage & Incident Resolution Drawer":
   - Displays side-by-side VisionGuard diff and allows 1-click "Waive as Standard Wear" or "Withhold Deposit".
Proof of Work: Click "Approve Access" on a pending request and verify it moves immediately to the Active Custody table.
```

---

### Part 2.10: Immutable Audit Timeline & Fairness Analytics
* **Target File:** `OpenLabs/frontend/src/components/audit/AuditAndFairnessView.jsx`
* **Skills Tag:** `[Skills: frontend-design, web-design-guidelines]`

#### The Prompt:
```text
[Skills: frontend-design, web-design-guidelines]
Context: Criterion #5 (Auditability) & Criterion #6 (Fair Allocation) showcase.
Task:
In src/components/audit/AuditAndFairnessView.jsx:
1. Audit History Event Stream:
   - Vertical chronological timeline with glowing nodes.
   - Each event card: Timestamp, Actor Avatar & Role, Action Chip (SUBMIT_REQUEST, APPROVE_BOOKING, PERFORM_CHECKIN, RETURN_EQUIPMENT), Justification Text, and truncated SHA-256 Tamper Hash badge (e.g. "🔒 sha256:7f8a9...b4").
2. Departmental Parity & Anti-Hoarding Widget:
   - Horizontal percentage progress bar chart:
     - Mechanical Eng: 38%
     - Biomedical Eng: 29%
     - Electrical Eng: 22%
     - Media Arts: 11%
   - Dashed red marker at 40%: "Institutional Parity Ceiling (Anti-Monopolization Active)".
Proof of Work: Verify audit entries render chronologically with clean icons and zero layout shift.
```

---

## 4. The 3-Minute Scripted Judge Guided Tour

When Member 2 builds the **"⚡ Run 1-Click Guided Tour"** button, it automatically triggers this automated sequence:

1. **Step 1:** Selects **Alex Chen (Student)** $\rightarrow$ Opens Catalog $\rightarrow$ Selects Haas CNC Mill.
2. **Step 2:** Shows "Haas Level 2 Safety Cert Verified" $\rightarrow$ Submits 3-hour reservation.
3. **Step 3:** Switches to **Dr. Elena Vance (Lab Owner)** $\rightarrow$ Shows Alex's request $\rightarrow$ Clicks "Approve".
4. **Step 4:** Switches back to **Alex Chen** $\rightarrow$ Opens Check-In $\rightarrow$ Displays QR & confirms 4-point checklist $\rightarrow$ Sets status to `CHECKED_IN`.
5. **Step 5:** Clicks "Initiate Return" $\rightarrow$ Shows Return Photo $\rightarrow$ Activates VisionGuard side-by-side photo diff with detected collet wear highlight.
6. **Step 6:** Switches to **Dr. Elena Vance** $\rightarrow$ Reviews diff $\rightarrow$ Clicks "Waive as Standard Wear".
7. **Step 7:** Opens **Audit Trail** $\rightarrow$ Displays complete 10-step immutable ledger with SHA-256 digital hashes.

---

## 5. Member 2 Self-Verification Checklist

Before pushing to production:
- [ ] Dark-zinc palette matches `#09090b` canvas with crisp `#10b981` emerald status badges.
- [ ] Top Judge Bar allows seamless 1-click toggling between Alex, Elena, and Marcus.
- [ ] Interactive 7-day availability calendar renders 30-minute maintenance buffers in amber.
- [ ] Check-In modal requires all 4 checklist toggles before enabling the confirm button.
- [ ] Visual Damage Diff slider drags smoothly side-by-side with bounding box coordinates.
- [ ] Audit Timeline renders SHA-256 hashes for every lifecycle state transition.
- [ ] Zero layout shift (CLS = 0) and 100% responsive across desktop and tablet views.

