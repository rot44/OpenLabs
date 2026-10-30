# OpenLabs AI — 3-Minute Video Presentation & Demonstration Script

**Event:** CodeHack 48-Hour Hackathon  
**Target Video Duration:** 03:42 (222 Seconds)  
**Voiceover Engine:** Studio AI Voiceover (High-Fidelity Audio Tracks in `public/audio/`)  
**Playback Interface:** Built directly into OpenLabs via the top navigation **"🎬 3-Min AI Video Demo"** button.

---

## Video Chapter Breakdown & Narration Script

```
0:00 ─── 0:30 ─── 1:00 ─── 1:30 ─── 2:00 ─── 2:30 ─── 3:00 ─── 3:42
 │         │         │         │         │         │         │
Ch 1      Ch 2      Ch 3      Ch 4      Ch 5      Ch 6      Ch 7
Crisis    Personas  TrustScan Director  Custody   VisionDiff Audit Log
```

---

### Chapter 1: The Higher-Ed Crisis & OpenLabs AI
* **Timecode:** `0:00 - 0:30` (30.5s)
* **Tag:** Problem Statement & Vision
* **On-Screen Visuals:**
  - Campus research machinery overview card ($50M+ idle capacity).
  - OpenLabs unlocked aperture logo with glowing emerald/cyan node.
  - Key stat highlights: 82% unutilized lab time, locked departmental barriers.
* **Audio Track:** `/audio/chapter1.m4a`
* **Verbatim Narration:**
  > "Across world-class research universities, over fifty million dollars of advanced machinery sits idle in locked departmental silos. Haas CNC mills, confocal laser microscopes, and ISO five cleanrooms are reserved only for insider faculty, while interdisciplinary students and startups face endless bureaucratic red tape. Welcome to OpenLabs AI: the trusted, auditable institutional resource sharing platform engineered to unlock underused equipment while guaranteeing physical custody and safety."

---

### Chapter 2: The Multi-Persona System & Distributed Redis Concurrency
* **Timecode:** `0:30 - 1:04` (34.1s)
* **Tag:** Distributed Systems & Concurrency Tier
* **On-Screen Visuals:**
  - 3-Persona Switcher (Alex Chen, Dr. Elena Vance, Marcus Thorne).
  - 7-Day Slot Availability Grid with color-coded reservation states.
  - Redis distributed locking terminal callout: `SET resource:haas_cnc NX EX 10` & `TTL 300s`.
* **Audio Track:** `/audio/chapter2.m4a`
* **Verbatim Narration:**
  > "OpenLabs structures university governance into three role-gated personas. Alex Chen represents student researchers, Dr. Elena Vance serves as Lab Director and Equipment Owner, and Marcus Thorne oversees campus safety and compliance. When Alex browses the catalog, our interactive seven-day calendar renders live slot availability. Under the hood, high contention is protected by our Redis distributed locking tier. A ten-second atomic lock eliminates double bookings, five-minute soft holds protect checkout, and an idempotency cache ensures zero duplicate reservations."

---

### Chapter 3: Gemini TrustScan AI & Drag-and-Drop Safety Credential OCR
* **Timecode:** `1:04 - 1:38` (33.7s)
* **Tag:** Multimodal AI & Verification
* **On-Screen Visuals:**
  - Booking Modal showing Haas CNC VF-2 reservation details.
  - Real file drag-and-drop zone accepting PDF/PNG certificates.
  - Gemini TrustScan OCR badge parsing Level 2 CNC certification with 99.2% match score.
* **Audio Track:** `/audio/chapter3.m4a`
* **Verbatim Narration:**
  > "Specialized equipment requires verified safety clearance. To book the Haas CNC VF-2, Alex must hold a Level Two CNC safety credential. In the Booking Modal, researchers drag and drop safety certificates in PDF or image format. Instantly, our multimodal Gemini TrustScan engine executes optical character recognition, parses issuing authority and expiration dates, and evaluates certification match with ninety-nine percent confidence. If no certificate is found, researchers can auto-fill verified sample credentials in one click."

---

