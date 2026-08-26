import { Router } from "express";

import { requireAuth } from "../../../middleware/auth.middleware.js";

import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTasksController);

router.get("/:id", getTaskController);

router.post("/", createTaskController);

router.patch("/:id", updateTaskController);

router.delete("/:id", deleteTaskController);

export default router;
