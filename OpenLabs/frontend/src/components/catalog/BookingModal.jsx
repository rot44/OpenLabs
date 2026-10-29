import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, ShieldCheck, UploadCloud, CheckCircle2, Clock, FileText, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Reserve Equipment Slot</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {resource.title} • {initialSlot ? initialSlot.dateString : "Tomorrow, 14:00 - 17:00"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Research Purpose */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
              Research & Academic Purpose *
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe your research experiment or fabrication purpose..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Required for lab director justification and institutional grant reporting.
            </span>
          </div>

          {/* Safety Qualification Verification Section */}
          <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-200">
                  Prerequisite: {requiredCert}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Gemini TrustScan AI
              </span>
            </div>

            {userHasCert ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{requiredCert}</span> on file
                    <div className="text-[11px] text-emerald-400/80">
                      Issued by Campus Makerspace Board • Valid through Dec 2027
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TrustScan 98.4%
                </span>
              </div>
            ) : uploadedCert ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{uploadedCert.name}</span>
                    <div className="text-[11px] text-cyan-300/80">
                      OCR Verified • Match Score: {uploadedCert.score}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  Verified
                </span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl p-4 text-center cursor-pointer transition-colors">
                {isSimulatingOcr ? (
                  <div className="flex flex-col items-center justify-center py-3 gap-2">
                    <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
                    <span className="text-xs font-medium text-emerald-300">
                      TrustScan OCR parsing safety badge & metadata...
                    </span>
                  </div>
                ) : (
                  <div onClick={handleSimulateUpload} className="flex flex-col items-center justify-center py-2">
                    <UploadCloud className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-xs font-medium text-zinc-300">
                      Click to upload safety certification PDF / PNG
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      (Or click to auto-run TrustScan OCR simulation for testing)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quota & Fair-Share Policy Check */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>
                Requested Duration: <strong className="text-white">{durationHours} Hours</strong>
              </span>
            </div>
            {isOverQuota ? (
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Exceeds weekly cap. Will route to Fair-Share Waitlist.</span>
              </div>
            ) : (
              <span className="text-[11px] text-emerald-400 font-mono">
                ✓ Within weekly quota ({activePersona.weeklyHoursUsed + durationHours}/{activePersona.maxWeeklyHours}h)
              </span>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-submit-booking"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/30"
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
