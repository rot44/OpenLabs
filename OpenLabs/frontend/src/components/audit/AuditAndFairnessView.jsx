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
        return "text-cobalt bg-weathered/30 border-cobalt/30";
      case "VERIFY_CREDENTIAL":
        return "text-cobalt bg-weathered/50 border-cobalt/40";
      case "SUBMIT_REQUEST":
        return "text-cobalt bg-sandstone border-cobalt/30";
      case "APPROVE_BOOKING":
        return "text-cobalt bg-limestone-light border-cobalt/40";
      case "PERFORM_CHECKIN":
        return "text-cobalt bg-weathered/40 border-cobalt/40";
      case "INITIATE_RETURN":
        return "text-rust bg-rust/10 border-rust/30";
      case "AI_DIFF_ANOMALY":
        return "text-rust bg-rust/20 border-rust/50 font-bold";
      case "RESOLVE_INCIDENT":
      case "COMPLETE_TRANSACTION":
        return "text-cobalt bg-weathered/40 border-sandstone-border";
      default:
        return "text-earthInk-muted bg-sandstone border-sandstone-border";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sandstone-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-weathered/50 border border-sandstone-border text-earthInk text-xs font-semibold mb-1.5 font-mono">
            Campus Safety & Audit Office
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-earthInk tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-cobalt" />
            <span>Immutable Audit Trail & Departmental Parity Ledger</span>
          </h1>
          <p className="text-xs text-earthInk-muted mt-1">
            Cryptographically sealed SHA-256 state chain and anti-monopolization quota enforcement • Marcus Thorne
          </p>
        </div>
      </div>

      {/* Top Section: Departmental Parity & Anti-Hoarding Widget */}
      <div className="rounded-2xl bg-limestone border border-sandstone-border p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sandstone-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cobalt" />
            <h3 className="text-base font-bold text-earthInk tracking-tight">
              30-Day Institutional Resource Allocation & Monopolization Index
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-earthInk-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-rust" />
            <span>Parity Ceiling: <strong className="text-rust">40.0% Max Cap</strong></span>
          </div>
        </div>

        <p className="text-xs text-earthInk-muted leading-relaxed max-w-3xl">
          To prevent single-department equipment hoarding, institutional policy restricts any individual academic unit from consuming more than 40% of cumulative machine hours over a rolling 30-day window. Excess requests are automatically routed to the fair-share queue.
        </p>

        {/* Progress Bars */}
        <div className="space-y-4 pt-2">
          {departments.map((dept, idx) => {
            const isNearLimit = dept.usagePct >= 35;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-earthInk">{dept.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-earthInk-muted">{dept.hours} Hours Logged</span>
                    <span className={`font-bold ${isNearLimit ? "text-rust" : "text-cobalt"}`}>
                      {dept.usagePct}%
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-3 bg-sandstone rounded-full overflow-hidden border border-sandstone-border">
                  {/* Active department bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearLimit ? "bg-rust" : "bg-cobalt"
                    }`}
                    style={{ width: `${dept.usagePct}%` }}
                  />

                  {/* 40% Parity Ceiling Line */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-rust z-10 shadow-sm"
                    style={{ left: "40%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-earthInk-muted font-mono">
          <span>Current Monopolization Index: <strong className="text-earthInk">0.14 (Nominal / Highly Equitable)</strong></span>
          <span className="text-cobalt font-semibold">Zero Active Violations</span>
        </div>
      </div>

      {/* Bottom Section: Audit History Event Stream */}
      <div className="rounded-2xl bg-limestone border border-sandstone-border p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-sandstone-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cobalt" />
            <h3 className="text-base font-bold text-earthInk tracking-tight">
              Cryptographic Audit Stream (Immutable SHA-256 Ledger)
            </h3>
          </div>
          <span className="text-xs text-earthInk-muted font-mono">
            {auditLogs.length} Verified Block Records
          </span>
        </div>

        {/* Chronological Event Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.5 before:w-0.5 before:bg-sandstone-border">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Glowing Timeline Node */}
              <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-sandstone border-2 border-cobalt ring-4 ring-limestone group-hover:scale-125 transition-transform" />

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-limestone-light border border-sandstone-border hover:border-cobalt/40 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-earthInk">{log.target}</span>
                  </div>

                  <span className="text-[11px] font-mono text-earthInk-muted">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-earthInk leading-relaxed">
                  {log.details}
                </p>

                <div className="pt-2 border-t border-sandstone-border flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-earthInk-muted">
                    Sealed by: <strong className="text-earthInk">{log.actor}</strong> ({log.actorRole})
                  </span>

                  <span className="flex items-center gap-1 font-mono text-[10px] text-earthInk-muted bg-sandstone px-2 py-0.5 rounded border border-sandstone-border">
                    <Lock className="w-3 h-3 text-cobalt" />
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
