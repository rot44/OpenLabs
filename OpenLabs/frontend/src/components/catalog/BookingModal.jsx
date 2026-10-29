import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, ShieldCheck, UploadCloud, CheckCircle2, Clock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export function BookingModal({ resource, initialSlot, isOpen, onClose, onSuccess }) {
  const { activePersona, submitBooking } = useApp();
  const [purpose, setPurpose] = useState(
    "ASME autonomous drone lightweight carbon/aluminum motor mount prototyping and aerodynamic testing."
  );
  const [notes, setNotes] = useState("");
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);
  const [uploadedCert, setUploadedCert] = useState(null);

  if (!isOpen || !resource) return null;

  const requiredCert = resource.requiredQualifications[0] || "Standard Safety Clearance";
  const userHasCert = activePersona.safetyCertificates.some((c) =>
    c.name.toLowerCase().includes(requiredCert.toLowerCase()) || requiredCert.toLowerCase().includes(c.name.toLowerCase())
  );

  const durationHours = initialSlot ? initialSlot.durationHours : 3;
  const isOverQuota =
    activePersona.maxWeeklyHours > 0 &&
    activePersona.weeklyHoursUsed + durationHours > activePersona.maxWeeklyHours;

  const handleSimulateUpload = () => {
    setIsSimulatingOcr(true);
    setTimeout(() => {
      setIsSimulatingOcr(false);
      setUploadedCert({
        name: `${requiredCert}_verified_doc.pdf`,
        score: "98.7%",
        issuer: "Accredited Campus Laboratory Board",
      });
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const booking = submitBooking(resource, {
      purpose,
      notes,
      date: initialSlot ? initialSlot.dateString : "Tomorrow, 14:00 - 17:00",
      durationHours,
      certName: requiredCert,
    });
    onSuccess(booking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earthInk/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-stone-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-earthInk tracking-tight">Reserve Equipment Slot</h2>
              <p className="text-xs text-earthInk-muted mt-0.5">
                {resource.title} • {initialSlot ? initialSlot.dateString : "Tomorrow, 14:00 - 17:00"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Research Purpose */}
          <div>
            <label className="block text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono mb-2">
              Research & Academic Purpose *
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe your research experiment or fabrication purpose..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-limestone-light border border-sandstone-border text-sm text-earthInk placeholder-earthInk-faint focus:outline-none focus:ring-2 focus:ring-cobalt/50 shadow-inner"
            />
            <span className="text-[11px] text-earthInk-muted mt-1 block">
              Required for lab director justification and institutional grant reporting.
            </span>
          </div>

          {/* Safety Qualification Verification Section */}
          <div className="rounded-2xl bg-sandstone/40 border border-sandstone-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cobalt" />
                <span className="text-xs font-bold text-earthInk">
                  Prerequisite: {requiredCert}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-limestone text-cobalt font-bold border border-sandstone-border">
                Gemini TrustScan AI
              </span>
            </div>

            {userHasCert ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-cobalt/10 border border-cobalt/25 text-xs text-earthInk">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cobalt shrink-0" />
                  <div>
                    <span className="font-bold text-earthInk">{requiredCert}</span> on file
                    <div className="text-[11px] text-earthInk-muted">
                      Issued by Campus Makerspace Board • Valid through Dec 2027
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cobalt text-white shadow-sm">
                  TrustScan 98.4%
                </span>
              </div>
            ) : uploadedCert ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-weathered/30 border border-weathered/60 text-xs text-earthInk">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cobalt shrink-0" />
                  <div>
                    <span className="font-bold text-earthInk">{uploadedCert.name}</span>
                    <div className="text-[11px] text-earthInk-muted">
                      OCR Verified • Match Score: {uploadedCert.score}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cobalt text-white font-mono font-bold">
                  Verified
                </span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-sandstone-border hover:border-cobalt/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-limestone-light">
                {isSimulatingOcr ? (
                  <div className="flex flex-col items-center justify-center py-3 gap-2">
                    <Sparkles className="w-6 h-6 text-cobalt animate-spin" />
                    <span className="text-xs font-semibold text-cobalt">
                      TrustScan OCR parsing safety badge & metadata...
                    </span>
                  </div>
                ) : (
                  <div onClick={handleSimulateUpload} className="flex flex-col items-center justify-center py-2">
                    <UploadCloud className="w-6 h-6 text-earthInk-muted mb-1" />
                    <span className="text-xs font-semibold text-earthInk">
                      Click to upload safety certification PDF / PNG
                    </span>
                    <span className="text-[10px] text-earthInk-muted mt-0.5">
                      (Or click to auto-run TrustScan OCR simulation for testing)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quota & Fair-Share Policy Check in Weathered Stone */}
          <div className="p-3.5 rounded-2xl bg-weathered/25 border border-weathered/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-earthInk">
              <Clock className="w-4 h-4 text-cobalt" />
              <span>
                Requested Duration: <strong className="text-earthInk">{durationHours} Hours</strong>
              </span>
            </div>
            {isOverQuota ? (
              <div className="flex items-center gap-1.5 text-rust-dark font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Exceeds weekly cap. Will route to Fair-Share Waitlist.</span>
              </div>
            ) : (
              <span className="text-[11px] text-cobalt font-mono font-bold">
                ✓ Within weekly quota ({activePersona.weeklyHoursUsed + durationHours}/{activePersona.maxWeeklyHours}h)
              </span>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-sandstone-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-earthInk-muted hover:text-earthInk transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-submit-booking"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition-all shadow-md shadow-cobalt/25"
            >
              <span>{isOverQuota ? "Join Fair Waitlist" : "Submit Reservation Request"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
