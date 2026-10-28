import mongoose from "mongoose";
import { Resource } from "../models/resource.model.js";
import { Booking } from "../models/booking.model.js";
import { memoryStore } from "../db/memoryStore.js";
import { ApiError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordAuditLog } from "../utils/auditHelper.js";
import { AUDIT_ACTIONS, RESOURCE_STATUS, BOOKING_STATUS } from "../constants.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getAllResources = asyncHandler(async (req, res) => {
  const { category, department, search, status } = req.query;

  if (!isDbConnected()) {
    let list = [...memoryStore.resources];
    if (category) list = list.filter((r) => r.category === category);
    if (department) list = list.filter((r) => r.department === department);
    if (status) list = list.filter((r) => r.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    return res.status(200).json(
      new APIResponse(200, list, `Retrieved ${list.length} resources (In-Memory Tier).`)
    );
  }

  const filter = {};
  if (category) filter.category = category;
  if (department) filter.department = department;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { requiredQualifications: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const resources = await Resource.find(filter)
    .populate("owner", "name email department avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new APIResponse(200, resources, `Retrieved ${resources.length} resources.`)
  );
});

export const getResourceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const resource = memoryStore.resources.find((r) => r._id === id);
    if (!resource) throw new ApiError(404, "Resource not found.");
    const upcomingBookings = memoryStore.bookings.filter(
      (b) => b.resource._id === id || b.resource === id
    );
    return res.status(200).json(
      new APIResponse(200, { resource, upcomingBookings }, "Resource details retrieved (In-Memory Tier).")
    );
  }

  const resource = await Resource.findById(id).populate("owner", "name email department avatar");
  if (!resource) throw new ApiError(404, "Resource not found.");

  const upcomingBookings = await Booking.find({
    resource: id,
    status: { $in: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.CHECKED_IN] },
    startTime: { $gte: new Date() },
  })
    .select("startTime endTime status durationHours")
    .sort({ startTime: 1 });

  return res.status(200).json(
    new APIResponse(200, { resource, upcomingBookings }, "Resource details retrieved.")
  );
});

export const createResource = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    title,
    category,
    description,
    department,
    location,
    images = [],
    requiredQualifications = [],
    hourlyRate = 0,
    weeklyQuotaLimit = 10,
    specs = {},
  } = req.body;

  if (!title || !category || !description || !department || !location?.building) {
    throw new ApiError(400, "Title, category, description, department, and location are required.");
  }

  const resourceData = {
    _id: `res_${Date.now()}`,
    title,
    category,
    description,
    department,
    location,
    images: images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    ],
    owner: user._id,
    requiredQualifications,
    hourlyRate,
    weeklyQuotaLimit,
    specs,
    status: RESOURCE_STATUS.AVAILABLE,
  };

  if (!isDbConnected()) {
    memoryStore.resources.unshift(resourceData);
    return res.status(201).json(
      new APIResponse(201, resourceData, "Resource listing created successfully (In-Memory Tier).")
    );
  }

  const resource = await Resource.create(resourceData);

  await recordAuditLog({
    resourceId: resource._id,
    actor: user,
    action: AUDIT_ACTIONS.CREATE_LISTING,
    fromState: null,
    toState: RESOURCE_STATUS.AVAILABLE,
    justification: "Resource published to catalog with safety requirements.",
    metadata: { requiredQualifications, weeklyQuotaLimit },
  });

  return res.status(201).json(
    new APIResponse(201, resource, "Resource listing created successfully.")
  );
});
