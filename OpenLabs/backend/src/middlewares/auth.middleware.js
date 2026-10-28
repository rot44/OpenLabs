import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_ROLES } from "../constants.js";

/**
 * Intelligent Authentication & Persona Switcher Middleware.
 * Resolves user from:
 * 1. x-persona header or query (?persona=alex|elena|marcus)
 * 2. Cookie openlabs_persona
 * 3. Default fallback to Alex Chen (requester) for seamless API testing & evaluation.
 */
export const authenticateUser = asyncHandler(async (req, res, next) => {
  const personaHeader =
    req.headers["x-persona"] ||
    req.cookies?.openlabs_persona ||
    req.query?.persona;

  let user = null;

  if (personaHeader) {
    const roleSearch = personaHeader.toLowerCase();
    if (roleSearch.includes("elena") || roleSearch === USER_ROLES.OWNER) {
      user = await User.findOne({ role: USER_ROLES.OWNER });
    } else if (roleSearch.includes("marcus") || roleSearch === USER_ROLES.ADMIN) {
      user = await User.findOne({ role: USER_ROLES.ADMIN });
    } else {
      user = await User.findOne({ role: USER_ROLES.REQUESTER });
    }
  }

  // Fallback to primary requester (Alex Chen) if not found or not specified
  if (!user) {
    user = await User.findOne({ role: USER_ROLES.REQUESTER });
  }

  // If still no user in DB (pre-seed), provide an ephemeral mock user so endpoints don't crash
  if (!user) {
    user = {
      _id: "660000000000000000000001",
      name: "Alex Chen (Demo)",
      email: "alex.chen@student.university.edu",
      role: USER_ROLES.REQUESTER,
      department: "Mechanical & Aerospace Engineering",
      reputationScore: 0.94,
      weeklyHoursUsed: 6,
    };
  }

  req.user = user;
  next();
});

/**
 * Role-Based Access Control (RBAC) Guard.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Forbidden: Role '${req.user?.role || "anonymous"}' does not have permission to perform this action. Required: [${allowedRoles.join(", ")}]`
      );
    }
    next();
  };
};

