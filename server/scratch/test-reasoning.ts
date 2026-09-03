import { deriveProductivityReasoning } from "../src/modules/companion/services/reasoning.service.js";
import type { ProductivitySignals, CompanionContext } from "../src/modules/companion/types/companion.types.js";

function runTest(name: string, signals: ProductivitySignals, context?: CompanionContext) {
  console.log(`\n--- TEST: ${name} ---`);
  const result = deriveProductivityReasoning(signals, context);
  console.log(JSON.stringify(result, null, 2));
}

// CASE 1: Light Workload
runTest("CASE 1 - LIGHT WORKLOAD", {
  pendingTaskCount: 2,
  overdueTaskCount: 0,
  highPriorityPendingCount: 0,
  completedTodayCount: 1,
  activeGoalCount: 1
});

// CASE 2: Overdue Pressure
runTest("CASE 2 - OVERDUE PRESSURE", {
  pendingTaskCount: 6,
  overdueTaskCount: 3,
  highPriorityPendingCount: 2,
  completedTodayCount: 1,
  activeGoalCount: 1
});

// CASE 3: Strong Momentum
runTest("CASE 3 - STRONG MOMENTUM", {
  pendingTaskCount: 5,
  overdueTaskCount: 0,
  highPriorityPendingCount: 1,
  completedTodayCount: 4,
  activeGoalCount: 1
});

// CASE 4: No Historical Data
runTest("CASE 4 - NO HISTORICAL DATA", {
  pendingTaskCount: 5,
  overdueTaskCount: 1,
  highPriorityPendingCount: 1,
  completedTodayCount: 0,
  activeGoalCount: 1
});

// CASE 5: No Goal Relationship
runTest("CASE 5 - NO GOAL RELATIONSHIP", {
  pendingTaskCount: 3,
  overdueTaskCount: 0,
  highPriorityPendingCount: 0,
  completedTodayCount: 0,
  activeGoalCount: 1
}, {
  signals: {} as any, // Mock
  todayTasks: [
    { id: "1", title: "Task 1", status: "pending", priority: "normal" }
  ]
});

// CASE 5.1: Aligned Goals
runTest("CASE 5.1 - ALIGNED GOALS", {
  pendingTaskCount: 3,
  overdueTaskCount: 0,
  highPriorityPendingCount: 0,
  completedTodayCount: 0,
  activeGoalCount: 1
}, {
  signals: {} as any,
  todayTasks: [
    { id: "1", title: "Task 1", status: "pending", priority: "normal", goal: "Goal A" }
  ]
});
