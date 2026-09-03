export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequest {
  systemInstruction: string;
  messages: AIMessage[];
}

export interface AIResponse {
  content: string;
}

export interface CompanionContext {
  goals: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    category?: string;
    nextAction?: string;
    targetDate?: string;
  }>;

  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
    goal?: string;
  }>;
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
