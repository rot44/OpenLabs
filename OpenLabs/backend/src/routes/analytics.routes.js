import { Router } from "express";
import {
  getFairnessAnalytics,
  getPlatformOverview,
} from "../controllers/analyticsController.js";

const router = Router();

router.get("/fairness", getFairnessAnalytics);
router.get("/overview", getPlatformOverview);

export default router;

