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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Approved • Ready for QR Check-In
          </span>
        );
      case "checked_in":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            In Active Custody
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            Under Lab Director Review (Normal Wear)
          </span>
        );
      case "returned":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Transaction Completed
          </span>
        );
      case "requested":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/40">
            <Clock className="w-3.5 h-3.5" />
            Awaiting Director Approval
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-emerald-400" />
            <span>My Equipment Custody & Reservation Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
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
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-surface border transition-all ${isCheckedIn
                ? "border-blue-500/50 shadow-lg shadow-blue-950/20"
                : isApproved
                  ? "border-emerald-500/40 shadow-lg shadow-emerald-950/10"
                  : "border-border"
                }`}
            >
              {/* Left Column: Asset Info & Purpose */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {booking.resourceTitle}
                  </h3>
                  {getStatusBadge(booking.status)}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                  <strong>Research Purpose:</strong> {booking.purpose}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    {booking.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {booking.certName} (TrustScan Verified)
                  </span>
                  <span>•</span>
                  <span className="font-mono text-zinc-500">ID: {booking.id}</span>
                </div>
              </div>

              {/* Middle Column: Live Countdown Timer if Checked In */}
              {isCheckedIn && (
                <div className="flex flex-col items-start lg:items-center justify-center p-4 rounded-xl bg-blue-950/40 border border-blue-800/40">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-blue-300">
                    Active Custody Remaining
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-white mt-0.5 tracking-tight">
                    {formatTimer(activeTimerSeconds)}
                  </span>
                  <span className="text-[10px] text-blue-400/80 mt-1">
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-950/20"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Check In with QR & Baseline</span>
                  </button>
                )}

                {isCheckedIn && (
                  <button
                    id={`btn-open-return-${booking.id}`}
                    onClick={() => setReturnTarget(booking)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-950/30"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Initiate Return & AI Diff</span>
                  </button>
                )}

                {booking.status === "disputed" && (
                  <button
                    onClick={() => setReturnTarget(booking)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 transition-colors"
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
