// Next.js API Route for Emotion Report Generation

import { NextRequest, NextResponse } from "next/server";

const EMOTION_API_URL = process.env.EMOTION_API_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    const response = await fetch(
      `${EMOTION_API_URL}/api/emotion/report/${sessionId}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to generate report",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating emotion report:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
