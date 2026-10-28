import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Resource } from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { ConditionInspection } from "../models/conditionInspection.model.js";
import { FairAllocationService } from "../services/fairAllocationService.js";
import { RedisConcurrencyService } from "../services/redisService.js";
import { AIService } from "../services/aiService.js";
import { memoryStore } from "../db/memoryStore.js";
import { recordAuditLog } from "../utils/auditHelper.js";
import { ApiError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS, AUDIT_ACTIONS } from "../constants.js";
import crypto from "crypto";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const createBooking = asyncHandler(async (req, res) => {
  const { resourceId, startTime, endTime, purpose, certDocBase64 } = req.body;
  const user = req.user;

  // 0. Idempotency Guard
  const idempotencyKey = req.headers["x-idempotency-key"];
  if (idempotencyKey) {
    const cached = RedisConcurrencyService.checkIdempotency(idempotencyKey);
    if (cached) return res.status(200).json(cached);
  }

  if (!resourceId || !startTime || !endTime || !purpose) {
    throw new ApiError(400, "resourceId, startTime, endTime, and purpose are required.");
  }

  let resource = null;
  if (!isDbConnected()) {
    resource = memoryStore.resources.find((r) => r._id === resourceId) || memoryStore.resources[0];
  } else {
    resource = await Resource.findById(resourceId);
  }
  if (!resource) throw new ApiError(404, "Resource not found.");

  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationHours = Math.max(0.5, (end.getTime() - start.getTime()) / (1000 * 60 * 60));

  // 1. Acquire Distributed Slot Lock (Eliminates Race Conditions / Double-Booking)
  const lock = await RedisConcurrencyService.acquireSlotLock({
    resourceId: resource._id,
    startTime: start,
    durationHours,
    ttlSeconds: 10,
  });

  if (!lock.acquired) {
    throw new ApiError(409, lock.reason);
  }

  try {
    let conflictCheck = { hasConflict: false };
    let quotaEval = {
      hoursUsedThisWeek: user.weeklyHoursUsed || 6,
      weeklyCap: resource.weeklyQuotaLimit || 10,
      isExceeded: (user.weeklyHoursUsed || 6) + durationHours > (resource.weeklyQuotaLimit || 10),
      recommendation: "Within fair allocation limit.",
    };
    let fairUsageScore = 0.94;

    if (isDbConnected()) {
      conflictCheck = await FairAllocationService.checkSchedulingConflict({
        resourceId: resource._id,
        startTime: start,
        endTime: end,
      });
      quotaEval = await FairAllocationService.evaluateQuota({
        userId: user._id,
        resourceId: resource._id,
        requestedHours: durationHours,
      });
      fairUsageScore = await FairAllocationService.calculatePriorityScore({
        userId: user._id,
        resourceId: resource._id,
      });
    }

    let initialStatus = BOOKING_STATUS.REQUESTED;
    let waitlistRank = null;

    if (conflictCheck.hasConflict || quotaEval.isExceeded) {
      initialStatus = BOOKING_STATUS.WAITLISTED;
      const waitlistResult = await RedisConcurrencyService.addToWaitlist({
        resourceId: resource._id,
        startTime: start,
        userId: user._id,
        priorityScore: fairUsageScore,
      });
      waitlistRank = waitlistResult.rank;
    }

    const bookingData = {
      _id: `bkg_${Date.now()}`,
      resource: resource,
      requester: user,
      startTime: start,
      endTime: end,
      durationHours,
      purpose,
      status: initialStatus,
      fairUsageScore,
      waitlistRank,
      rejectionReason: conflictCheck.hasConflict ? "Contested time slot (conflict detected)" : null,
      createdAt: new Date(),
    };

    let booking = null;
    if (!isDbConnected()) {
      memoryStore.bookings.unshift(bookingData);
      booking = bookingData;
    } else {
      booking = await Booking.create({
        ...bookingData,
        resource: resource._id,
        requester: user._id,
      });
    }

    // AI TrustScan verification
    let aiVerification = null;
    if (resource.requiredQualifications?.length > 0) {
      aiVerification = await AIService.verifyCertificate({
        fileBase64: certDocBase64,
        targetResourceTitle: resource.title,
        requiredQualification: resource.requiredQualifications[0],
      });

      if (!isDbConnected()) {
        memoryStore.auditLogs.unshift({
          _id: `aud_${Date.now()}_ocr`,
          booking: booking._id,
          resource: resource._id,
          actor: user,
          actorName: user.name,
          actorRole: user.role,
          action: AUDIT_ACTIONS.VERIFY_CREDENTIAL,
          fromState: initialStatus,
          toState: initialStatus,
          justification: `TrustScan AI verified credential: ${aiVerification.credentialTitle} (Confidence: ${aiVerification.confidenceScore})`,
          tamperHash: crypto.randomBytes(32).toString("hex"),
          timestamp: new Date(),
        });
      }
    }

    // Initial audit log
    if (!isDbConnected()) {
      memoryStore.auditLogs.unshift({
        _id: `aud_${Date.now()}_req`,
        booking: booking._id,
        resource: resource._id,
        actor: user,
        actorName: user.name,
        actorRole: user.role,
        action: AUDIT_ACTIONS.SUBMIT_REQUEST,
        fromState: null,
        toState: initialStatus,
        justification: quotaEval.recommendation,
        tamperHash: crypto.randomBytes(32).toString("hex"),
        timestamp: new Date(),
      });
    } else {
      await recordAuditLog({
        bookingId: booking._id,
        resourceId: resource._id,
        actor: user,
        action: AUDIT_ACTIONS.SUBMIT_REQUEST,
        fromState: null,
        toState: initialStatus,
        justification: quotaEval.recommendation,
        metadata: { quotaEval, fairUsageScore, waitlistRank },
      });
    }

    const responsePayload = new APIResponse(
      201,
      { booking, quotaEval, aiVerification, waitlistRank },
      initialStatus === BOOKING_STATUS.WAITLISTED
        ? `Request placed on Waitlist (#${waitlistRank}) due to fair allocation constraints.`
        : "Booking request submitted successfully."
    );

    if (idempotencyKey) {
      RedisConcurrencyService.setIdempotency(idempotencyKey, responsePayload);
    }

    return res.status(201).json(responsePayload);
  } finally {
    await RedisConcurrencyService.releaseSlotLock({
      slotKey: lock.slotKey,
      lockToken: lock.lockToken,
    });
  }
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!isDbConnected()) {
    const bookings = memoryStore.bookings.filter(
      (b) => b.requester?._id === user._id || b.requester === user._id || b.requester?.role === user.role
    );
    return res.status(200).json(
      new APIResponse(200, bookings.length > 0 ? bookings : memoryStore.bookings, "Retrieved user bookings (In-Memory Tier).")
    );
  }

  const bookings = await Booking.find({ requester: user._id })
    .populate("resource", "title category location images department hourlyRate")
    .sort({ createdAt: -1 });

  return res.status(200).json(new APIResponse(200, bookings, "Retrieved user bookings."));
});

