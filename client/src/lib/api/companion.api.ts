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
