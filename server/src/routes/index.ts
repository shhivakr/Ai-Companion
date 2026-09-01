import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import goalRoutes from "../modules/goals/routes/goal.routes.js";
import taskRoutes from "../modules/tasks/routes/task.routes.js";
import companionRoutes from "../modules/companion/routes/companion.routes.js";
import checkInRoutes from "../modules/checkins/routes/checkin.routes.js";
import timelineRoutes from "../modules/timeline/routes/timeline.routes.js";
import memoryRoutes from "../modules/memory/routes/memory.routes.js";
import settingsRoutes from "../modules/settings/routes/settings.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Personal AI Companion API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/goals", goalRoutes);
router.use("/tasks", taskRoutes);
router.use("/companion", companionRoutes);
router.use("/check-ins", checkInRoutes);
router.use("/timeline", timelineRoutes);
router.use("/memory", memoryRoutes);
router.use("/settings", settingsRoutes);

export default router;
