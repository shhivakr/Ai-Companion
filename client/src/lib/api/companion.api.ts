import { getAccessToken } from "./client";

export type CompanionMessageRole = "user" | "assistant";

export interface CompanionMessage {
  id: string;
  role: CompanionMessageRole;
  content: string;
  createdAt: string;
}

export interface ChatCompanionPayload {
  message: string;
  conversationId?: string;
}

export interface ChatCompanionResponse {
  message: string;
  data: {
    conversationId: string;
    message: string;
  };
}

export interface ConversationResponse {
  conversation: {
    conversationId: string;
    title: string;
    messages: CompanionMessage[];
  };
}

export interface ConversationSummary {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  conversations: ConversationSummary[];
}

// ─── SSE stream event types ───────────────────────────────────────────────────

export type StreamEvent =
  | { type: "conversation"; conversationId: string }
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; code: string }
  | { type: "tool_confirmation_required"; actionId: string; toolName: string; summary: string }
  | { type: "tool_ambiguity"; message: string; candidates: any[] }
  | { type: "tool_executing"; toolName: string }
  | { type: "tool_result"; toolName: string; success: boolean };

export interface StreamCallbacks {
  onConversationId: (conversationId: string) => void;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (code: string) => void;
  onToolConfirmationRequired: (actionId: string, toolName: string, summary: string) => void;
  onToolAmbiguity: (message: string, candidates: any[]) => void;
  onToolExecuting: (toolName: string) => void;
  onToolResult: (toolName: string, success: boolean) => void;
}

// ─── Shared fetch helper (for non-streaming endpoints) ───────────────────────

async function companionRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = getAccessToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`/api/companion${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong");
  }

  return data as T;
}

export async function chatWithCompanion(payload: ChatCompanionPayload) {
  return companionRequest<ChatCompanionResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getConversation(conversationId: string) {
  return companionRequest<ConversationResponse>(
    `/conversations/${conversationId}`,
    {
      method: "GET",
    },
  );
}

export async function getConversations() {
  return companionRequest<ConversationsResponse>("/conversations", {
    method: "GET",
  });
}

// ─── Streaming fetch ──────────────────────────────────────────────────────────

/**
 * Opens an SSE stream to /api/companion/chat/stream.
 *
 * Reads the response body incrementally, parses newline-delimited JSON events,
 * and dispatches them to the provided callbacks.
 *
 * @param payload         - message + optional conversationId
 * @param clientMessageId - Idempotency key — same across retries of the same message
 * @param callbacks       - Event handlers
 * @param signal          - AbortSignal from AbortController (for Stop button)
 */
export async function streamCompanionChat(
  payload: ChatCompanionPayload,
  clientMessageId: string,
  callbacks: StreamCallbacks,
  signal: AbortSignal,
): Promise<void> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response: Response;

  try {
    response = await fetch("/api/companion/chat/stream", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ ...payload, clientMessageId }),
      signal,
      cache: "no-store",
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      // User-initiated stop — not an error
      return;
    }
    callbacks.onError("network_error");
    return;
  }

  if (!response.ok) {
    callbacks.onError("generation_failed");
    return;
  }

  if (!response.body) {
    callbacks.onError("generation_failed");
    return;
  }

  // ─── Read the SSE stream ──────────────────────────────────────────────────
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newlines.
      // Split on \n\n and process complete events.
      const parts = buffer.split("\n\n");

      // The last part may be an incomplete event — keep it in the buffer.
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice("data: ".length);

        let event: StreamEvent;
        try {
          event = JSON.parse(jsonStr) as StreamEvent;
        } catch {
          // Malformed event — skip
          continue;
        }

        switch (event.type) {
          case "conversation":
            callbacks.onConversationId(event.conversationId);
            break;
          case "chunk":
            callbacks.onChunk(event.text);
            break;
          case "done":
            callbacks.onDone();
            break;
          case "error":
            callbacks.onError(event.code);
            break;
          case "tool_confirmation_required":
            callbacks.onToolConfirmationRequired(event.actionId, event.toolName, event.summary);
            break;
          case "tool_ambiguity":
            callbacks.onToolAmbiguity(event.message, event.candidates);
            break;
          case "tool_executing":
            callbacks.onToolExecuting(event.toolName);
            break;
          case "tool_result":
            callbacks.onToolResult(event.toolName, event.success);
            break;
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      // User-initiated stop — not an error
      return;
    }
    callbacks.onError("network_error");
  } finally {
    reader.releaseLock();
  }
}
export async function confirmCompanionToolAction(
  actionId: string,
  callbacks: StreamCallbacks,
  signal: AbortSignal,
): Promise<void> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response: Response;

  try {
    response = await fetch(`/api/companion/tool-actions/${actionId}/confirm`, {
      method: "POST",
      headers,
      credentials: "include",
      signal,
      cache: "no-store",
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    callbacks.onError("network_error");
    return;
  }

  if (!response.ok) {
    callbacks.onError("generation_failed");
    return;
  }

  if (!response.body) {
    callbacks.onError("generation_failed");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice("data: ".length);
        let event: StreamEvent;
        try {
          event = JSON.parse(jsonStr) as StreamEvent;
        } catch {
          continue;
        }

        switch (event.type) {
          case "conversation":
            callbacks.onConversationId(event.conversationId);
            break;
          case "chunk":
            callbacks.onChunk(event.text);
            break;
          case "done":
            callbacks.onDone();
            break;
          case "error":
            callbacks.onError(event.code);
            break;
          case "tool_confirmation_required":
            callbacks.onToolConfirmationRequired(event.actionId, event.toolName, event.summary);
            break;
          case "tool_ambiguity":
            callbacks.onToolAmbiguity(event.message, event.candidates);
            break;
          case "tool_executing":
            callbacks.onToolExecuting(event.toolName);
            break;
          case "tool_result":
            callbacks.onToolResult(event.toolName, event.success);
            break;
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    callbacks.onError("network_error");
  } finally {
    reader.releaseLock();
  }
}
