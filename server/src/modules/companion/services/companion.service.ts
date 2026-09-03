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

  const [context, rawHistory] = await Promise.all([
    getCompanionContext(userId, message),

    Message.find({
      conversation: conversation._id,
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  const history = rawHistory.reverse();

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
  const [context, rawHistory] = await Promise.all([
    getCompanionContext(userId, message),
    Message.find({
      conversation: conversation._id,
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  const history = rawHistory.reverse();

  const systemInstruction = buildCompanionSystemPrompt(context);
  const messages = history.map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const tools = [
    // We only expose tools for explicitly tool-supported intents or all the time?
    // Let's expose them all the time so Gemini can decide.
    // However, we must import `companionToolDeclarations`.
    // I'll add an import at the top of the file.
  ];

  // We actually need to import `companionToolDeclarations` from tool.registry.ts.
  // We'll do that at the top of the file in a separate step.
  // For now, let's just pass `tools: (await import("../tools/tool.registry.js")).companionToolDeclarations`
  
  let accumulated = "";
  let streamStarted = false;
  let requiresConfirmation = false;
  let toolCallResult: any = null;

  try {
    const { companionToolDeclarations } = await import("../tools/tool.registry.js");
    const { processToolCall } = await import("../tools/execution/tool.executor.js");

    const textStream = await aiProvider.streamResponse(
      { systemInstruction, messages, tools: [{ functionDeclarations: companionToolDeclarations }] },
      abortSignal,
    );

    for await (const chunk of textStream) {
      if (abortSignal?.aborted) break;
      streamStarted = true;

      if (chunk.type === "toolCall") {
        const { toolCall } = chunk;
        const processResult = await processToolCall(userId, toolCall.name, toolCall.args, resolvedConversationId, clientMessageId);
        
        if (processResult.type === "ambiguity") {
          onEvent({ type: "tool_ambiguity" as any, message: processResult.message, candidates: processResult.candidates } as any);
          accumulated += processResult.message;
          // We can stop here, since ambiguity requires user response
        } else if (processResult.type === "confirmation_required") {
          requiresConfirmation = true;
          toolCallResult = processResult;
          onEvent({ 
            type: "tool_confirmation_required" as any, 
            actionId: processResult.action.id,
            toolName: processResult.action.toolName,
            summary: processResult.action.summary
          } as any);
        } else if (processResult.type === "error") {
          onEvent({ type: "error", code: "generation_failed" });
        }
        // If it's executed directly, we'd loop back to Gemini, but we're only doing confirmation_required tools.
        break; 
      } else {
        accumulated += chunk.text;
        onEvent({ type: "chunk", text: chunk.text });
      }
    }
  } catch (err) {
    if (abortSignal?.aborted) return;
    onEvent({ type: "error", code: "generation_failed" });
    return;
  }

  if (abortSignal?.aborted) return;

  if (!streamStarted || (!accumulated && !requiresConfirmation && !toolCallResult)) {
    onEvent({ type: "error", code: "generation_failed" });
    return;
  }

  // Persist
  try {
    if (requiresConfirmation) {
      // Don't persist a final assistant message yet, because they need to confirm.
      // Or we can persist the tool call if we want, but usually it's better to wait until completion.
      // For now, we will NOT persist the assistant message until execution is confirmed.
      // But wait! If we don't persist it, on refresh the user won't see the confirmation UI.
      // The prompt says "Do NOT persist this [PendingAction] to MongoDB unless the existing architecture clearly requires persistence."
      // Since it's not persisted to DB, if they refresh, the confirmation is gone. This is fine.
    } else {
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
    }
  } catch (persistErr) {
    console.error("Companion stream persistence error:", persistErr);
    onEvent({ type: "error", code: "persistence_failed" });
    return;
  }

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
