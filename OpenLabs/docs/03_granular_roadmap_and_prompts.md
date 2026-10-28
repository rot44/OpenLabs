# OpenLabs AI — Granular Multi-Part Roadmap & Overpowered Prompts Library

**Problem Statement:** *Unlock Underused Equipment and Spaces*  
**Platform Name:** **OpenLabs AI**  
**Architecture:** MERN Stack + Google Gemini 2.5 Flash Multimodal AI  
**Structure:** 12 Micro-Parts for Member 1 | 10 Micro-Parts for Member 2 | Full Overpowered Prompt Library

---

## 1. Executive Division & Sync Architecture

To ensure both team members build at maximum velocity with **zero blocking**, development is partitioned into granular micro-parts with an agreed mock contract.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                OPENLABS PLATFORM                                  │
├────────────────────────────────────────┬──────────────────────────────────────────┤
│ MEMBER 1: Backend, AI & Security       │ MEMBER 2: Frontend, UI/UX & Demo         │
│ (Prakhar)                              │ (Friend)                                 │
├────────────────────────────────────────┼──────────────────────────────────────────┤
│ Part 1.1: Constants & Enums            │ Part 2.1: Vite, Tailwind & Theme Tokens  │
│ Part 1.2: User & Credential Schema     │ Part 2.2: Judge Role Switcher Bar        │
│ Part 1.3: Resource & Machinery Schema  │ Part 2.3: Mock State & Data Contracts    │
│ Part 1.4: Booking State Machine Schema │ Part 2.4: Resource Catalog & Filters     │
│ Part 1.5: Condition Inspection Schema  │ Part 2.5: Availability Calendar & Detail │
│ Part 1.6: Immutable Audit Trail Schema │ Part 2.6: Booking & Cert Upload Modal    │
│ Part 1.7: Academic Seed Generator      │ Part 2.7: Check-In QR & Photo Upload UI  │
│ Part 1.8: Anti-Monopolization Engine   │ Part 2.8: Visual Damage Diff Slider      │
│ Part 1.9: TrustScan AI (Cert OCR)      │ Part 2.9: Lab Manager Inbox Dashboard    │
│ Part 1.10: VisionGuard AI (Photo Diff) │ Part 2.10: Audit Timeline & Parity Chart │
│ Part 1.11: 10-Step State Machine APIs  │                                          │
│ Part 1.12: End-to-End API Verification │                                          │
└────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. Member 1: Granular Parts & Overpowered Prompts

Every prompt below is engineered with **embedded skills**, **file targets**, **exact logic**, and **proof-of-work commands**.

---

### Part 1.1: Constants, State Enums & Environment Setup
* **Goal:** Centralize all system states, roles, categories, and risk severities into a single source of truth.

```text
[Skills: backend-architecture, spec-driven-development]
Context: OpenLabs Backend (Node.js/Express 5 ESM).
Task:
1. In src/constants.js, define and export:
   - DB_NAME = "openlabs"
   - USER_ROLES: REQUESTER ("requester"), OWNER ("owner"), ADMIN ("admin")
   - RESOURCE_CATEGORIES: MACHINERY, LAB_SPACE, PROTOTYPING, MEDIA, TESTING_DEVICE
   - RESOURCE_STATUS: AVAILABLE, IN_USE, MAINTENANCE, RETIRED
   - BOOKING_STATUS: REQUESTED, VERIFYING, APPROVED, WAITLISTED, REJECTED, CHECKED_IN, RETURNED, DISPUTED, COMPLETED
   - AUDIT_ACTIONS: CREATE_LISTING, SUBMIT_REQUEST, VERIFY_CREDENTIAL, APPROVE_BOOKING, REJECT_BOOKING, WAITLIST_BOOKING, PERFORM_CHECKIN, INITIATE_RETURN, AI_DIFF_ANOMALY, RESOLVE_INCIDENT, COMPLETE_TRANSACTION
   - RISK_SEVERITY: CLEAN, NORMAL_WEAR, COSMETIC_DAMAGE, CRITICAL_HAZARD
2. Update .env to include PORT=8000, MONGODB_URI, and GEMINI_API_KEY placeholder.
Proof of Work: Run a node check verifying all constants export cleanly with zero syntax errors.
```

