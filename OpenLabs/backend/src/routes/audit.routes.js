import { Router } from "express";
import {
  getAuditTimeline,
  getAllAuditLogs,
  verifyAuditIntegrity,
} from "../controllers/auditController.js";

const router = Router();

router.get("/timeline/:bookingId", getAuditTimeline);
router.get("/all", getAllAuditLogs);
router.get("/verify/:id", verifyAuditIntegrity);

export default router;

