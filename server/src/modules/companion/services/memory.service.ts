import mongoose from "mongoose";
import { UserMemory } from "../models/UserMemory.js";
import type { CompanionIntent, ResolvedIntent } from "../types/companion.types.js";

/**
 * Deterministically attempts to extract a memory statement from a user's message.
 * Returns null if the statement appears to be temporary state (e.g., "today", "right now").
 */
function extractMemoryStatement(message: string): { key: string; value: string; category: string } | null {
  const msgLower = message.toLowerCase().trim();

  // Reject explicit temporary state
  if (msgLower.includes("today") || msgLower.includes("right now") || msgLower.includes("tomorrow") || msgLower.includes("yesterday")) {
    return null;
  }

  // 1. Direct "remember that X" instructions
  const rememberMatch = message.match(/(?:remember that|keep in mind that|please remember|don't forget that) (.+)/i);
  if (rememberMatch) {
    let value = rememberMatch[1].trim();
    value = value.replace(/^i /i, "User ").replace(/\bmy\b/gi, "User's");

    let category = "preference";
    let key = "explicit_" + Date.now().toString(); // default unique key
    if (value.toLowerCase().includes("work") || value.toLowerCase().includes("coding") || value.toLowerCase().includes("morning") || value.toLowerCase().includes("night")) {
      category = "work_style";
      key = "preferred_work_style";
    } else if (value.toLowerCase().includes("response") || value.toLowerCase().includes("answer") || value.toLowerCase().includes("concise") || value.toLowerCase().includes("short")) {
      category = "preference";
      key = "response_style";
    }

    return {
      category,
      key,
      value: value.charAt(0).toUpperCase() + value.slice(1)
    };
  }

  // 2. Preference statements
  const preferMatch = message.match(/(i prefer|my preference is|i usually|i like to) (.+)/i);
  if (preferMatch) {
    let value = preferMatch[0].trim();
    value = value.replace(/^i prefer/i, "User prefers")
                 .replace(/^my preference is/i, "User's preference is")
                 .replace(/^i usually/i, "User usually")
                 .replace(/^i like to/i, "User likes to");
    
    let category = "work_style";
    let key = "routine_" + Date.now().toString();
    if (value.toLowerCase().includes("work") || value.toLowerCase().includes("coding") || value.toLowerCase().includes("morning") || value.toLowerCase().includes("night")) {
      key = "preferred_work_style";
    } else if (value.toLowerCase().includes("response") || value.toLowerCase().includes("answer") || value.toLowerCase().includes("concise") || value.toLowerCase().includes("short")) {
      category = "preference";
      key = "response_style";
    }

    return {
      category,
      key,
      value: value.charAt(0).toUpperCase() + value.slice(1)
    };
  }

  return null;
}

export async function processAndSaveMemory(userId: string, message: string, intentInfo: ResolvedIntent): Promise<void> {
  const hasMemorySaveIntent = intentInfo.intent === "memory_save" || intentInfo.secondaryIntents.includes("memory_save");
  
  if (!hasMemorySaveIntent || intentInfo.confidence !== "high") {
    return;
  }

  const extracted = extractMemoryStatement(message);
  if (!extracted) {
    return;
  }

  // Update or insert the memory
  await UserMemory.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(userId), category: extracted.category, key: extracted.key } as any,
    {
      value: extracted.value,
      source: "user_explicit",
      confidence: "high"
    },
    { upsert: true, new: true }
  );
}

export async function getUserMemories(userId: string) {
  const memories = await UserMemory.find({ user: new mongoose.Types.ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .lean();
  return memories;
}

export async function findRelevantMemories(userId: string, intentInfo: ResolvedIntent) {
  // Bounded deterministic relevance logic
  const query = { user: new mongoose.Types.ObjectId(userId) };

  const allMemories = await UserMemory.find(query).lean();
  
  // Deterministic relevance based on intent
  return allMemories.filter(memory => {
    // Universal preferences are always relevant
    if (memory.category === "preference") return true;

    // Routine and work style
    if (memory.category === "routine" || memory.category === "work_style") {
      return ["today_focus", "planning", "productivity", "memory_save", "memory_recall"].includes(intentInfo.intent) ||
             intentInfo.secondaryIntents.some(i => ["today_focus", "planning"].includes(i));
    }

    return true;
  });
}

export async function deleteMemory(userId: string, memoryId: string) {
  await UserMemory.deleteOne({
    _id: new mongoose.Types.ObjectId(memoryId),
    user: new mongoose.Types.ObjectId(userId)
  });
}

export async function clearUserMemories(userId: string) {
  await UserMemory.deleteMany({ user: new mongoose.Types.ObjectId(userId) });
}
