import { Router } from "express";

import {
  createCheckInController,
  getCheckInsController,
  getTodayCheckInController,
} from "../controllers/checkin.controller.js";

import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", createCheckInController);
router.get("/", getCheckInsController);
router.get("/today", getTodayCheckInController);

export default router;