import mongoose, { Schema } from "mongoose";
import { AUDIT_ACTIONS } from "../constants.js";

const auditLogSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
      default: null,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      index: true,
      default: null,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(AUDIT_ACTIONS),
      required: true,
      index: true,
    },
    fromState: {
      type: String,
      default: null,
    },
    toState: {
      type: String,
      required: true,
    },
    justification: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    tamperHash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false } // Immutable append-only log
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

