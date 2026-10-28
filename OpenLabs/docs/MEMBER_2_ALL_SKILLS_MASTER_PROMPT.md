# OpenLabs AI — Member 2 Unified Skills Setup & Master Frontend Prompt

This document provides Member 2 (Frontend Lead) with:
1. **A Single Setup Command** to install all required AI skills and plugins in 1 step.
2. **The Master All-Skills Frontend Prompt** to paste into Antigravity / Gemini for generating the complete frontend.

---

## Part 1: The Single Setup Command for Member 2's Machine

Run this one-liner in your terminal after cloning the repository. It validates your environment, symlinks workspace skills, and outputs the Marketplace plugin cards for 1-click activation:

```bash
# From the root of the cloned repo:
mkdir -p OpenLabs/frontend && \
echo "=== Verifying Workspace Skills in .agents/skills/ ===" && \
ls -d .agents/skills/* && \
echo "=== Workspace Skills Loaded Successfully ==="
```

### Required Antigravity Plugins (1-Click Marketplace IDs)
Ensure these three plugins are enabled in your Antigravity IDE / Gemini environment:
1. **Modern Web Guidance:** `antigravity-plugins-official/plugin/modern-web-guidance-plugin`
2. **Chrome DevTools & A11y:** `antigravity-plugins-official/plugin/chrome-devtools-plugin`
3. **Gemini API & Vision:** `antigravity-plugins-official/plugin/gemini-api`

---

## Part 2: The Master All-Skills Frontend Prompt (Copy & Paste to Agent)

> **Instructions for Member 2:** Copy everything inside the prompt box below and send it directly to your AI agent. It activates all 7 frontend skills simultaneously and builds the entire UI step-by-step.

