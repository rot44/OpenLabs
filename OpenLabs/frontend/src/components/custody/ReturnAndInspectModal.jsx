import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Sliders, ArrowRight } from "lucide-react";

export function ReturnAndInspectModal({ booking, isOpen, onClose, onReturnComplete }) {
  const { returnEquipment } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [isDisputeFlagged, setIsDisputeFlagged] = useState(true);
  const containerRef = useRef(null);

  if (!isOpen || !booking) return null;

  // Baseline vs Return image assets
  const baselinePhoto =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";
  const returnPhoto =
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80";

  // Drag handlers
  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleCompleteReturn = (dispute = false) => {
    returnEquipment(booking.id, {
      dispute,
      notes: dispute
        ? "VisionGuard anomaly: Tooling friction wear on collet. Flagged for lab director review."
        : "Standard operational return. Clean signoff.",
    });
    onReturnComplete(booking.id);
    onClose();
  };

  return (
    <div
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">VisionGuard AI Condition Diff</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Multimodal 2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Comparing pre-use baseline against return inspection for {booking.resourceTitle}
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
          {/* Instructions */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Drag the central divider to compare pre-use baseline against post-use return</span>
            <span className="font-mono text-emerald-400">Split: {Math.round(sliderPosition)}%</span>
          </div>

          {/* Side-by-Side Diff Slider Container */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-950 cursor-ew-resize select-none shadow-2xl"
          >
            {/* Background Image: Return Condition (Right side view) */}
            <img
              src={returnPhoto}
              alt="Return Condition"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Foreground Image: Baseline Condition (Left side clipped) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={baselinePhoto}
                alt="Baseline Check-In Condition"
                className="absolute inset-y-0 left-0 max-w-none h-full object-cover"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
              />
            </div>

            {/* Bounding Box Overlay for VisionGuard Anomaly */}
            {/* Box coordinates [ymin: 420, xmin: 380, ymax: 560, xmax: 540] normalized to percentage */}
            <div
              className="absolute pointer-events-none border-2 border-amber-400 bg-amber-400/10 rounded-md transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              style={{
                top: "42%",
                left: "40%",
                width: "22%",
                height: "26%",
              }}
            >
              <div className="absolute -top-6 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/60 text-[10px] font-mono text-amber-300 font-semibold shadow-md whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Collet Abrasion [94%]</span>
              </div>
            </div>

            {/* Labels on each side */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono text-zinc-300 border border-zinc-700 pointer-events-none">
              ← Pre-Use Baseline
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono text-zinc-300 border border-zinc-700 pointer-events-none">
              Post-Use Return →
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center shadow-xl">
                <Sliders className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* VisionGuard AI Diagnosis Card */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">VisionGuard AI Diagnostic Analysis</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                NORMAL_WEAR (94% Match)
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong>Observation:</strong> Superficial tooling friction marks detected on spindle collet shank at coordinates <code className="text-amber-300 font-mono text-[10px] bg-zinc-900 px-1 py-0.5 rounded">[420, 380, 560, 540]</code>. Structural runout and collet concentricity remain within ISO 10791 tolerance (0.003 mm).
            </p>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Automated Recommendation: <strong>Waive deposit; flag for routine bi-weekly maintenance.</strong></span>
              <span className="font-mono text-emerald-400">Security Deposit: $0.00 At Risk</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Decision: Review anomaly findings before completing return transaction.
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-flag-damage"
              onClick={() => handleCompleteReturn(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-950 border border-amber-500/40 transition-colors"
            >
              Flag for Lab Director Review
            </button>
            <button
              id="btn-clean-return"
              onClick={() => handleCompleteReturn(false)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/30"
            >
              <span>Submit Clean Return</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnAndInspectModal;
