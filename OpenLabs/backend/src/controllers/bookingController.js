import { Booking } from "../models/booking.model.js";
import { Resource } from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { ConditionInspection } from "../models/conditionInspection.model.js";
import { FairAllocationService } from "../services/fairAllocationService.js";
import { AIService } from "../services/aiService.js";
import { recordAuditLog } from "../utils/auditHelper.js";
import { ApiError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS, AUDIT_ACTIONS } from "../constants.js";
import crypto from "crypto";

export const createBooking = asyncHandler(async (req, res) => {
  const { resourceId, startTime, endTime, purpose, certDocBase64 } = req.body;
  const user = req.user;

  if (!resourceId || !startTime || !endTime || !purpose) {
    throw new ApiError(400, "resourceId, startTime, endTime, and purpose are required.");
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) throw new ApiError(404, "Resource not found.");

  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationHours = Math.max(0.5, (end.getTime() - start.getTime()) / (1000 * 60 * 60));

  // 1. Check scheduling conflict & 30-min cooldown buffer
  const conflictCheck = await FairAllocationService.checkSchedulingConflict({
    resourceId,
    startTime: start,
    endTime: end,
  });

  // 2. Evaluate Anti-Monopolization Quota (Criterion #6)
  const quotaEval = await FairAllocationService.evaluateQuota({
    userId: user._id,
    resourceId,
    requestedHours: durationHours,
  });

  // 3. Calculate Fair Usage Priority Score
  const fairUsageScore = await FairAllocationService.calculatePriorityScore({
    userId: user._id,
    resourceId,
  });

  // Determine initial status based on quota & conflict
  let initialStatus = BOOKING_STATUS.REQUESTED;
  let waitlistRank = null;

  if (conflictCheck.hasConflict || quotaEval.isExceeded) {
    initialStatus = BOOKING_STATUS.WAITLISTED;
    const existingWaitlist = await Booking.countDocuments({
      resource: resourceId,
      status: BOOKING_STATUS.WAITLISTED,
    });
    waitlistRank = existingWaitlist + 1;
  }

  // 4. Create Booking
  const booking = await Booking.create({
    resource: resourceId,
    requester: user._id,
    startTime: start,
    endTime: end,
    durationHours,
    purpose,
    status: initialStatus,
    fairUsageScore,
    waitlistRank,
    rejectionReason: conflictCheck.hasConflict ? "Contested time slot (conflict detected)" : null,
  });

  // 5. Automatic Gemini TrustScan verification if certificate attached
  let aiVerification = null;
  if (certDocBase64 && resource.requiredQualifications?.length > 0) {
    aiVerification = await AIService.verifyCertificate({
      fileBase64: certDocBase64,
      targetResourceTitle: resource.title,
      requiredQualification: resource.requiredQualifications[0],
    });

    await recordAuditLog({
      bookingId: booking._id,
      resourceId: resource._id,
      actor: user,
      action: AUDIT_ACTIONS.VERIFY_CREDENTIAL,
      fromState: initialStatus,
      toState: initialStatus,
      justification: `TrustScan AI verified credential: ${aiVerification.credentialTitle} (Confidence: ${aiVerification.confidenceScore})`,
      metadata: aiVerification,
    });
  }

  // Record initial audit event
  await recordAuditLog({
    bookingId: booking._id,
    resourceId: resource._id,
    actor: user,
    action: AUDIT_ACTIONS.SUBMIT_REQUEST,
    fromState: null,
    toState: initialStatus,
    justification: quotaEval.recommendation,
    metadata: { quotaEval, fairUsageScore },
  });

  return res.status(201).json(
    new APIResponse(
      201,
      { booking, quotaEval, aiVerification },
      initialStatus === BOOKING_STATUS.WAITLISTED
        ? `Request placed on Waitlist (#${waitlistRank}) due to fair allocation constraints.`
        : "Booking request submitted successfully."
    )
  );
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const user = req.user;
  const bookings = await Booking.find({ requester: user._id })
    .populate("resource", "title category location images department hourlyRate")
    .sort({ createdAt: -1 });

  return res.status(200).json(new APIResponse(200, bookings, "Retrieved user bookings."));
});

export const getManagerInbox = asyncHandler(async (req, res) => {
  const user = req.user;
  // Get all resources owned by this user
  const ownedResources = await Resource.find({ owner: user._id }).select("_id");
  const resourceIds = ownedResources.map((r) => r._id);

  const pendingRequests = await Booking.find({
    resource: { $in: resourceIds },
    status: { $in: [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.VERIFYING, BOOKING_STATUS.WAITLISTED] },
  })
    .populate("resource", "title category location department requiredQualifications")
    .populate("requester", "name email department reputationScore safetyCertificates")
    .sort({ fairUsageScore: -1, createdAt: 1 });

  const activeCustody = await Booking.find({
    resource: { $in: resourceIds },
    status: { $in: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.CHECKED_IN, BOOKING_STATUS.RETURNED] },
  })
    .populate("resource", "title category location department")
    .populate("requester", "name email department avatar")
    .sort({ startTime: 1 });

  return res.status(200).json(
    new APIResponse(
      200,
      { pendingRequests, activeCustody },
      "Retrieved manager inbox successfully."
    )
  );
});