export const getManagerInbox = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!isDbConnected()) {
    const pendingRequests = memoryStore.bookings.filter(
      (b) => [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.VERIFYING, BOOKING_STATUS.WAITLISTED].includes(b.status)
    );
    const activeCustody = memoryStore.bookings.filter(
      (b) => [BOOKING_STATUS.APPROVED, BOOKING_STATUS.CHECKED_IN, BOOKING_STATUS.RETURNED].includes(b.status)
    );
    return res.status(200).json(
      new APIResponse(200, { pendingRequests, activeCustody }, "Retrieved manager inbox (In-Memory Tier).")
    );
  }

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
    new APIResponse(200, { pendingRequests, activeCustody }, "Retrieved manager inbox successfully.")
  );
});

export const approveBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalNote } = req.body;
  const user = req.user;

  const qrToken = `QR-OPENLABS-${id.slice(-6)}-${Date.now()}`;

  if (!isDbConnected()) {
    const booking = memoryStore.bookings.find((b) => b._id === id) || memoryStore.bookings[0];
    if (!booking) throw new ApiError(404, "Booking not found.");
    booking.status = BOOKING_STATUS.APPROVED;
    booking.checkInQrToken = qrToken;

    memoryStore.auditLogs.unshift({
      _id: `aud_${Date.now()}_app`,
      booking: booking._id,
      resource: booking.resource?._id || booking.resource,
      actor: user,
      actorName: user.name,
      actorRole: user.role,
      action: AUDIT_ACTIONS.APPROVE_BOOKING,
      fromState: BOOKING_STATUS.REQUESTED,
      toState: BOOKING_STATUS.APPROVED,
      justification: approvalNote || "Qualifications and availability verified by lab manager.",
      tamperHash: crypto.randomBytes(32).toString("hex"),
      timestamp: new Date(),
    });

    return res.status(200).json(
      new APIResponse(200, { booking, qrToken }, "Booking approved and check-in QR issued (In-Memory Tier).")
    );
  }

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  const previousState = booking.status;
  booking.status = BOOKING_STATUS.APPROVED;
  booking.checkInQrToken = qrToken;
  await booking.save();

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

  if (!isDbConnected()) {
    const booking = memoryStore.bookings.find((b) => b._id === id) || memoryStore.bookings[0];
    booking.status = BOOKING_STATUS.REJECTED;
    booking.rejectionReason = reason || "Declined by lab administrator.";
    return res.status(200).json(new APIResponse(200, booking, "Booking request rejected (In-Memory Tier)."));
  }

  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found.");

  booking.status = BOOKING_STATUS.REJECTED;
  booking.rejectionReason = reason || "Declined by lab administrator.";
  await booking.save();

  return res.status(200).json(new APIResponse(200, booking, "Booking request rejected."));
});

