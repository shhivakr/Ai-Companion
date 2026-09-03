import { GoogleGenAI } from "@google/genai";

import type { AIRequest, AIResponse, AIStreamChunk, StreamErrorCode } from "../types/companion.types";

/**
 * Classifies a Gemini SDK error into a typed StreamErrorCode.
 * The @google/genai SDK throws `ApiError` with a numeric `.status` property.
 */
export function classifyGeminiError(err: unknown): StreamErrorCode {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: number }).status;
    if (status === 429) return "rate_limited";
    if (status === 503) return "service_unavailable";
  }
  return "generation_failed";
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const client = new GoogleGenAI({
  apiKey,
});

export interface AIProvider {
  generateResponse(request: AIRequest): Promise<AIResponse>;
  streamResponse(
    request: AIRequest,
    abortSignal?: AbortSignal,
  ): Promise<AsyncGenerator<AIStreamChunk>>;
}

export class GeminiProvider implements AIProvider {
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const config: any = {
      systemInstruction: request.systemInstruction,
    };
    if (request.tools) {
      config.tools = request.tools;
    }

    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: request.messages.map((message) => {
        if ((message as any).role === "function") {
          return {
            role: "user",
            parts: [{ functionResponse: { name: (message as any).name, response: (message as any).content } }]
          };
        }
        if ((message as any).role === "tool_call") {
          return {
            role: "model",
            parts: [{ functionCall: { name: (message as any).name, args: (message as any).args } }]
          };
        }
        return {
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        };
      }),
      config,
    });

    const content = response.text?.trim() || "";

    let toolCall;
    if (response.functionCalls && response.functionCalls.length > 0) {
      const fc = response.functionCalls[0];
      if (fc.name && fc.args) {
        toolCall = {
          name: fc.name,
          args: fc.args
        };
      }
    }

    if (!content && !toolCall) {
      throw new Error("AI provider returned an empty response without tool calls");
    }

    return {
      content,
      toolCall
    };
  }

  async streamResponse(
    request: AIRequest,
    abortSignal?: AbortSignal,
  ): Promise<AsyncGenerator<AIStreamChunk>> {
    const config: any = {
      systemInstruction: request.systemInstruction,
      abortSignal,
    };
    if (request.tools) {
      config.tools = request.tools;
    }

    const generator = await client.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: request.messages.map((message) => {
        if ((message as any).role === "function") {
          return {
            role: "user",
            parts: [{ functionResponse: { name: (message as any).name, response: (message as any).content } }]
          };
        }
        if ((message as any).role === "tool_call") {
          return {
            role: "model",
            parts: [{ functionCall: { name: (message as any).name, args: (message as any).args } }]
          };
        }
        return {
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        };
      }),
      config,
    });

    async function* mappedStream(): AsyncGenerator<AIStreamChunk> {
      for await (const chunk of generator) {
        if (chunk.functionCalls && chunk.functionCalls.length > 0) {
          const fc = chunk.functionCalls[0];
          if (fc.name && fc.args) {
            yield { type: "toolCall", toolCall: { name: fc.name, args: fc.args } };
            return;
          }
        }
        
        const text = chunk.text;
        if (text) {
          yield { type: "text", text };
        }
      }
    }

    return mappedStream();
  }
}

export const aiProvider = new GeminiProvider();
