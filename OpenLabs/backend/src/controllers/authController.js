import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { memoryStore } from "../db/memoryStore.js";
import { APIResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_ROLES } from "../constants.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const switchPersona = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(
      400,
      `Invalid role. Must be one of: [${Object.values(USER_ROLES).join(", ")}]`
    );
  }

  let user = null;
  if (!isDbConnected()) {
    user = memoryStore.users.find((u) => u.role === role);
  } else {
    user = await User.findOne({ role });
  }

  if (!user) {
    user = memoryStore.users.find((u) => u.role === role) || {
      _id: "usr_fallback",
      name: role === USER_ROLES.OWNER ? "Dr. Elena Vance" : role === USER_ROLES.ADMIN ? "Marcus Thorne" : "Alex Chen",
      email: `${role}@university.edu`,
      role,
      department: role === USER_ROLES.OWNER ? "Advanced Manufacturing Lab" : "Mechanical & Aerospace Engineering",
      reputationScore: 0.98,
      weeklyHoursUsed: role === USER_ROLES.REQUESTER ? 6 : 0,
    };
  }

  // Set cookie for browser session persistence
  res.cookie("openlabs_persona", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new APIResponse(
      200,
      { user, activePersona: role },
      `Switched to persona: ${user.name} (${role}).`
    )
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new APIResponse(200, req.user, "Current user retrieved.")
  );
});

export const getAllPersonas = asyncHandler(async (req, res) => {
  let users = [];
  if (!isDbConnected()) {
    users = memoryStore.users;
  } else {
    users = await User.find({}).select(
      "name email role department avatar reputationScore weeklyHoursUsed safetyCertificates"
    );
  }

  return res.status(200).json(
    new APIResponse(200, users, "Retrieved all personas for judge evaluation.")
  );
});
