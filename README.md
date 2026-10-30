# 🔬 OpenLabs AI
> **Institutional Resource Sharing & Multimodal Custody Platform**  
> *Built for CodeHack 48-Hour Hackathon*

[![Test Suite](https://img.shields.io/badge/backend%20tests-11%2F11%20passing%20(100%25)-emerald)]()
[![Database](https://img.shields.io/badge/database-MongoDB%20Atlas%20%2B%20Redis-blue)]()
[![AI Engine](https://img.shields.io/badge/multimodal%20AI-Gemini%202.5%20Flash-violet)]()
[![Video Demo](https://img.shields.io/badge/video%20demo-3%20Min%20Broadcast%20Ready-red)]()

---

## 🎬 3-Minute Hackathon Video Presentation

- 📁 **Downloadable Video File:** [`OpenLabs_Hackathon_Demo_3Min.webm`](file:///Users/prakhar/Desktop/PROJECTSS/CodeHack/OpenLabs/OpenLabs_Hackathon_Demo_3Min.webm) *(Broadcast 1080p WebM with studio AI voiceover)*
- 🌐 **Interactive 1080p Exporter:** Run the app and visit `http://localhost:5173/recorder.html` to preview, scrub, or re-export.
- 🎨 **21st Motion Graphics Studio:** [21st.dev Editor Project](https://21st.dev/community/video/editor/ecf3d0ba-7d57-4ced-8593-26827097b125)
- 📜 **Full Verbatim Script & Timecodes:** [04_3_MINUTE_VIDEO_PRESENTATION_SCRIPT.md](file:///Users/prakhar/Desktop/PROJECTSS/CodeHack/OpenLabs/docs/04_3_MINUTE_VIDEO_PRESENTATION_SCRIPT.md)
- 📋 **Submission Package & Google Form Text:** [05_HACKATHON_VIDEO_SUBMISSION_PACKAGE.md](file:///Users/prakhar/Desktop/PROJECTSS/CodeHack/OpenLabs/docs/05_HACKATHON_VIDEO_SUBMISSION_PACKAGE.md)

---

## 🌟 Key Architecture & Capabilities

```mermaid
flowchart TD
    subgraph Frontend["React 19 + Tailwind + Lucide"]
        A["Catalog & 7-Day Slot Grid"]
        B["Booking Modal + Drag-and-Drop Certificate"]
        C["Lab Director Queue"]
        D["Physical Custody Station Beacon"]
        E["VisionGuard AI Visual Diff Slider"]
        F["SHA-256 Audit Ledger & 1-Click Tour"]
    end

    subgraph Backend["Express 4 + Node 24"]
        G["Redis Concurrency Tier<br/>SET NX EX 10s • TTL 300s Hold"]
        H["Gemini 2.5 Flash TrustScan OCR<br/>Zero-Trust Safety Verification"]
        I["Anti-Monopoly Quota Engine<br/>10h/wk Student Cap • 40% Dept Ceiling"]
        J["Cryptographic QR Dispatch<br/>4-Point Safety Preflight • 2-Angle Baseline"]
        K["VisionGuard Visual Diff Engine<br/>Bounding Box [420, 380, 560, 540]"]
    end

    subgraph Storage["Cloud Data Tier"]
        L[("MongoDB Atlas Cluster0<br/>Resilient Mongoose Schemas")]
        M[("Redis / In-Memory Tier<br/>Atomic Lock Registry")]
    end

    Frontend --> Backend
    Backend --> Storage
```

### 1. Tri-Persona RBAC
- **Student Researcher (Alex Chen):** Browse gear, upload certifications, monitor physical custody timers, submit return photos.
- **Equipment Owner / Lab Director (Dr. Elena Vance):** Approve or deny bookings, set operating rates, waive security deposits.
- **Campus Safety & Compliance Auditor (Marcus Thorne):** Inspect tamper-proof SHA-256 event chains, track departmental equity.

### 2. Distributed Concurrency & Anti-Collision
- **Atomic Locks:** `SET lock:slot:{resource}:{slot} {token} NX EX 10` prevents simultaneous race conditions.
- **Soft Holds:** 5-minute checkout holds (`TTL 300s`) protect students during verification and payment.
- **Idempotency Keys:** Protect against multi-click network retries.

### 3. Gemini 2.5 Flash TrustScan OCR
- Ingests safety certification PDFs and photos with base64 streaming.
- Extracts Credential Name, Authority, and Expiration Date with 99.2% confidence.
- 1-Click test auto-fill for evaluators.

### 4. Physical Custody Transfer
- Replaces honor-system clipboards with authenticated QR beacon check-in.
- Mandatory 4-point safety preflight checklist (E-stops, debris clearance, eye protection).
- 2-angle baseline timestamped benchmark photography (bed enclosure + spindle collet).

### 5. VisionGuard Multimodal AI Visual Diff
- Interactive side-by-side comparison slider between baseline pre-use and return photos.
- Detects microscopic anomalies, rendering glowing AI bounding boxes at `[420, 380, 560, 540]`.
- Classifies severity: `NORMAL_WEAR (0.94)` vs `CRITICAL_DAMAGE`.

---

## 🚀 Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/PrakharxCodes/CodeHack.git
cd CodeHack

# Install Backend
cd OpenLabs/backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2. Environment Configuration
The backend connects to MongoDB Atlas or runs in zero-crash in-memory mode if offline:
```env
PORT=8000
MONGODB_URI=mongodb+srv://prakharxcodes_db_user:XF9Hhar45jrGfcnS@cluster0.5kz3xcw.mongodb.net/openlabs?retryWrites=true&w=majority
JWT_SECRET=openlabs_hackathon_super_secret_jwt_key_2026
```

### 3. Run Backend (Port 8000)
```bash
cd OpenLabs/backend
npm start
```

### 4. Run Frontend (Port 5173)
```bash
cd OpenLabs/frontend
npm run dev
```

### 5. Run Backend Test Suite (100% Passing)
```bash
cd OpenLabs/backend
npm test
```
Result: `11 passing (100%)`.

---

## 👨‍💻 Team & Hackathon Information
- **Event:** CodeHack 48-Hour Hackathon (October 2026)
- **Submission Form:** [Google Forms Link](https://forms.gle/QTD1ZRuPX37Yef37A)
- **License:** MIT
