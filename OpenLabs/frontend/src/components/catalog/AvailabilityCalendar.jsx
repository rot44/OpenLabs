import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Check, AlertCircle } from "lucide-react";

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

  // Seeded status map for realistic lab operations
  // key: `${dayIdx}-${slotIdx}`
  // status: 'available' | 'buffer' | 'booked'
  const getSlotStatus = (dIdx, sIdx) => {
    if (dIdx === 0 && sIdx === 1) return "booked"; // Booked by another researcher
    if (dIdx === 0 && sIdx === 2) return "buffer"; // 30-min Turnaround Maintenance
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
    <div className="flex flex-col bg-zinc-900/80 rounded-2xl border border-border p-4">
      {/* Header and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-200">7-Day Real-Time Dispatch Grid</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/60" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/20 border border-amber-500/60" />
            30m Buffer
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-800 border border-zinc-700" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 border border-blue-400" />
            Selected
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-2 px-2 text-[10px] text-zinc-500 uppercase font-mono">Time</th>
              {days.map((day, idx) => (
                <th key={idx} className="py-2 px-2 text-[11px] font-semibold text-zinc-300 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {timeSlots.map((slot, sIdx) => (
              <tr key={sIdx} className="hover:bg-zinc-850/40 transition-colors">
                <td className="py-2.5 px-2 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                  {slot}
                </td>
                {days.map((day, dIdx) => {
                  const status = getSlotStatus(dIdx, sIdx);
                  const isSelected =
                    selectedSlot && selectedSlot.day === day && selectedSlot.time === slot;

                  let cellClass = "";
                  let label = "";

                  if (isSelected) {
                    cellClass = "bg-blue-600/90 text-white font-semibold shadow-md ring-1 ring-blue-400";
                    label = "Selected";
                  } else if (status === "available") {
                    cellClass =
                      "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white border border-emerald-900/40 cursor-pointer";
                    label = "Open";
                  } else if (status === "buffer") {
                    cellClass =
                      "bg-amber-950/30 text-amber-400/80 border border-amber-900/30 cursor-not-allowed";
                    label = "Buffer";
                  } else {
                    cellClass =
                      "bg-zinc-850/60 text-zinc-500 border border-zinc-800 cursor-not-allowed";
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

      {/* Selected Slot Feedback */}
      {selectedSlot && (
        <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-400" />
            <span>
              Selected Time Window: <strong>{selectedSlot.dateString}</strong> ({selectedSlot.durationHours} hours)
            </span>
          </div>
          <span className="font-mono text-[11px] text-blue-300">
            Quota Impact: -{selectedSlot.durationHours}h
          </span>
        </div>
      )}
    </div>
  );
}

export default AvailabilityCalendar;
