import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import {
  createMemorySchema,
  memoryIdSchema,
  memoryQuerySchema,
  updateMemorySchema,
} from "../schemas/memory.schema.js";
import {
  createMemory,
  deleteMemory,
  getMemories,
  getMemoryById,
  updateMemory,
} from "../services/memory.service.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

function getValidationError(error: unknown) {
  if (error && typeof error === "object" && "flatten" in error) {
    return (error as { flatten: () => unknown }).flatten();
  }

  return undefined;
}

export async function createMemoryController(req: Request, res: Response) {
  const result = createMemorySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid memory data",
      errors: result.error.flatten(),
    });
  }

  try {
    const memory = await createMemory(getUserId(req), result.data);

    return res.status(201).json({
      message: "Memory created successfully",
      memory,
    });
  } catch (error) {
    console.error("Create memory error:", error);

    return res.status(500).json({
      message: "Failed to create memory",
    });
  }
}

export async function getMemoriesController(req: Request, res: Response) {
  const result = memoryQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid memory query",
      errors: result.error.flatten(),
    });
  }

  try {
    const memories = await getMemories(getUserId(req), result.data);

    return res.status(200).json({
      memories,
    });
  } catch (error) {
    console.error("Get memories error:", error);

    return res.status(500).json({
      message: "Failed to fetch memories",
    });
  }
}

export async function getMemoryController(req: Request, res: Response) {
  const result = memoryIdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid memory id",
      errors: result.error.flatten(),
    });
  }

  try {
    const memory = await getMemoryById(getUserId(req), result.data.id);

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    return res.status(200).json({
      memory,
    });
  } catch (error) {
    console.error("Get memory error:", error);

    return res.status(500).json({
      message: "Failed to fetch memory",
    });
  }
}

export async function updateMemoryController(req: Request, res: Response) {
  const paramsResult = memoryIdSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      message: "Invalid memory id",
      errors: paramsResult.error.flatten(),
    });
  }

  const bodyResult = updateMemorySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      message: "Invalid memory data",
      errors: bodyResult.error.flatten(),
    });
  }

  try {
    const memory = await updateMemory(
      getUserId(req),
      paramsResult.data.id,
      bodyResult.data,
    );

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    return res.status(200).json({
      message: "Memory updated successfully",
      memory,
    });
  } catch (error) {
    console.error("Update memory error:", error);

    return res.status(500).json({
      message: "Failed to update memory",
    });
  }
}

export async function deleteMemoryController(req: Request, res: Response) {
  const result = memoryIdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid memory id",
      errors: result.error.flatten(),
    });
  }

  try {
    const memory = await deleteMemory(getUserId(req), result.data.id);

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    return res.status(200).json({
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Delete memory error:", error);

    return res.status(500).json({
      message: "Failed to delete memory",
    });
  }
}
