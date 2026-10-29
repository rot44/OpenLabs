import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { OpenLabsLogo } from "./OpenLabsLogo";
import {
  Compass,
  KeyRound,
  LayoutDashboard,
  History,
  CheckCircle2,
  ChevronDown,
  LogOut,
  UserCheck,
  Shield,
  Clock,
  LogIn,
  Building,
  GraduationCap
} from "lucide-react";

export function NavigationHeader() {
  const {
    activeTab,
    setActiveTab,
    activePersona,
    activePersonaKey,
    openAuthModal,
    isAuthenticated,
    logout,
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: "catalog", label: "Explore Catalog", icon: Compass },
    { id: "custody", label: "My Custody & Bookings", icon: KeyRound },
    {
      id: "manager",
      label: "Lab Director Hub",
      icon: LayoutDashboard,
      badge: activePersonaKey === "elena" ? "Director Mode" : null,
    },
    {
      id: "audit",
      label: "Audit & Fairness Ledger",
      icon: History,
      badge: activePersonaKey === "marcus" ? "Admin Mode" : null,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sandstone-border bg-limestone/95 backdrop-blur-md px-4 py-3 shadow-stone-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Identity + System Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <OpenLabsLogo size="sm" />
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sandstone/60 border border-sandstone-border text-[11px] font-medium text-earthInk-muted shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cobalt animate-pulse" />
            <span className="font-semibold text-earthInk">Campus Asset Dispatch</span>
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-cobalt text-white shadow-md shadow-cobalt/20"
                    : "text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-earthInk-muted"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? "bg-white/20 text-white" : "bg-rust/15 text-rust border border-rust/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Profile Menu or Sign In CTA */}
        <div className="relative shrink-0 flex items-center gap-2" ref={dropdownRef}>
          {isAuthenticated ? (
            <div>
              {/* Trigger Button */}
              <button
                id="btn-user-profile-menu"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-limestone-light border border-sandstone-border hover:border-cobalt/40 shadow-stone-sm transition-all cursor-pointer group"
              >
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cobalt/30 group-hover:ring-cobalt transition-all"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-earthInk group-hover:text-cobalt transition-colors">
                      {activePersona.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-weathered/40 text-earthInk-muted font-medium">
                      {activePersona.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-earthInk-muted truncate max-w-[120px]">
                    {activePersona.email}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-earthInk-faint transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180 text-cobalt" : ""
                  }`}
                />
              </button>

              {/* Interactive Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-3xl bg-limestone border border-sandstone-border shadow-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {/* User Overview */}
                  <div className="flex items-start gap-3 pb-3 border-b border-sandstone-border">
                    <img
                      src={activePersona.avatar}
                      alt={activePersona.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cobalt/30"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-earthInk truncate">{activePersona.name}</h4>
                      <p className="text-xs text-earthInk-muted truncate">{activePersona.email}</p>
                      <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-earthInk-faint">
                        <span>ID:</span>
                        <span className="font-bold text-earthInk">{activePersona.institutionalId || "STU-8829"}</span>
                        <span>•</span>
                        <span className="text-cobalt font-semibold">Rep {(activePersona.reputationScore * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Department Info */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-earthInk-muted">
                      <Building className="w-3.5 h-3.5 text-cobalt shrink-0" />
                      <span className="truncate">{activePersona.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-earthInk-muted">
                      <GraduationCap className="w-3.5 h-3.5 text-rust shrink-0" />
                      <span className="capitalize">{activePersona.title}</span>
                    </div>
                  </div>

                  {/* Quota Progress Meter (If applicable) */}
                  {activePersona.maxWeeklyHours > 0 && (
                    <div className="p-3 rounded-2xl bg-sandstone/40 border border-sandstone-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-earthInk">Weekly Machine Quota</span>
                        <span className="font-mono text-earthInk-muted">
                          {activePersona.weeklyHoursUsed} / {activePersona.maxWeeklyHours}h
                        </span>
                      </div>
                      <div className="w-full h-2 bg-sandstone-dark rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cobalt rounded-full transition-all"
                          style={{
                            width: `${(activePersona.weeklyHoursUsed / activePersona.maxWeeklyHours) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Safety Clearances */}
                  {activePersona.safetyCertificates && activePersona.safetyCertificates.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-earthInk-faint tracking-wider">
                        Active Safety Clearances
                      </span>
                      <div className="space-y-1">
                        {activePersona.safetyCertificates.map((cert, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-limestone-light border border-sandstone-border text-xs"
                          >
                            <span className="text-earthInk font-medium truncate max-w-[190px]">{cert.name}</span>
                            <span className="text-[10px] text-cobalt font-mono font-bold bg-cobalt/10 px-1.5 py-0.5 rounded">
                              Verified
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown Action Buttons */}
                  <div className="pt-2 border-t border-sandstone-border space-y-1.5">
                    <button
                      id="btn-dropdown-switch-account"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-earthInk hover:bg-sandstone/60 transition-colors cursor-pointer text-left"
                    >
                      <UserCheck className="w-4 h-4 text-cobalt" />
                      <span>Switch Institutional Account</span>
                    </button>

                    <button
                      id="btn-dropdown-signout"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rust hover:bg-rust/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rust" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-header-signin"
              onClick={openAuthModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-cobalt hover:bg-cobalt-hover shadow-md shadow-cobalt/25 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / SSO</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
