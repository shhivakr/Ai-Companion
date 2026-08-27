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
}

export const aiProvider = new GeminiProvider();
