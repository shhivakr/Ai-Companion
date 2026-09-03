import type {
  CompanionIntent,
  ResolvedIntent,
  ContextDepth,
} from "../types/companion.types.js";

/**
 * Lightweight intent rules for deterministic scoring.
 */
interface IntentRule {
  intent: CompanionIntent;
  exactPhrases?: string[];
  multiWordPhrases?: string[];
  keywords?: string[];
  questions?: string[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "greeting",
    exactPhrases: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "how are you", "how are you doing"],
  },
  {
    intent: "today_focus",
    exactPhrases: [
      "what should i work on today",
      "what is my priority today",
      "what should i do first",
      "what should i focus on today",
      "what should i do today",
      "help me decide what to work on",
    ],
    multiWordPhrases: [
      "work on today",
      "priority today",
      "focus on today",
      "important today",
      "focus on",
      "work on",
    ],
    keywords: ["today", "priority", "urgent"],
    questions: [
      "what should i focus on",
      "what should i do",
    ],
  },
  {
    intent: "task_status",
    exactPhrases: [
      "what tasks do i have",
      "show my pending tasks",
      "what is left to do",
      "which tasks are incomplete",
      "do i have anything pending",
      "what are my tasks",
      "show my tasks",
    ],
    multiWordPhrases: ["pending tasks", "left to do", "incomplete tasks", "tasks do i have"],
    keywords: ["tasks", "pending", "incomplete"],
    questions: ["what is pending", "what tasks"],
  },
  {
    intent: "task_completion",
    exactPhrases: [
      "what did i complete today",
      "what have i finished",
      "what did i get done today",
      "how many tasks did i finish",
      "what is done",
    ],
    multiWordPhrases: ["completed today", "got done today", "finished today", "completed tasks"],
    keywords: ["complete", "completed", "finish", "finished", "done"],
    questions: ["what did i complete"],
  },
  {
    intent: "overdue_work",
    exactPhrases: [
      "what am i behind on",
      "what's overdue",
      "what is overdue",
      "which tasks did i miss",
      "what have i not finished",
      "am i falling behind",
    ],
    multiWordPhrases: ["behind on", "missed tasks", "past due", "overdue tasks", "tasks are overdue"],
    keywords: ["overdue", "behind", "missed", "late"],
    questions: ["what is overdue", "am i behind"],
  },
  {
    intent: "goal_progress",
    exactPhrases: [
      "how am i doing on my goals",
      "how is my progress",
      "am i making progress",
      "how close am i to my goals",
      "show my goal progress",
      "goal progress",
    ],
    multiWordPhrases: ["progress on my goals", "goal progress", "towards my goal", "progress on"],
    keywords: ["progress", "achieve", "towards", "advance"],
    questions: ["how is my progress", "am i making progress"],
  },
  {
    intent: "goal_status",
    exactPhrases: [
      "what are my goals",
      "show my active goals",
      "what am i working towards",
      "list my goals",
    ],
    multiWordPhrases: ["my goals", "active goals", "working towards"],
    keywords: ["goals", "objective", "milestone", "target"],
    questions: ["what are my goals", "show goals"],
  },
  {
    intent: "check_in",
    exactPhrases: [
      "how am i feeling",
      "i feel unmotivated",
      "i am feeling unmotivated",
      "i'm feeling unmotivated",
      "i am tired",
      "i'm tired",
      "i am stressed",
      "i'm stressed",
      "i am not focused",
      "i'm not focused",
      "check in with me",
      "how is my energy",
    ],
    multiWordPhrases: ["feel unmotivated", "feeling unmotivated", "am tired", "am stressed", "energy level", "my mood", "feeling tired"],
    keywords: ["feel", "feeling", "tired", "stressed", "unmotivated", "energy", "mood", "exhausted", "burnout"],
    questions: ["how is my energy", "how am i feeling"],
  },
  {
    intent: "planning",
    exactPhrases: [
      "help me plan my day",
      "plan my work",
      "how should i organize today",
      "make a plan for today",
      "what should i do next",
      "plan my day",
    ],
    multiWordPhrases: ["plan my day", "organize today", "make a plan", "do next"],
    keywords: ["plan", "organize", "schedule"],
    questions: ["how should i organize", "what to do next"],
  },
  {
    intent: "memory_save",
    exactPhrases: [
      "remember that i",
      "please remember i",
      "keep in mind that i",
      "don't forget that i",
    ],
    multiWordPhrases: [
      "remember that",
      "keep in mind",
      "i prefer",
      "i usually",
      "my preference is",
      "i like to",
      "i prefer to"
    ],
    keywords: ["remember", "prefer", "preference"],
  },
  {
    intent: "memory_recall",
    exactPhrases: [
      "what do you remember about me",
      "what do you know about my preferences",
      "do you remember how i like to work",
      "what are my preferences"
    ],
    multiWordPhrases: [
      "remember about me",
      "know about me",
      "my preferences",
      "do you remember"
    ],
    questions: [
      "what do you remember",
      "what do you know"
    ],
  },
];

