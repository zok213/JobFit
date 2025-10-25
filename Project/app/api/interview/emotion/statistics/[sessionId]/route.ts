// Next.js API Route for Emotion Statistics

import { NextRequest, NextResponse } from "next/server";

const EMOTION_API_URL = process.env.EMOTION_API_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    const response = await fetch(
      `${EMOTION_API_URL}/api/emotion/statistics/${sessionId}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch statistics",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching emotion statistics:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
