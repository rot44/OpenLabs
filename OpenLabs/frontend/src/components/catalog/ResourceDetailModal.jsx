import React, { useState } from "react";
import { X, MapPin, ShieldCheck, Wrench, Calendar, ArrowRight, Layers } from "lucide-react";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

export function ResourceDetailModal({ resource, isOpen, onClose, onBookWithSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-zinc-800 text-emerald-400">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{resource.title}</h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{resource.location}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{resource.department}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banner Image + Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 h-48 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                  Asset Overview & Capabilities
                </h4>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Required Training Badge */}
              <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="text-xs">
                    <span className="text-zinc-400">Mandatory Clearance: </span>
                    <strong className="text-zinc-200">{resource.requiredQualifications.join(", ")}</strong>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Institutional Zero-Fee
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-3">
              Certified Technical Specifications
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(resource.specs).map(([param, value], idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">{param}</span>
                  <span className="text-xs font-semibold text-zinc-200 mt-1">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Availability Calendar */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-3">
              Select Reservation Time Window
            </h4>
            <AvailabilityCalendar
              onSlotSelect={setSelectedSlot}
              selectedSlot={selectedSlot}
              resourceTitle={resource.title}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            {selectedSlot ? (
              <span>Ready to book for: <strong className="text-emerald-400">{selectedSlot.dateString}</strong></span>
            ) : (
              <span>Please select an available green slot above to proceed.</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => onBookWithSlot(resource, selectedSlot)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-950/30"
            >
              <span>Proceed to Safety Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailModal;