---

### Part 1.2: User & Credential Data Model
* **Goal:** Create the `User` Mongoose model supporting institutional roles, safety credentials, and rolling weekly quota tracking.

```text
[Skills: domain-modeling, backend-architecture]
Context: Building user identity and credential vault in OpenLabs.
Task:
In src/models/user.model.js:
1. Define safetyCertSchema with: name, credentialId, issuingAuthority, issueDate, expiryDate, verified (boolean), documentUrl.
2. Define userSchema with:
   - name, email (unique, lowercase, trimmed)
   - role (enum from USER_ROLES, default: REQUESTER)
   - department (required, indexed)
   - avatar (URL)
   - reputationScore (number, 0.0 to 1.0, default: 1.0)
   - weeklyHoursUsed (number, default: 0)
   - safetyCertificates: [safetyCertSchema]
3. Export User model.
Proof of Work: Verify Mongoose compiles the schema without errors.
```

---

### Part 1.3: Equipment & Resource Data Model
* **Goal:** Create the `Resource` Mongoose model with specifications, location coordinates, required training credentials, and anti-monopolization quotas.

```text
[Skills: domain-modeling, backend-architecture]
Context: Building physical asset registry in OpenLabs.
Task:
In src/models/resource.model.js:
1. Define resourceSchema with:
   - title (string, required, indexed)
   - category (enum from RESOURCE_CATEGORIES, indexed)
   - description (string, required)
   - department (string, required, indexed)
   - location: { building, room, campus }
   - images: [string]
   - owner: ObjectId ref "User" (required)
   - requiredQualifications: [string] (e.g. ["Haas CNC Safety Level 2"])
   - hourlyRate (number, default: 0)
   - weeklyQuotaLimit (number, default: 10) // Anti-monopolization cap
   - isInstantApproval (boolean, default: false)
   - status (enum from RESOURCE_STATUS, default: AVAILABLE)
   - specs: Map of strings
   - operatingHours: { start: "08:00", end: "20:00", days: [1,2,3,4,5] }
2. Export Resource model.
Proof of Work: Verify schema supports dynamic specification maps and indexing.
```

---

### Part 1.4: Booking Lifecycle State Machine Model
* **Goal:** Create the `Booking` model representing the 10-step lifecycle, fair-allocation scoring, and QR check-in tokens.

```text
[Skills: domain-modeling, backend-architecture]
Context: Building the core transaction engine in OpenLabs.
Task:
In src/models/booking.model.js:
1. Define bookingSchema with:
   - resource: ObjectId ref "Resource" (required, indexed)
   - requester: ObjectId ref "User" (required, indexed)
   - startTime: Date (required)
   - endTime: Date (required)
   - durationHours: Number (required)
   - purpose: String (required)
   - status: String (enum from BOOKING_STATUS, default: REQUESTED, indexed)
   - fairUsageScore: Number (default: 1.0)
   - waitlistRank: Number (default: null)
   - rejectionReason: String
   - checkInQrToken: String
   - checkedInAt: Date
   - returnedAt: Date
   - cancellationReason: String
2. Add compound index: { resource: 1, startTime: 1, endTime: 1 } for fast conflict queries.
3. Export Booking model.
Proof of Work: Verify schema indexes and enum validation.
```

---

### Part 1.5: Condition Inspection & Damage Model
* **Goal:** Model physical custody: baseline check-in photos, checklists, return photos, and Gemini AI diff coordinates.

