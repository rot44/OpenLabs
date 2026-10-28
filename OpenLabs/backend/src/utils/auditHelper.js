import crypto from "crypto";
import { AuditLog } from "../models/auditLog.model.js";

/**
 * Creates an immutable, tamper-evident audit log entry.
 */
export const recordAuditLog = async ({
  bookingId = null,
  resourceId = null,
  actor,
  action,
  fromState = null,
  toState,
  justification = "",
  metadata = {},
}) => {
  try {
    const timestamp = new Date();
    const rawPayload = JSON.stringify({
      bookingId,
      resourceId,
      actorId: actor?._id || actor?.id,
      action,
      fromState,
      toState,
      justification,
      timestamp: timestamp.toISOString(),
      metadata,
    });

    // Generate SHA-256 tamper hash
    const tamperHash = crypto
      .createHash("sha256")
      .update(rawPayload)
      .digest("hex");

    const auditEntry = await AuditLog.create({
      booking: bookingId,
      resource: resourceId,
      actor: actor?._id || actor?.id,
      actorName: actor?.name || "System Automated",
      actorRole: actor?.role || "system",
      action,
      fromState,
      toState,
      justification,
      metadata,
      tamperHash,
      timestamp,
    });

    return auditEntry;
  } catch (error) {
    console.error("Failed to record audit log:", error);
    // We log but do not crash the primary transaction
    return null;
  }
};

