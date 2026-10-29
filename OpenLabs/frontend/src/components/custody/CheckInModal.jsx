import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, QrCode, Camera, ShieldCheck, CheckSquare, Square, AlertCircle, ArrowRight } from "lucide-react";

export function CheckInModal({ booking, isOpen, onClose, onCheckInComplete }) {
  const { performCheckIn } = useApp();

  // 4-point mandatory safety checklist state
  const [checklist, setChecklist] = useState({
    cleanliness: true,
    structuralIntegrity: true,
    toolingAccounted: true,
    safetyEStop: true,
  });

  const [activeTab, setActiveTab] = useState("qr"); // 'qr' | 'photos'

  if (!isOpen || !booking) return null;

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecklistComplete =
    checklist.cleanliness &&
    checklist.structuralIntegrity &&
    checklist.toolingAccounted &&
    checklist.safetyEStop;

  const handleConfirm = () => {
    if (!isChecklistComplete) return;
    performCheckIn(booking.id, checklist);
    onCheckInComplete(booking.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Physical Custody Check-In</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Token: <span className="font-mono text-blue-400 font-semibold">{booking.id}</span> • {booking.resourceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Animated QR Scanner Simulation Box */}
          <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
            {/* Scanner Area */}
            <div className="relative w-48 h-48 rounded-xl border-2 border-emerald-500/40 bg-zinc-900/80 p-3 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Animated Scan Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-beam" />
              
              {/* QR Code SVG */}
              <svg className="w-36 h-36 text-zinc-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm3 3h2v2h-2v-2zm-3 2h3v3h-3v-3zm5 0h3v3h-3v-3z" />
              </svg>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Physical QR Dispatch Beacon Verified
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Machine Key Dispenser Station 104 • Access Pin: 849-219
              </p>
            </div>
          </div>

          {/* Baseline Condition Photo Records (2 angles) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Baseline Pre-Use Photo Evidence (2 Angles)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                Timestamp Sealed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-2">
                <div className="h-28 rounded-lg overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                    alt="Angle 1"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-zinc-300 font-mono">
                    Angle 1: Enclosure & Bed
                  </span>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-2">
                <div className="h-28 rounded-lg overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
                    alt="Angle 2"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-zinc-300 font-mono">
                    Angle 2: Spindle Collet & Chuck
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Point Mandatory Pre-Flight Checklist */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Mandatory 4-Point Safety Checklist
            </span>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => toggleCheck("cleanliness")}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-left transition-colors border border-zinc-800"
              >
                {checklist.cleanliness ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className={checklist.cleanliness ? "text-zinc-200" : "text-zinc-400"}>
                  Work area & bed cleared of debris, metal shavings, and oil spills
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("structuralIntegrity")}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-left transition-colors border border-zinc-800"
              >
                {checklist.structuralIntegrity ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className={checklist.structuralIntegrity ? "text-zinc-200" : "text-zinc-400"}>
                  Zero visible structural cracks, broken tooling, or hydraulic leaks
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("toolingAccounted")}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-left transition-colors border border-zinc-800"
              >
                {checklist.toolingAccounted ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className={checklist.toolingAccounted ? "text-zinc-200" : "text-zinc-400"}>
                  All 20+1 tooling collets, edge finders, and wrenches accounted for
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("safetyEStop")}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-left transition-colors border border-zinc-800"
              >
                {checklist.safetyEStop ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className={checklist.safetyEStop ? "text-zinc-200" : "text-zinc-400"}>
                  Emergency stop switch tested & certified operational before powering on
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="text-xs">
            {!isChecklistComplete ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Check all 4 safety requirements to take physical custody.
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">
                ✓ All 4 safety pre-flight items verified. Ready to activate.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-check-in"
              disabled={!isChecklistComplete}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-950/30"
            >
              <span>Confirm Check-In & Take Custody</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInModal;
