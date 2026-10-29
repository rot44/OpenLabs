import React from "react";
import { useApp } from "../../context/AppContext";
import { Compass, KeyRound, LayoutDashboard, History, CheckCircle2, ShieldAlert } from "lucide-react";

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
    <header className="w-full border-b border-border bg-surface/50 backdrop-blur-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Persona Profile Pill */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-1.5 shadow-sm">
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white">{activePersona.name}</span>
              <span className="text-[10px] text-zinc-400">({activePersona.role})</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                Rep: {(activePersona.reputationScore * 100).toFixed(0)}%
              </span>
              <span>•</span>
              <span className="truncate max-w-[140px] text-zinc-400">{activePersona.department}</span>
            </div>
          </div>

          {/* Fair Usage Meter */}
          {activePersona.maxWeeklyHours > 0 && (
            <div className="hidden lg:flex flex-col items-end pl-3 border-l border-zinc-800">
              <span className="text-[10px] text-zinc-400">
                Weekly Quota: <strong className="text-zinc-200">{activePersona.weeklyHoursUsed}/{activePersona.maxWeeklyHours}h</strong>
              </span>
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
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