/**
 * Checks for negation in the context of specific keywords.
 * If the message has "don't", "not", "no" within 3 words before the target, it's negated.
 */
function isNegated(message: string, phraseOrKeyword: string): boolean {
  const negationPattern = new RegExp(`(?:not|don't|dont|no|never|isn't|aren't|am not)\\s+(?:\\w+\\s+){0,3}${phraseOrKeyword}`, 'i');
  return negationPattern.test(message);
}

/**
 * Scores an intent based on exact matches, multi-word phrases, keywords, and questions.
 */
function scoreIntent(message: string, rule: IntentRule): number {
  let score = 0;
  const msgLower = message.toLowerCase().trim();
  
  // Remove punctuation for easier matching
  const msgClean = msgLower.replace(/[^\w\s]/g, "");

  // Helper to check if a phrase exists as a whole word
  const containsPhrase = (phrase: string) => {
    return new RegExp(`\\b${phrase}\\b`, 'i').test(msgLower);
  };

  // 1. Exact phrase (highest weight)
  if (rule.exactPhrases) {
    for (const phrase of rule.exactPhrases) {
      if (msgClean === phrase.replace(/[^\w\s]/g, "")) {
        return 100; // Definite match
      }
      if (containsPhrase(phrase)) {
        if (!isNegated(msgLower, phrase)) {
          score += 30;
        }
      }
    }
  }

  // 2. Question patterns
  if (rule.questions) {
    for (const q of rule.questions) {
      if (containsPhrase(q)) {
        if (!isNegated(msgLower, q)) {
          score += 20;
        }
      }
    }
  }

  // 3. Multi-word phrases
  if (rule.multiWordPhrases) {
    for (const phrase of rule.multiWordPhrases) {
      if (containsPhrase(phrase)) {
        if (!isNegated(msgLower, phrase)) {
          score += 15;
        }
      }
    }
  }

  // 4. Keywords
  if (rule.keywords) {
    for (const kw of rule.keywords) {
      // Use word boundaries for keywords
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(msgLower)) {
        if (!isNegated(msgLower, kw)) {
          score += 5;
        }
      }
    }
  }

  return score;
}

/**
 * Maps an intent to its context needs and depth.
 */
function getContextNeedsForIntent(intent: CompanionIntent): {
  depth: ContextDepth;
  tasks: boolean;
  goals: boolean;
  checkIn: boolean;
  signals: boolean;
} {
  switch (intent) {
    case "greeting":
      return { depth: "minimal", tasks: false, goals: false, checkIn: false, signals: true };
    case "today_focus":
      return { depth: "focused", tasks: true, goals: true, checkIn: false, signals: true };
    case "task_status":
      return { depth: "focused", tasks: true, goals: false, checkIn: false, signals: true };
    case "task_completion":
      return { depth: "focused", tasks: true, goals: false, checkIn: false, signals: true };
    case "overdue_work":
      return { depth: "focused", tasks: true, goals: false, checkIn: false, signals: true };
    case "goal_progress":
    case "goal_status":
      return { depth: "focused", tasks: true, goals: true, checkIn: false, signals: true };
    case "check_in":
      return { depth: "focused", tasks: true, goals: true, checkIn: true, signals: true };
    case "planning":
      return { depth: "deep", tasks: true, goals: true, checkIn: true, signals: true };
    case "productivity":
      return { depth: "focused", tasks: true, goals: true, checkIn: false, signals: true };
    case "memory_save":
      return { depth: "minimal", tasks: false, goals: false, checkIn: false, signals: false };
    case "memory_recall":
      return { depth: "minimal", tasks: false, goals: false, checkIn: false, signals: false };
    case "general":
    default:
      return { depth: "minimal", tasks: false, goals: false, checkIn: false, signals: true };
  }
}

