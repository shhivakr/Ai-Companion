import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not configured");
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/companion/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
      // Required: disable Next.js fetch caching so the stream is live
      cache: "no-store",
      // Do NOT set a duplex option — Next.js handles this correctly for
      // outbound POST requests without it.
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to companion service." },
      { status: 502 },
    );
  }

  // If the backend returned a non-streaming error before SSE started,
  // forward it as JSON.
  if (!backendResponse.ok && backendResponse.status !== 200) {
    const errorData = await backendResponse.json().catch(() => ({
      message: "Companion service error",
    }));
    return NextResponse.json(errorData, { status: backendResponse.status });
  }

  // Stream the SSE body directly — do NOT buffer it with response.json().
  // This is the critical path: response.body is a ReadableStream that we
  // pipe straight through to the browser.
  return new Response(backendResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Disable Vercel/proxy buffering
      "X-Accel-Buffering": "no",
    },
  });
}
