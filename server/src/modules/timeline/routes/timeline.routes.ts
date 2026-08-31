import { Router } from "express";
import { getTimelineController } from "../controllers/timeline.controller.js";
import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTimelineController);

export default router;
