import React from "react";

export function OpenLabsLogo({ size = "default", showBadge = true, className = "" }) {
  const isSmall = size === "sm";

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none tracking-tight ${className}`}>
      {/* Geometric Aperture SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          className={`${isSmall ? "w-6 h-6" : "w-8 h-8"} text-cobalt drop-shadow-[0_2px_8px_rgba(37,71,168,0.25)]`}
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
            className="text-earthInk/30"
          />
          {/* Inner Shared Nodes */}
          <polygon
            points="16,7 24,11.5 24,20.5 16,25 8,20.5 8,11.5"
            stroke="url(#aperture-grad)"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Rust & Cobalt Aperture Petals */}
          <line x1="16" y1="7" x2="24" y2="20.5" stroke="#B65D3F" strokeWidth="1.35" strokeOpacity="0.85" />
          <line x1="24" y1="11.5" x2="8" y2="20.5" stroke="#B65D3F" strokeWidth="1.35" strokeOpacity="0.85" />
          <line x1="8" y1="11.5" x2="16" y2="25" stroke="#2547A8" strokeWidth="1.35" strokeOpacity="0.85" />
          {/* Central Active Shared Node */}
          <circle cx="16" cy="16" r="3" fill="#2547A8" className="animate-pulse" />
          <circle cx="16" cy="16" r="1.2" fill="#F6F1E8" />
          
          <defs>
            <linearGradient id="aperture-grad" x1="8" y1="7" x2="24" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2547A8" />
              <stop offset="1" stopColor="#B65D3F" />
            </linearGradient>
          </defs>
        </svg>
        {/* Subtle Node Aura */}
        <span className="absolute w-2 h-2 rounded-full bg-cobalt blur-[3px] pointer-events-none opacity-40" />
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center gap-1.5">
        <span className={`font-bold tracking-tight text-earthInk ${isSmall ? "text-base" : "text-lg"}`}>
          Open<span className="text-earthInk-muted font-medium">Labs</span>
        </span>
        {showBadge && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cobalt/10 text-cobalt border border-cobalt/25 font-mono tracking-wider shadow-sm">
            AI
          </span>
        )}
      </div>
    </div>
  );
}

export default OpenLabsLogo;
