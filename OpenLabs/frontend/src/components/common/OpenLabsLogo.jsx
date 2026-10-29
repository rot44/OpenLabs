import React from "react";

export function OpenLabsLogo({ size = "default", showBadge = true, className = "" }) {
  const isSmall = size === "sm";

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none tracking-tight ${className}`}>
      {/* Geometric Aperture SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          className={`${isSmall ? "w-6 h-6" : "w-8 h-8"} text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]`}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Aperture Outer Perimeter */}
          <polygon
            points="16,2 29,9.5 29,24.5 16,32 3,24.5 3,9.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            className="text-zinc-600/80"
          />
          {/* Inner Shared Nodes */}
          <polygon
            points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5"
            stroke="url(#aperture-grad)"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Cyan Aperture Petals */}
          <line x1="16" y1="7" x2="24" y2="20.5" stroke="#06b6d4" strokeWidth="1.25" strokeOpacity="0.7" />
          <line x1="24" y1="11.5" x2="8" y2="20.5" stroke="#06b6d4" strokeWidth="1.25" strokeOpacity="0.7" />
          <line x1="8" y1="11.5" x2="16" y2="25" stroke="#10b981" strokeWidth="1.25" strokeOpacity="0.7" />
          {/* Central Active Shared Node */}
          <circle cx="16" cy="16" r="3" fill="#10b981" className="animate-pulse" />
          <circle cx="16" cy="16" r="1.2" fill="#ecfdf5" />
          
          <defs>
            <linearGradient id="aperture-grad" x1="8" y1="7" x2="24" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        {/* Subtle Node Aura */}
        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 blur-[3px] pointer-events-none" />
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center gap-1.5">
        <span className={`font-bold tracking-tight text-white ${isSmall ? "text-base" : "text-lg"}`}>
          Open<span className="text-zinc-400 font-medium">Labs</span>
        </span>
        {showBadge && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            AI
          </span>
        )}
      </div>
    </div>
  );
}

export default OpenLabsLogo;
