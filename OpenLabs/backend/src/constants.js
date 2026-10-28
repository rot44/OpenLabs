export const DB_NAME = "openlabs";

export const USER_ROLES = {
  REQUESTER: "requester",
  OWNER: "owner",
  ADMIN: "admin",
};

export const RESOURCE_CATEGORIES = {
  MACHINERY: "machinery",
  LAB_SPACE: "lab_space",
  PROTOTYPING: "prototyping",
  MEDIA: "media",
  TESTING_DEVICE: "testing_device",
};

export const RESOURCE_STATUS = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
  RETIRED: "retired",
};

export const BOOKING_STATUS = {
  REQUESTED: "requested",
  VERIFYING: "verifying",
  APPROVED: "approved",
  WAITLISTED: "waitlisted",
  REJECTED: "rejected",
  CHECKED_IN: "checked_in",
  RETURNED: "returned",
  DISPUTED: "disputed",
  COMPLETED: "completed",
};

export const AUDIT_ACTIONS = {
  CREATE_LISTING: "CREATE_LISTING",
  SUBMIT_REQUEST: "SUBMIT_REQUEST",
  VERIFY_CREDENTIAL: "VERIFY_CREDENTIAL",
  APPROVE_BOOKING: "APPROVE_BOOKING",
  REJECT_BOOKING: "REJECT_BOOKING",
  WAITLIST_BOOKING: "WAITLIST_BOOKING",
  PERFORM_CHECKIN: "PERFORM_CHECKIN",
  INITIATE_RETURN: "INITIATE_RETURN",
  AI_DIFF_ANOMALY: "AI_DIFF_ANOMALY",
  RESOLVE_INCIDENT: "RESOLVE_INCIDENT",
  COMPLETE_TRANSACTION: "COMPLETE_TRANSACTION",
};

export const RISK_SEVERITY = {
  CLEAN: "CLEAN",
  NORMAL_WEAR: "NORMAL_WEAR",
  COSMETIC_DAMAGE: "COSMETIC_DAMAGE",
  CRITICAL_HAZARD: "CRITICAL_HAZARD",
};