```text
[Skills: domain-modeling, backend-architecture]
Context: Physical custody handoff and condition tracking.
Task:
In src/models/conditionInspection.model.js:
1. Define anomalySchema: { component: String, issueDescription: String, coordinates: { ymin, xmin, ymax, xmax } }
2. Define conditionInspectionSchema:
   - booking: ObjectId ref "Booking" (required, unique, indexed)
   - resource: ObjectId ref "Resource" (required, indexed)
   - inspector: ObjectId ref "User" (required)
   - checkInRecord: { timestamp, photos: [String], checklist: { cleanlinessVerified, noStructuralDamage, accessoriesIntact, powerCycleOk }, notes }
   - returnRecord: { timestamp, photos: [String], checklist: { cleanedAfterUse, toolsReturned, noNewDamageObserved }, notes }
   - aiDiffResult: { analyzedAt, anomalyDetected, confidenceScore, riskSeverity (enum from RISK_SEVERITY), anomalies: [anomalySchema], recommendedAction, humanSummary }
   - managerSignoff: { approved: Boolean, signedBy: ObjectId ref "User", signedAt: Date, notes: String }
3. Export ConditionInspection model.
Proof of Work: Verify schema supports nested inspection records and coordinates.
```

---

### Part 1.6: Immutable Audit Trail & Cryptographic Hashing
* **Goal:** Build the append-only `AuditLog` model and helper with SHA-256 tamper-evident digital hashes.

```text
[Skills: backend-architecture, security-hardening]
Context: Tamper-evident audit trail for Criterion #5 (Trust & Safety).
Task:
1. In src/models/auditLog.model.js:
   - Define auditLogSchema: booking, resource, actor (ObjectId ref User), actorName, actorRole, action (enum from AUDIT_ACTIONS), fromState, toState, justification, metadata (Mixed), tamperHash (String, required), timestamp (Date, default: Date.now, indexed).
   - Set timestamps: false to prevent Mongoose mutation of updatedAt.
2. In src/utils/auditHelper.js:
   - Build recordAuditLog({ bookingId, resourceId, actor, action, fromState, toState, justification, metadata }).
   - Compute SHA-256 hash using crypto: hash(bookingId + action + actorId + timestamp + toState).
   - Insert into AuditLog and return the created record.
Proof of Work: Test auditHelper by generating a dummy log and verifying the SHA-256 hash length is exactly 64 characters.
```

---

### Part 1.7: Academic Resource Seed Script & 3 Personas
* **Goal:** Build `src/db/seed.js` to populate 3 judge-switchable personas and 6 flagship institutional resources.

```text
[Skills: domain-modeling, backend-architecture]
Context: Seeding high-fidelity academic lab data for OpenLabs.
Task:
In src/db/seed.js:
1. Connect to MongoDB using process.env.MONGODB_URI.
2. Seed 3 Personas:
   - Dr. Elena Vance (Lab Director / Owner, Advanced Manufacturing)
   - Alex Chen (Graduate Student / Requester, Mechanical Eng, has Haas Level 2 Cert, 6h weekly used)
   - Marcus Thorne (Campus Safety Admin)
3. Seed 6 Flagship Resources:
   - Haas VF-2 Super Speed CNC Mill (Requires Haas CNC Safety Level 2)
   - Nikon Eclipse Ti2 Confocal Microscope (Requires Bio-imaging Laser Safety Level 1)
   - Formlabs Form 3L SLA Resin 3D Printer (Requires Resin & Chemical Safety Pass)
   - RED V-Raptor 8K Cinema Camera Package (Requires Cinema Gear Field Cert)
   - ISO 5 Cleanroom Photolithography Bench (Requires Cleanroom Protocol L3)
   - Rohde & Schwarz 40GHz Spectrum Analyzer (Requires RF Hazard Safety)
4. Seed 1 active approved booking with initialized audit logs for instant demo readiness.
Proof of Work: Run node src/db/seed.js and confirm in console that 3 personas and 6 resources were inserted.
```

---

### Part 1.8: Anti-Monopolization & Quota Scoring Engine
* **Goal:** Implement the mathematical fair allocation algorithm and 30-minute turnaround cooldown buffer in `src/services/fairAllocationService.js`.

