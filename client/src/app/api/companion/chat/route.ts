import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not configured");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const response = await fetch(`${BACKEND_API_URL}/companion/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Companion chat proxy error:", error);

    return NextResponse.json(
      {
        message: "Unable to connect to companion service.",
      },
      {
        status: 502,
      },
    );
  }
}
