import type { CompanionTool, CompanionToolContext, ToolResult } from "./tool.types.js";
import { createTaskTool, completeTaskTool, updateTaskTool } from "./task.tools.js";
import { createCheckInTool } from "./checkin.tools.js";
import { Type } from "@google/genai";

export const tools: Record<string, CompanionTool> = {
  [createTaskTool.name]: createTaskTool,
  [completeTaskTool.name]: completeTaskTool,
  [updateTaskTool.name]: updateTaskTool,
  [createCheckInTool.name]: createCheckInTool,
};

export async function executeCompanionTool(
  toolName: string,
  args: unknown,
  context: CompanionToolContext
): Promise<ToolResult> {
  const tool = tools[toolName];
  
  if (!tool) {
    return {
      success: false,
      errorCode: "unknown_tool",
      message: `Tool ${toolName} is not registered or not permitted.`
    };
  }

  // Validate args using the defined Zod schema
  const parseResult = tool.schema.safeParse(args);
  if (!parseResult.success) {
    return {
      success: false,
      errorCode: "validation_failed",
      message: `Invalid arguments for ${toolName}: ${parseResult.error.message}`
    };
  }

  // Execute with safely parsed args
  return tool.execute(parseResult.data, context);
}

// Map the tools to Gemini function declarations
export const companionToolDeclarations = [
  {
    name: "createTask",
    description: "Create a new task for the authenticated user.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Title of the task" },
        description: { type: Type.STRING, description: "Optional description of the task" },
        priority: { type: Type.STRING, description: "low, medium, or high" },
        dueDate: { type: Type.STRING, description: "Optional ISO date string for due date" },
        goal: { type: Type.STRING, description: "Optional ObjectId of the goal to associate with" }
      },
      required: ["title"]
    }
  },
  {
    name: "completeTask",
    description: "Mark a task as completed. Provide either a taskId or a natural language taskReference.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        taskId: { type: Type.STRING, description: "The unique ID of the task" },
        taskReference: { type: Type.STRING, description: "Natural language reference to the task if ID is unknown" }
      }
    }
  },
  {
    name: "updateTask",
    description: "Update an existing task's fields. Provide either a taskId or taskReference.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        taskId: { type: Type.STRING, description: "The unique ID of the task" },
        taskReference: { type: Type.STRING, description: "Natural language reference to the task" },
        updates: {
          type: Type.OBJECT,
          description: "The fields to update",
          properties: {
            title: { type: Type.STRING, description: "Title of the task" },
            description: { type: Type.STRING, description: "Optional description of the task" },
            priority: { type: Type.STRING, description: "low, medium, or high" },
            dueDate: { type: Type.STRING, description: "Optional ISO date string for due date" },
            goal: { type: Type.STRING, description: "Optional ObjectId of the goal" },
            status: { type: Type.STRING, description: "pending or completed" }
          }
        }
      },
      required: ["updates"]
    }
  },
  {
    name: "createCheckIn",
    description: "Create a new check-in with feeling, energy, focus, and an optional note.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        feeling: { type: Type.STRING, description: "good, okay, or low" },
        energy: { type: Type.STRING, description: "high, medium, or low" },
        focus: { type: Type.STRING, description: "product_work, client_work, or learning" },
        note: { type: Type.STRING, description: "Optional note up to 1000 characters" }
      },
      required: ["feeling", "energy", "focus"]
    }
  }
];
