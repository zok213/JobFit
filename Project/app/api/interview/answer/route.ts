import { NextRequest, NextResponse } from "next/server";
import { getNextQuestion } from "@/app/utils/deepseekApi";
import redisDb from "@/app/lib/redis";

export async function POST(request: NextRequest) {
  try {
    // Protect against attacks with Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type must be application/json",
        },
        { status: 415 }
      );
    }

    // Get information from request body
    const body = await request.json();
    const { session_id, answer } = body;

    // Log for debugging - ensure not to log sensitive information
    console.log("Request body:", {
      session_id: session_id ? `${session_id.substring(0, 8)}...` : undefined,
      answer_length: answer ? answer.length : 0,
    });

    // Check for missing information
    if (!session_id || !answer) {
      console.error("Missing session_id or answer information");
      return NextResponse.json(
        {
          success: false,
          message: "Missing session_id or answer information",
        },
        { status: 400 }
      );
    }

    // Limit answer length to prevent DoS attacks
    if (answer.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer is too long, limit is 5000 characters",
        },
        { status: 400 }
      );
    }

    // Thử lấy phiên phỏng vấn với retry từ Redis
    let session = null;
    let retryCount = 0;
    const maxRetries = 2;

    while (!session && retryCount <= maxRetries) {
      // Check if interview session exists in Redis
      session = await redisDb.getSession(session_id);

      if (!session) {
        console.log(
          `Attempt ${retryCount + 1}/${
            maxRetries + 1
          }: Session not found in Redis: ${session_id}`
        );

        if (retryCount < maxRetries) {
          // Chờ 500ms trước khi thử lại
          await new Promise((resolve) => setTimeout(resolve, 500));
          retryCount++;
        } else {
          console.error(
            `Interview session not found in Redis with ID: ${session_id} after ${
              maxRetries + 1
            } attempts`
          );

          // Return error with suggestion instead of 404
          return NextResponse.json(
            {
              success: false,
              message:
                "Interview session has expired or does not exist. Please start a new session.",
              error_code: "SESSION_EXPIRED",
            },
            { status: 410 } // Use 410 Gone instead of 404 Not Found
          );
        }
      }
    }

    // Ở đây chúng ta đã có session hoặc đã vượt qua số lần thử lại tối đa
    if (!session) {
      // Đây là trường hợp dự phòng, thực tế không nên xảy ra vì đã kiểm tra ở trên
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not retrieve interview session from Redis. Please try again.",
          error_code: "SESSION_ERROR",
        },
        { status: 500 }
      );
    }

    // Check if interview session is already completed
    if (session.isCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "This interview session is already completed",
        },
        { status: 400 }
      );
    }

    console.log("Found interview session in Redis:", {
      sessionId: session.sessionId,
      topic: session.topic,
      questionsCount: session.questions.length,
      answersCount: session.answers.length,
    });

    // Check if session should be completed
    const lowerAnswer = answer.toLowerCase();
    const isCompleted =
      lowerAnswer.includes("stop") || lowerAnswer.includes("end");

    // Get next question from DeepSeek API
    let nextQuestion = "";
    let nextQuestionResponse;
    let apiErrorOccurred = false;

    try {
      // Pass all 4 parameters to getNextQuestion
      nextQuestionResponse = await getNextQuestion(
        session_id,
        session.topic,
        session.questions,
        [...session.answers, answer] // Add current answer to array
      );

      // Use question directly from Deepseek API without replacement
      if (
        nextQuestionResponse &&
        typeof nextQuestionResponse.question === "string"
      ) {
        nextQuestion = nextQuestionResponse.question;

        // Only process format, not content
        // If question starts with "bruh", only remove this word
        if (nextQuestion.toLowerCase().trim().startsWith("bruh")) {
          console.warn(
            "Detected question starting with 'bruh', removing this word"
          );
          nextQuestion = nextQuestion.replace(/^bruh[,.\s]*/i, "").trim();

          // Capitalize first letter
          if (nextQuestion.length > 0) {
            nextQuestion =
              nextQuestion.charAt(0).toUpperCase() + nextQuestion.slice(1);
          }
        }

        // Limit question length to avoid display issues
        if (nextQuestion.length > 2000) {
          console.warn("Question from API is too long, truncating...");
          nextQuestion = nextQuestion.substring(0, 1997) + "...";
        }

        console.log(
          "Next question from Deepseek API:",
          nextQuestion.substring(0, 100) + "..."
        );
      } else {
        console.error("Invalid response from API:", nextQuestionResponse);
        apiErrorOccurred = true;
      }
    } catch (error) {
      console.error("Error calling Deepseek API:", error);
      apiErrorOccurred = true;
    }

    // If there's an error from API and no question received, create fallback question
    if (apiErrorOccurred || !nextQuestion) {
      console.warn("Using fallback question due to API error");
      nextQuestion = "Can you share more about your experience?";
    }

    // Determine completion status
    const finalIsCompleted =
      isCompleted ||
      (nextQuestionResponse && nextQuestionResponse.is_completed);

    // Thử cập nhật phiên với retry trong Redis
    let updatedSession = null;
    retryCount = 0;

    while (!updatedSession && retryCount <= maxRetries) {
      // Save answer and new question to database
      updatedSession = await redisDb.updateSession(
        session_id,
        answer,
        nextQuestion,
        finalIsCompleted
      );

      if (!updatedSession) {
        console.log(
          `Attempt ${retryCount + 1}/${
            maxRetries + 1
          }: Failed to update session in Redis: ${session_id}`
        );

        if (retryCount < maxRetries) {
          // Chờ 500ms trước khi thử lại
          await new Promise((resolve) => setTimeout(resolve, 500));
          retryCount++;
        } else {
          // Nếu vẫn thất bại sau tất cả các lần thử lại, ghi log và tiếp tục
          console.warn(
            `Could not update interview session in Redis: ${session_id} after ${
              maxRetries + 1
            } attempts, but still continuing`
          );
          break;
        }
      }
    }

    // Create response with Set-Cookie to store session_id
    const response = NextResponse.json({
      success: true,
      session_id,
      question: nextQuestion,
      is_completed: finalIsCompleted,
    });

    // Add session_id cookie with 7-day max-age
    response.cookies.set({
      name: "interview_session_id",
      value: session_id,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.error("Error processing answer with Redis:", error);
    return NextResponse.json(
      {
        success: false,
        message: `An error occurred while processing the answer: ${
          error.message || String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