### Chapter 4: Lab Director Clearance & Fair-Share Quota Engine
* **Timecode:** `1:38 - 2:09` (30.9s)
* **Tag:** Institutional Governance & Anti-Monopolization
* **On-Screen Visuals:**
  - Dr. Elena Vance Lab Director Hub.
  - Pending approval card with requester profile and verified TrustScan certificate.
  - Quota visualizer: 10h/week student cap and 40% departmental utilization ceiling.
  - 1-Click approval generating cryptographic QR dispatch token.
* **Audio Track:** `/audio/chapter4.m4a`
* **Verbatim Narration:**
  > "Switching to Dr. Elena Vance opens the Lab Director Hub. Requests appear in real time with requester profiles, research statements, and TrustScan verification badges. Dr. Vance reviews the booking within our institutional quota limits. OpenLabs enforces a strict ten-hour weekly cap per student and a forty percent departmental utilization ceiling, preventing single departments from monopolizing shared gear. When approved, a unique cryptographic QR dispatch token is generated for physical machine pickup."

---

### Chapter 5: Physical Custody Transfer & 2-Angle Baseline Check-In
* **Timecode:** `2:09 - 2:40` (30.7s)
* **Tag:** Physical Custody Protocol
* **On-Screen Visuals:**
  - Animated QR scanner beacon with moving laser beam.
  - 4-point safety pre-flight toggles (e-stop, debris clearance, eye protection, structural inspection).
  - 2-angle baseline photo capture (bed enclosure + spindle collet).
  - Live custody countdown timer activation.
* **Audio Track:** `/audio/chapter5.m4a`
* **Verbatim Narration:**
  > "At the workshop floor, custody handover begins. Alex opens Physical Custody Check-In, aligning their device with the animated QR scanning beacon at the machine station. Before the tool unlocks, the student completes a mandatory four-point pre-flight checklist, verifying emergency stop circuits, debris clearance, and zero structural cracks. They record two timestamped baseline photos of the enclosure bed and spindle collet. Once submitted, live physical custody activates with a real-time countdown timer."

---

### Chapter 6: The Flagship VisionGuard Multimodal Visual Diff Slider
* **Timecode:** `2:40 - 3:11` (31.7s)
* **Tag:** Computer Vision & Innovation
* **On-Screen Visuals:**
  - Interactive draggable before/after condition diff slider.
  - VisionGuard bounding box localized on spindle collet: `[420, 380, 560, 540]`.
  - Severity classification pill: `NORMAL_WEAR (94% Match)` with deposit waiver notice.
* **Audio Track:** `/audio/chapter6.m4a`
* **Verbatim Narration:**
  > "When the session ends, Alex initiates equipment return by uploading post-use inspection photos. This triggers our flagship VisionGuard multimodal AI. The interactive condition diff slider allows side-by-side comparison between pre-use baseline and post-use return. VisionGuard automatically projects bounding boxes around detected surface wear, localizing tooling friction on the collet at coordinates four-twenty by three-eighty. It classifies the severity as normal operational wear, enabling Dr. Vance to waive deposits with confidence."

---

### Chapter 7: Cryptographic SHA-256 Audit Trail & 1-Click Guided Tour
* **Timecode:** `3:11 - 3:42` (30.6s)
* **Tag:** Audit Ledger & Rubric Alignment
* **On-Screen Visuals:**
  - Marcus Thorne Audit and Fairness Ledger.
  - Immutable event chain with SHA-256 tamper hashes.
  - 30-day departmental parity bar chart.
  - Confetti burst celebrating complete walkthrough.
* **Audio Track:** `/audio/chapter7.m4a`
* **Verbatim Narration:**
  > "Finally, Marcus Thorne accesses the Audit and Fairness Ledger. Every lifecycle action: credential verification, manager signoff, QR check-in, and visual diff analysis, is chained into an immutable SHA-256 event log. Evaluators can explore the entire journey in under three minutes using the One-Click Guided Tour. OpenLabs combines distributed concurrency, multimodal computer vision, and zero-crash fault tolerance to safely unlock the world's greatest institutional laboratories."

---

## How Judges Can Experience This Video

1. **In-App Interactive Video Theatre:** Click the **"🎬 3-Min AI Video Demo"** button on the top right navigation header.
2. **Audio Track Download:** Judges can download the master voiceover directly (`openlabs_master_voiceover.m4a`) or individual chapter tracks from the theatre player.
3. **Interactive Sync:** Scrubbing the timeline or clicking any chapter jumps the presentation, subtitles, and voiceover in real time.