```text
[Skills: backend-architecture, tdd, domain-modeling]
Context: Anti-Monopolization engine for Criterion #6 (Fair Allocation - 10 Points).
Task:
In src/services/fairAllocationService.js, build FairAllocationService with:
1. evaluateQuota({ userId, resourceId, requestedHours }):
   - Computes rolling calendar week usage.
   - Compares against resource.weeklyQuotaLimit (e.g. 10 hrs).
   - Returns { hoursUsedThisWeek, requestedHours, weeklyCap, isExceeded, remainingHours, recommendation }.
2. calculatePriorityScore({ userId, resourceId }):
   - Formula: 0.35*(IdleDays/14) + 0.35*(1 - Used/Cap) + 0.20*(Reputation) - 0.10*(ActiveHolds).
   - Returns normalized float between 0.10 and 1.00.
3. checkSchedulingConflict({ resourceId, startTime, endTime, excludeBookingId }):
   - Enforces a 30-minute maintenance/turnaround buffer before and after every booking.
   - Returns { hasConflict: boolean, conflictingBooking, bufferRequiredMinutes: 30 }.
4. getFairnessMetrics():
   - Aggregates rolling 30-day hours by department and checks against 40% parity ceiling.
Proof of Work: Run a standalone test script verifying quota overflow triggers isExceeded=true.
```

---

### Part 1.9: TrustScan AI — Gemini Safety Credential OCR
* **Goal:** Implement Gemini 2.5 Flash document verification with structured JSON schema in `src/services/aiService.js`.

```text
[Skills: gemini-api-dev, backend-architecture]
Context: Automated safety qualification verification.
Task:
In src/services/aiService.js:
1. Implement AIService.verifyCertificate({ fileBase64, mimeType, targetResourceTitle, requiredQualification }):
   - System instruction: Institutional safety officer verifying academic training certificates.
   - Calls Gemini 2.5 Flash with responseMimeType: "application/json".
   - Extracts: isCredentialDocument, holderName, institution, credentialTitle, credentialId, issueDate, expiryDate, isExpired, meetsRequirements, confidenceScore, flagReason.
   - Include high-fidelity offline fallback returning authentic verified JSON if GEMINI_API_KEY is not set.
2. Build controller endpoint POST /api/ai/verify-cert to test independently.
Proof of Work: Send a curl request with a base64 test payload and verify structured JSON returns with meetsRequirements: true.
```

---

### Part 1.10: VisionGuard AI — Gemini Visual Damage Diffing
* **Goal:** Implement dual-image comparison comparing baseline vs return photos with bounding box coordinates.

```text
[Skills: gemini-api-dev, backend-architecture]
Context: Automated before-and-after condition inspection for OpenLabs.
Task:
In src/services/aiService.js:
1. Implement AIService.compareConditionPhotos({ baselinePhotos, returnPhotos, resourceTitle, checklistNotes }):
   - System instruction: Precision laboratory equipment damage auditor.
   - Sends both baseline (Image A) and return (Image B) to Gemini 2.5 Flash Vision.
   - Detects cracks, scratches, toolhead chips, missing parts.
   - Returns: anomalyDetected (boolean), riskSeverity (CLEAN, NORMAL_WEAR, COSMETIC_DAMAGE, CRITICAL_HAZARD), confidenceScore, detectedAnomalies: [{ component, issueDescription, coordinates: { ymin, xmin, ymax, xmax } }], recommendedAction, humanSummary.
   - Include offline fallback returning simulated collet tool-wear with coordinates.
2. Build controller endpoint POST /api/ai/inspect-condition.
Proof of Work: Run curl test verifying output contains normalized bounding boxes [ymin, xmin, ymax, xmax].
```

---

### Part 1.11: 10-Step State Machine Express Controllers
* **Goal:** Implement atomic state transitions with automatic audit logging in `src/controllers/bookingController.js`.

