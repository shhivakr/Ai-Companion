import { z } from "zod";

export interface CompanionToolContext {
  userId: string;
}

export interface ToolResult {
  success: boolean;
  message?: string;
  data?: unknown;
  errorCode?: "unknown_tool" | "invalid_arguments" | "not_found" | "not_authorized" | "validation_failed" | "execution_failed";
}

export interface CompanionTool<T = unknown> {
  name: string;
  description: string;
  schema: z.ZodSchema<T>;
  execute(args: T, context: CompanionToolContext): Promise<ToolResult>;
}
