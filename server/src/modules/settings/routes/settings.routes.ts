import { Router } from "express";

import { requireAuth } from "../../../middleware/auth.middleware.js";

import {
  getSettingsController,
  updateSettingsController,
} from "../controllers/settings.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getSettingsController);

router.patch("/", updateSettingsController);

export default router;
