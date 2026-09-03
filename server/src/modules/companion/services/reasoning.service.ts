import type {
  ProductivitySignals,
  ProductivityReasoning,
  ProductivityPattern,
  CompanionContext
} from "../types/companion.types.js";

export function deriveProductivityReasoning(
  signals: ProductivitySignals,
  context?: CompanionContext
): ProductivityReasoning {
  const {
    pendingTaskCount,
    overdueTaskCount,
    completedTodayCount,
    highPriorityPendingCount,
    activeGoalCount
  } = signals;

  // 1. Workload Level
  let workloadLevel: ProductivityReasoning["workloadLevel"] = "light";
  if (pendingTaskCount >= 10 || (overdueTaskCount >= 4 && pendingTaskCount >= 5)) {
    workloadLevel = "overloaded";
  } else if (pendingTaskCount >= 5 || overdueTaskCount >= 3 || highPriorityPendingCount >= 3) {
    workloadLevel = "heavy";
  } else if (pendingTaskCount >= 2 || overdueTaskCount > 0 || highPriorityPendingCount > 0) {
    workloadLevel = "moderate";
  }

  // 2. Overdue Risk
  let overdueRisk: ProductivityReasoning["overdueRisk"] = "low";
  if (overdueTaskCount >= 3 || (overdueTaskCount >= 2 && highPriorityPendingCount >= 2)) {
    overdueRisk = "high";
  } else if (overdueTaskCount > 0) {
    overdueRisk = "moderate";
  }

  // 3. Priority Pressure
  let priorityPressure: ProductivityReasoning["priorityPressure"] = "low";
  if (highPriorityPendingCount >= 3 || (highPriorityPendingCount >= 2 && overdueTaskCount >= 2)) {
    priorityPressure = "high";
  } else if (highPriorityPendingCount > 0) {
    priorityPressure = "moderate";
  }

  // 4. Momentum
  let momentum: ProductivityReasoning["momentum"] = "unknown";
  if (completedTodayCount >= 3) {
    momentum = "strong";
  } else if (completedTodayCount > 0) {
    momentum = "steady";
  } else {
    // 0 completed tasks. We don't know if it's 8 AM or 9 PM, so default to unknown.
    // We avoid making a psychological claim about low momentum without time context.
    momentum = "unknown";
  }

  // 5. Goal Alignment
  let goalAlignment: ProductivityReasoning["goalAlignment"] = "unclear";
  if (activeGoalCount === 0) {
    goalAlignment = "unclear";
  } else if (context && context.todayTasks && context.todayTasks.length > 0) {
    let tasksWithGoals = 0;
    let tasksWithoutGoals = 0;

    for (const task of context.todayTasks) {
      if (task.goal) {
        tasksWithGoals++;
      } else {
        tasksWithoutGoals++;
      }
    }

    if (tasksWithGoals > 0 && tasksWithoutGoals === 0) {
      goalAlignment = "aligned";
    } else if (tasksWithGoals > 0) {
      goalAlignment = "partial";
    } else {
      goalAlignment = "unclear";
    }
  }

  // 6. Pattern Detection
  const patterns: ProductivityPattern[] = [];

  if (overdueTaskCount > 0) {
    let severity: "info" | "warning" | "critical" = "info";
    if (overdueRisk === "high") severity = "critical";
    else if (overdueRisk === "moderate") severity = "warning";

    patterns.push({
      type: "overdue_backlog",
      severity,
      evidence: [`${overdueTaskCount} overdue task(s)`]
    });
  }

  if (highPriorityPendingCount > 0) {
    let severity: "info" | "warning" | "critical" = "info";
    if (priorityPressure === "high") severity = "critical";
    else if (priorityPressure === "moderate") severity = "warning";

    patterns.push({
      type: "high_priority_pressure",
      severity,
      evidence: [`${highPriorityPendingCount} high-priority pending task(s)`]
    });
  }

  if (momentum === "strong") {
    patterns.push({
      type: "strong_momentum",
      severity: "info",
      evidence: [`${completedTodayCount} tasks completed today`]
    });
  }

  if (workloadLevel === "heavy" || workloadLevel === "overloaded") {
    patterns.push({
      type: "heavy_workload",
      severity: workloadLevel === "overloaded" ? "critical" : "warning",
      evidence: [`${pendingTaskCount} pending tasks total`]
    });
  }

  return {
    workloadLevel,
    overdueRisk,
    momentum,
    priorityPressure,
    goalAlignment,
    patterns
  };
}
