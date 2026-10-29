import React from "react";
import { useApp } from "../../context/AppContext";
import { MapPin, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

export function ResourceCard({ resource, onSelect, onBook }) {
  const { activePersona } = useApp();

  const userCerts = activePersona.safetyCertificates.map((c) => c.name);
  const hasPrereq = resource.requiredQualifications.every((req) =>
    userCerts.some((c) => c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase()))
  );

  return (
    <div className="group relative flex flex-col rounded-2xl bg-limestone border border-sandstone-border hover:border-cobalt/50 transition-all duration-300 shadow-stone-sm hover:shadow-stone-lg overflow-hidden">
      {/* Equipment Image Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-sandstone-dark">
        <img
          src={resource.image}
          alt={resource.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earthInk/90 via-earthInk/20 to-transparent opacity-85" />

        {/* Category & Status Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-limestone/90 backdrop-blur-md text-earthInk border border-limestone-border shadow-sm">
            {resource.categoryLabel}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-limestone/95 text-cobalt border border-cobalt/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse" />
            Available Now
          </span>
        </div>

        {/* Location & Rate Footer on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-weathered-light" />
            {resource.location}
          </span>
          <span className="font-mono text-limestone font-semibold drop-shadow-md px-2 py-0.5 rounded bg-cobalt/80 border border-white/20">
            $0 / Institutional Free
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-earthInk tracking-tight group-hover:text-cobalt transition-colors">
          {resource.title}
        </h3>

        <p className="mt-2 text-xs text-earthInk-muted line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Safety Prerequisite Status */}
        <div className="mt-4 pt-3 border-t border-sandstone-border">
          <div className="text-[11px] font-semibold text-earthInk-faint mb-1.5 uppercase tracking-wider font-mono">
            Required Qualification:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {resource.requiredQualifications.map((req, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                  hasPrereq
                    ? "bg-cobalt/10 text-cobalt border border-cobalt/25"
                    : "bg-rust/15 text-rust-dark border border-rust/30"
                }`}
              >
                {hasPrereq ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-cobalt" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rust" />
                )}
                <span>{req}</span>
                {hasPrereq ? (
                  <span className="text-[10px] text-cobalt font-bold ml-1">✓ On File</span>
                ) : (
                  <span className="text-[10px] text-rust-dark font-bold ml-1">Upload Req</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Specs highlights in Weathered Stone surface */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-weathered/25 rounded-xl p-2.5 border border-weathered/40">
          {Object.entries(resource.specs).slice(0, 2).map(([key, val], idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-earthInk-faint text-[10px] uppercase font-mono">{key}</span>
              <span className="text-earthInk font-semibold truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-sandstone-border flex items-center gap-2">
          <button
            onClick={() => onSelect(resource)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-earthInk bg-limestone-dark hover:bg-limestone border border-limestone-border transition-all text-center"
          >
            Specs & Hours
          </button>
          <button
            id={`book-${resource.id}`}
            onClick={() => onBook(resource)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/20"
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