```text
[Skills: backend-architecture, spec-driven-development, security-hardening]
Context: 10-Step transaction lifecycle for OpenLabs.
Task:
In src/controllers/bookingController.js, implement:
1. createBooking: Quota check -> Conflict check -> Priority score -> Create Booking -> TrustScan OCR -> Log Audit.
2. getMyBookings & getManagerInbox: Populated views with role segregation.
3. approveBooking: Validates REQUESTED -> APPROVED, generates secure checkInQrToken, initializes ConditionInspection, logs Audit.
4. rejectBooking: Validates -> REJECTED with required reason, logs Audit.
5. performCheckIn: Validates APPROVED -> CHECKED_IN, records baseline photos & 4 checklist toggles, logs Audit.
6. initiateReturn: Validates CHECKED_IN -> RETURNED, records return photos, executes VisionGuard AI diff, logs Audit.
7. completeBooking: Validates RETURNED -> COMPLETED, records manager signoff and deposit release, logs Audit.
Proof of Work: Test state machine transitions using an end-to-end curl script from request through completion.
```

---

### Part 1.12: Judge Role Switcher, Routes & Server Wiring
* **Goal:** Wire all routes into `src/app.js`, add `/api/auth/switch-persona`, and perform complete API verification.

```text
[Skills: backend-architecture, proof-of-work]
Context: Final backend assembly and route mounting.
Task:
1. Create src/controllers/authController.js with switchPersona({ role }) returning Alex, Elena, or Marcus with an active session token/cookie.
2. In src/routes/:
   - auth.routes.js: POST /switch-persona, GET /me
   - resource.routes.js: GET /, GET /:id, POST /
   - booking.routes.js: POST /, GET /my-bookings, GET /manager-inbox, PATCH /:id/approve, PATCH /:id/reject, POST /:id/checkin, POST /:id/return, POST /:id/complete
   - audit.routes.js: GET /timeline/:bookingId, GET /all
   - analytics.routes.js: GET /fairness
3. Mount all routes in src/app.js under /api/v1/*.
Proof of Work: Execute curl tests hitting /api/v1/resources, /api/v1/auth/switch-persona, and /api/v1/analytics/fairness, verifying 200 OK responses.
```

---

## 3. Member 2: Granular Parts & Overpowered Prompts

---

### Part 2.1: Vite React 19, Tailwind & OpenLabs Design Tokens
* **Goal:** Initialize frontend with dark-zinc engineering theme, status badges, and OpenLabs SVG branding.

```text
[Skills: frontend-design, web-design-guidelines]
Context: OpenLabs Frontend (React 19 + Vite + Tailwind CSS + Lucide React).
Task:
1. In CrAp/frontend/ (or OpenLabs/frontend/), initialize Vite React with Tailwind CSS and Lucide React.
2. Configure tailwind.config.js with:
   - Primary: Emerald (#10b981)
   - Accent: Cyan (#06b6d4)
   - Canvas: Deep Zinc (#09090b)
   - Surface: Zinc-900 (#18181b) with Zinc-800 borders (#27272a)
   - Status: Approved (#10b981), Waitlisted (#f59e0b), CheckedIn (#3b82f6), Disputed (#ef4444)
3. Create src/components/common/OpenLabsLogo.jsx with the unlocked aperture/flask SVG mark.
Proof of Work: Start Vite dev server and confirm dark-zinc theme renders with zero layout shift.
```

---

### Part 2.2: Global Navigation & Judge 1-Click Role Switcher Bar
* **Goal:** Build the persistent top bar allowing judges to toggle between Alex (Student), Dr. Vance (Owner), and Safety Admin in 1 click.

```text
[Skills: frontend-design, vercel-composition-patterns, web-design-guidelines]
Context: Top header for OpenLabs.
Task:
In src/components/common/JudgeBar.jsx:
1. Anchor a persistent top bar across the entire screen:
   - Left: OpenLabs Logo + "CodeHack Evaluation Mode" badge.
   - Center: 3 Persona Pills:
     - 🎓 "Alex Chen (Student / Requester)"
     - 🔬 "Dr. Elena Vance (Lab Director / Owner)"
     - 🛡️ "Marcus Thorne (Campus Safety Admin)"
   - Right: "⚡ Run 1-Click Judge Tour" button.
2. Clicking any persona triggers the persona state switcher instantly without page reload.
3. Active persona receives an illuminated emerald/cyan border ring with active role indicator.
Proof of Work: Verify clicking each pill updates active persona state and switches navigation tabs.
```