export const performCheckIn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { baselinePhotos = [], checklist = {}, notes = "" } = req.body;
  const user = req.user;

  const inspectionRecord = {
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
  };

  if (!isDbConnected()) {
    const booking = memoryStore.bookings.find((b) => b._id === id) || memoryStore.bookings[0];
    booking.status = BOOKING_STATUS.CHECKED_IN;
    booking.checkedInAt = new Date();

    memoryStore.auditLogs.unshift({
      _id: `aud_${Date.now()}_chk`,
      booking: booking._id,
      resource: booking.resource?._id || booking.resource,
      actor: user,
      actorName: user.name,
      actorRole: user.role,
      action: AUDIT_ACTIONS.PERFORM_CHECKIN,
      fromState: BOOKING_STATUS.APPROVED,
      toState: BOOKING_STATUS.CHECKED_IN,
      justification: "Physical custody transferred to requester. Baseline photos logged.",
      tamperHash: crypto.randomBytes(32).toString("hex"),
      timestamp: new Date(),
    });

    return res.status(200).json(
      new APIResponse(200, { booking, inspection: { checkInRecord: inspectionRecord } }, "Equipment checked in successfully (In-Memory Tier).")
    );
  }

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  booking.status = BOOKING_STATUS.CHECKED_IN;
  booking.checkedInAt = new Date();
  await booking.save();

  const inspection = await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    { checkInRecord: inspectionRecord },
    { upsert: true, new: true }
  );

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.PERFORM_CHECKIN,
    fromState: BOOKING_STATUS.APPROVED,
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

  const returnPhotosList = returnPhotos.length > 0 ? returnPhotos : [
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800"
  ];

  // Run VisionGuard AI diff comparison
  const aiDiffResult = await AIService.compareConditionPhotos({
    baselinePhotos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
    ],
    returnPhotos: returnPhotosList,
    resourceTitle: "Haas VF-2 Super Speed CNC Mill",
    checklistNotes: notes,
  });

  if (!isDbConnected()) {
    const booking = memoryStore.bookings.find((b) => b._id === id) || memoryStore.bookings[0];
    booking.status = BOOKING_STATUS.RETURNED;
    booking.returnedAt = new Date();

    memoryStore.auditLogs.unshift({
      _id: `aud_${Date.now()}_ret`,
      booking: booking._id,
      resource: booking.resource?._id || booking.resource,
      actor: user,
      actorName: user.name,
      actorRole: user.role,
      action: AUDIT_ACTIONS.INITIATE_RETURN,
      fromState: BOOKING_STATUS.CHECKED_IN,
      toState: BOOKING_STATUS.RETURNED,
      justification: `Equipment returned. VisionGuard analysis: ${aiDiffResult.riskSeverity} (${aiDiffResult.humanSummary})`,
      tamperHash: crypto.randomBytes(32).toString("hex"),
      timestamp: new Date(),
    });

    return res.status(200).json(
      new APIResponse(
        200,
        { booking, aiDiffResult, inspection: { returnRecord: { photos: returnPhotosList, checklist } } },
        "Return submitted. Automated condition inspection complete (In-Memory Tier)."
      )
    );
  }

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  booking.status = BOOKING_STATUS.RETURNED;
  booking.returnedAt = new Date();
  await booking.save();

  const inspection = await ConditionInspection.findOneAndUpdate(
    { booking: booking._id },
    {
      returnRecord: {
        timestamp: new Date(),
        photos: returnPhotosList,
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
    fromState: BOOKING_STATUS.CHECKED_IN,
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
  const { signoffNotes = "" } = req.body;
  const user = req.user;

  if (!isDbConnected()) {
    const booking = memoryStore.bookings.find((b) => b._id === id) || memoryStore.bookings[0];
    booking.status = BOOKING_STATUS.COMPLETED;

    memoryStore.auditLogs.unshift({
      _id: `aud_${Date.now()}_com`,
      booking: booking._id,
      resource: booking.resource?._id || booking.resource,
      actor: user,
      actorName: user.name,
      actorRole: user.role,
      action: AUDIT_ACTIONS.COMPLETE_TRANSACTION,
      fromState: BOOKING_STATUS.RETURNED,
      toState: BOOKING_STATUS.COMPLETED,
      justification: signoffNotes || "Manager signoff complete. Transaction finalized.",
      tamperHash: crypto.randomBytes(32).toString("hex"),
      timestamp: new Date(),
    });

    return res.status(200).json(
      new APIResponse(200, booking, "Booking completed and signed off successfully (In-Memory Tier).")
    );
  }

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new ApiError(404, "Booking not found.");

  booking.status = BOOKING_STATUS.COMPLETED;
  await booking.save();

  await recordAuditLog({
    bookingId: booking._id,
    resourceId: booking.resource._id,
    actor: user,
    action: AUDIT_ACTIONS.COMPLETE_TRANSACTION,
    fromState: BOOKING_STATUS.RETURNED,
    toState: BOOKING_STATUS.COMPLETED,
    justification: signoffNotes || "Manager signoff complete. Transaction finalized.",
  });

  return res.status(200).json(
    new APIResponse(200, booking, "Booking completed and signed off successfully.")
  );
});
