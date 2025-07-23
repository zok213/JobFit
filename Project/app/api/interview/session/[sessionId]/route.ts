import { NextRequest, NextResponse } from "next/server";
import redisDb from "@/app/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Get session_id from URL params
    const { sessionId } = params;

    // Check validity of sessionId to prevent attacks
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Session ID",
        },
        { status: 400 }
      );
    }

    // Limit sessionId length
    if (sessionId.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Session ID (too long)",
        },
        { status: 400 }
      );
    }

    console.log(`Checking session status in Redis: ${sessionId}`);

    // Get session information from Redis
    const session = await redisDb.getSession(sessionId);

    if (!session) {
      console.warn(
        `Interview session not found in Redis with ID: ${sessionId}`
      );
      return NextResponse.json(
        {
          success: false,
          message: "Interview session does not exist or has expired",
          error_code: "SESSION_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Return basic session information
    return NextResponse.json({
      success: true,
      session_id: sessionId,
      is_active: true,
      is_completed: session.isCompleted,
      position: session.position || "Unknown position",
      created_at: session.createdAt,
      question_count: session.questions.length,
    });
  } catch (error: any) {
    console.error("Error checking interview session in Redis:", error);
    return NextResponse.json(
      {
        success: false,
        message: `An error occurred while checking the interview session: ${
          error.message || String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
