import React from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldAlert,
  Lock,
  UserX,
  ArrowRight,
  LogIn,
  Compass,
  FileCheck,
  Building,
  KeyRound,
  AlertCircle
} from "lucide-react";

export function InstitutionalAccessGate({ type = "faculty_required", tabName = "Restricted Area" }) {
  const { activePersona, isAuthenticated, openAuthModal, setActiveTab } = useApp();

  const configs = {
    auth_required: {
      code: "401 UNAUTHORIZED",
      icon: Lock,
      iconBg: "bg-cobalt/10 text-cobalt border-cobalt/30",
      badgeText: "University SSO Authentication Required",
      title: "Campus Identification Required",
      subtitle: `Access to ${tabName} is restricted to verified university personnel.`,
      description:
        "To review personal custody tokens, scan equipment QR beacons, or access institutional ledgers, you must sign in with an authorized @openlabs.edu account or verified Google Workspace SSO.",
      requiredRoleLabel: "Active University Identity (Student, Faculty, or EH&S)",
      primaryBtnText: "Sign In with SSO / Google",
      primaryBtnAction: openAuthModal,
    },
    faculty_required: {
      code: "403 FORBIDDEN • FACULTY CLEARANCE LEVEL 3",
      icon: ShieldAlert,
      iconBg: "bg-rust/15 text-rust border-rust/30",
      badgeText: "Faculty & Lab Director Clearance Required",
      title: "Faculty Clearance Required",
      subtitle: "This core facility control hub is restricted to Principal Investigators and Lab Directors.",
      description:
        "You are currently authenticated as a Student / Requester (Level 1 Clearance). Reviewing reservation requests, waiving equipment incidents, and modifying machine calibration parameters requires Faculty credentials (FAC-100482 or equivalent).",
      requiredRoleLabel: "Principal Investigator / Lab Director (FAC Clearance)",
      primaryBtnText: "Switch to Faculty Account",
      primaryBtnAction: openAuthModal,
    },
    admin_required: {
      code: "403 FORBIDDEN • ADMIN SECURITY CLEARANCE LEVEL 4",
      icon: ShieldAlert,
      iconBg: "bg-rust/15 text-rust border-rust/30",
      badgeText: "Campus Safety & Risk Management Clearance Required",
      title: "Administrative Security Clearance Required",
      subtitle: "Access to the cryptographic audit trail and anti-hoarding meters is restricted.",
      description:
        "Access to the immutable SHA-256 event ledger, campus-wide anti-hoarding 40% parity enforcement meters, and security compliance overrides is strictly limited to Institutional Safety Officers (ADM-009142 or equivalent).",
      requiredRoleLabel: "Institutional Safety Admin / Auditor (ADM Clearance)",
      primaryBtnText: "Switch to Safety Auditor Account",
      primaryBtnAction: openAuthModal,
    },
  };

  const config = configs[type] || configs.faculty_required;
  const Icon = config.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-3xl bg-limestone border border-sandstone-border shadow-stone-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Institutional Security Header */}
        <div className="px-6 py-4 bg-limestone-light border-b border-sandstone-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-rust tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rust animate-ping" />
            <span>{config.code}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-earthInk-muted">
            <span>Protocol:</span>
            <span className="font-semibold text-earthInk">OpenLabs-RBAC/2.4</span>
            <span>•</span>
            <span>Target:</span>
            <span className="font-semibold text-cobalt">{tabName}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className={`p-4 rounded-2xl border shrink-0 ${config.iconBg}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rust/10 text-rust border border-rust/25">
                {config.badgeText}
              </span>
              <h2 className="text-2xl font-black text-earthInk tracking-tight">{config.title}</h2>
              <p className="text-sm text-earthInk-muted leading-relaxed max-w-2xl">
                {config.description}
              </p>
            </div>
          </div>

          {/* Current vs Required Credentials Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Session */}
            <div className="p-4 rounded-2xl bg-sandstone/50 border border-sandstone-border space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-sandstone-border">
                <span className="font-mono uppercase font-bold text-earthInk-faint text-[10px]">
                  Active Workstation Session
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isAuthenticated ? "bg-cobalt/10 text-cobalt" : "bg-earthInk/10 text-earthInk-muted"
                  }`}
                >
                  {isAuthenticated ? "Authenticated" : "Unverified Guest"}
                </span>
              </div>

              {isAuthenticated && activePersona ? (
                <div className="flex items-start gap-3">
                  <img
                    src={activePersona.avatar}
                    alt={activePersona.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-sandstone-border shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <h4 className="font-bold text-earthInk truncate">{activePersona.name}</h4>
                    <p className="text-earthInk-muted text-[11px] truncate">{activePersona.email}</p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-earthInk-faint">
                      <span>ID: {activePersona.institutionalId}</span>
                      <span>•</span>
                      <span className="capitalize">{activePersona.role}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 text-xs text-earthInk-muted">
                  <UserX className="w-5 h-5 text-rust shrink-0" />
                  <span>No institutional credentials detected on this workstation.</span>
                </div>
              )}
            </div>

            {/* Required Clearance */}
            <div className="p-4 rounded-2xl bg-limestone-light border border-rust/30 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-sandstone-border">
                <span className="font-mono uppercase font-bold text-rust text-[10px]">
                  Required Minimum Clearance
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rust/10 text-rust">
                  Privileged
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rust/10 text-rust border border-rust/20 shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <h4 className="font-bold text-earthInk">{config.requiredRoleLabel}</h4>
                  <p className="text-earthInk-muted text-[11px] mt-0.5">
                    Requires verified RSA/ECDSA institutional key signature or validated institutional Google SSO token.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-sandstone-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="btn-gate-return-catalog"
              onClick={() => setActiveTab("catalog")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold text-earthInk hover:bg-sandstone transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-cobalt" />
              <span>Return to Resource Catalog</span>
            </button>

            <button
              id="btn-gate-switch-account"
              onClick={config.primaryBtnAction}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-cobalt hover:bg-cobalt-hover shadow-md shadow-cobalt/25 transition-all cursor-pointer"
            >
              <span>{config.primaryBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstitutionalAccessGate;
