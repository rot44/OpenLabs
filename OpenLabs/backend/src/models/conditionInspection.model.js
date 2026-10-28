import mongoose, { Schema } from "mongoose";
import { RISK_SEVERITY } from "../constants.js";

const anomalySchema = new Schema(
  {
    component: { type: String, required: true },
    issueDescription: { type: String, required: true },
    coordinates: {
      ymin: Number,
      xmin: Number,
      ymax: Number,
      xmax: Number,
    },
  },
  { _id: false }
);

const conditionInspectionSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkInRecord: {
      timestamp: { type: Date, default: null },
      photos: [{ type: String }],
      checklist: {
        cleanlinessVerified: { type: Boolean, default: false },
        noStructuralDamage: { type: Boolean, default: false },
        accessoriesIntact: { type: Boolean, default: false },
        powerCycleOk: { type: Boolean, default: false },
      },
      notes: { type: String, default: "" },
    },
    returnRecord: {
      timestamp: { type: Date, default: null },
      photos: [{ type: String }],
      checklist: {
        cleanedAfterUse: { type: Boolean, default: false },
        toolsReturned: { type: Boolean, default: false },
        noNewDamageObserved: { type: Boolean, default: false },
      },
      notes: { type: String, default: "" },
    },
    aiDiffResult: {
      analyzedAt: { type: Date, default: null },
      anomalyDetected: { type: Boolean, default: false },
      confidenceScore: { type: Number, default: 0 },
      riskSeverity: {
        type: String,
        enum: Object.values(RISK_SEVERITY),
        default: RISK_SEVERITY.CLEAN,
      },
      anomalies: [anomalySchema],
      recommendedAction: { type: String, default: "RELEASE_DEPOSIT" },
      humanSummary: { type: String, default: "No damage detected." },
    },
    managerSignoff: {
      approved: { type: Boolean, default: false },
      signedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
      signedAt: { type: Date, default: null },
      notes: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const ConditionInspection = mongoose.model(
  "ConditionInspection",
  conditionInspectionSchema
);

