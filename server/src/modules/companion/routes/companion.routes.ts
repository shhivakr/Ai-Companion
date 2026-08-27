import { Router } from "express";

import {
  chatCompanionController,
  getConversationController,
  getConversationsController,
} from "../controllers/companion.controller.js";

import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", requireAuth, chatCompanionController);

router.get("/conversations", requireAuth, getConversationsController);

router.get(
  "/conversations/:conversationId",
  requireAuth,
  getConversationController,
);

export default router;
