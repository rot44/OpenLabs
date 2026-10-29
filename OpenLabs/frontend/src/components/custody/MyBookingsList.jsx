import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CheckInModal } from "./CheckInModal";
import { ReturnAndInspectModal } from "./ReturnAndInspectModal";
import { Clock, KeyRound, QrCode, Sliders, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export function MyBookingsList() {
  const { bookings, activePersona } = useApp();
  const [checkInTarget, setCheckInTarget] = useState(null);
  const [returnTarget, setReturnTarget] = useState(null);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(7140); // ~1h 59m live simulation

  // Live countdown timer for checked_in asset
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cobalt/10 text-cobalt border border-cobalt/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse" />
            Approved • Ready for QR Check-In
          </span>
        );
      case "checked_in":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-weathered/60 text-earthInk border border-sandstone-border">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-ping" />
            In Active Custody
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rust/15 text-rust border border-rust/40">
            <AlertTriangle className="w-3.5 h-3.5 text-rust" />
            Under Lab Director Review (Normal Wear)
          </span>
        );
      case "returned":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-weathered/40 text-earthInk-muted border border-sandstone-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-cobalt" />
            Transaction Completed
          </span>
        );
      case "requested":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sandstone text-earthInk-muted border border-sandstone-border">
            <Clock className="w-3.5 h-3.5 text-earthInk-faint" />
            Awaiting Director Approval
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sandstone-border">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-earthInk tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-cobalt" />
            <span>My Equipment Custody & Reservation Ledger</span>
          </h1>
          <p className="text-xs text-earthInk-muted mt-1">
            Track equipment in your possession, initiate QR handoffs, and manage post-use AI return inspections.
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isCheckedIn = booking.status === "checked_in";
          const isApproved = booking.status === "approved";

          return (
            <div
              key={booking.id}
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-limestone border transition-all ${
                isCheckedIn
                  ? "border-cobalt/40 shadow-stone-md ring-1.5 ring-cobalt/30"
                  : isApproved
                  ? "border-cobalt/30 shadow-stone-sm ring-1 ring-cobalt/20"
                  : "border-sandstone-border shadow-stone-sm"
              }`}
            >
              {/* Left Column: Asset Info & Purpose */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-bold text-earthInk tracking-tight">
                    {booking.resourceTitle}
                  </h3>
                  {getStatusBadge(booking.status)}
                </div>

                <p className="text-xs text-earthInk-muted leading-relaxed max-w-2xl">
                  <strong className="text-earthInk font-semibold">Research Purpose:</strong> {booking.purpose}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-earthInk-muted pt-1">
                  <span className="flex items-center gap-1 font-mono text-earthInk-muted">
                    <Clock className="w-3.5 h-3.5 text-earthInk-faint" />
                    {booking.date}
                  </span>
                  <span className="text-sandstone-darker">•</span>
                  <span className="flex items-center gap-1 text-cobalt font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {booking.certName} (TrustScan Verified)
                  </span>
                  <span className="text-sandstone-darker">•</span>
                  <span className="font-mono text-earthInk-faint">ID: {booking.id}</span>
                </div>
              </div>

              {/* Middle Column: Live Countdown Timer if Checked In */}
              {isCheckedIn && (
                <div className="flex flex-col items-start lg:items-center justify-center p-4 rounded-xl bg-weathered/30 border border-sandstone-border shadow-inner">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-earthInk-faint font-bold">
                    Active Custody Remaining
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-earthInk mt-0.5 tracking-tight">
                    {formatTimer(activeTimerSeconds)}
                  </span>
                  <span className="text-[10px] text-earthInk-muted mt-1 font-medium">
                    Turnaround buffer begins automatically at 00:00
                  </span>
                </div>
              )}

              {/* Right Column: Dynamic Action CTAs */}
              <div className="flex items-center gap-3">
                {isApproved && (
                  <button
                    id={`btn-open-checkin-${booking.id}`}
                    onClick={() => setCheckInTarget(booking)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/25 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Check In with QR & Baseline</span>
                  </button>
                )}

                {isCheckedIn && (
                  <button
                    id={`btn-open-return-${booking.id}`}
                    onClick={() => setReturnTarget(booking)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/25 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Initiate Return & AI Diff</span>
                  </button>
                )}

                {booking.status === "disputed" && (
                  <button
                    onClick={() => setReturnTarget(booking)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rust hover:bg-rust-hover transition-colors shadow-md shadow-rust/25 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Inspect VisionGuard Diff</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CheckInModal
        booking={checkInTarget}
        isOpen={!!checkInTarget}
        onClose={() => setCheckInTarget(null)}
        onCheckInComplete={(id) => {
          // Handled in context
        }}
      />

      <ReturnAndInspectModal
        booking={returnTarget}
        isOpen={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        onReturnComplete={(id) => {
          // Handled in context
        }}
      />
    </div>
  );
}

export default MyBookingsList;
