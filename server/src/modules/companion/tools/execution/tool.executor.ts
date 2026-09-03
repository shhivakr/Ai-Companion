import crypto from "crypto";
import { executeCompanionTool } from "../tool.registry.js";
import { companionToolDeclarations } from "../tool.registry.js";
import { Task } from "../../../tasks/models/Task.js";
import mongoose from "mongoose";
import type { ToolResult } from "../tool.types.js";

// Pending actions map (in-memory, per instance).
// In a distributed setup, this could be Redis. For now, it's sufficient per the prompt.
export interface PendingToolAction {
  id: string;
  toolName: string;
  arguments: any;
  userId: string;
  conversationId: string;
  clientMessageId: string;
  confirmationRequired: boolean;
  summary: string;
  createdAt: Date;
  expiresAt: Date;
}

const pendingActions = new Map<string, PendingToolAction>();

export function getPendingAction(actionId: string, userId: string): PendingToolAction | undefined {
  const action = pendingActions.get(actionId);
  if (action && action.userId === userId && action.expiresAt > new Date()) {
    return action;
  }
  return undefined;
}

export function consumePendingAction(actionId: string): void {
  pendingActions.delete(actionId);
}

export function cancelPendingAction(actionId: string, userId: string): boolean {
  const action = pendingActions.get(actionId);
  if (action && action.userId === userId) {
    pendingActions.delete(actionId);
    return true;
  }
  return false;
}

// Generates a human-readable summary
function generateToolSummary(toolName: string, args: any): string {
  switch (toolName) {
    case "createTask":
      return `Create task “${args.title}”`;
    case "completeTask":
      // Title will be injected if resolved
      return `Mark task “${args._resolvedTitle || args.taskId}” as completed`;
    case "updateTask":
      return `Update task “${args._resolvedTitle || args.taskId}”`;
    case "createCheckIn":
      return `Save today's check-in`;
    default:
      return `Execute ${toolName}`;
  }
}

export type ExecutionLayerResult = 
  | { type: "ambiguity"; message: string; candidates: any[] }
  | { type: "confirmation_required"; action: PendingToolAction }
  | { type: "executed"; result: ToolResult }
  | { type: "error"; message: string; errorCode: string };

// Attempt to resolve natural language reference to a task ID
async function resolveTaskReference(userId: string, taskReference: string): Promise<{ taskId?: string, title?: string, candidates?: any[] }> {
  const tasks = await Task.find({ user: new mongoose.Types.ObjectId(userId) }).lean();
  
  const lowerRef = taskReference.toLowerCase();
  
  // exact title match
  let matches = tasks.filter(t => t.title.toLowerCase() === lowerRef);
  if (matches.length === 1) return { taskId: matches[0]._id.toString(), title: matches[0].title };
  
  // partial keyword match
  matches = tasks.filter(t => t.title.toLowerCase().includes(lowerRef));
  if (matches.length === 1) return { taskId: matches[0]._id.toString(), title: matches[0].title };
  
  if (matches.length > 1) {
    return { 
      candidates: matches.map(m => ({ id: m._id.toString(), title: m.title, status: m.status, priority: m.priority })) 
    };
  }

  return {}; // No match
}

export async function processToolCall(
  userId: string, 
  toolName: string, 
  args: any,
  conversationId: string,
  clientMessageId: string
): Promise<ExecutionLayerResult> {
  const toolDeclarations = companionToolDeclarations.find(t => t.name === toolName);
  if (!toolDeclarations) {
    return { type: "error", errorCode: "unknown_tool", message: "Unknown tool requested." };
  }
  
  // Need the actual tool object to get the Zod schema
  // We can dynamically import or just access it since it's the same logic `executeCompanionTool` uses.
  // Wait, `processToolCall` is the entry point, so we need access to the tool's schema.
  const { tools } = await import("../tool.registry.js");
  const tool = tools[toolName];
  if (!tool) {
    return { type: "error", errorCode: "unknown_tool", message: "Unknown tool requested." };
  }

  const parseResult = tool.schema.safeParse(args);
  if (!parseResult.success) {
    return { type: "error", errorCode: "validation_failed", message: `Invalid arguments: ${parseResult.error.message}` };
  }

  args = parseResult.data;

  // Pre-process for entity resolution (tasks)
  if ((toolName === "completeTask" || toolName === "updateTask") && !args.taskId && args.taskReference) {
    const resolution = await resolveTaskReference(userId, args.taskReference);
    
    if (resolution.candidates) {
      return {
        type: "ambiguity",
        message: `I found multiple tasks matching “${args.taskReference}”. Which one do you mean?`,
        candidates: resolution.candidates
      };
    }
    
    if (!resolution.taskId) {
      return { type: "error", errorCode: "not_found", message: "I couldn't find that task." };
    }

    args.taskId = resolution.taskId;
    args._resolvedTitle = resolution.title;
  }
  
  if ((toolName === "completeTask" || toolName === "updateTask") && args.taskId) {
     if (!args._resolvedTitle) {
        const t = await Task.findOne({ _id: args.taskId, user: new mongoose.Types.ObjectId(userId) }).lean();
        if (t) {
            args._resolvedTitle = t.title;
        } else {
             return { type: "error", errorCode: "not_found", message: "I couldn't find that task." };
        }
     }
  }

  // Confirmation is required for all currently supported tools
  const requiresConfirmation = ["createTask", "completeTask", "updateTask", "createCheckIn"].includes(toolName);

  if (requiresConfirmation) {
    const actionId = crypto.randomUUID();
    const action: PendingToolAction = {
      id: actionId,
      toolName,
      arguments: args,
      userId,
      conversationId,
      clientMessageId,
      confirmationRequired: true,
      summary: generateToolSummary(toolName, args),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins expiry
    };
    pendingActions.set(actionId, action);
    
    return { type: "confirmation_required", action };
  }

  // If no confirmation needed, execute directly (future proofing)
  const result = await executeCompanionTool(toolName, args, { userId });
  return { type: "executed", result };
}
