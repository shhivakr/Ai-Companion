import { Router } from "express";

import { requireAuth } from "../../../middleware/auth.middleware.js";

import {
  createMemoryController,
  deleteMemoryController,
  getMemoriesController,
  getMemoryController,
  updateMemoryController,
} from "../controllers/memory.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getMemoriesController);
router.get("/:id", getMemoryController);
router.post("/", createMemoryController);
router.patch("/:id", updateMemoryController);
router.delete("/:id", deleteMemoryController);

export default router;
