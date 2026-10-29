import React from "react";
import { useApp } from "../../context/AppContext";
import { History, Shield, Lock, BarChart3, AlertOctagon, CheckCircle2, FileCode, Users } from "lucide-react";

export function AuditAndFairnessView() {
  const { auditLogs } = useApp();

  // Seeded departmental parity percentages
  const departments = [
    { name: "Mechanical & Aerospace Engineering", usagePct: 38, hours: 152, status: "near_limit" },
    { name: "Biomedical Engineering", usagePct: 29, hours: 116, status: "nominal" },
    { name: "Electrical & Computer Engineering", usagePct: 22, hours: 88, status: "nominal" },
    { name: "Visual Arts & Interactive Media", usagePct: 11, hours: 44, status: "nominal" },
  ];

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE_LISTING":
        return "text-cyan-400 bg-cyan-950/60 border-cyan-800/40";
      case "VERIFY_CREDENTIAL":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-800/40";
      case "SUBMIT_REQUEST":
        return "text-blue-400 bg-blue-950/60 border-blue-800/40";
      case "APPROVE_BOOKING":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-800/40";
      case "PERFORM_CHECKIN":
        return "text-indigo-400 bg-indigo-950/60 border-indigo-800/40";
      case "INITIATE_RETURN":
        return "text-amber-400 bg-amber-950/60 border-amber-800/40";
      case "AI_DIFF_ANOMALY":
        return "text-red-400 bg-red-950/60 border-red-800/40";
      case "RESOLVE_INCIDENT":
      case "COMPLETE_TRANSACTION":
        return "text-purple-400 bg-purple-950/60 border-purple-800/40";
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-1.5 font-mono">
            Campus Safety & Audit Office
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Immutable Audit Trail & Departmental Parity Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cryptographically sealed SHA-256 state chain and anti-monopolization quota enforcement • Marcus Thorne
          </p>
        </div>
      </div>

      {/* Top Section: Departmental Parity & Anti-Hoarding Widget */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              30-Day Institutional Resource Allocation & Monopolization Index
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Parity Ceiling: <strong>40.0% Max Cap</strong></span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          To prevent single-department equipment hoarding, institutional policy restricts any individual academic unit from consuming more than 40% of cumulative machine hours over a rolling 30-day window. Excess requests are automatically routed to the fair-share queue.
        </p>

        {/* Progress Bars */}
        <div className="space-y-4 pt-2">
          {departments.map((dept, idx) => {
            const isNearLimit = dept.usagePct >= 35;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{dept.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400">{dept.hours} Hours Logged</span>
                    <span className={`font-bold ${isNearLimit ? "text-amber-400" : "text-emerald-400"}`}>
                      {dept.usagePct}%
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  {/* Active department bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearLimit ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                    style={{ width: `${dept.usagePct}%` }}
                  />

                  {/* 40% Parity Ceiling Line */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-red-500 z-10"
                    style={{ left: "40%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Current Monopolization Index: <strong>0.14 (Nominal / Highly Equitable)</strong></span>
          <span className="text-emerald-400">Zero Active Violations</span>
        </div>
      </div>

      {/* Bottom Section: Audit History Event Stream */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Cryptographic Audit Stream (Immutable SHA-256 Ledger)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {auditLogs.length} Verified Block Records
          </span>
        </div>

        {/* Chronological Event Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.5 before:w-0.5 before:bg-zinc-800">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Glowing Timeline Node */}
              <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-zinc-900 border-2 border-emerald-400 ring-4 ring-zinc-950 group-hover:scale-125 transition-transform" />

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-white">{log.target}</span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {log.details}
                </p>

                <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-zinc-400">
                    Sealed by: <strong className="text-zinc-200">{log.actor}</strong> ({log.actorRole})
                  </span>

                  <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    <Lock className="w-3 h-3 text-emerald-400/80" />
                    <span>sha256:{log.hash.slice(0, 16)}...{log.hash.slice(-8)}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditAndFairnessView;
