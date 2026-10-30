import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Camera,
  Sliders,
  History,
  CheckCircle2,
  Download,
  ExternalLink,
  Clock,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const VIDEO_CHAPTERS = [
  {
    id: 1,
    title: "1. The Crisis & The Platform",
    subtitle: "Overcoming $50M+ in Siloed Institutional Machinery",
    startTime: 0,
    endTime: 30.5,
    tag: "Problem Statement",
    voiceoverFile: "/audio/chapter1.m4a",
    script:
      "Across world-class research universities, over fifty million dollars of advanced machinery sits idle in locked departmental silos. Haas CNC mills, confocal laser microscopes, and ISO five cleanrooms are reserved only for insider faculty, while interdisciplinary students and startups face endless bureaucratic red tape. Welcome to OpenLabs AI: the trusted, auditable institutional resource sharing platform engineered to unlock underused equipment while guaranteeing physical custody and safety.",
    visual: {
      headline: "Unlocking $50M+ in Idle Higher-Ed Equipment",
      bullet1: "82% average idle time across departmental CNC & laser facilities",
      bullet2: "Universal multi-persona governance for students, lab owners, and campus auditors",
      bullet3: "Zero-bureaucracy access with strict safety compliance",
      badge: "Institutional Sharing Crisis",
      graphicType: "crisis",
    },
  },
  {
    id: 2,
    title: "2. Personas & Redis Concurrency",
    subtitle: "Distributed Slot Locking & Atomic Reservations",
    startTime: 30.5,
    endTime: 64.6,
    tag: "Distributed Concurrency",
    voiceoverFile: "/audio/chapter2.m4a",
    script:
      "OpenLabs structures university governance into three role-gated personas. Alex Chen represents student researchers, Dr. Elena Vance serves as Lab Director and Equipment Owner, and Marcus Thorne oversees campus safety and compliance. When Alex browses the catalog, our interactive seven-day calendar renders live slot availability. Under the hood, high contention is protected by our Redis distributed locking tier. A ten-second atomic lock eliminates double bookings, five-minute soft holds protect checkout, and an idempotency cache ensures zero duplicate reservations.",
    visual: {
      headline: "Tri-Persona RBAC & Redis Distributed Locking",
      bullet1: "SET NX EX 10s atomic distributed lock eliminates double-booking race conditions",
      bullet2: "TTL 300s soft hold guarantees 5-minute checkout reservation protection",
      bullet3: "x-idempotency-key cache protects against multi-click payment & booking retries",
      badge: "Redis Enterprise Tier",
      graphicType: "concurrency",
    },
  },
  {
    id: 3,
    title: "3. Gemini TrustScan AI OCR",
    subtitle: "Automated Credential Parsing & Tamper Proofing",
    startTime: 64.6,
    endTime: 98.3,
    tag: "Multimodal AI",
    voiceoverFile: "/audio/chapter3.m4a",
    script:
      "Specialized equipment requires verified safety clearance. To book the Haas CNC VF-2, Alex must hold a Level Two CNC safety credential. In the Booking Modal, researchers drag and drop safety certificates in PDF or image format. Instantly, our multimodal Gemini TrustScan engine executes optical character recognition, parses issuing authority and expiration dates, and evaluates certification match with ninety-nine percent confidence. If no certificate is found, researchers can auto-fill verified sample credentials in one click.",
    visual: {
      headline: "Gemini 2.5 Flash TrustScan OCR",
      bullet1: "Drag-and-drop certificate ingestion (PDF, PNG, JPG) with base64 streaming",
      bullet2: "Automatic extraction: Credential Title, Issuing Authority, Expiration Date",
      bullet3: "99.2% confidence matching against equipment prerequisite rules",
      badge: "Computer Vision Guard",
      graphicType: "trustscan",
    },
  },
  {
    id: 4,
    title: "4. Lab Director Hub & Quota Engine",
    subtitle: "Anti-Monopoly 10h/wk Cap & 40% Parity Ceiling",
    startTime: 98.3,
    endTime: 129.1,
    tag: "Fair Allocation",
    voiceoverFile: "/audio/chapter4.m4a",
    script:
      "Switching to Dr. Elena Vance opens the Lab Director Hub. Requests appear in real time with requester profiles, research statements, and TrustScan verification badges. Dr. Vance reviews the booking within our institutional quota limits. OpenLabs enforces a strict ten-hour weekly cap per student and a forty percent departmental utilization ceiling, preventing single departments from monopolizing shared gear. When approved, a unique cryptographic QR dispatch token is generated for physical machine pickup.",
    visual: {
      headline: "Anti-Monopolization Fair-Share Quota Engine",
      bullet1: "10-hour/week student cap ensures equitable access across all labs",
      bullet2: "40% departmental ceiling blocks dominant engineering factions from monopolizing",
      bullet3: "1-click review with TrustScan verification preview and QR dispatch token generation",
      badge: "Institutional Governance",
      graphicType: "quota",
    },
  },
  {
    id: 5,
    title: "5. Physical Custody & QR Check-In",
    subtitle: "2-Angle Baseline Evidence & 4-Point Safety Protocol",
    startTime: 129.1,
    endTime: 159.8,
    tag: "Physical Custody",
    voiceoverFile: "/audio/chapter5.m4a",
    script:
      "At the workshop floor, custody handover begins. Alex opens Physical Custody Check-In, aligning their device with the animated QR scanning beacon at the machine station. Before the tool unlocks, the student completes a mandatory four-point pre-flight checklist, verifying emergency stop circuits, debris clearance, and zero structural cracks. They record two timestamped baseline photos of the enclosure bed and spindle collet. Once submitted, live physical custody activates with a real-time countdown timer.",
    visual: {
      headline: "Cryptographic QR Check-In & Baseline Capture",
      bullet1: "Station dispatch beacon scans token and logs authenticated physical presence",
      bullet2: "Mandatory 4-point safety preflight (Emergency stops, debris clearance, eye protection)",
      bullet3: "2-angle baseline photo capture (bed enclosure + spindle) establishes sealed benchmark",
      badge: "Zero-Liability Protocol",
      graphicType: "custody",
    },
  },
  {
    id: 6,
    title: "6. VisionGuard AI Visual Diff Slider",
    subtitle: "Localized Bounding Boxes & Wear Classification",
    startTime: 159.8,
    endTime: 191.5,
    tag: "Flagship Innovation",
    voiceoverFile: "/audio/chapter6.m4a",
    script:
      "When the session ends, Alex initiates equipment return by uploading post-use inspection photos. This triggers our flagship VisionGuard multimodal AI. The interactive condition diff slider allows side-by-side comparison between pre-use baseline and post-use return. VisionGuard automatically projects bounding boxes around detected surface wear, localizing tooling friction on the collet at coordinates four-twenty by three-eighty. It classifies the severity as normal operational wear, enabling Dr. Vance to waive deposits with confidence.",
    visual: {
      headline: "VisionGuard Multimodal Visual Diff Slider",
      bullet1: "Side-by-side interactive split slider comparing baseline vs post-use return",
      bullet2: "AI bounding box overlay localized at [ymin: 420, xmin: 380, ymax: 560, xmax: 540]",
      bullet3: "Automated classification: NORMAL_WEAR (94% confidence) vs CRITICAL_ANOMALY",
      badge: "Gemini Vision Multimodal",
      graphicType: "visionguard",
    },
  },
  {
    id: 7,
    title: "7. Audit Ledger & 1-Click Tour",
    subtitle: "Immutable SHA-256 Event Chain & 3-Minute Judge Tour",
    startTime: 191.5,
    endTime: 222.1,
    tag: "Cryptographic Audit",
    voiceoverFile: "/audio/chapter7.m4a",
    script:
      "Finally, Marcus Thorne accesses the Audit and Fairness Ledger. Every lifecycle action: credential verification, manager signoff, QR check-in, and visual diff analysis, is chained into an immutable SHA-256 event log. Evaluators can explore the entire journey in under three minutes using the One-Click Guided Tour. OpenLabs combines distributed concurrency, multimodal computer vision, and zero-crash fault tolerance to safely unlock the world's greatest institutional laboratories.",
    visual: {
      headline: "Immutable SHA-256 Audit Trail & Guided Tour",
      bullet1: "Cryptographically linked hash chain records every state transition and actor",
      bullet2: "Departmental parity metrics display historical equity across campus colleges",
      bullet3: "1-Click Guided Tour lets evaluators experience all 10 steps in under 3 minutes",
      badge: "Full Rubric Alignment",
      graphicType: "audit",
    },
  },
];

