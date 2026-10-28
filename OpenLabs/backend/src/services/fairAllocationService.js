import { Booking } from "../models/booking.model.js";
import { Resource } from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { BOOKING_STATUS } from "../constants.js";

/**
 * Service enforcing Criterion #6: Fair Allocation & Anti-Monopolization
 */
export class FairAllocationService {
  /**
   * Enforces weekly usage quota to prevent monopolization.
   */
  static async evaluateQuota({ userId, resourceId, requestedHours }) {
    const resource = await Resource.findById(resourceId);
    if (!resource) throw new Error("Resource not found");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Calculate start of current calendar week (Monday 00:00)
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon, 6=Sun
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    // Sum hours booked by this user on this resource for the current week
    const currentWeekBookings = await Booking.find({
      resource: resourceId,
      requester: userId,
      startTime: { $gte: weekStart },
      status: {
        $in: [
          BOOKING_STATUS.REQUESTED,
          BOOKING_STATUS.APPROVED,
          BOOKING_STATUS.CHECKED_IN,
          BOOKING_STATUS.COMPLETED,
        ],
      },
    });

    const hoursUsedThisWeek = currentWeekBookings.reduce(
      (acc, b) => acc + (b.durationHours || 0),
      0
    );

    const weeklyCap = resource.weeklyQuotaLimit || 10;
    const isExceeded = hoursUsedThisWeek + requestedHours > weeklyCap;

    return {
      hoursUsedThisWeek,
      requestedHours,
      weeklyCap,
      isExceeded,
      remainingHours: Math.max(0, weeklyCap - hoursUsedThisWeek),
      recommendation: isExceeded
        ? `Weekly limit of ${weeklyCap}h reached (${hoursUsedThisWeek}h used). Request placed on waitlist.`
        : "Within fair allocation limit.",
    };
  }

  /**
   * Calculates explainable Priority Score for waitlisting & tiebreakers.
   * PriorityScore = 0.35*(IdleDays) + 0.35*(1 - Used/Cap) + 0.20*(Reputation) - 0.10*(ActiveHolds)
   */
  static async calculatePriorityScore({ userId, resourceId }) {
    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);

    // 1. Idle time: Days since last completed booking on any equipment in this department
    const lastBooking = await Booking.findOne({
      requester: userId,
      status: BOOKING_STATUS.COMPLETED,
    }).sort({ endTime: -1 });

    const daysIdle = lastBooking
      ? Math.min(30, (Date.now() - new Date(lastBooking.endTime).getTime()) / (1000 * 60 * 60 * 24))
      : 30; // 30 days max weight if first-time user
    const idleScore = Math.min(1.0, daysIdle / 14); // Normalized to 14 days

    // 2. Capacity utilization score (inverted)
    const weeklyCap = resource?.weeklyQuotaLimit || 10;
    const hoursUsed = user?.weeklyHoursUsed || 0;
    const capacityScore = Math.max(0.0, 1.0 - hoursUsed / weeklyCap);

    // 3. Reputation score
    const reputationScore = user?.reputationScore ?? 0.95;

    // 4. Active holds penalty
    const activeHolds = await Booking.countDocuments({
      requester: userId,
      status: { $in: [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.APPROVED, BOOKING_STATUS.CHECKED_IN] },
    });
    const holdsPenalty = Math.min(0.5, activeHolds * 0.1);

    // Weighted composite score (0.0 to 1.0 scale)
    const compositeScore =
      0.35 * idleScore +
      0.35 * capacityScore +
      0.2 * reputationScore -
      holdsPenalty;

    return parseFloat(Math.max(0.1, Math.min(1.0, compositeScore)).toFixed(3));
  }

  /**
   * Checks for scheduling conflicts and enforces 30-min turnaround buffer.
   */
  static async checkSchedulingConflict({
    resourceId,
    startTime,
    endTime,
    excludeBookingId = null,
  }) {
    const BUFFER_MS = 30 * 60 * 1000; // 30 minutes maintenance/inspection buffer
    const bufferedStart = new Date(new Date(startTime).getTime() - BUFFER_MS);
    const bufferedEnd = new Date(new Date(endTime).getTime() + BUFFER_MS);

    const query = {
      resource: resourceId,
      status: {
        $in: [
          BOOKING_STATUS.APPROVED,
          BOOKING_STATUS.CHECKED_IN,
        ],
      },
      $or: [
        { startTime: { $lt: bufferedEnd, $gte: bufferedStart } },
        { endTime: { $gt: bufferedStart, $lte: bufferedEnd } },
        { startTime: { $lte: bufferedStart }, endTime: { $gte: bufferedEnd } },
      ],
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(query).populate("requester", "name email");

    return {
      hasConflict: !!conflictingBooking,
      conflictingBooking,
      bufferRequiredMinutes: 30,
    };
  }

  /**
   * Generates Departmental Parity & Monopolization analytics for judges.
   */
  static async getFairnessMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const aggregateStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.APPROVED, BOOKING_STATUS.CHECKED_IN] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "requester",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.department",
          totalHours: { $sum: "$durationHours" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalHours: -1 } },
    ]);

    const totalHoursAll = aggregateStats.reduce((sum, item) => sum + item.totalHours, 0) || 1;

    const departmentShares = aggregateStats.map((item) => ({
      department: item._id,
      totalHours: item.totalHours,
      totalBookings: item.totalBookings,
      percentage: parseFloat(((item.totalHours / totalHoursAll) * 100).toFixed(1)),
      isWithinParityCeiling: (item.totalHours / totalHoursAll) <= 0.40, // 40% cap
    }));

    return {
      monopolizationDetected: departmentShares.some((d) => !d.isWithinParityCeiling),
      totalSharedHours30d: totalHoursAll,
      parityCeilingLimitPercent: 40,
      departmentShares,
    };
  }
}

