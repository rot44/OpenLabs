import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ResourceCard } from "./ResourceCard";
import { ResourceDetailModal } from "./ResourceDetailModal";
import { BookingModal } from "./BookingModal";
import { Search, Sparkles, Filter, CheckCircle2 } from "lucide-react";

export function ResourceCatalog() {
  const { resources, activePersona } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [detailResource, setDetailResource] = useState(null);
  const [bookingResource, setBookingResource] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const categories = [
    { id: "all", label: "All Equipment & Spaces" },
    { id: "machinery", label: "Machinery & Mills" },
    { id: "lab_space", label: "Cleanroom & Lab Spaces" },
    { id: "prototyping", label: "3D Prototyping" },
    { id: "media", label: "High-Speed Media" },
    { id: "testing_device", label: "RF & Signal Testing" },
  ];

  const suggestionChips = [
    "Haas 5-Axis CNC",
    "Confocal Laser Microscope",
    "SLA 3D Printer",
    "8K High-Speed Cinema",
    "ISO 5 Cleanroom",
  ];

  // Filtering
  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === "all" || res.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartBooking = (resource, slot = null) => {
    setBookingResource(resource);
    setSelectedSlot(slot);
    setDetailResource(null);
  };

  const handleBookingSuccess = (booking) => {
    setToastMessage(`Reservation request submitted for ${booking.resourceTitle}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-300 text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Discovery Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-surface to-surface/80 border border-border p-6 md:p-8 overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Institutional Asset Dispatch Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Discover & Share Specialized Research Infrastructure
          </h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Eliminate equipment idle time across departments. Access certified CNC machinery, cleanrooms, optical microscopes, and prototyping tools with automated qualification matching.
          </p>
        </div>

        {/* Search Bar with Natural Language Intent */}
        <div className="relative z-10 mt-6 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              id="catalog-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment name, department, capability, or training badge..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Intent Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] text-zinc-500 font-mono">Suggested:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(chip)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-zinc-900/90 text-zinc-400 hover:text-emerald-300 border border-zinc-800 hover:border-emerald-500/40 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Showing <span className="text-zinc-200 font-semibold">{filteredResources.length}</span> verified assets
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onSelect={(res) => setDetailResource(res)}
            onBook={(res) => handleStartBooking(res)}
          />
        ))}
      </div>

      {/* Modals */}
      <ResourceDetailModal
        resource={detailResource}
        isOpen={!!detailResource}
        onClose={() => setDetailResource(null)}
        onBookWithSlot={(res, slot) => handleStartBooking(res, slot)}
      />

      <BookingModal
        resource={bookingResource}
        initialSlot={selectedSlot}
        isOpen={!!bookingResource}
        onClose={() => setBookingResource(null)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}

export default ResourceCatalog;
