import React from "react";
import { useApp } from "../../context/AppContext";
import { MapPin, ShieldCheck, Clock, ArrowRight, AlertTriangle } from "lucide-react";

export function ResourceCard({ resource, onSelect, onBook }) {
  const { activePersona } = useApp();

  // Check if active user holds required qualifications
  const userCerts = activePersona.safetyCertificates.map((c) => c.name);
  const hasPrereq = resource.requiredQualifications.every((req) =>
    userCerts.some((c) => c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase()))
  );

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface border border-border hover:border-zinc-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/10 overflow-hidden">
      {/* Equipment Image Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
        <img
          src={resource.image}
          alt={resource.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

        {/* Category & Status Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-900/90 backdrop-blur-md text-zinc-300 border border-zinc-700/60 shadow-sm">
            {resource.categoryLabel}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available Now
          </span>
        </div>

        {/* Location Footer on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
          <span className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {resource.location}
          </span>
          <span className="font-mono text-emerald-400 font-semibold drop-shadow-md">
            $0 / Institutional Free
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
          {resource.title}
        </h3>

        <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Safety Prerequisite Status */}
        <div className="mt-4 pt-3 border-t border-border/80">
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5">Required Qualification:</div>
          <div className="flex flex-wrap gap-1.5">
            {resource.requiredQualifications.map((req, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  hasPrereq
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                    : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                }`}
              >
                {hasPrereq ? (
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                )}
                <span>{req}</span>
                {hasPrereq ? (
                  <span className="text-[10px] text-emerald-400 font-bold ml-1">✓ On File</span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-semibold ml-1">Upload Req</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Specs highlights */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-zinc-900/60 rounded-xl p-2.5 border border-zinc-800/80">
          {Object.entries(resource.specs).slice(0, 2).map(([key, val], idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-zinc-500 text-[10px] uppercase font-mono">{key}</span>
              <span className="text-zinc-200 font-medium truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-border flex items-center gap-2">
          <button
            onClick={() => onSelect(resource)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/60 transition-all text-center"
          >
            Specs & Hours
          </button>
          <button
            id={`book-${resource.id}`}
            onClick={() => onBook(resource)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-950/20"
          >
            <span>Reserve Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;