/**
 * Resolves the primary intent and confidence for a user message.
 */
export function resolveIntent(message: string): ResolvedIntent {
  const msgLower = message.toLowerCase().trim();

  // Special fast-path for pure greetings
  const isGreeting = /^(hi|hello|hey|good morning|good evening|good afternoon)(\s+there)?$/.test(msgLower.replace(/[^\w\s]/g, ""));
  if (isGreeting) {
    return {
      intent: "greeting",
      secondaryIntents: [],
      confidence: "high",
      depth: "minimal",
      contextNeeds: { tasks: false, goals: false, checkIn: false, signals: true },
    };
  }

  // 1. Score all intents
  const scoredIntents: { intent: CompanionIntent; score: number }[] = [];
  for (const rule of INTENT_RULES) {
    scoredIntents.push({ intent: rule.intent, score: scoreIntent(message, rule) });
  }

  // Sort by score descending
  scoredIntents.sort((a, b) => b.score - a.score);

  let bestIntent = scoredIntents[0].intent;
  let highestScore = scoredIntents[0].score;
  const secondaryIntents: CompanionIntent[] = [];

  // Handle ambiguous cases where scoring is a tie or very low
  let confidence: "high" | "medium" | "low" = "low";
  if (highestScore >= 30) {
    confidence = "high";
  } else if (highestScore >= 15) {
    confidence = "medium";
  } else if (highestScore > 0) {
    confidence = "low";
  }

  // Ambiguous fallback heuristics
  if (highestScore === 0) {
    if (msgLower.includes("how am i doing")) {
      bestIntent = "check_in"; // or productivity
      confidence = "low";
    } else if (msgLower.includes("what should i do")) {
      bestIntent = "today_focus";
      confidence = "low";
    } else {
      bestIntent = "general";
    }
  }

  // 2. Identify meaningful secondary intents
  // Threshold: at least 15 points (multi-word match) AND within a reasonable distance of primary
  // We use score >= 15 && score >= highestScore * 0.25 to allow strong secondary matches 
  // even if the primary was an exact phrase match (100 points).
  for (let i = 1; i < scoredIntents.length; i++) {
    const { intent, score } = scoredIntents[i];
    if (score >= 15 && score >= highestScore * 0.2) {
      secondaryIntents.push(intent);
    }
  }

  // 3. Determine base context needs by UNION of primary and secondary intents
  const combinedNeeds = { tasks: false, goals: false, checkIn: false, signals: true };
  
  const applyNeeds = (intent: CompanionIntent) => {
    const needs = getContextNeedsForIntent(intent);
    if (needs.tasks) combinedNeeds.tasks = true;
    if (needs.goals) combinedNeeds.goals = true;
    if (needs.checkIn) combinedNeeds.checkIn = true;
  };

  applyNeeds(bestIntent);
  secondaryIntents.forEach(applyNeeds);

  // 4. Adjust context for low confidence / ambiguity (Issue 1 fix)
  if (confidence === "low" && bestIntent !== "general") {
    // Strip heavy context but preserve lightweight relevant signals
    combinedNeeds.tasks = false;
    combinedNeeds.goals = false;
    // If the intent is explicitly related to check_in (e.g. "how am i doing?"), preserve checkIn
    if (bestIntent === "check_in" || secondaryIntents.includes("check_in")) {
      combinedNeeds.checkIn = true;
    } else {
      combinedNeeds.checkIn = false;
    }
  }

  // 5. Determine dynamic Context Depth (Issue 2 fix)
  let computedDepth: ContextDepth = "focused";

  // Count how many distinct large context areas are requested
  const contextAreas = (combinedNeeds.tasks ? 1 : 0) + (combinedNeeds.goals ? 1 : 0) + (combinedNeeds.checkIn ? 1 : 0);

  if (bestIntent === "general" || bestIntent === "greeting" || (confidence === "low" && contextAreas <= 1)) {
    computedDepth = "minimal";
  } else if (
    bestIntent === "planning" ||
    (secondaryIntents.length > 0 && contextAreas >= 2) ||
    msgLower.includes("why") || msgLower.includes("how should i fix")
  ) {
    // If asking for planning, OR crossing multiple domains with secondary intents, OR asking deep reasoning questions
    computedDepth = "deep";
  }

  return {
    intent: bestIntent,
    secondaryIntents,
    confidence,
    depth: computedDepth,
    contextNeeds: combinedNeeds,
  };
}
