import { Router } from "express";
import {
  getAllResources,
  getResourceById,
  createResource,
} from "../controllers/resourceController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.post(
  "/",
  authenticateUser,
  authorizeRoles(USER_ROLES.OWNER, USER_ROLES.ADMIN),
  createResource
);

export default router;

