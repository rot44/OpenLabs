import React from "react";
import { useApp } from "../../context/AppContext";
import { Compass, KeyRound, LayoutDashboard, History, CheckCircle2 } from "lucide-react";

export function NavigationHeader() {
  const { activeTab, setActiveTab, activePersona, activePersonaKey } = useApp();

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
    <header className="w-full border-b border-sandstone-border bg-limestone/80 backdrop-blur-sm px-4 py-3 shadow-stone-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cobalt text-white shadow-md shadow-cobalt/20"
                    : "text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-earthInk-muted"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? "bg-white/20 text-white" : "bg-rust/15 text-rust border border-rust/30"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Persona Profile Pill */}
        <div className="flex items-center gap-3 bg-limestone rounded-2xl px-3.5 py-1.5 border border-sandstone-border shadow-stone-sm">
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-cobalt/30"
          />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-earthInk">{activePersona.name}</span>
              <span className="text-[10px] text-earthInk-faint">({activePersona.role})</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-earthInk-muted">
              <span className="flex items-center gap-1 text-cobalt font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Rep: {(activePersona.reputationScore * 100).toFixed(0)}%
              </span>
              <span>•</span>
              <span className="truncate max-w-[140px] text-earthInk-muted">{activePersona.department}</span>
            </div>
          </div>

          {/* Fair Usage Meter */}
          {activePersona.maxWeeklyHours > 0 && (
            <div className="hidden lg:flex flex-col items-end pl-3 border-l border-sandstone-border">
              <span className="text-[10px] text-earthInk-muted">
                Weekly Quota: <strong className="text-earthInk">{activePersona.weeklyHoursUsed}/{activePersona.maxWeeklyHours}h</strong>
              </span>
              <div className="w-20 h-1.5 bg-sandstone-dark rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-cobalt rounded-full transition-all"
                  style={{ width: `${(activePersona.weeklyHoursUsed / activePersona.maxWeeklyHours) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