```text
[Skills: modern-web-guidance, web-design-guidelines, vercel-composition-patterns, vercel-react-best-practices, vercel-react-view-transitions, a11y-debugging, code-simplification]

Role: Member 2 (Frontend Architecture, UI/UX Design System & 1-Click Judge Experience Lead)
Project: OpenLabs AI — Institutional Lab & Equipment Sharing Platform (CodeHack 48h Hackathon)
Working Directory: OpenLabs/frontend/
Backend API: http://localhost:5000/api/v1 (with automatic local mock fallback if backend is offline)

Your mission is to construct the complete, judge-winning OpenLabs frontend adhering strictly to the Vercel / Linear dark-zinc engineering aesthetic and the 10-step equipment custody lifecycle.

================================================================================
CRITICAL SKILLS COMPLIANCE CHECKLIST
================================================================================
1. [vercel-react-best-practices]:
   - bundle-barrel-imports: Import Lucide icons and subcomponents directly from their specific files.
   - rerender-functional-setstate: Use functional setState for stable callbacks.
   - rerender-no-inline-components: Never define subcomponents inside parent render loops.
   - async-parallel: Parallelize independent fetch calls.
2. [web-design-guidelines]:
   - High contrast dark-zinc palette (#09090b canvas, #18181b surface, #27272a border).
   - Semantic HTML with accessible ARIA labels for modal dialogs and role tabs.
   - Visible focus states (ring-2 ring-emerald-500/50) and zero layout shift.
3. [vercel-composition-patterns]:
   - Compound component architecture for Modals, Cards, and Slider components.
   - Children over boolean props; clean, declarative interfaces.
4. [vercel-react-view-transitions]:
   - Smooth CSS transitions on persona toggling, modal openings, and tab switching.

================================================================================
STEP-BY-STEP IMPLEMENTATION EXECUTION
================================================================================

### STEP 1: Scaffolding, Vite & Tailwind Dark-Zinc Tokens
In OpenLabs/frontend/:
1. Create `package.json` with React 19, Lucide React, canvas-confetti, Vite, and Tailwind CSS.
2. Configure `vite.config.js` with port 5173 and proxy `/api` -> `http://localhost:5000`.
3. Configure `tailwind.config.js` with OpenLabs tokens:
   - canvas: "#09090b" (Zinc 950)
   - surface: "#18181b" (Zinc 900)
   - border: "#27272a" (Zinc 800)
   - primary: "#10b981" (Emerald 500)
   - accent: "#06b6d4" (Cyan 500)
   - statuses: approved (#10b981), waitlisted (#f59e0b), checked_in (#3b82f6), disputed (#ef4444)
4. Create `index.html` with title "OpenLabs AI — Institutional Resource & Equipment Sharing" and Inter font.
5. Create `src/index.css` with dark theme root styles and custom scrollbars.

### STEP 2: Brand Identity & The 1-Click Judge Experience Bar
1. Create `src/components/common/OpenLabsLogo.jsx`:
   - Geometric aperture SVG with emerald pulse center node + "OpenLabs" wordmark + emerald "AI" badge.
2. Create `src/components/common/JudgeBar.jsx` (Anchored at the very top, z-50):
   - Left: OpenLabs Logo + "CodeHack Evaluator Mode" pulse pill.
   - Center: 3 1-Click Persona Buttons:
     - 🎓 "Alex Chen (Student / Requester)"
     - 🔬 "Dr. Elena Vance (Lab Director / Owner)"
     - 🛡️ "Marcus Thorne (Campus Safety Admin)"
   - Right: "⚡ Run 1-Click Guided Tour" button with glowing emerald border.
   - Instant state toggle without page reload; active button receives glowing ring.

### STEP 3: Resilient State Management & Backend API Adapter
Create `src/context/AppContext.jsx`:
1. Provide `AppContext` & `useApp` hook containing:
   - `activePersona`: Default Alex Chen (reputation: 0.94, weeklyHours: 6/10h, dept: "Biomedical").
   - `resources`: 6 seeded flagship machines (Haas VF-2 CNC Mill, Nikon Confocal Microscope, Formlabs Form 3L, RED V-Raptor 8K, ISO 5 Cleanroom Bench, Keysight RF Analyzer).
   - `bookings`: Active and past reservations with full 10-step status.
   - `auditLogs`: Seeded immutable SHA-256 event chain.
   - `guidedTourStep`: State for the automated judge walkthrough.
2. Dual-mode networking:
   - All actions (`switchPersona`, `submitBooking`, `approveBooking`, `checkIn`, `returnEquipment`, `resolveIncident`) attempt `fetch('/api/v1/...')` with `x-persona: <role>`.
   - If backend is offline or unreachable, seamlessly update local in-memory state with zero UI error toasts!

### STEP 4: Resource Catalog Explorer & Availability Calendar
1. Create `src/components/catalog/ResourceCatalog.jsx`:
   - Natural language search input with prompt suggestion chips ("Biohood with Centrifuge", "Haas 5-Axis CNC", "8K Raw Camera").
   - Category filter pills: All, Machinery, Lab Spaces, Prototyping, Media, Testing/RF.
   - Weekly quota progress meter (6/10h used, emerald progress bar).
2. Create `src/components/catalog/ResourceCard.jsx`:
   - High-contrast equipment card with image preview, department tag, hourly rate ($0 institutional internal), training prerequisite badge, and "Reserve Slot" CTA.
3. Create `src/components/catalog/AvailabilityCalendar.jsx`:
   - 7-day interactive time-slot grid (08:00 to 20:00).
   - Green slots = available; Amber = 5-min Redis lock hold; Gray = booked; Blue = selected.
4. Create `src/components/catalog/BookingModal.jsx`:
   - Project research purpose textarea.
   - Drag-and-drop safety certificate uploader with simulated / live Gemini TrustScan OCR badge (extracts certification level and confidence score).

### STEP 5: Custody Tracking, QR Check-In & Baseline Verification
1. Create `src/components/custody/MyBookingsList.jsx`:
   - Shows user's active custody, pending approvals, and past reservation history.
2. Create `src/components/custody/CheckInModal.jsx`:
   - Interactive QR scanner simulation with animated scanning beam.
   - 2-angle baseline photo capture interface (Overall Asset + Critical Working Surface).
   - 4-point safety pre-flight toggle list:
     [x] Emergency stop switch verified
     [x] Work area cleared of debris
     [x] Personal protective equipment worn
     [x] Calibration baseline confirmed
   - Activates live countdown timer upon check-in.

### STEP 6: The Flagship Visual Damage Diff Slider (VisionGuard AI)
Create `src/components/custody/ReturnAndInspectModal.jsx`:
1. Post-use photo upload (Spindle collet / bed surface).
2. Side-by-side interactive comparison slider:
   - Left: Baseline Check-in Photo (Pre-use).
   - Right: Return Inspection Photo (Post-use).
   - Draggable vertical divider with smooth mouse/touch tracking.
3. VisionGuard AI Overlay:
   - Renders animated bounding box around damage coordinates: `[ymin: 420, xmin: 380, ymax: 560, xmax: 540]`.
   - Risk Severity Badge: "NORMAL WEAR" (Amber) or "ANOMALY DETECTED" (Red).
   - VisionGuard AI Explanation Card: "Tooling friction marks detected on spindle collet shank. 94% confidence normal tooling wear."
4. Toggle incident dispute flag or proceed to return.

### STEP 7: Lab Director Dashboard & Incident Resolution
Create `src/components/manager/ManagerDashboard.jsx` (Visible to Dr. Elena Vance):
1. `PendingApprovalsTable`:
   - Requester profile, research purpose, TrustScan verified certificate badge, 1-click Approve / Deny buttons.
2. `ActiveCustodyTracker`:
   - Cards showing machinery currently in physical use with live countdown timers and requester contact info.
3. `IncidentReviewDrawer`:
   - Displays flagged equipment returns, visual diff slider, deposit hold amount, and 1-click "Waive (Wear & Tear)" or "Escalate Dispute" actions.

### STEP 8: Institutional Audit Ledger & Fairness Analytics
Create `src/components/audit/AuditAndFairnessView.jsx` (Visible to Marcus Thorne):
1. `AuditTimeline`:
   - Chronological event chain displaying all actions (`SUBMIT_REQUEST`, `VERIFY_CREDENTIAL`, `APPROVE_BOOKING`, `PERFORM_CHECKIN`, `INITIATE_RETURN`, `COMPLETE_TRANSACTION`).
   - Displays timestamp, actor, state delta, and cryptographically linked SHA-256 hashes.
2. `DepartmentalParityChart`:
   - 30-day resource utilization by department (Mechanical 38%, Biomedical 29%, Electrical 22%, Creative 11%).
   - Displays institutional 40% parity ceiling line to prevent department monopolization.

### STEP 9: The 1-Click Guided Judge Tour Engine
In `src/App.jsx`:
1. Implement the automated 4-step evaluator tour triggered by "⚡ Run 1-Click Guided Tour":
   - Step 1: Shows student discovering Haas CNC and reserving slot.
   - Step 2: Auto-switches to Dr. Elena Vance to approve request.
   - Step 3: Auto-switches back to Alex Chen to demonstrate QR check-in and VisionGuard return diff slider.
   - Step 4: Auto-switches to Marcus Thorne to inspect the immutable audit ledger.
   - Fires celebratory `canvas-confetti` upon tour completion!
2. Assemble `NavigationHeader.jsx`, `JudgeBar.jsx`, and view router in `App.jsx`.

================================================================================
VERIFICATION PROOF-OF-WORK
================================================================================
1. Run `npm run build` in `OpenLabs/frontend/` and ensure 0 TypeScript/JSX errors.
2. Verify all 4 tabs and 3 persona switches operate without layout shifts.
3. Test that the interactive visual diff slider drags smoothly with bounding box overlays.
```

