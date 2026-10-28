import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getManagerInbox,
  approveBooking,
  rejectBooking,
  performCheckIn,
  initiateReturn,
  completeBooking,
} from "../controllers/bookingController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

// Apply authentication middleware to all booking routes
router.use(authenticateUser);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/manager-inbox", authorizeRoles(USER_ROLES.OWNER, USER_ROLES.ADMIN), getManagerInbox);

router.patch("/:id/approve", authorizeRoles(USER_ROLES.OWNER, USER_ROLES.ADMIN), approveBooking);
router.patch("/:id/reject", authorizeRoles(USER_ROLES.OWNER, USER_ROLES.ADMIN), rejectBooking);

router.post("/:id/checkin", performCheckIn);
router.post("/:id/return", initiateReturn);
router.post("/:id/complete", authorizeRoles(USER_ROLES.OWNER, USER_ROLES.ADMIN), completeBooking);

export default router;

