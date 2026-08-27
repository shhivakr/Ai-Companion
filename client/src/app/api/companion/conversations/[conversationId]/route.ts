import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not configured");
}

interface RouteContext {
  params: Promise<{
    conversationId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { conversationId } = await context.params;

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const response = await fetch(
      `${BACKEND_API_URL}/companion/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Conversation history proxy error:", error);

    return NextResponse.json(
      {
        message: "Unable to load conversation.",
      },
      {
        status: 502,
      },
    );
  }
}
