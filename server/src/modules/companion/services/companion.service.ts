import mongoose from "mongoose";

import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";

import { aiProvider } from "./ai.service";
import { getCompanionContext } from "./context.service";

import { buildCompanionSystemPrompt } from "../prompts/companion.prompt";
import type { StreamEvent } from "../types/companion.types";

interface ChatResult {
  conversationId: string;
  message: string;
}

export async function chatWithCompanion(
  userId: string,
  message: string,
  conversationId?: string,
): Promise<ChatResult> {
  let conversation: InstanceType<typeof Conversation> | null = null;

  if (conversationId) {
    if (!mongoose.isValidObjectId(conversationId)) {
      throw new Error("Invalid conversation ID");
    }

    conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: userId,
      title: message.slice(0, 120),
    });
  }

  await Message.create({
    conversation: conversation._id,
    user: userId,
    role: "user",
    content: message,
  });

  const [context, history] = await Promise.all([
    getCompanionContext(userId),

    Message.find({
      conversation: conversation._id,
      user: userId,
    })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean(),
  ]);

  const systemInstruction = buildCompanionSystemPrompt(context);

  const messages = history.map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const response = await aiProvider.generateResponse({
    systemInstruction,
    messages,
  });

  await Message.create({
    conversation: conversation._id,
    user: userId,
    role: "assistant",
    content: response.content,
  });

  await Conversation.updateOne(
    {
      _id: conversation._id,
      user: userId,
    },
    {
      $set: {
        updatedAt: new Date(),
      },
    },
  );

  return {
    conversationId: conversation._id.toString(),
    message: response.content,
  };
}

/**
 * Streams an AI response for the companion chat.
 *
 * @param userId         - Authenticated user ID
 * @param message        - User message text
 * @param clientMessageId - Client-generated idempotency key (used across retries)
 * @param onEvent        - Callback that receives SSE events to write to the response
 * @param conversationId - Optional existing conversation ID
 * @param abortSignal    - Signal from the Express req.socket close event
 */
export async function streamChatWithCompanion(
  userId: string,
  message: string,
  clientMessageId: string,
  onEvent: (event: StreamEvent) => void,
  conversationId?: string,
  abortSignal?: AbortSignal,
): Promise<void> {
  // ─── 1. Resolve or create conversation ────────────────────────────────────
  let conversation: InstanceType<typeof Conversation> | null = null;

  if (conversationId) {
    if (!mongoose.isValidObjectId(conversationId)) {
      onEvent({ type: "error", code: "invalid_request" });
      return;
    }

    conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: userId,
      title: message.slice(0, 120),
    });
  }

  const resolvedConversationId = conversation._id.toString();

  // Send conversationId to client as early as possible so it can persist to
  // sessionStorage even before the first text chunk arrives.
  onEvent({ type: "conversation", conversationId: resolvedConversationId });

  // ─── 2. Idempotent user message persistence ────────────────────────────────
  // Check if a user message with this clientMessageId already exists for this
  // conversation (i.e. a retry). If it does, skip creating a duplicate.
  const existingUserMessage = await Message.findOne({
    conversation: conversation._id,
    user: userId,
    role: "user",
    clientMessageId,
  }).lean();

  if (!existingUserMessage) {
    await Message.create({
      conversation: conversation._id,
      user: userId,
      role: "user",
      content: message,
      clientMessageId,
    });
  }

  // ─── 3. Load context and conversation history concurrently ────────────────
  const [context, history] = await Promise.all([
    getCompanionContext(userId),
    Message.find({
      conversation: conversation._id,
      user: userId,
    })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean(),
  ]);

  const systemInstruction = buildCompanionSystemPrompt(context);
  const messages = history.map((item) => ({
    role: item.role,
    content: item.content,
  }));

  // ─── 4. Stream from AI provider ───────────────────────────────────────────
  let accumulated = "";
  let streamStarted = false;

  try {
    const textStream = await aiProvider.streamResponse(
      { systemInstruction, messages },
      abortSignal,
    );

    for await (const chunk of textStream) {
      // If client disconnected, stop consuming the generator.
      if (abortSignal?.aborted) {
        break;
      }

      streamStarted = true;
      accumulated += chunk;
      onEvent({ type: "chunk", text: chunk });
    }
  } catch (err) {
    // Distinguish abort from genuine error
    if (abortSignal?.aborted) {
      // Client disconnected — do not persist partial response, do not emit error
      return;
    }

    // Genuine AI generation failure
    onEvent({ type: "error", code: "generation_failed" });
    return;
  }

  // If aborted after the loop (e.g. aborted between chunks), do not persist.
  if (abortSignal?.aborted) {
    return;
  }

  if (!streamStarted || !accumulated) {
    onEvent({ type: "error", code: "generation_failed" });
    return;
  }

  // ─── 5. Persist the complete assistant response (exactly once) ────────────
  try {
    await Message.create({
      conversation: conversation._id,
      user: userId,
      role: "assistant",
      content: accumulated,
    });

    await Conversation.updateOne(
      { _id: conversation._id, user: userId },
      { $set: { updatedAt: new Date() } },
    );
  } catch (persistErr) {
    // Persistence failed — inform the client if the connection is still open
    console.error("Companion stream persistence error:", persistErr);
    onEvent({ type: "error", code: "persistence_failed" });
    return;
  }

  // ─── 6. Signal successful completion ─────────────────────────────────────
  onEvent({ type: "done" });
}

export async function getConversationHistory(
  userId: string,
  conversationId: string,
) {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  }).lean();

  if (!conversation) {
    return null;
  }

  const messages = await Message.find({
    conversation: conversation._id,
    user: userId,
  })
    .sort({ createdAt: 1 })
    .lean();

  return {
    conversationId: conversation._id.toString(),
    title: conversation.title,
    messages: messages.map((message) => ({
      id: message._id.toString(),
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    })),
  };
}

export async function getConversations(userId: string, limit = 20) {
  const conversations = await Conversation.find({
    user: userId,
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select("_id title createdAt updatedAt")
    .lean();

  return conversations.map((conversation) => ({
    conversationId: conversation._id.toString(),
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  }));
}
