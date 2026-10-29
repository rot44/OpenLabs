import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ReturnAndInspectModal } from "../custody/ReturnAndInspectModal";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  Layers,
  Sliders,
  UserPlus,
  KeyRound,
  Check,
  X,
  Building2,
  GraduationCap,
  Sparkles,
  BadgeCheck,
  ShieldAlert
} from "lucide-react";

// Individual Onboarding Card allowing Dr. Elena Vance to decide role, department, and quota
function OnboardingRequestItem({ request, onAuthorize, onReject }) {
  const [selectedRole, setSelectedRole] = useState(request.suggestedRole || "requester");
  const [selectedDepartment, setSelectedDepartment] = useState(
    request.proposedDepartment || "Mechanical & Aerospace Engineering"
  );
  const [selectedQuota, setSelectedQuota] = useState(
    selectedRole === "owner" ? "20" : selectedRole === "admin" ? "0" : "15"
  );
  const [customTitle, setCustomTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Update default quota and title when role changes
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === "owner") {
      setSelectedQuota("20");
      setCustomTitle("Lab Director / Equipment Owner");
    } else if (role === "admin") {
      setSelectedQuota("0");
      setCustomTitle("Campus Safety Admin / Auditor");
    } else {
      setSelectedQuota("15");
      setCustomTitle("Student / Researcher");
    }
  };

  const handleAuthorizeClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onAuthorize(request.id, {
        role: selectedRole,
        department: selectedDepartment,
        maxWeeklyHours: Number(selectedQuota),
        title: customTitle || undefined,
      });
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div
      key={request.id}
      className="p-5 rounded-2xl bg-limestone border border-sandstone-border hover:border-cobalt/40 transition-all space-y-4 shadow-stone-sm"
    >
      {/* Top Request Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <img
            src={request.avatar}
            alt={request.name}
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cobalt/25 shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="w-11 h-11 rounded-2xl bg-cobalt/10 border border-cobalt/25 hidden items-center justify-center font-bold text-cobalt shrink-0">
            {request.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-earthInk">{request.name}</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rust/10 text-rust border border-rust/25">
                Pending Clearance
              </span>
            </div>
            <p className="text-xs text-earthInk-muted">{request.email}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-earthInk-faint">
              <span className="inline-flex items-center gap-1 text-cobalt font-semibold">
                <Sparkles className="w-3 h-3" />
                {request.authMethod === "google_oauth" ? "Google Workspace SSO (GIS)" : "Campus SSO Directory"}
              </span>
              <span>•</span>
              <span>Requested {request.requestedAt}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-mono font-bold text-earthInk-faint">Request ID</span>
          <div className="text-xs font-mono text-earthInk font-semibold">{request.id}</div>
        </div>
      </div>

      {/* Designation Controls for Dr. Elena Vance */}
      <div className="p-4 rounded-xl bg-limestone-light border border-sandstone-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-earthInk font-mono uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-cobalt" />
          <span>Director Role Designation Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Role Selector */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold text-earthInk-muted mb-1">
              Institutional Designation
            </label>
            <select
              id={`select-role-${request.id}`}
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-limestone border border-sandstone-border text-earthInk focus:outline-none focus:ring-2 focus:ring-cobalt/40"
            >
              <option value="requester">Student / Researcher (Requester)</option>
              <option value="owner">Core Facility Director / PI (Owner)</option>
              <option value="admin">Safety Auditor / Risk Admin (Admin)</option>
            </select>
          </div>

          {/* Department Selector */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold text-earthInk-muted mb-1">
              Department Affiliation
            </label>
            <select
              id={`select-dept-${request.id}`}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-limestone border border-sandstone-border text-earthInk focus:outline-none focus:ring-2 focus:ring-cobalt/40"
            >
              <option value="Mechanical & Aerospace Engineering">Mechanical & Aerospace Engineering</option>
              <option value="Advanced Manufacturing & Bio-Engineering">Advanced Manufacturing & Bio-Engineering</option>
              <option value="Biomedical Engineering">Biomedical Engineering & Imaging</option>
              <option value="Materials Science & Engineering">Materials Science & Nanotechnology</option>
              <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>
              <option value="Visual Arts & Interactive Robotics">Robotics & Digital Prototyping</option>
            </select>
          </div>

          {/* Weekly Machine Quota */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-bold text-earthInk-muted mb-1">
              Weekly Equipment Quota
            </label>
            <select
              id={`select-quota-${request.id}`}
              value={selectedQuota}
              onChange={(e) => setSelectedQuota(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-limestone border border-sandstone-border text-earthInk focus:outline-none focus:ring-2 focus:ring-cobalt/40"
            >
              <option value="10">10 Hours / Wk (Standard Undergrad)</option>
              <option value="15">15 Hours / Wk (Capstone Researcher)</option>
              <option value="20">20 Hours / Wk (Graduate / Postdoc)</option>
              <option value="35">35 Hours / Wk (Core Facility Lead)</option>
              <option value="0">Unlimited (Auditor / Full Clearance)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Decision Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-earthInk-muted">
          Designation grants access to equipment reservation ledgers and campus custody tokens.
        </span>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            id={`btn-decline-designation-${request.id}`}
            onClick={() => onReject(request.id)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rust hover:bg-rust/10 border border-rust/30 transition-all cursor-pointer"
          >
            Decline
          </button>

          <button
            type="button"
            id={`btn-authorize-designation-${request.id}`}
            disabled={isProcessing}
            onClick={handleAuthorizeClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-cobalt hover:bg-cobalt-hover shadow-sm shadow-cobalt/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <span>Issuing Token...</span>
            ) : (
              <>
                <BadgeCheck className="w-4 h-4" />
                <span>Authorize Designation & Issue Campus Token</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ManagerDashboard() {
  const {
    bookings,
    approveBooking,
    resolveIncident,
    onboardingRequests = [],
    authorizeUserDesignation,
    rejectUserRequest,
    registeredPersonas = {},
  } = useApp();

  const [inspectModalBooking, setInspectModalBooking] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [activeOnboardingTab, setActiveOnboardingTab] = useState("pending"); // 'pending' | 'cleared'

  const pendingRequests = bookings.filter((b) => b.status === "requested");
  const activeCustody = bookings.filter((b) => b.status === "checked_in");
  const incidents = bookings.filter((b) => b.status === "disputed");

  const pendingOnboarding = onboardingRequests.filter((r) => r.status === "pending");
  const approvedOnboarding = onboardingRequests.filter((r) => r.status === "approved");

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

  const handleAuthorizeDesignation = (requestId, options) => {
    const result = authorizeUserDesignation(requestId, options);
    if (result && result.success) {
      setSuccessToast(`Granted designation for ${result.persona?.name}! Institutional ID: ${result.persona?.institutionalId}`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleRejectDesignation = (requestId) => {
    rejectUserRequest(requestId);
    setSuccessToast("Access request declined.");
    setTimeout(() => setSuccessToast(null), 3000);
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
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Pending Role Designation</span>
          <div className="text-2xl font-extrabold text-rust mt-1">
            {pendingOnboarding.length} New Users
          </div>
          <span className="text-[11px] text-earthInk-muted mt-1 block">Awaiting Dr. Elena Vance</span>
        </div>

        <div className="p-4 rounded-2xl bg-limestone border border-sandstone-border shadow-stone-sm">
          <span className="text-[10px] uppercase font-mono text-earthInk-faint font-bold">Pending Reservations</span>
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
      </div>

      {/* Section 1: Dr. Elena Vance's Institutional Onboarding & Role Clearance Queue */}
      <div className="rounded-3xl bg-limestone border border-sandstone-border p-6 space-y-5 shadow-stone-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sandstone-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cobalt/10 text-cobalt border border-cobalt/25">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-earthInk tracking-tight">
                  Institutional Identity Onboarding & Role Clearance
                </h3>
                {pendingOnboarding.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rust/15 text-rust border border-rust/30 animate-pulse">
                    {pendingOnboarding.length} Awaiting Director Action
                  </span>
                )}
              </div>
              <p className="text-xs text-earthInk-muted mt-0.5">
                New accounts attempting login via Google Workspace SSO or Institutional Email require Dr. Elena Vance to assign designation, department, and quota.
              </p>
            </div>
          </div>

          {/* Sub-tabs: Pending vs Approved */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sandstone/60 border border-sandstone-border self-start sm:self-auto">
            <button
              type="button"
              id="tab-onboarding-pending"
              onClick={() => setActiveOnboardingTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeOnboardingTab === "pending"
                  ? "bg-cobalt text-white shadow-sm"
                  : "text-earthInk-muted hover:text-earthInk"
              }`}
            >
              Pending Clearance ({pendingOnboarding.length})
            </button>
            <button
              type="button"
              id="tab-onboarding-cleared"
              onClick={() => setActiveOnboardingTab("cleared")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeOnboardingTab === "cleared"
                  ? "bg-cobalt text-white shadow-sm"
                  : "text-earthInk-muted hover:text-earthInk"
              }`}
            >
              Cleared Personnel ({approvedOnboarding.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeOnboardingTab === "pending" ? (
          pendingOnboarding.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-cobalt mx-auto opacity-70" />
              <div className="text-sm font-bold text-earthInk">All Onboarding Clearances Processed</div>
              <p className="text-xs text-earthInk-muted max-w-md mx-auto">
                No new researcher accounts are waiting for designation. When a new email or Google SSO profile attempts login, their profile will appear here immediately for Dr. Elena Vance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOnboarding.map((req) => (
                <OnboardingRequestItem
                  key={req.id}
                  request={req}
                  onAuthorize={handleAuthorizeDesignation}
                  onReject={handleRejectDesignation}
                />
              ))}
            </div>
          )
        ) : (
          /* Cleared Personnel Directory */
          <div className="space-y-3">
            {approvedOnboarding.length === 0 ? (
              <div className="py-8 text-center text-xs text-earthInk-muted">
                No recently approved onboarding requests.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-sandstone-border text-earthInk-faint font-mono uppercase text-[10px]">
                      <th className="py-2.5 px-3">Personnel</th>
                      <th className="py-2.5 px-3">Granted Designation</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Institutional Token</th>
                      <th className="py-2.5 px-3">Approved By</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-border/60">
                    {approvedOnboarding.map((ap) => (
                      <tr key={ap.id} className="hover:bg-sandstone/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={ap.avatar}
                              alt={ap.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-sandstone-border"
                            />
                            <div>
                              <div className="font-bold text-earthInk">{ap.name}</div>
                              <div className="text-[10px] text-earthInk-muted">{ap.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-earthInk capitalize">
                            {ap.assignedTitle || ap.assignedRole || "Researcher"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-earthInk-muted font-medium">
                          {ap.department || "Engineering"}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-cobalt">
                          {ap.institutionalId || "STU-ACTIVE"}
                        </td>
                        <td className="py-3 px-3 text-earthInk-muted">
                          {ap.approvedBy || "Dr. Elena Vance"} ({ap.approvedAt || "Recent"})
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cobalt/10 text-cobalt border border-cobalt/25">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Pending Equipment Approvals Table */}
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
