import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import { chatWithCompanion, getConversationHistory } from "../services/companion.service";
import { chatSchema } from "../validation/companion.validation";
import mongoose from "mongoose";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

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

    const response = await chatWithCompanion(userId, result.data.message);

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

    const conversation = await getConversationHistory(
      userId,
      conversationId,
    );

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