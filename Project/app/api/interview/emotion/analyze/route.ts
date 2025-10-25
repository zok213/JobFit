// Next.js API Route for Emotion Detection
// Proxies requests to Python Flask service

import { NextRequest, NextResponse } from "next/server";

const EMOTION_API_URL = process.env.EMOTION_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to Python emotion detection service
    const response = await fetch(`${EMOTION_API_URL}/api/emotion/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Emotion analysis failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in emotion analysis:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
