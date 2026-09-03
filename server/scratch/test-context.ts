function resolveContextNeeds(message: string) {
  const msg = message.toLowerCase();

  const isGeneral =
    /^(hi|hello|hey|thanks|thank you|ok|okay|cool|good morning|good night)\b/.test(
      msg,
    ) && msg.length < 30;

  if (isGeneral) {
    return {
      includeToday: false,
      includeOverdue: false,
      includeGoals: false,
      includeCheckIn: false,
      includeSignals: true,
    };
  }

  const needsToday = /(today|now|focus|current|what should i do|next|priorit|urgent)/.test(msg);
  const needsOverdue = /(overdue|late|missed|behind|catch up)/.test(msg);
  const needsGoals = /(goal|progress|achieve|objective|target|milestone|status|how am i doing)/.test(msg);
  const needsCheckIn = /(how am i doing|mood|energy|feeling|tired|productive|check-in|check in)/.test(msg);
  const needsTasks = /(task|todo|to do|to-do|list|work on|finish|complete)/.test(msg);

  const hasSpecifics =
    needsToday || needsOverdue || needsGoals || needsCheckIn || needsTasks;

  return {
    includeToday: hasSpecifics ? needsToday || needsTasks : true,
    includeOverdue: hasSpecifics
      ? needsOverdue || needsTasks || needsToday
      : true,
    includeGoals: hasSpecifics ? needsGoals || needsToday : true,
    includeCheckIn: hasSpecifics ? needsCheckIn || needsToday : true,
    includeSignals: true,
  };
}

const testCases = [
  "What should I do today?",
  "What are my overdue tasks?",
  "How am I doing?",
  "What is my goal progress?",
  "How is my fitness goal coming along?",
  "Hi",
  "Hello, can you help me?",
  "What should I focus on?",
];

console.log("Running context resolution tests:\n");
testCases.forEach((tc) => {
  console.log(`Message: "${tc}"`);
  console.log(resolveContextNeeds(tc));
  console.log("------------------------");
});