---

### Part 2.3: Mock State & Data Contracts
* **Goal:** Build React Context / Zustand store with mock data so frontend can develop all 10 screens without waiting for backend.

```text
[Skills: vercel-composition-patterns, vercel-react-best-practices]
Context: Parallel frontend state management for OpenLabs.
Task:
In src/context/AppContext.jsx:
1. Define context holding:
   - activePersona (Alex, Elena, or Marcus)
   - resources (6 seeded institutional assets)
   - bookings (active, pending, and past custody items)
   - currentBookingFlow (in-progress booking or inspection)
2. Add actions: switchPersona, requestBooking, approveBooking, checkInEquipment, returnEquipment, completeBooking.
3. Wire to live backend API (/api/v1/*) with automatic fallback to local state if backend is unreachable.
Proof of Work: Confirm state persists and updates cleanly across components.
```

---

### Part 2.4: Resource Catalog & Smart Filter Hub
* **Goal:** Build the exploration hub with category chips, qualification badges, and fair-quota indicators.

```text
[Skills: frontend-design, web-design-guidelines, vercel-react-best-practices]
Context: Discovery interface for OpenLabs.
Task:
In src/components/catalog/ResourceCatalog.jsx:
1. Build Search Header with natural-language intent search bar ("high speed aluminum CNC", "confocal microscope").
2. Filter Pills: All, Machinery, Lab Spaces, Prototyping, Media, RF/Testing.
3. Resource Card:
   - Equipment image with hover zoom.
   - Status badge (Available, In Use, Maintenance).
   - Location tag (Building + Room).
   - "Prerequisites" chip (e.g. "Requires Haas Level 2").
   - Fair-Usage Quota meter: "6/10 hrs used this week".
   - "Request Access" action button.
Proof of Work: Verify multi-filter selection works smoothly with 60fps animations.
```

---

### Part 2.5: Equipment Detail & 7-Day Slot Availability Calendar
* **Goal:** Modal/Drawer displaying deep technical specifications and interactive 7-day calendar slot picker.

```text
[Skills: frontend-design, vercel-react-view-transitions]
Context: Asset specification and time reservation.
Task:
In src/components/catalog/ResourceDetailModal.jsx:
1. Technical Specs Grid: Spindle RPM, travel envelope, laser lines, resin types.
2. 7-Day Interactive Time-Slot Grid:
   - Visual slots (08:00 to 20:00).
   - Green = Available, Gray = In Use, Amber = Turnaround Buffer (30 mins).
3. Slot selection highlights duration, estimated cost, and quota consumption.
4. "Proceed to Safety Verification" button.
Proof of Work: Verify slot click updates selected time range and calculates duration accurately.
```

---

### Part 2.6: Booking Modal & Drag-and-Drop Safety Cert Upload
* **Goal:** Booking request modal with purpose input, certificate uploader, and instant Gemini TrustScan validation preview.

```text
[Skills: frontend-design, web-design-guidelines]
Context: Eligibility check and booking submission.
Task:
In src/components/booking/BookingModal.jsx:
1. Step 1: Project Purpose & Description input.
2. Step 2: "Safety Qualification Verification":
   - Displays required training credential name.
   - If user already holds cert (Alex Chen): Shows "✅ Haas Level 2 on file (Exp: Dec 2027)".
   - If missing: Drag-and-drop PDF/PNG upload area with simulated "TrustScan AI Scanning..." spinner.
3. Submits to backend and shows instant feedback:
   - Green banner: "Approved / Scheduled" OR
   - Amber banner: "Placed on Fair-Share Waitlist (#1) due to weekly quota."
Proof of Work: Test uploading a sample image and verify simulated OCR status updates to verified.
```

---

### Part 2.7: Physical Custody Check-In Screen (QR & Photos)
* **Goal:** Check-in screen with QR scan verification, 2 baseline camera uploads, and 4-point safety checklist.

