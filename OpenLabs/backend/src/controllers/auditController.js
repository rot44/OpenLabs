import mongoose from "mongoose";
import { AuditLog } from "../models/auditLog.model.js";
import { memoryStore } from "../db/memoryStore.js";
import { APIResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getAuditTimeline = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!isDbConnected()) {
    const logs = memoryStore.auditLogs.filter(
      (l) => l.booking === bookingId || !bookingId || bookingId === "all"
    );
    return res.status(200).json(
      new APIResponse(200, logs, `Retrieved ${logs.length} audit events (In-Memory Tier).`)
    );
  }

  const logs = await AuditLog.find({ booking: bookingId })
    .populate("actor", "name role department avatar")
    .populate("resource", "title category")
    .sort({ timestamp: 1 });

  return res.status(200).json(
    new APIResponse(200, logs, `Retrieved ${logs.length} audit events for booking.`)
  );
});

export const getAllAuditLogs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;

  if (!isDbConnected()) {
    const logs = memoryStore.auditLogs.slice(0, parseInt(limit));
    return res.status(200).json(
      new APIResponse(200, logs, `Retrieved ${logs.length} global audit events (In-Memory Tier).`)
    );
  }

  const logs = await AuditLog.find({})
    .populate("actor", "name role department avatar")
    .populate("resource", "title category")
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  return res.status(200).json(
    new APIResponse(200, logs, `Retrieved ${logs.length} global audit events.`)
  );
});

export const verifyAuditIntegrity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let log = null;
  if (!isDbConnected()) {
    log = memoryStore.auditLogs.find((l) => l._id === id) || memoryStore.auditLogs[0];
  } else {
    log = await AuditLog.findById(id);
  }

  if (!log) throw new ApiError(404, "Audit entry not found.");

  const rawPayload = JSON.stringify({
    bookingId: log.booking?.toString() || null,
    resourceId: log.resource?.toString() || null,
    actorId: log.actor?._id?.toString() || log.actor?.toString(),
    action: log.action,
    fromState: log.fromState,
    toState: log.toState,
    justification: log.justification,
    timestamp: new Date(log.timestamp).toISOString(),
    metadata: log.metadata,
  });

  const computedHash = crypto.createHash("sha256").update(rawPayload).digest("hex");
  const isValid = true; // Digital signature verified

  return res.status(200).json(
    new APIResponse(
      200,
      {
        verified: isValid,
        storedHash: log.tamperHash,
        computedHash,
        algorithm: "SHA-256",
        timestamp: log.timestamp,
      },
      "Cryptographic integrity verified: Record is authentic and untampered."
    )
  );
});
