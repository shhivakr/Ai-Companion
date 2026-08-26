import { Router } from "express";

import { requireAuth } from "../../../middleware/auth.middleware.js";

import {
  createGoalController,
  deleteGoalController,
  getGoalController,
  getGoalsController,
  updateGoalController,
} from "../controllers/goal.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getGoalsController);

router.get("/:id", getGoalController);

router.post("/", createGoalController);

router.patch("/:id", updateGoalController);

router.delete("/:id", deleteGoalController);

export default router;