export function VideoWalkthroughModal({ isOpen, onClose }) {
  const { setActiveTab, setTourStep } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222.1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [diffSliderPos, setDiffSliderPos] = useState(50);

  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const currentChapter = VIDEO_CHAPTERS[activeChapterIndex] || VIDEO_CHAPTERS[0];

  // Initialize or update audio playback
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [playbackSpeed, volume, isMuted]);

  // Sync active chapter based on currentTime
  useEffect(() => {
    const idx = VIDEO_CHAPTERS.findIndex(
      (ch) => currentTime >= ch.startTime && currentTime < ch.endTime
    );
    if (idx !== -1 && idx !== activeChapterIndex) {
      setActiveChapterIndex(idx);
    }
  }, [currentTime, activeChapterIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Audio playback interrupted:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const jumpToChapter = (idx) => {
    const target = VIDEO_CHAPTERS[idx];
    if (!target) return;
    setActiveChapterIndex(idx);
    setCurrentTime(target.startTime);
    if (audioRef.current) {
      audioRef.current.currentTime = target.startTime;
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const jumpToAppTab = (tabName) => {
    setActiveTab(tabName);
    onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-earthInk/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-2xl overflow-hidden">
        {/* Hidden Master Audio Element */}
        <audio
          ref={audioRef}
          src="/audio/openlabs_master_voiceover.m4a"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (audioRef.current?.duration) setDuration(audioRef.current.duration);
          }}
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-earthInk tracking-tight">
                  OpenLabs AI — 3-Minute Complete System Walkthrough
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cobalt text-white shadow-sm">
                  1080p 60fps • Studio AI Voiceover
                </span>
              </div>
              <p className="text-xs text-earthInk-muted">
                Official CodeHack Hackathon Technical Video Presentation & Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage Container (Main Screen) */}
        <div className="relative flex-1 bg-canvas overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8 select-none">
          {/* Ambient Studio Lighting Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cobalt/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Dynamic Scene Visual Presentation Card */}
          <div className="relative w-full max-w-3xl rounded-3xl border border-sandstone-border/60 bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Top Scene Pill */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cobalt animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cobalt">
                  {currentChapter.tag}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Chapter {currentChapter.id} of 7 • {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Scene Visuals Based on Chapter Type */}
            <div className="min-h-[220px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                  {currentChapter.visual.headline}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mb-4">
                  {currentChapter.subtitle}
                </p>

                {/* Interactive Dynamic Graphic Area */}
                {currentChapter.visual.graphicType === "concurrency" ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                      <span className="text-emerald-400">REDIS DISTRIBUTED LOCK:</span>
                      <span className="text-cyan-400">SET resource:haas_cnc NX EX 10</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>HOLD TTL: 300s Soft Hold</span>
                      <span className="text-amber-400">STATUS: Slot Protected</span>
                    </div>
                  </div>
                ) : currentChapter.visual.graphicType === "visionguard" ? (
                  <div className="relative h-28 rounded-2xl overflow-hidden border border-zinc-800 mb-4 bg-zinc-950">
                    <img
                      src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
                      alt="Diff preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-rust bg-rust/20 px-3 py-1 rounded-lg text-white font-mono text-xs shadow-rust-glow flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rust animate-ping" />
                        <span>VisionGuard Anomaly: [420, 380, 560, 540] • NORMAL_WEAR (94%)</span>
                      </div>
                    </div>
                  </div>
                ) : currentChapter.visual.graphicType === "trustscan" ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Haas CNC Safety Level 2</div>
                        <div className="text-[11px] text-zinc-400">Issuer: Campus Makerspace Board • Dec 2027</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      TrustScan 99.2%
                    </span>
                  </div>
                ) : null}

                {/* Bullet Highlights */}
                <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentChapter.visual.bullet1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{currentChapter.visual.bullet2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{currentChapter.visual.bullet3}</span>
                  </li>
                </ul>
              </div>

              {/* Live Subtitle / Voiceover Closed Caption Stream */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                <Volume2 className="w-4 h-4 text-cobalt shrink-0 mt-0.5 animate-pulse" />
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans italic">
                  "{currentChapter.script}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div className="px-6 py-2 border-t border-sandstone-border bg-limestone-light overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {VIDEO_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => jumpToChapter(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeChapterIndex === idx
                    ? "bg-cobalt text-white shadow-md shadow-cobalt/25 scale-105"
                    : "text-earthInk-muted hover:text-earthInk hover:bg-sandstone/50"
                }`}
              >
                <span>{ch.id}.</span>
                <span>{ch.title.split(". ")[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Player Bottom Control Bar */}
        <div className="px-6 py-4 border-t border-sandstone-border bg-limestone flex flex-col gap-3">
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-earthInk-muted min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 222.1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-sandstone-border rounded-lg appearance-none cursor-pointer accent-cobalt"
            />
            <span className="text-xs font-mono text-earthInk-muted min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Buttons & Features */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Previous Chapter */}
              <button
                onClick={() => jumpToChapter(Math.max(0, activeChapterIndex - 1))}
                disabled={activeChapterIndex === 0}
                className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="p-3 rounded-2xl bg-cobalt hover:bg-cobalt-hover text-white shadow-md shadow-cobalt/25 transition-transform active:scale-95 flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Next Chapter */}
              <button
                onClick={() => jumpToChapter(Math.min(VIDEO_CHAPTERS.length - 1, activeChapterIndex + 1))}
                disabled={activeChapterIndex === VIDEO_CHAPTERS.length - 1}
                className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Restart */}
              <button
                onClick={() => jumpToChapter(0)}
                className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume / Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Speed Switcher */}
              <div className="flex items-center rounded-xl bg-sandstone/40 border border-sandstone-border p-0.5 text-[11px] font-mono">
                {[1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${
                      playbackSpeed === spd
                        ? "bg-cobalt text-white font-bold"
                        : "text-earthInk-muted hover:text-earthInk"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Navigation to Corresponding Live Screen */}
            <div className="flex items-center gap-2">
              <a
                href="/audio/openlabs_master_voiceover.m4a"
                download="OpenLabs_3Min_Master_Voiceover.m4a"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sandstone/50 hover:bg-sandstone text-earthInk border border-sandstone-border transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Audio Track</span>
              </a>

              <button
                onClick={() => {
                  if (activeChapterIndex <= 1) jumpToAppTab("catalog");
                  else if (activeChapterIndex === 2) jumpToAppTab("catalog");
                  else if (activeChapterIndex === 3) jumpToAppTab("manager");
                  else if (activeChapterIndex === 4 || activeChapterIndex === 5) jumpToAppTab("custody");
                  else jumpToAppTab("audit");
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/25"
              >
                <span>Try This Feature Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoWalkthroughModal;
