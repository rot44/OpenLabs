import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ReturnAndInspectModal } from "../custody/ReturnAndInspectModal";
import { LayoutDashboard, CheckCircle2, Clock, ShieldCheck, AlertTriangle, User, Layers, Sliders } from "lucide-react";

export function ManagerDashboard() {
  const { bookings, approveBooking, resolveIncident } = useApp();
  const [inspectModalBooking, setInspectModalBooking] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-limestone border border-cobalt/40 text-earthInk text-xs shadow-stone-xl backdrop-blur-md animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-cobalt" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sandstone-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cobalt/10 border border-cobalt/25 text-cobalt text-xs font-bold mb-1.5 font-mono">
            Lab Director Control Center
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-earthInk tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-cobalt" />
            <span>Facility Oversight & Custody Operations</span>
          </h1>
          <p className="text-xs text-earthInk-muted mt-1">
            Supervising Advanced Manufacturing & Bio-Imaging Facility • Dr. Elena Vance
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-limestone border border-sandstone-border shadow-stone-sm">
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Registered Flagships</span>
          <div className="text-2xl font-extrabold text-earthInk mt-1">6 Assets</div>
          <span className="text-[11px] text-cobalt font-semibold mt-1 block">100% Operational Status</span>
        </div>

        <div className="p-4 rounded-2xl bg-limestone border border-sandstone-border shadow-stone-sm">
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Pending Authorization</span>
          <div className="text-2xl font-extrabold text-rust mt-1">
            {pendingRequests.length} Requests
          </div>
          <span className="text-[11px] text-earthInk-muted mt-1 block">TrustScan OCR pre-cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-limestone border border-sandstone-border shadow-stone-sm">
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Active Custody Floor</span>
          <div className="text-2xl font-extrabold text-cobalt mt-1">
            {activeCustody.length} In-Use
          </div>
          <span className="text-[11px] text-earthInk-muted mt-1 block">Live telemetry monitored</span>
        </div>

        <div className="p-4 rounded-2xl bg-limestone border border-sandstone-border shadow-stone-sm">
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Institutional Parity</span>
          <div className="text-2xl font-extrabold text-cobalt mt-1">38% Peak</div>
          <span className="text-[11px] text-earthInk-muted mt-1 block">Within 40% department cap</span>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="rounded-3xl bg-limestone border border-sandstone-border p-6 space-y-4 shadow-stone-sm">
        <div className="flex items-center justify-between pb-3 border-b border-sandstone-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rust" />
            <h3 className="text-base font-bold text-earthInk tracking-tight">
              Pending Access Authorizations ({pendingRequests.length})
            </h3>
          </div>
          <span className="text-xs text-earthInk-faint font-mono">Requires Director Signature</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-8 text-center text-xs text-earthInk-muted font-medium">
            No pending access requests. All equipment requests have been processed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sandstone-border text-earthInk-faint font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Requester & Dept</th>
                  <th className="py-2.5 px-3">Target Asset</th>
                  <th className="py-2.5 px-3">Time Window</th>
                  <th className="py-2.5 px-3">TrustScan Verification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-border/60">
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-sandstone/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-sandstone-dark flex items-center justify-center font-bold text-earthInk">
                          {req.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-earthInk">{req.userName}</div>
                          <div className="text-[10px] text-earthInk-muted">{req.userDepartment}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-earthInk">
                      {req.resourceTitle}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-earthInk-muted font-medium">
                      {req.date} ({req.durationHours}h)
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cobalt/10 border border-cobalt/25 text-cobalt text-[11px] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-cobalt" />
                        <span>{req.certName}</span>
                        <span className="font-mono text-cobalt font-bold">98.4%</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-approve-${req.id}`}
                          onClick={() => handleApprove(req.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-sm"
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
        <div className="rounded-3xl bg-rust/10 border border-rust/35 p-6 space-y-4 shadow-stone-sm">
          <div className="flex items-center justify-between pb-3 border-b border-rust/25">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rust" />
              <h3 className="text-base font-bold text-earthInk tracking-tight">
                VisionGuard Flagged Incident Review ({incidents.length})
              </h3>
            </div>
            <span className="text-xs text-rust-dark font-mono font-bold">Automated Damage Diff Alert</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-limestone border border-rust/30 shadow-stone-sm"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-earthInk">
                    <span>{inc.resourceTitle}</span>
                    <span className="text-xs text-earthInk-muted">• Returned by {inc.userName}</span>
                  </div>
                  <p className="text-xs text-earthInk-muted mt-1 leading-relaxed">
                    {inc.returnNotes}
                  </p>
                  <div className="text-[11px] text-rust font-mono mt-1 font-semibold">
                    VisionGuard AI: NORMAL_WEAR localized on collet [ymin: 420, xmin: 380, ymax: 560, xmax: 540]
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectModalBooking(inc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-earthInk bg-limestone-dark hover:bg-limestone border border-limestone-border transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>View Diff Slider</span>
                  </button>
                  <button
                    id={`btn-waive-${inc.id}`}
                    onClick={() => handleResolve(inc.id, "waived")}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-sm"
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
      <div className="rounded-3xl bg-limestone border border-sandstone-border p-6 space-y-4 shadow-stone-sm">
        <div className="flex items-center justify-between pb-3 border-b border-sandstone-border">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cobalt" />
            <h3 className="text-base font-bold text-earthInk tracking-tight">
              Machinery Currently in Physical Custody ({activeCustody.length})
            </h3>
          </div>
          <span className="text-xs text-earthInk-faint font-mono font-medium">Floor Telemetry Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCustody.map((cust) => (
            <div
              key={cust.id}
              className="p-4 rounded-2xl bg-limestone-light border border-sandstone-border flex items-start justify-between gap-4 shadow-stone-sm"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-lg border border-cobalt/25 font-bold">
                  Physical Custody Active
                </span>
                <h4 className="text-sm font-bold text-earthInk mt-2">{cust.resourceTitle}</h4>
                <div className="flex items-center gap-2 text-xs text-earthInk-muted mt-1">
                  <User className="w-3.5 h-3.5 text-earthInk-faint" />
                  <span>{cust.userName} ({cust.userDepartment})</span>
                </div>
                <div className="text-[11px] text-earthInk-faint mt-1">
                  Purpose: {cust.purpose}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-earthInk-faint font-bold">Live Window</span>
                <div className="text-sm font-mono font-bold text-cobalt mt-0.5">
                  Nominal
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReturnAndInspectModal
        booking={inspectModalBooking}
        isOpen={!!inspectModalBooking}
        onClose={() => setInspectModalBooking(null)}
        onReturnComplete={() => {}}
      />
    </div>
  );
}

export default ManagerDashboard;
