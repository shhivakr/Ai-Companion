import { getPendingAction, consumePendingAction } from "../tools/execution/tool.executor.js";
import { executeCompanionTool } from "../tools/tool.registry.js";
import { aiProvider, classifyGeminiError } from "./ai.service.js";
import { getCompanionContext } from "./context.service.js";
import { buildCompanionSystemPrompt } from "../prompts/companion.prompt.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import type { StreamEvent } from "../types/companion.types.js";

export async function streamConfirmToolAction(
  userId: string,
  actionId: string,
  onEvent: (event: StreamEvent) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  const pendingAction = getPendingAction(actionId, userId);
  if (!pendingAction) {
    onEvent({ type: "error", code: "invalid_request" } as any);
    return;
  }

  // Consume action (idempotent, prevents replay)
  consumePendingAction(actionId);

  onEvent({ type: "tool_executing" as any, toolName: pendingAction.toolName } as any);

  // Execute
  const toolResult = await executeCompanionTool(pendingAction.toolName, pendingAction.arguments, { userId });

  onEvent({ 
    type: "tool_result" as any, 
    toolName: pendingAction.toolName, 
    success: toolResult.success 
  } as any);

  // Now feed back to Gemini to get final response
  const conversation = await Conversation.findOne({ _id: pendingAction.conversationId, user: userId });
  if (!conversation) {
    onEvent({ type: "error", code: "invalid_request" } as any);
    return;
  }

  const [context, rawHistory] = await Promise.all([
    getCompanionContext(userId, ""), 
    Message.find({ conversation: conversation._id, user: userId }) 
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  const history = rawHistory.reverse();
  const systemInstruction = buildCompanionSystemPrompt(context);
  
  // Create Gemini messages matching history
  const messages: any[] = history.map((item: any) => ({
    role: item.role,
    content: item.content,
  }));

  // Append the tool call and result
  messages.push({
    role: "tool_call",
    name: pendingAction.toolName,
    args: pendingAction.arguments
  });
  messages.push({
    role: "function",
    name: pendingAction.toolName,
    content: toolResult
  });

  let accumulated = "";
  let streamStarted = false;

  try {
    const textStream = await aiProvider.streamResponse(
      { systemInstruction, messages },
      abortSignal,
    );

    for await (const chunk of textStream) {
      if (abortSignal?.aborted) break;
      streamStarted = true;

      if (chunk.type === "text") {
        accumulated += chunk.text;
        onEvent({ type: "chunk", text: chunk.text });
      }
    }
  } catch (err) {
    if (abortSignal?.aborted) return;
    const errorCode = classifyGeminiError(err);
    console.error(`[companion] gemini:error ${actionId} (${errorCode})`, err);
    onEvent({ type: "error", code: errorCode } as any);
    return;
  }

  if (abortSignal?.aborted) return;

  if (!streamStarted || !accumulated) {
    onEvent({ type: "error", code: "generation_failed" } as any);
    return;
  }

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
    console.error("Companion stream persistence error:", persistErr);
    onEvent({ type: "error", code: "persistence_failed" } as any);
    return;
  }

  onEvent({ type: "done" });
}
