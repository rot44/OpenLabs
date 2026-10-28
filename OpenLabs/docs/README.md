# OpenLabs AI — Project Blueprint & Architecture Hub

Welcome to the central design and engineering specification repository for **OpenLabs AI** built for the **CodeHack 48-Hour Hackathon**.

**Problem Statement:** *Unlock Underused Equipment and Spaces*  
**One-Line Mission:** Build a trusted platform that helps universities, research labs, and makerspaces safely share underused high-value equipment, spaces, and fabrication tools.

---

## 📁 Dedicated Member Plans (Start Here!)

| Document | Team Member | Scope & Complete Contents |
| :--- | :--- | :--- |
| **[`MEMBER_1_OVERPOWERED_PLAN.md`](./MEMBER_1_OVERPOWERED_PLAN.md)** | **Member 1 (Prakhar)**<br>*Backend, AI & Security* | • **12 Granular Micro-Parts** with ready-to-run Overpowered Prompts<br>• Mongoose schemas (`User`, `Resource`, `Booking`, `ConditionInspection`, `AuditLog`, `Incident`)<br>• 10-Step state-machine transitions & atomic controller handlers<br>• Mathematical Anti-Monopolization Quota Engine & 30-min turnaround buffer<br>• Gemini 2.5 Flash TrustScan (OCR) & VisionGuard (Damage Diff with Bounding Boxes)<br>• Append-only SHA-256 cryptographic audit helper & seed generator |
| **[`MEMBER_2_OVERPOWERED_PLAN.md`](./MEMBER_2_OVERPOWERED_PLAN.md)** | **Member 2 (Friend)**<br>*Frontend & UI/UX Design* | • **10 Granular Micro-Parts** with ready-to-run Overpowered Prompts<br>• React 19 + Tailwind dark-zinc (`#09090b`) design system with OpenLabs SVG logo<br>• Persistent **1-Click Judge Experience Switcher Bar** (`Alex` $\leftrightarrow$ `Dr. Vance` $\leftrightarrow$ `Marcus`)<br>• Mock state store for zero-dependency parallel building<br>• Resource Catalog & 7-Day Interactive Slot Availability Calendar<br>• QR Check-In modal with baseline photos & 4-point safety checklist<br>• Side-by-side **Visual Damage Diff Slider** with highlight bounding boxes<br>• Lab Director Approval Inbox & Immutable Audit History timeline |

---

## 📚 Complete System Design & Technical Specs

| Document | Purpose & Contents |
| :--- | :--- |
| **[`01_system_architecture_and_design.md`](./01_system_architecture_and_design.md)** | Full High-Level & Low-Level Design (HLD/LLD), 10-step state machine matrix, Anti-Monopolization formulas, MongoDB schemas, and complete REST API contract. |
| **[`02_ai_engines_and_mcp_toolkit.md`](./02_ai_engines_and_mcp_toolkit.md)** | The 5 Gemini Multimodal AI engines, production JSON schemas, bounding box damage diffing specs, and MCP integrations. |
| **[`00_members_48h_implementation_plan.md`](./00_members_48h_implementation_plan.md)** | The original 48-hour macro schedule and rubric alignment checklist. |

---

## 👥 Hackathon Individual Role Breakdown

The hackathon rules require **every team member to submit individually** explaining their specific contribution:

* **Member 1 (Prakhar): Backend, AI Engine & Security Lead**
  - Mongoose data models (`User`, `Resource`, `Booking`, `ConditionInspection`, `AuditLog`, `Incident`).
  - 10-step atomic state-machine controller with append-only tamper hashing.
  - Anti-monopolization quota service & 30-minute turnaround buffer.
  - Gemini 2.5 Flash Multimodal OCR & visual damage diffing.
  - REST endpoints and API security.

* **Member 2 (Friend): Frontend Architecture, UI/UX & Judge Experience Lead**
  - React 19 + Tailwind CSS + Lucide Icons dark-zinc design system.
  - Persistent 1-Click Judge Experience Switcher Bar (`Alex` $\leftrightarrow$ `Dr. Vance` $\leftrightarrow$ `Marcus Thorne`).
  - Resource Catalog Explorer with multi-facet filters and quota badges.
  - QR Code Check-In modal with baseline photo capture & 4-point safety checklist.
  - Side-by-side Visual Damage Diffing slider with highlighted coordinate overlays.
  - Manager Approval Inbox & Immutable Audit History timeline.

---

## 🚀 Quick Start for Both Members

### Member 1 (Backend):
```bash
cd OpenLabs/backend
npm run dev
# Server boots on http://localhost:8000
```

### Member 2 (Frontend):
```bash
cd OpenLabs/frontend
npm run dev
# Frontend boots on http://localhost:5173
```
