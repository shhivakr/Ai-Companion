import { Router } from "express";
import {
  chatCompanionController,
  getConversationController,
} from "../controllers/companion.controller.js";
import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", requireAuth, chatCompanionController);

router.get(
  "/conversations/:conversationId",
  requireAuth,
  getConversationController,
);

export default router;
