import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../constants.js";

const safetyCertSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    issuingAuthority: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    documentUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.REQUESTER,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    },
    reputationScore: {
      type: Number,
      default: 1.0,
      min: 0.0,
      max: 1.0,
    },
    weeklyHoursUsed: {
      type: Number,
      default: 0,
    },
    safetyCertificates: [safetyCertSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