```text
[Skills: frontend-design, web-design-guidelines]
Context: Step 7 of the sharing lifecycle: Physical check-in.
Task:
In src/components/custody/CheckInModal.jsx:
1. QR Code Display / Simulated Scanner: Animated scan line verifying booking token.
2. "Baseline Condition Record":
   - 2 Photo Upload boxes (Spindle/Work area & Toolhead).
   - Interactive camera trigger / file selection.
3. Mandatory 4-Point Safety Checklist:
   - [ ] Cleanliness verified (free of metal shavings / spills)
   - [ ] No visible structural damage on toolhead / stage
   - [ ] All accessories and collets present
   - [ ] Power cycle and safety interlocks operational
4. "Confirm Check-In & Accept Custody" button -> Transitions booking to CHECKED_IN.
Proof of Work: Confirm button remains disabled until all 4 checklist boxes are checked.
```

---

### Part 2.8: Return & Visual Damage Diff Inspector
* **Goal:** Return screen featuring side-by-side photo comparison slider with Gemini VisionGuard bounding box callouts.

```text
[Skills: frontend-design, web-design-guidelines, vercel-composition-patterns]
Context: Step 8 & 9 of the sharing lifecycle: Return inspection and AI damage diffing.
Task:
In src/components/custody/ReturnAndInspectModal.jsx:
1. Return photo upload & return checklist.
2. "VisionGuard AI Condition Diff" Viewer:
   - Side-by-side comparison slider: [Baseline Photo] vs [Return Photo].
   - Overlay: Red/Amber bounding box rectangle highlighting detected anomaly (e.g. spindle collet wear).
   - AI Summary card: "Detected minor tool abrasion on collet edge (Risk: NORMAL_WEAR, Confidence: 93%)".
3. Actions:
   - "Submit Standard Return" (clean)
   - "Flag Incident for Manager Review" (with reason input).
Proof of Work: Verify side-by-side slider drags smoothly and bounding box renders at exact coordinates.
```

---

### Part 2.9: Lab Manager Approval & Active Custody Dashboard
* **Goal:** Lab director dashboard with pending approval queue, active custody countdown timer, and incident triage.

```text
[Skills: frontend-design, web-design-guidelines]
Context: Lab owner oversight dashboard for Dr. Elena Vance.
Task:
In src/components/dashboard/ManagerDashboard.jsx:
1. Pending Requests Table:
   - Requester avatar, project purpose, requested time, TrustScan credential badge.
   - 1-Click "Approve" (generates QR), "Waitlist", and "Reject" buttons.
2. Active Custody Monitor:
   - List of machinery currently in use with live countdown timer and operator contact.
3. Incident Review Drawer:
   - Displays side-by-side VisionGuard photo diff and allows 1-click "Waive as Standard Wear" or "Charge Deposit".
Proof of Work: Verify approving a pending request immediately moves it to Active Custody.
```

---

### Part 2.10: Immutable Audit Timeline & Fairness Analytics
* **Goal:** Visual chronological audit trail and real-time departmental parity chart for judges.

```text
[Skills: frontend-design, web-design-guidelines]
Context: Criterion #5 (Trust & Safety) and Criterion #6 (Fair Allocation) visualizer.
Task:
In src/components/audit/AuditAndFairnessView.jsx:
1. Audit Timeline Stream:
   - Chronological vertical timeline of events.
   - For each event: Timestamp, Actor badge (Student, Manager, System), Action chip, Justification note, and truncated SHA-256 tamper hash.
2. Departmental Parity & Anti-Hoarding Widget:
   - Horizontal percentage bar chart showing 30-day hours across departments (MechEng: 38%, Biotech: 29%, ECE: 22%, Media: 11%).
   - "40% Parity Ceiling" indicator showing anti-monopolization is actively enforced.
Proof of Work: Verify audit entries render chronologically with clean styling and verified badge.
```

---

## 4. Execution Protocol: How to Run These Prompts

To execute any part with maximum precision:
1. Choose a prompt (e.g. **Part 1.1** or **Part 1.2**).
2. Tell me: **"Execute Part 1.X"**.
3. I will execute **only that specific part**, run the proof-of-work test, show you the result, and stop for your review.
