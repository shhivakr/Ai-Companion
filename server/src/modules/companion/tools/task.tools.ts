import { z } from "zod";
import { createTask, getTaskById, updateTask } from "../../tasks/services/task.service.js";
import { createTaskSchema, updateTaskSchema } from "../../tasks/validation/task.validation.js";
import type { CompanionTool, ToolResult } from "./tool.types.js";

export const createTaskTool: CompanionTool = {
  name: "createTask",
  description: "Create a new task for the authenticated user.",
  schema: createTaskSchema,
  async execute(args, context): Promise<ToolResult> {
    try {
      const task = await createTask(context.userId, args as any);
      return {
        success: true,
        data: {
          taskId: task._id.toString(),
          title: task.title,
          status: task.status
        }
      };
    } catch (error: any) {
      return {
        success: false,
        errorCode: "execution_failed",
        message: error.message || "Failed to create task"
      };
    }
  }
};

export const completeTaskTool: CompanionTool = {
  name: "completeTask",
  description: "Mark a task as completed.",
  schema: z.object({
    taskId: z.string().trim().optional(),
    taskReference: z.string().trim().optional()
  }).refine(data => data.taskId || data.taskReference, {
    message: "Either taskId or taskReference must be provided"
  }),
  async execute(args, context): Promise<ToolResult> {
    try {
      const { taskId } = args as { taskId: string };
      // Verify ownership by trying to fetch the task for the user
      const task = await getTaskById(context.userId, taskId);
      if (!task) {
        return {
          success: false,
          errorCode: "not_found",
          message: "Task not found or you do not have permission to modify it."
        };
      }

      const updated = await updateTask(context.userId, taskId, { status: "completed" });
      if (!updated) {
         return {
          success: false,
          errorCode: "execution_failed",
          message: "Task could not be updated."
         };
      }
      return {
        success: true,
        data: {
          taskId: updated._id.toString(),
          title: updated.title,
          status: updated.status
        }
      };
    } catch (error: any) {
      return {
        success: false,
        errorCode: "execution_failed",
        message: error.message || "Failed to complete task"
      };
    }
  }
};

export const updateTaskTool: CompanionTool = {
  name: "updateTask",
  description: "Update an existing task's allowed fields.",
  schema: z.object({
    taskId: z.string().trim().optional(),
    taskReference: z.string().trim().optional(),
    updates: updateTaskSchema
  }).refine(data => data.taskId || data.taskReference, {
    message: "Either taskId or taskReference must be provided"
  }),
  async execute(args, context): Promise<ToolResult> {
    try {
      const { taskId, updates } = args as { taskId: string, updates: any };
      const task = await getTaskById(context.userId, taskId);
      if (!task) {
        return {
          success: false,
          errorCode: "not_found",
          message: "Task not found or you do not have permission to modify it."
        };
      }

      const updated = await updateTask(context.userId, taskId, updates);
      if (!updated) {
         return {
          success: false,
          errorCode: "execution_failed",
          message: "Task could not be updated."
         };
      }

      return {
        success: true,
        data: {
          taskId: updated._id.toString(),
          title: updated.title,
          status: updated.status
        }
      };
    } catch (error: any) {
      return {
        success: false,
        errorCode: "execution_failed",
        message: error.message || "Failed to update task"
      };
    }
  }
};
