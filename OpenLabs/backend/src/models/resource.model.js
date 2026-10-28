import mongoose, { Schema } from "mongoose";
import { RESOURCE_CATEGORIES, RESOURCE_STATUS } from "../constants.js";

const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(RESOURCE_CATEGORIES),
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      building: { type: String, required: true },
      room: { type: String, required: true },
      campus: { type: String, default: "Main Campus" },
    },
    images: [
      {
        type: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requiredQualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    hourlyRate: {
      type: Number,
      default: 0,
    },
    weeklyQuotaLimit: {
      type: Number,
      default: 10, // Max hours per user per week to avoid monopolization
    },
    isInstantApproval: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(RESOURCE_STATUS),
      default: RESOURCE_STATUS.AVAILABLE,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    operatingHours: {
      start: { type: String, default: "08:00" },
      end: { type: String, default: "20:00" },
      days: { type: [Number], default: [1, 2, 3, 4, 5] }, // 1=Mon, 5=Fri
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);

