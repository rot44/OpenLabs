import React from "react";
import { Calendar as CalendarIcon, Check } from "lucide-react";

export function AvailabilityCalendar({ onSlotSelect, selectedSlot, resourceTitle }) {
  const days = ["Mon (Today)", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 17:00",
    "17:00 - 19:00",
    "19:00 - 21:00",
  ];

  const getSlotStatus = (dIdx, sIdx) => {
    if (dIdx === 0 && sIdx === 1) return "booked";
    if (dIdx === 0 && sIdx === 2) return "buffer";
    if (dIdx === 1 && sIdx === 3) return "booked";
    if (dIdx === 2 && sIdx === 0) return "buffer";
    return "available";
  };

  const handleSelect = (day, slot, status) => {
    if (status !== "available") return;
    onSlotSelect({
      day,
      time: slot,
      dateString: `${day}, ${slot}`,
      durationHours: slot.includes("14:00 - 17:00") ? 3 : 2,
    });
  };

  return (
    <div className="flex flex-col bg-limestone rounded-2xl border border-sandstone-border p-4 shadow-stone-sm">
      {/* Header and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sandstone-border">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cobalt" />
          <span className="text-xs font-bold text-earthInk">7-Day Real-Time Dispatch Grid</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-earthInk-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cobalt/20 border border-cobalt/60" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rust/25 border border-rust/60" />
            30m Buffer
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sandstone border border-sandstone-border" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cobalt border border-cobalt" />
            Selected
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-sandstone-border">
              <th className="py-2 px-2 text-[10px] text-earthInk-faint uppercase font-mono">Time</th>
              {days.map((day, idx) => (
                <th key={idx} className="py-2 px-2 text-[11px] font-bold text-earthInk text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-border/60">
            {timeSlots.map((slot, sIdx) => (
              <tr key={sIdx} className="hover:bg-sandstone/40 transition-colors">
                <td className="py-2.5 px-2 font-mono text-[11px] text-earthInk-muted whitespace-nowrap font-medium">
                  {slot}
                </td>
                {days.map((day, dIdx) => {
                  const status = getSlotStatus(dIdx, sIdx);
                  const isSelected =
                    selectedSlot && selectedSlot.day === day && selectedSlot.time === slot;

                  let cellClass = "";
                  let label = "";

                  if (isSelected) {
                    cellClass = "bg-cobalt text-white font-bold shadow-md ring-1 ring-cobalt-light";
                    label = "Selected";
                  } else if (status === "available") {
                    cellClass =
                      "bg-cobalt/10 text-cobalt hover:bg-cobalt hover:text-white border border-cobalt/25 cursor-pointer font-semibold";
                    label = "Open";
                  } else if (status === "buffer") {
                    cellClass =
                      "bg-rust/15 text-rust-dark border border-rust/25 cursor-not-allowed font-medium";
                    label = "Buffer";
                  } else {
                    cellClass =
                      "bg-sandstone/70 text-earthInk-faint border border-sandstone-border cursor-not-allowed";
                    label = "Hold";
                  }

                  return (
                    <td key={dIdx} className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelect(day, slot, status)}
                        disabled={status !== "available"}
                        className={`w-full py-2 px-1.5 rounded-lg text-[10px] transition-all flex flex-col items-center justify-center gap-0.5 ${cellClass}`}
                      >
                        <span>{label}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Slot Feedback in Weathered Stone Surface */}
      {selectedSlot && (
        <div className="mt-4 p-3 rounded-xl bg-weathered/30 border border-weathered/60 flex items-center justify-between text-xs text-earthInk">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cobalt" />
            <span>
              Selected Time Window: <strong className="text-cobalt">{selectedSlot.dateString}</strong> ({selectedSlot.durationHours} hours)
            </span>
          </div>
          <span className="font-mono text-[11px] text-earthInk-muted font-semibold">
            Quota Impact: -{selectedSlot.durationHours}h
          </span>
        </div>
      )}
    </div>
  );
}

export default AvailabilityCalendar;
