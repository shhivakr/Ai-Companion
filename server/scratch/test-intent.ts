import { resolveIntent } from "../src/modules/companion/services/intent.service.js";

const testCases = [
  // Greetings
  "hi",
  "hello",
  "good morning",

  // Today
  "what should I work on today?",
  "what should I focus on?",
  "what is my priority today?",

  // Tasks
  "what tasks do I have?",
  "show my pending tasks",
  "what is left to do?",

  // Completion
  "what did I complete today?",
  "what have I finished?",

  // Overdue
  "what am I behind on?",
  "what's overdue?",
  "which tasks did I miss?",

  // Goals
  "what are my goals?",
  "show my active goals",
  "how am I doing on my goals?",
  "how close am I to my goals?",

  // Check-in
  "how am I feeling?",
  "I'm feeling unmotivated",
  "I'm tired",
  "I'm not focused",

  // Planning
  "help me plan my day",
  "what should I do next?",
  "make a plan for today",

  // Mixed
  "what should I focus on today? I have overdue tasks",
  "how am I doing on my goals and what should I work on next?",
  "I'm feeling unmotivated, what should I work on?",

  // Ambiguous
  "how am I doing?",
  "what should I do?",

  // Negation
  "I don't have any overdue tasks",
  "I'm not tired",
];

console.log("Running intent resolution tests:\n");
testCases.forEach((tc) => {
  console.log(`\nMessage: "${tc}"`);
  const result = resolveIntent(tc);
  console.log(`  Intent:     ${result.intent}`);
  console.log(`  Secondary:  ${result.secondaryIntents.join(", ")}`);
  console.log(`  Confidence: ${result.confidence}`);
  console.log(`  Depth:      ${result.depth}`);
  console.log(
    `  Needs:      Tasks:${result.contextNeeds.tasks} | Goals:${result.contextNeeds.goals} | CheckIn:${result.contextNeeds.checkIn}`
  );
});
