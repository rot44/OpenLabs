import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, QrCode, Camera, ShieldCheck, CheckSquare, Square, AlertCircle, ArrowRight } from "lucide-react";

export function CheckInModal({ booking, isOpen, onClose, onCheckInComplete }) {
  const { performCheckIn } = useApp();

  const [checklist, setChecklist] = useState({
    cleanliness: true,
    structuralIntegrity: true,
    toolingAccounted: true,
    safetyEStop: true,
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earthInk/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-stone-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-earthInk tracking-tight">Physical Custody Check-In</h2>
              <p className="text-xs text-earthInk-muted mt-0.5">
                Token: <span className="font-mono text-cobalt font-bold">{booking.id}</span> • {booking.resourceTitle}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Animated QR Scanner Simulation Box in Sandstone Palette */}
          <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-sandstone/30 border border-sandstone-border overflow-hidden">
            {/* Scanner Area */}
            <div className="relative w-48 h-48 rounded-2xl border-2 border-cobalt/40 bg-limestone p-3 flex items-center justify-center overflow-hidden shadow-stone-sm">
              {/* Animated Scan Beam in Cobalt */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cobalt to-transparent shadow-[0_0_12px_#2547A8] animate-scan-beam" />
              
              {/* QR Code SVG */}
              <svg className="w-36 h-36 text-earthInk" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm3 3h2v2h-2v-2zm-3 2h3v3h-3v-3zm5 0h3v3h-3v-3z" />
              </svg>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-cobalt flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cobalt animate-ping" />
                Physical QR Dispatch Beacon Verified
              </span>
              <p className="text-[11px] text-earthInk-muted mt-0.5">
                Machine Key Dispenser Station 104 • Access Pin: 849-219
              </p>
            </div>
          </div>

          {/* Baseline Condition Photo Records (2 angles) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-cobalt" />
                Baseline Pre-Use Photo Evidence (2 Angles)
              </span>
              <span className="text-[10px] font-mono text-cobalt bg-cobalt/10 px-2.5 py-0.5 rounded-lg border border-cobalt/20 font-bold">
                Timestamp Sealed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden bg-limestone-light border border-sandstone-border p-2 shadow-stone-sm">
                <div className="h-28 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                    alt="Angle 1"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-earthInk/80 text-[10px] text-white font-mono">
                    Angle 1: Enclosure & Bed
                  </span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden bg-limestone-light border border-sandstone-border p-2 shadow-stone-sm">
                <div className="h-28 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
                    alt="Angle 2"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-earthInk/80 text-[10px] text-white font-mono">
                    Angle 2: Spindle Collet & Chuck
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Point Mandatory Pre-Flight Checklist */}
          <div className="p-4 rounded-2xl bg-sandstone/40 border border-sandstone-border space-y-3">
            <span className="text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cobalt" />
              Mandatory 4-Point Safety Checklist
            </span>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => toggleCheck("cleanliness")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-limestone hover:bg-limestone-light text-left transition-colors border border-sandstone-border shadow-stone-sm"
              >
                {checklist.cleanliness ? (
                  <CheckSquare className="w-4 h-4 text-cobalt shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-earthInk-faint shrink-0" />
                )}
                <span className={checklist.cleanliness ? "text-earthInk font-semibold" : "text-earthInk-muted"}>
                  Work area & bed cleared of debris, metal shavings, and oil spills
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("structuralIntegrity")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-limestone hover:bg-limestone-light text-left transition-colors border border-sandstone-border shadow-stone-sm"
              >
                {checklist.structuralIntegrity ? (
                  <CheckSquare className="w-4 h-4 text-cobalt shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-earthInk-faint shrink-0" />
                )}
                <span className={checklist.structuralIntegrity ? "text-earthInk font-semibold" : "text-earthInk-muted"}>
                  Zero visible structural cracks, broken tooling, or hydraulic leaks
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("toolingAccounted")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-limestone hover:bg-limestone-light text-left transition-colors border border-sandstone-border shadow-stone-sm"
              >
                {checklist.toolingAccounted ? (
                  <CheckSquare className="w-4 h-4 text-cobalt shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-earthInk-faint shrink-0" />
                )}
                <span className={checklist.toolingAccounted ? "text-earthInk font-semibold" : "text-earthInk-muted"}>
                  All 20+1 tooling collets, edge finders, and wrenches accounted for
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCheck("safetyEStop")}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-limestone hover:bg-limestone-light text-left transition-colors border border-sandstone-border shadow-stone-sm"
              >
                {checklist.safetyEStop ? (
                  <CheckSquare className="w-4 h-4 text-cobalt shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-earthInk-faint shrink-0" />
                )}
                <span className={checklist.safetyEStop ? "text-earthInk font-semibold" : "text-earthInk-muted"}>
                  Emergency stop switch tested & certified operational before powering on
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sandstone-border bg-limestone-light flex items-center justify-between">
          <div className="text-xs">
            {!isChecklistComplete ? (
              <span className="text-rust font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Check all 4 safety requirements to take physical custody.
              </span>
            ) : (
              <span className="text-cobalt font-bold">
                ✓ All 4 safety pre-flight items verified. Ready to activate.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-earthInk-muted hover:text-earthInk transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-check-in"
              disabled={!isChecklistComplete}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cobalt/25"
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
