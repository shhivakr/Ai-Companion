import mongoose from "mongoose";

import { Memory } from "../models/Memory";
import type {
  CreateMemoryInput,
  MemoryQueryInput,
  UpdateMemoryInput,
} from "../schemas/memory.schema";

export async function createMemory(userId: string, input: CreateMemoryInput) {
  return Memory.create({
    user: new mongoose.Types.ObjectId(userId),
    ...input,
  });
}

export async function getMemories(userId: string, query: MemoryQueryInput) {
  const filter: {
    user: mongoose.Types.ObjectId;
    category?: MemoryQueryInput["category"];
    source?: MemoryQueryInput["source"];
  } = {
    user: new mongoose.Types.ObjectId(userId),
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.source) {
    filter.source = query.source;
  }

  return Memory.find(filter).sort({
    importance: -1,
    updatedAt: -1,
  });
}

export async function getMemoryById(userId: string, memoryId: string) {
  return Memory.findOne({
    _id: new mongoose.Types.ObjectId(memoryId),
    user: new mongoose.Types.ObjectId(userId),
  });
}

export async function updateMemory(
  userId: string,
  memoryId: string,
  input: UpdateMemoryInput,
) {
  return Memory.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(memoryId),
      user: new mongoose.Types.ObjectId(userId),
    },
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteMemory(userId: string, memoryId: string) {
  return Memory.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(memoryId),
    user: new mongoose.Types.ObjectId(userId),
  });
}
