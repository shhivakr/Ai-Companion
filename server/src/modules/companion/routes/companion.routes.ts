import { Router } from "express";

import {
  chatCompanionController,
  streamChatCompanionController,
  getConversationController,
  getConversationsController,
} from "../controllers/companion.controller.js";

import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

// Non-streaming endpoint — unchanged
router.post("/chat", requireAuth, chatCompanionController);

// Streaming SSE endpoint
router.post("/chat/stream", requireAuth, streamChatCompanionController);

router.get("/conversations", requireAuth, getConversationsController);

router.get(
  "/conversations/:conversationId",
  requireAuth,
  getConversationController,
);

export default router;
