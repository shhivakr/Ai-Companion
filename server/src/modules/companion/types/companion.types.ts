export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequest {
  systemInstruction: string;
  messages: AIMessage[];
  tools?: any[];
}

export interface AIToolCall {
  name: string;
  args: any;
}

export interface AIResponse {
  content: string;
  toolCall?: AIToolCall;
}

export type AIStreamChunk = 
  | { type: "text"; text: string }
  | { type: "toolCall"; toolCall: AIToolCall };

export interface ProductivitySignals {
  pendingTaskCount: number;
  overdueTaskCount: number;
  completedTodayCount: number;
  highPriorityPendingCount: number;
  activeGoalCount: number;
}

export interface FormattedTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  goal?: string;
}

export interface FormattedGoal {
  id: string;
  title: string;
  progress: number;
  category?: string;
  nextAction?: string;
  targetDate?: string;
}

export interface FormattedCheckIn {
  feeling: string;
  energy: string;
  focus: string;
  note?: string;
  createdAt: string;
}

export type CompanionIntent =
  | "greeting"
  | "today_focus"
  | "task_status"
  | "task_completion"
  | "overdue_work"
  | "goal_progress"
  | "goal_status"
  | "check_in"
  | "planning"
  | "productivity"
  | "memory_save"
  | "memory_recall"
  | "general";

export type ContextDepth = "minimal" | "focused" | "deep";

export interface ResolvedIntent {
  intent: CompanionIntent;
  secondaryIntents: CompanionIntent[];
  confidence: "high" | "medium" | "low";
  depth: ContextDepth;
  contextNeeds: {
    tasks: boolean;
    goals: boolean;
    checkIn: boolean;
    signals: boolean;
  };
}

export interface ProductivityPattern {
  type:
    | "overdue_backlog"
    | "high_priority_pressure"
    | "low_momentum"
    | "strong_momentum"
    | "heavy_workload"
    | "goal_risk"
    | "goal_progress"
    | "stale_tasks";
  severity: "info" | "warning" | "critical";
  evidence: string[];
}

export interface ProductivityReasoning {
  workloadLevel: "light" | "moderate" | "heavy" | "overloaded";
  overdueRisk: "low" | "moderate" | "high";
  momentum: "low" | "steady" | "strong" | "unknown";
  priorityPressure: "low" | "moderate" | "high";
  goalAlignment: "aligned" | "partial" | "unclear";
  patterns: ProductivityPattern[];
}

export interface CompanionContext {
  intentInfo?: ResolvedIntent;
  signals: ProductivitySignals;
  productivityReasoning?: ProductivityReasoning;
  longTermMemories?: string[];
  todayTasks?: FormattedTask[];
  overdueTasks?: FormattedTask[];
  activeGoals?: FormattedGoal[];
  checkIn?: FormattedCheckIn;
}

/**
 * SSE stream events emitted by the companion streaming endpoint.
 */
export type StreamEvent =
  | { type: "conversation"; conversationId: string }
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; code: StreamErrorCode };

export type StreamErrorCode =
  | "generation_failed"
  | "persistence_failed"
  | "invalid_request";
