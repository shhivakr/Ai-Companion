import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import {
  chatWithCompanion,
  streamChatWithCompanion,
  getConversationHistory,
  getConversations,
} from "../services/companion.service";
import { chatSchema } from "../validation/companion.validation";
import mongoose from "mongoose";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

/** Existing non-streaming JSON endpoint — unchanged. */
export async function chatCompanionController(req: Request, res: Response) {
  const result = chatSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid companion request",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const response = await chatWithCompanion(
      userId,
      result.data.message,
      result.data.conversationId,
    );
    return res.status(200).json({
      message: "Companion response generated successfully",
      data: response,
    });
  } catch (error) {
    console.error("Companion chat error:", error);

    return res.status(500).json({
      message: "Failed to generate companion response",
    });
  }
}

/** New SSE streaming endpoint. */
export async function streamChatCompanionController(
  req: Request,
  res: Response,
) {
  // ─── Validate input before starting SSE ───────────────────────────────────
  const result = chatSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid companion request",
      errors: result.error.flatten(),
    });
  }

  const clientMessageId = req.body.clientMessageId;

  if (
    !clientMessageId ||
    typeof clientMessageId !== "string" ||
    clientMessageId.trim().length === 0
  ) {
    return res.status(400).json({
      message: "clientMessageId is required for streaming",
    });
  }

  let userId: string;

  try {
    userId = getUserId(req);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ─── Set SSE headers ───────────────────────────────────────────────────────
  // Once we write these, HTTP status can no longer be changed.
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  // Disable Nginx/proxy buffering so chunks reach the client immediately
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // ─── AbortController for client disconnect ─────────────────────────────────
  const abortController = new AbortController();

  function onClientClose() {
    abortController.abort();
  }

  req.socket.on("close", onClientClose);

  // ─── SSE write helper ──────────────────────────────────────────────────────
  function writeEvent(data: object): void {
    // Only write if response is still writable (client not disconnected)
    if (!res.writableEnded && !abortController.signal.aborted) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // Express 5 / Node HTTP does not expose flush directly; cast to any
      // to call it when available (important for intermediate proxies).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res as any).flush?.();
    }
  }

  // ─── Stream ────────────────────────────────────────────────────────────────
  try {
    await streamChatWithCompanion(
      userId,
      result.data.message,
      clientMessageId.trim(),
      writeEvent,
      result.data.conversationId,
      abortController.signal,
    );
  } catch (error) {
    console.error("Companion stream controller error:", error);
    // Attempt to inform client if connection is still open
    writeEvent({ type: "error", code: "generation_failed" });
  } finally {
    req.socket.off("close", onClientClose);
    if (!res.writableEnded) {
      res.end();
    }
  }
}

export async function streamConfirmToolActionController(
  req: Request<{ actionId: string }>,
  res: Response,
) {
  const { actionId } = req.params;

  let userId: string;

  try {
    userId = getUserId(req);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ─── Set SSE headers ───────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const abortController = new AbortController();

  function onClientClose() {
    abortController.abort();
  }

  req.socket.on("close", onClientClose);

  function writeEvent(data: object): void {
    if (!res.writableEnded && !abortController.signal.aborted) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res as any).flush?.();
    }
  }

  try {
    // Dynamic import to prevent circular dependency issues if any
    const { streamConfirmToolAction } = await import("../services/companion.confirmation.js");
    await streamConfirmToolAction(
      userId,
      actionId,
      writeEvent,
      abortController.signal,
    );
  } catch (error) {
    console.error("Companion confirm stream controller error:", error);
    writeEvent({ type: "error", code: "generation_failed" });
  } finally {
    req.socket.off("close", onClientClose);
    if (!res.writableEnded) {
      res.end();
    }
  }
}

export async function getConversationController(
  req: Request<{ conversationId: string }>,
  res: Response,
) {
  const { conversationId } = req.params;

  if (!mongoose.isValidObjectId(conversationId)) {
    return res.status(400).json({
      message: "Invalid conversation ID",
    });
  }

  try {
    const userId = getUserId(req);

    const conversation = await getConversationHistory(userId, conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    return res.status(500).json({
      message: "Failed to fetch conversation",
    });
  }
}

export async function getConversationsController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const conversations = await getConversations(userId);

    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
}
