import { Router } from "express";
import {
  switchPersona,
  getCurrentUser,
  getAllPersonas,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/switch-persona", switchPersona);
router.get("/me", authenticateUser, getCurrentUser);
router.get("/personas", getAllPersonas);

export default router;

