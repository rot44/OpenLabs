import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ReturnAndInspectModal } from "../custody/ReturnAndInspectModal";
import { LayoutDashboard, CheckCircle2, XCircle, Clock, ShieldCheck, AlertTriangle, User, Layers, ArrowUpRight, Sliders } from "lucide-react";

export function ManagerDashboard() {
  const { bookings, approveBooking, resolveIncident } = useApp();
  const [inspectModalBooking, setInspectModalBooking] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Filter pending requests and active custody
  const pendingRequests = bookings.filter((b) => b.status === "requested");
  const activeCustody = bookings.filter((b) => b.status === "checked_in");
  const incidents = bookings.filter((b) => b.status === "disputed");

  const handleApprove = (bookingId) => {
    approveBooking(bookingId);
    setSuccessToast(`Access approved for booking ${bookingId}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleResolve = (bookingId, resolution) => {
    resolveIncident(bookingId, resolution);
    setSuccessToast(
      resolution === "waived"
        ? "Wear & tear waived. Booking successfully closed!"
        : "Incident recorded and forwarded to facilities."
    );
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-300 text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-1.5 font-mono">
            Lab Director Control Center
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-cyan-400" />
            <span>Facility Oversight & Custody Operations</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Supervising Advanced Manufacturing & Bio-Imaging Facility • Dr. Elena Vance
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Registered Flagships</span>
          <div className="text-2xl font-bold text-white mt-1">6 Assets</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">100% Operational Status</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Pending Authorization</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {pendingRequests.length} Requests
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">TrustScan OCR pre-cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Active Custody Floor</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {activeCustody.length} In-Use
          </div>
          <span className="text-[11px] text-blue-400/80 mt-1 block">Live telemetry monitored</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Institutional Parity</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">38% Peak</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Within 40% department cap</span>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Pending Access Authorizations ({pendingRequests.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Requires Director Signature</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No pending access requests. All equipment requests have been processed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Requester & Dept</th>
                  <th className="py-2.5 px-3">Target Asset</th>
                  <th className="py-2.5 px-3">Time Window</th>
                  <th className="py-2.5 px-3">TrustScan Verification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-850/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                          {req.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{req.userName}</div>
                          <div className="text-[10px] text-zinc-400">{req.userDepartment}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-zinc-200">
                      {req.resourceTitle}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-zinc-400">
                      {req.date} ({req.durationHours}h)
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{req.certName}</span>
                        <span className="font-mono text-emerald-400 font-bold">98.4%</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-approve-${req.id}`}
                          onClick={() => handleApprove(req.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm"
                        >
                          Approve Access
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incident Review Drawer if any return is disputed */}
      {incidents.length > 0 && (
        <div className="rounded-2xl bg-amber-950/30 border border-amber-500/40 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                VisionGuard Flagged Incident Review ({incidents.length})
              </h3>
            </div>
            <span className="text-xs text-amber-300 font-mono">Automated Damage Diff Alert</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span>{inc.resourceTitle}</span>
                    <span className="text-xs text-zinc-400">• Returned by {inc.userName}</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">
                    {inc.returnNotes}
                  </p>
                  <div className="text-[11px] text-amber-400 font-mono mt-1">
                    VisionGuard AI: NORMAL_WEAR localized on collet [ymin: 420, xmin: 380, ymax: 560, xmax: 540]
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectModalBooking(inc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>View Diff Slider</span>
                  </button>
                  <button
                    id={`btn-waive-${inc.id}`}
                    onClick={() => handleResolve(inc.id, "waived")}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm"
                  >
                    Waive (Standard Wear)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Custody Tracker */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Machinery Currently in Physical Custody ({activeCustody.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Floor Telemetry Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCustody.map((cust) => (
            <div
              key={cust.id}
              className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                  Physical Custody Active
                </span>
                <h4 className="text-sm font-bold text-white mt-2">{cust.resourceTitle}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{cust.userName} ({cust.userDepartment})</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Purpose: {cust.purpose}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Live Window</span>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                  Nominal
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff Inspection Modal if clicked */}
      <ReturnAndInspectModal
        booking={inspectModalBooking}
        isOpen={!!inspectModalBooking}
        onClose={() => setInspectModalBooking(null)}
        onReturnComplete={(id) => {
          // Handled in context
        }}
      />
    </div>
  );
}

export default ManagerDashboard;
