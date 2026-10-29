import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ResourceCard } from "./ResourceCard";
import { ResourceDetailModal } from "./ResourceDetailModal";
import { BookingModal } from "./BookingModal";
import { Search, Sparkles, CheckCircle2 } from "lucide-react";

export function ResourceCatalog() {
  const { resources } = useApp();
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-limestone border border-cobalt/40 text-earthInk text-xs shadow-stone-xl backdrop-blur-md animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-cobalt" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Discovery Banner in Limestone Surface */}
      <div className="relative rounded-3xl bg-limestone border border-sandstone-border p-6 md:p-8 overflow-hidden shadow-stone-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt/10 border border-cobalt/25 text-cobalt text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Institutional Asset Dispatch Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-earthInk tracking-tight">
            Discover & Share Specialized Research Infrastructure
          </h1>
          <p className="mt-2 text-sm text-earthInk-muted leading-relaxed">
            Eliminate equipment idle time across departments. Access certified CNC machinery, cleanrooms, optical microscopes, and prototyping tools with automated qualification matching.
          </p>
        </div>

        {/* Search Bar with Natural Language Intent */}
        <div className="relative z-10 mt-6 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-earthInk-faint pointer-events-none" />
            <input
              type="text"
              id="catalog-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment name, department, capability, or training badge..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-limestone-light border border-sandstone-border text-sm text-earthInk placeholder-earthInk-faint focus:outline-none focus:ring-2 focus:ring-cobalt/50 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-earthInk-muted hover:text-earthInk"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Intent Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] text-earthInk-faint font-mono">Suggested:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(chip)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-sandstone/60 text-earthInk-muted hover:text-cobalt hover:bg-limestone border border-sandstone-border transition-colors shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient background decoration in Weathered Stone and Rust */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-weathered/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-rust/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sandstone-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-cobalt text-white shadow-sm"
                  : "text-earthInk-muted hover:text-earthInk hover:bg-limestone"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-earthInk-faint font-mono">
          Showing <span className="text-earthInk font-bold">{filteredResources.length}</span> verified assets
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
