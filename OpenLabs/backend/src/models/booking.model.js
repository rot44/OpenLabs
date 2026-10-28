import mongoose, { Schema } from "mongoose";
import { BOOKING_STATUS } from "../constants.js";

const bookingSchema = new Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
      min: 0.5,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.REQUESTED,
      index: true,
    },
    fairUsageScore: {
      type: Number,
      default: 1.0,
    },
    waitlistRank: {
      type: Number,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    checkInQrToken: {
      type: String,
      default: null,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);

