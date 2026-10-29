import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { AppProvider, useApp } from "./context/AppContext";
import { JudgeBar } from "./components/common/JudgeBar";
import { NavigationHeader } from "./components/common/NavigationHeader";
import { ResourceCatalog } from "./components/catalog/ResourceCatalog";
import { MyBookingsList } from "./components/custody/MyBookingsList";
import { ManagerDashboard } from "./components/dashboard/ManagerDashboard";
import { AuditAndFairnessView } from "./components/audit/AuditAndFairnessView";
import { CheckInModal } from "./components/custody/CheckInModal";
import { ReturnAndInspectModal } from "./components/custody/ReturnAndInspectModal";
import { AuthModal } from "./components/auth/AuthModal";
import { Sparkles, ChevronRight, X, Play, RotateCcw } from "lucide-react";

function MainContent() {
  const {
    activeTab,
    setActiveTab,
    activePersonaKey,
    switchPersona,
    tourStep,
    setTourStep,
    bookings,
    approveBooking,
    performCheckIn,
    returnEquipment,
    resolveIncident,
    bannerNotice,
  } = useApp();

  const [tourModalBooking, setTourModalBooking] = useState(null);
  const [tourDiffBooking, setTourDiffBooking] = useState(null);

  // Guided Tour Script controller
  const handleStartTour = () => {
    setTourStep(1);
    switchPersona("alex");
    setActiveTab("catalog");
  };

  const handleNextTourStep = () => {
    if (tourStep === 1) {
      // Step 2: Switch to Dr. Elena Vance to approve request
      setTourStep(2);
      switchPersona("elena");
      setActiveTab("manager");
    } else if (tourStep === 2) {
      // Step 3: Switch back to Alex Chen to check in with QR
      setTourStep(3);
      switchPersona("alex");
      setActiveTab("custody");
      const target = bookings.find((b) => b.resourceId === "res-haas-cnc") || bookings[0];
      setTourModalBooking(target);
    } else if (tourStep === 3) {
      // Step 4: Show VisionGuard Diff slider
      setTourStep(4);
      setTourModalBooking(null);
      const target = bookings.find((b) => b.resourceId === "res-haas-cnc") || bookings[0];
      setTourDiffBooking(target);
    } else if (tourStep === 4) {
      // Step 5: Switch to Dr. Elena to waive
      setTourStep(5);
      setTourDiffBooking(null);
      switchPersona("elena");
      setActiveTab("manager");
    } else if (tourStep === 5) {
      // Step 6: Switch to Marcus Thorne to inspect audit ledger
      setTourStep(6);
      switchPersona("marcus");
      setActiveTab("audit");

      // Celebrate with fireworks confetti tailored to palette!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2547A8", "#B65D3F", "#C8B89E", "#332F29", "#E9DFCE"],
      });
    } else if (tourStep === 6) {
      // Finish tour
      setTourStep(0);
    }
  };

  const handleCancelTour = () => {
    setTourStep(0);
    setTourModalBooking(null);
    setTourDiffBooking(null);
  };

  const tourPrompts = {
    1: {
      step: 1,
      role: "Alex Chen (Student / Requester)",
      title: "Step 1: Discover Specialized Haas CNC Mill & Submit Reservation",
      description: "Alex discovers the Haas 5-Axis Mill in the catalog. Gemini TrustScan AI automatically verifies his Haas Level 2 safety certificate on file.",
      actionLabel: "Advance to Step 2: Lab Director Approval →",
    },
    2: {
      step: 2,
      role: "Dr. Elena Vance (Lab Director / Owner)",
      title: "Step 2: 1-Click Director Review & Institutional Parity Authorization",
      description: "Switched to Dr. Elena Vance. She reviews Alex's capstone purpose and TrustScan credential score (98.4%) and approves access.",
      actionLabel: "Advance to Step 3: Physical QR Check-In →",
    },
    3: {
      step: 3,
      role: "Alex Chen (Student / Requester)",
      title: "Step 3: Physical Arrival, Animated QR Scan & Baseline Evidence",
      description: "Alex arrives at Shop 104, scans the machine QR beacon, records 2 pre-use baseline photos, and certifies the 4-point safety checklist.",
      actionLabel: "Advance to Step 4: VisionGuard AI Damage Diff →",
    },
    4: {
      step: 4,
      role: "VisionGuard AI Multimodal Engine",
      title: "Step 4: Interactive Visual Damage Diff & Bounding Box Localization",
      description: "Post-use return photos are compared side-by-side with pre-use baseline. VisionGuard detects normal spindle collet wear [420, 380, 560, 540] with 94% confidence.",
      actionLabel: "Advance to Step 5: Director Resolution →",
    },
    5: {
      step: 5,
      role: "Dr. Elena Vance (Lab Director)",
      title: "Step 5: Incident Review & Educational Protocol Waiver",
      description: "Dr. Elena reviews the VisionGuard side-by-side diff. She waives the normal tooling wear under educational policy with zero deposit withholding.",
      actionLabel: "Advance to Step 6: Immutable Audit Ledger →",
    },
    6: {
      step: 6,
      role: "Marcus Thorne (Campus Safety Admin)",
      title: "Step 6: Cryptographically Sealed SHA-256 Trail & 40% Parity Ceiling",
      description: "Switched to Marcus Thorne. Inspect the complete immutable event chain with SHA-256 hashes and verify departmental anti-hoarding parity meters.",
      actionLabel: "Complete Guided Tour 🎉",
    },
  };

  const currentTour = tourPrompts[tourStep];

  return (
    <div className="min-h-screen bg-sandstone text-earthInk flex flex-col font-sans">
      {/* Top 1-Click Evaluator Bar */}
      <JudgeBar onStartTour={handleStartTour} />

      {/* Main Navigation Header */}
      <NavigationHeader />

      {/* Guided Tour Floating Banner */}
      {currentTour && (
        <div className="sticky top-14 z-40 w-full bg-limestone/95 border-b border-cobalt/30 backdrop-blur-md px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-cobalt/15 text-cobalt border border-cobalt/30 shrink-0">
                <Sparkles className="w-5 h-5 animate-spin" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cobalt/15 text-cobalt border border-cobalt/20">
                    Tour Step {currentTour.step} of 6
                  </span>
                  <span className="text-xs text-earthInk-muted">• Role: {currentTour.role}</span>
                </div>
                <h4 className="text-sm font-bold text-earthInk mt-0.5">{currentTour.title}</h4>
                <p className="text-xs text-earthInk-muted mt-0.5 max-w-3xl leading-relaxed">
                  {currentTour.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
              <button
                onClick={handleCancelTour}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-earthInk-muted hover:text-earthInk transition-colors"
              >
                Exit Tour
              </button>
              <button
                id="btn-next-tour-step"
                onClick={handleNextTourStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cobalt hover:bg-cobalt-hover shadow-md shadow-cobalt/20 transition-all cursor-pointer"
              >
                <span>{currentTour.actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Banner Notice */}
      {bannerNotice && (
        <div className="bg-weathered/40 border-b border-sandstone-border px-4 py-1.5 text-center text-xs text-earthInk animate-in fade-in">
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Tab Router View */}
      <main className="flex-1 pb-16">
        {activeTab === "catalog" && <ResourceCatalog />}
        {activeTab === "custody" && <MyBookingsList />}
        {activeTab === "manager" && <ManagerDashboard />}
        {activeTab === "audit" && <AuditAndFairnessView />}
      </main>

      {/* Tour Modals */}
      <CheckInModal
        booking={tourModalBooking}
        isOpen={!!tourModalBooking}
        onClose={() => setTourModalBooking(null)}
        onCheckInComplete={(id) => {
          setTourModalBooking(null);
        }}
      />

      <ReturnAndInspectModal
        booking={tourDiffBooking}
        isOpen={!!tourDiffBooking}
        onClose={() => setTourDiffBooking(null)}
        onReturnComplete={(id) => {
          setTourDiffBooking(null);
        }}
      />

      {/* Institutional SSO & Auth Modal */}
      <AuthModal />

      {/* Global Footer */}
      <footer className="border-t border-sandstone-border bg-limestone/60 px-4 py-6 text-center text-xs text-earthInk-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cobalt" />
            <span className="text-earthInk font-semibold">OpenLabs AI</span>
            <span>— Institutional Resource & Equipment Sharing Platform</span>
          </div>
          <div className="text-[11px] font-mono text-earthInk-muted">
            CodeHack 48h Hackathon • Member 2 (Frontend & Judge Experience Lead)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
