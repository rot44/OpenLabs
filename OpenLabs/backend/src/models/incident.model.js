import mongoose, { Schema } from "mongoose";

const incidentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    description: {
      type: String,
      required: true,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    estimatedDamageCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved"],
      default: "open",
      index: true,
    },
    resolutionAction: {
      type: String,
      enum: ["waived_wear", "partial_charge", "full_forfeit", "retraining_mandate"],
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Incident = mongoose.model("Incident", incidentSchema);

