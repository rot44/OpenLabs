import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { X, Sparkles, AlertTriangle, Sliders, ArrowRight, UploadCloud, Camera, CheckCircle2 } from "lucide-react";

export function ReturnAndInspectModal({ booking, isOpen, onClose, onReturnComplete }) {
  const { returnEquipment } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultBaseline =
    booking?.baselinePhotos?.[0]?.url ||
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";

  const defaultReturn =
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80";

  const [returnPhoto, setReturnPhoto] = useState(defaultReturn);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);

  if (!isOpen || !booking) return null;

  const baselinePhoto = defaultBaseline;

  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReturnPhoto(event.target.result);
        setIsCustomPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

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
      returnPhotos: [returnPhoto],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earthInk/65 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-stone-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-earthInk tracking-tight">VisionGuard AI Condition Diff</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cobalt/10 text-cobalt border border-cobalt/25">
                  Multimodal 2.0
                </span>
              </div>
              <p className="text-xs text-earthInk-muted mt-0.5">
                Comparing pre-use baseline against return inspection for {booking.resourceTitle}
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
          {/* Instructions & Upload Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-earthInk-muted">
            <span>Drag the central divider to compare pre-use baseline against post-use return</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-cobalt font-bold">Split: {Math.round(sliderPosition)}%</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cobalt/10 text-cobalt hover:bg-cobalt/20 border border-cobalt/25 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Return Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                className="hidden"
              />
            </div>
          </div>

          {/* Side-by-Side Diff Slider Container */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden border border-sandstone-border bg-sandstone cursor-ew-resize select-none shadow-stone-md"
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

            {/* Bounding Box Overlay for VisionGuard Anomaly (Rust highlight) */}
            <div
              className="absolute pointer-events-none border-2 border-rust bg-rust/20 rounded-md transition-all shadow-rust-glow"
              style={{
                top: "42%",
                left: "40%",
                width: "22%",
                height: "26%",
              }}
            >
              <div className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded bg-rust text-white text-[10px] font-mono font-bold shadow-md whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Collet Abrasion [94%]</span>
              </div>
            </div>

            {/* Labels on each side */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-limestone/90 backdrop-blur-sm text-[11px] font-mono text-earthInk border border-limestone-border shadow-sm pointer-events-none font-semibold">
              ← Pre-Use Baseline
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-limestone/90 backdrop-blur-sm text-[11px] font-mono text-earthInk border border-limestone-border shadow-sm pointer-events-none font-semibold">
              Post-Use Return →
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-md pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cobalt border-2 border-white flex items-center justify-center shadow-lg">
                <Sliders className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* VisionGuard AI Diagnosis Card in Weathered Stone surface */}
          <div className="p-4 rounded-2xl bg-weathered/30 border border-weathered/60 space-y-3 shadow-stone-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rust" />
                <span className="text-xs font-bold text-earthInk">VisionGuard AI Diagnostic Analysis</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rust/15 text-rust-dark border border-rust/30 font-mono">
                NORMAL_WEAR (94% Match)
              </span>
            </div>

            <p className="text-xs text-earthInk-muted leading-relaxed">
              <strong>Observation:</strong> Superficial tooling friction marks detected on spindle collet shank at coordinates <code className="text-earthInk font-mono text-[10px] bg-limestone px-1.5 py-0.5 rounded border border-sandstone-border font-semibold">[420, 380, 560, 540]</code>. Structural runout and collet concentricity remain within ISO 10791 tolerance (0.003 mm).
            </p>

            <div className="pt-2 border-t border-weathered/60 flex items-center justify-between text-[11px] text-earthInk-muted">
              <span>Automated Recommendation: <strong>Waive deposit; flag for routine bi-weekly maintenance.</strong></span>
              <span className="font-mono text-cobalt font-bold">Security Deposit: $0.00 At Risk</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-sandstone-border bg-limestone-light flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-earthInk-muted">
            Decision: Review anomaly findings before completing return transaction.
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-flag-damage"
              onClick={() => handleCompleteReturn(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rust-dark bg-rust/15 hover:bg-rust/25 border border-rust/35 transition-colors"
            >
              Flag for Lab Director Review
            </button>
            <button
              id="btn-clean-return"
              onClick={() => handleCompleteReturn(false)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/25"
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
