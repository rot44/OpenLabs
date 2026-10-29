import React, { useState } from "react";
import { X, MapPin, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

export function ResourceDetailModal({ resource, isOpen, onClose, onBookWithSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earthInk/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-stone-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-earthInk tracking-tight">{resource.title}</h2>
              <div className="flex items-center gap-2 text-xs text-earthInk-muted mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rust" />
                <span>{resource.location}</span>
                <span>•</span>
                <span className="text-cobalt font-semibold">{resource.department}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banner Image + Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 h-48 rounded-2xl overflow-hidden bg-sandstone-dark border border-sandstone-border shadow-stone-sm">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono">
                  Asset Overview & Capabilities
                </h4>
                <p className="mt-2 text-sm text-earthInk-muted leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Required Training Badge */}
              <div className="mt-4 p-3 rounded-2xl bg-sandstone/50 border border-sandstone-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cobalt" />
                  <div className="text-xs">
                    <span className="text-earthInk-muted">Mandatory Clearance: </span>
                    <strong className="text-earthInk">{resource.requiredQualifications.join(", ")}</strong>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-lg border border-cobalt/20 font-bold">
                  Zero-Fee
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono mb-3">
              Certified Technical Specifications
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(resource.specs).map(([param, value], idx) => (
                <div key={idx} className="p-3 rounded-xl bg-limestone-light border border-sandstone-border flex flex-col shadow-stone-sm">
                  <span className="text-[10px] text-earthInk-faint font-mono uppercase">{param}</span>
                  <span className="text-xs font-bold text-earthInk mt-1">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Availability Calendar */}
          <div>
            <h4 className="text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono mb-3">
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
        <div className="p-4 border-t border-sandstone-border bg-limestone-light flex items-center justify-between">
          <div className="text-xs text-earthInk-muted">
            {selectedSlot ? (
              <span>Ready to book for: <strong className="text-cobalt">{selectedSlot.dateString}</strong></span>
            ) : (
              <span>Please select an open slot on the schedule above to proceed.</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-earthInk-muted hover:text-earthInk transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => onBookWithSlot(resource, selectedSlot)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cobalt/25"
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
