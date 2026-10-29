import React from "react";
import { useApp, PERSONAS } from "../../context/AppContext";
import { OpenLabsLogo } from "./OpenLabsLogo";
import { Zap, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export function JudgeBar({ onStartTour }) {
  const { activePersonaKey, switchPersona, tourStep } = useApp();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-canvas/90 backdrop-blur-md px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Evaluator Pill */}
        <div className="flex items-center gap-3">
          <OpenLabsLogo size="sm" />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-[11px] font-medium text-zinc-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">CodeHack</span>
            <span className="text-emerald-400 font-semibold">1-Click Evaluator Mode</span>
          </div>
        </div>

        {/* Center: 3 Persona Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border shadow-inner">
          {/* Alex Chen */}
          <button
            id="persona-alex"
            onClick={() => switchPersona("alex")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "alex"
                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-emerald-500/80 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <span className="text-sm">🎓</span>
            <span className="hidden md:inline">Alex Chen</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-700/60 text-zinc-300">Student</span>
          </button>

          {/* Dr. Elena Vance */}
          <button
            id="persona-elena"
            onClick={() => switchPersona("elena")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "elena"
                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-cyan-500/80 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <span className="text-sm">🔬</span>
            <span className="hidden md:inline">Dr. Elena Vance</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">Lab Owner</span>
          </button>

          {/* Marcus Thorne */}
          <button
            id="persona-marcus"
            onClick={() => switchPersona("marcus")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "marcus"
                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-amber-500/80 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <span className="text-sm">🛡️</span>
            <span className="hidden md:inline">Marcus Thorne</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">Safety Admin</span>
          </button>
        </div>

        {/* Right: 1-Click Guided Tour CTA */}
        <div className="flex items-center gap-2">
          <button
            id="btn-guided-tour"
            onClick={onStartTour}
            className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-gradient-to-r from-emerald-950/90 to-zinc-900 border border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all ${
              tourStep > 0 ? "ring-2 ring-emerald-400 animate-pulse" : ""
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{tourStep > 0 ? `Tour Step ${tourStep}/6 (Running)` : "⚡ Run 1-Click Guided Tour"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JudgeBar;
