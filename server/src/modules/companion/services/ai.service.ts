import { GoogleGenAI } from "@google/genai";

import type { AIRequest, AIResponse } from "../types/companion.types";

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
  ): Promise<AsyncGenerator<string>>;
}

export class GeminiProvider implements AIProvider {
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: request.messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: message.content,
          },
        ],
      })),
      config: {
        systemInstruction: request.systemInstruction,
      },
    });

    const content = response.text?.trim();

    if (!content) {
      throw new Error("AI provider returned an empty response");
    }

    return {
      content,
    };
  }

  async streamResponse(
    request: AIRequest,
    abortSignal?: AbortSignal,
  ): Promise<AsyncGenerator<string>> {
    const generator = await client.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: request.messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: message.content,
          },
        ],
      })),
      config: {
        systemInstruction: request.systemInstruction,
        // Pass abortSignal into the SDK. Note from the SDK docs:
        // AbortSignal is a client-only operation — it stops the local
        // fetch but does not cancel billing/usage on Google's side.
        abortSignal,
      },
    });

    // Wrap the generator to yield only text strings
    async function* textStream(): AsyncGenerator<string> {
      for await (const chunk of generator) {
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    }

    return textStream();
  }
}

export const aiProvider = new GeminiProvider();
