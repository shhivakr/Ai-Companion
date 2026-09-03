import mongoose from "mongoose";
import { processAndSaveMemory, findRelevantMemories, getUserMemories } from "../src/modules/companion/services/memory.service.js";
import { resolveIntent } from "../src/modules/companion/services/intent.service.js";
import { UserMemory } from "../src/modules/companion/models/UserMemory.js";

// MOCK MONGOOSE
let mockDb: any[] = [];

UserMemory.findOneAndUpdate = (async (query: any, update: any, options: any) => {
  const existingIndex = mockDb.findIndex(m => m.user.toString() === query.user.toString() && m.category === query.category && m.key === query.key);
  if (existingIndex > -1) {
    mockDb[existingIndex].value = update.value;
  } else {
    mockDb.push({ user: query.user, category: query.category, key: query.key, value: update.value });
  }
  return mockDb;
}) as any;

UserMemory.find = ((query: any) => {
  return {
    sort: () => ({
      lean: async () => mockDb.filter(m => m.user.toString() === query.user.toString())
    }),
    lean: async () => mockDb.filter(m => m.user.toString() === query.user.toString())
  };
}) as any;

UserMemory.deleteMany = (async () => { mockDb = []; }) as any;

async function runTests() {
  const userId = new mongoose.Types.ObjectId().toString();
  await UserMemory.deleteMany({}); // clean

  console.log("\n--- CASE 1 - EXPLICIT MEMORY ---");
  let msg = "remember that I prefer working in the morning";
  let intent = resolveIntent(msg);
  await processAndSaveMemory(userId, msg, intent);
  let memories = await getUserMemories(userId);
  console.log(memories.map(m => ({ category: m.category, value: m.value })));

  console.log("\n--- CASE 2 - EXPLICIT RESPONSE PREFERENCE ---");
  msg = "remember that I prefer concise responses";
  intent = resolveIntent(msg);
  await processAndSaveMemory(userId, msg, intent);
  memories = await getUserMemories(userId);
  console.log(memories.map(m => ({ category: m.category, value: m.value })));

  console.log("\n--- CASE 3 - TEMPORARY STATE ---");
  msg = "I'm tired today";
  intent = resolveIntent(msg);
  await processAndSaveMemory(userId, msg, intent);
  const memoriesAfterState = await getUserMemories(userId);
  console.log(`Memories count: ${memoriesAfterState.length} (expected: 2)`);

  console.log("\n--- CASE 4 - CURRENT TASK DATA ---");
  msg = "I have 5 pending tasks";
  intent = resolveIntent(msg);
  await processAndSaveMemory(userId, msg, intent);
  const memoriesAfterTask = await getUserMemories(userId);
  console.log(`Memories count: ${memoriesAfterTask.length} (expected: 2)`);

  console.log("\n--- CASE 5 - MEMORY RECALL ---");
  msg = "what do you remember about me?";
  intent = resolveIntent(msg);
  console.log(`Intent: ${intent.intent}`);
  const relevant = await findRelevantMemories(userId, intent);
  console.log(`Relevant memories loaded: ${relevant.map(m => m.value)}`);

  console.log("\n--- CASE 6 - MEMORY UPDATE ---");
  msg = "Remember that I usually prefer working at night"; // Update
  intent = resolveIntent(msg);
  await processAndSaveMemory(userId, msg, intent);
  const updatedMemories = await getUserMemories(userId);
  console.log(updatedMemories.map(m => ({ category: m.category, key: m.key, value: m.value })));
  console.log(`Memories count: ${updatedMemories.length} (expected: 2)`);

  console.log("\n--- CASE 7 - USER ISOLATION ---");
  const userB = new mongoose.Types.ObjectId().toString();
  const userBMemories = await getUserMemories(userB);
  console.log(`User B memories count: ${userBMemories.length} (expected: 0)`);

  console.log("\n--- CASE 8 - MEMORY RELEVANCE ---");
  const query = "what should I work on this morning?";
  const qIntent = resolveIntent(query);
  const rel = await findRelevantMemories(userId, qIntent);
  console.log(`Query: "${query}" -> Intent: ${qIntent.intent}`);
  console.log(`Relevant loaded: ${rel.map(m => m.value)}`);

  const q2 = "what tasks are overdue?";
  const qIntent2 = resolveIntent(q2);
  const rel2 = await findRelevantMemories(userId, qIntent2);
  console.log(`Query: "${q2}" -> Intent: ${qIntent2.intent}`);
  console.log(`Relevant loaded: ${rel2.map(m => m.value)}`);
}

runTests().catch(console.error);
