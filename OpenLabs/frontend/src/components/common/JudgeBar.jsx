import React from "react";
import { useApp } from "../../context/AppContext";
import { OpenLabsLogo } from "./OpenLabsLogo";
import { Zap } from "lucide-react";

export function JudgeBar({ onStartTour }) {
  const { activePersonaKey, switchPersona, tourStep } = useApp();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-sandstone-border bg-limestone/92 backdrop-blur-md px-4 py-2.5 transition-all shadow-stone-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Evaluator Pill */}
        <div className="flex items-center gap-3">
          <OpenLabsLogo size="sm" />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sandstone/70 border border-sandstone-border text-[11px] font-medium text-earthInk-muted shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cobalt animate-pulse" />
            <span className="text-earthInk-faint">CodeHack</span>
            <span className="text-cobalt font-semibold">1-Click Evaluator Mode</span>
          </div>
        </div>

        {/* Center: 3 Persona Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-sandstone/60 rounded-xl border border-sandstone-border shadow-inner">
          {/* Alex Chen */}
          <button
            id="persona-alex"
            onClick={() => switchPersona("alex")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "alex"
                ? "bg-limestone text-earthInk shadow-stone-sm ring-1.5 ring-cobalt font-semibold"
                : "text-earthInk-muted hover:text-earthInk hover:bg-limestone/50"
            }`}
          >
            <span className="text-sm">🎓</span>
            <span className="hidden md:inline">Alex Chen</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-weathered/40 text-earthInk-muted font-medium">Student</span>
          </button>

          {/* Dr. Elena Vance */}
          <button
            id="persona-elena"
            onClick={() => switchPersona("elena")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "elena"
                ? "bg-limestone text-earthInk shadow-stone-sm ring-1.5 ring-cobalt font-semibold"
                : "text-earthInk-muted hover:text-earthInk hover:bg-limestone/50"
            }`}
          >
            <span className="text-sm">🔬</span>
            <span className="hidden md:inline">Dr. Elena Vance</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cobalt/10 text-cobalt font-semibold border border-cobalt/20">Lab Owner</span>
          </button>

          {/* Marcus Thorne */}
          <button
            id="persona-marcus"
            onClick={() => switchPersona("marcus")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePersonaKey === "marcus"
                ? "bg-limestone text-earthInk shadow-stone-sm ring-1.5 ring-rust font-semibold"
                : "text-earthInk-muted hover:text-earthInk hover:bg-limestone/50"
            }`}
          >
            <span className="text-sm">🛡️</span>
            <span className="hidden md:inline">Marcus Thorne</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rust/10 text-rust font-semibold border border-rust/20">Safety Admin</span>
          </button>
        </div>

        {/* Right: 1-Click Guided Tour CTA */}
        <div className="flex items-center gap-2">
          <button
            id="btn-guided-tour"
            onClick={onStartTour}
            className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover border border-cobalt-light shadow-md shadow-cobalt/25 hover:shadow-lg hover:shadow-cobalt/35 transition-all ${
              tourStep > 0 ? "ring-2 ring-rust animate-pulse" : ""
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rust-light fill-rust-light group-hover:scale-110 transition-transform" />
            <span>{tourStep > 0 ? `Tour Step ${tourStep}/6 (Running)` : "⚡ Run 1-Click Guided Tour"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JudgeBar;