export const approveBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalNote } = req.body;
  const user = req.user;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  const previousState = booking.status;
  const qrToken = `QR-${booking.resource.title.slice(0, 4).toUpperCase()}-${booking._id.toString().slice(-6)}-${Date.now()}`;

  booking.status = BOOKING_STATUS.APPROVED;
  booking.checkInQrToken = qrToken;
  await booking.save();

  // Create empty ConditionInspection record ready for check-in
  await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    {
      booking: booking._id,
      resource: booking.resource._id,
      inspector: user._id,
    },
    { upsert: true, new: true }
  );

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.APPROVE_BOOKING,
    fromState: previousState,
    toState: BOOKING_STATUS.APPROVED,
    justification: approvalNote || "Qualifications and availability verified by lab manager.",
    metadata: { qrToken },
  });

  return res.status(200).json(
    new APIResponse(200, { booking, qrToken }, "Booking approved and check-in QR issued.")
  );
});

export const rejectBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user;

  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found.");

  const previousState = booking.status;
  booking.status = BOOKING_STATUS.REJECTED;
  booking.rejectionReason = reason || "Declined by lab administrator.";
  await booking.save();

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource,
    actor: user,
    action: AUDIT_ACTIONS.REJECT_BOOKING,
    fromState: previousState,
    toState: BOOKING_STATUS.REJECTED,
    justification: reason || "Declined by lab administrator.",
  });

  return res.status(200).json(new APIResponse(200, booking, "Booking request rejected."));
});

export const performCheckIn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { baselinePhotos = [], checklist = {}, notes = "" } = req.body;
  const user = req.user;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.status !== BOOKING_STATUS.APPROVED) {
    throw new ApiError(400, `Cannot check in from status: ${booking.status}`);
  }

  const previousState = booking.status;
  booking.status = BOOKING_STATUS.CHECKED_IN;
  booking.checkedInAt = new Date();
  await booking.save();

  // Update condition inspection record
  const inspection = await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    {
      checkInRecord: {
        timestamp: new Date(),
        photos: baselinePhotos.length > 0 ? baselinePhotos : [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
        ],
        checklist: {
          cleanlinessVerified: checklist.cleanlinessVerified ?? true,
          noStructuralDamage: checklist.noStructuralDamage ?? true,
          accessoriesIntact: checklist.accessoriesIntact ?? true,
          powerCycleOk: checklist.powerCycleOk ?? true,
        },
        notes: notes || "Equipment verified in nominal starting condition.",
      },
    },
    { upsert: true, new: true }
  );

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.PERFORM_CHECKIN,
    fromState: previousState,
    toState: BOOKING_STATUS.CHECKED_IN,
    justification: "Physical custody transferred to requester. Baseline photos logged.",
    metadata: { checklist: inspection.checkInRecord.checklist },
  });

  return res.status(200).json(
    new APIResponse(200, { booking, inspection }, "Equipment checked in successfully. Custody active.")
  );
});

export const initiateReturn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { returnPhotos = [], checklist = {}, notes = "" } = req.body;
  const user = req.user;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.status !== BOOKING_STATUS.CHECKED_IN) {
    throw new ApiError(400, `Cannot return asset from status: ${booking.status}`);
  }

  const previousState = booking.status;
  booking.status = BOOKING_STATUS.RETURNED;
  booking.returnedAt = new Date();
  await booking.save();

  // Retrieve baseline photos for AI diffing
  const existingInspection = await ConditionInspection.findOne({ booking: booking._id });
  const baselinePhotos = existingInspection?.checkInRecord?.photos || [];

  // Run VisionGuard AI diff comparison
  const aiDiffResult = await AIService.compareConditionPhotos({
    baselinePhotos,
    returnPhotos: returnPhotos.length > 0 ? returnPhotos : [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800"
    ],
    resourceTitle: booking.resource.title,
    checklistNotes: notes,
  });

  const inspection = await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    {
      returnRecord: {
        timestamp: new Date(),
        photos: returnPhotos.length > 0 ? returnPhotos : [
          "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800"
        ],
        checklist: {
          cleanedAfterUse: checklist.cleanedAfterUse ?? true,
          toolsReturned: checklist.toolsReturned ?? true,
          noNewDamageObserved: checklist.noNewDamageObserved ?? !aiDiffResult.anomalyDetected,
        },
        notes: notes || "Equipment returned to dock.",
      },
      aiDiffResult: {
        ...aiDiffResult,
        analyzedAt: new Date(),
      },
    },
    { new: true }
  );

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.INITIATE_RETURN,
    fromState: previousState,
    toState: BOOKING_STATUS.RETURNED,
    justification: `Equipment returned. VisionGuard analysis: ${aiDiffResult.riskSeverity} (${aiDiffResult.humanSummary})`,
    metadata: { aiDiffResult },
  });

  return res.status(200).json(
    new APIResponse(
      200,
      { booking, inspection, aiDiffResult },
      "Return submitted. Automated condition inspection complete."
    )
  );
});

export const completeBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { signoffNotes = "", waiveDamage = true } = req.body;
  const user = req.user;

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  const previousState = booking.status;
  booking.status = BOOKING_STATUS.COMPLETED;
  await booking.save();

  await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    {
      managerSignoff: {
        approved: true,
        signedBy: user._id,
        signedAt: new Date(),
        notes: signoffNotes || "Condition certified satisfactory. Security deposit released.",
      },
    }
  );

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.COMPLETE_TRANSACTION,
    fromState: previousState,
    toState: BOOKING_STATUS.COMPLETED,
    justification: signoffNotes || "Manager signoff complete. Transaction finalized.",
  });

  return res.status(200).json(
    new APIResponse(200, booking, "Booking completed and signed off successfully.")
  );
});

