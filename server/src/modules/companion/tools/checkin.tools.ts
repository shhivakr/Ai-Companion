import { createCheckIn } from "../../checkins/services/checkin.service.js";
import { createCheckInSchema } from "../../checkins/schemas/checkin.schema.js";
import type { CompanionTool, ToolResult } from "./tool.types.js";

export const createCheckInTool: CompanionTool = {
  name: "createCheckIn",
  description: "Create a new check-in with feeling, energy, focus, and an optional note.",
  schema: createCheckInSchema,
  async execute(args, context): Promise<ToolResult> {
    try {
      const checkIn = await createCheckIn(context.userId, args as any);
      return {
        success: true,
        data: {
          checkInId: checkIn._id.toString(),
          feeling: checkIn.feeling,
          energy: checkIn.energy,
          focus: checkIn.focus
        }
      };
    } catch (error: any) {
      return {
        success: false,
        errorCode: "execution_failed",
        message: error.message || "Failed to create check-in"
      };
    }
  }
};
