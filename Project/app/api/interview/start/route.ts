import { NextRequest, NextResponse } from "next/server";
import { getFirstQuestion } from "@/app/utils/deepseekApi";
import redisDb from "@/app/lib/redis";

// Số lần thử lại tạo phiên
const MAX_SESSION_CREATE_ATTEMPTS = 3;
// Thời gian chờ giữa các lần thử (ms)
const RETRY_DELAY = 1000;

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
    const { name, interview_topic, position } = body;

    // Limit field lengths to prevent DoS attacks
    if (name && name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must not exceed 100 characters",
        },
        { status: 400 }
      );
    }

    if (interview_topic && interview_topic.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview topic must not exceed 500 characters",
        },
        { status: 400 }
      );
    }

    console.log("Starting interview:", {
      name: name ? name.substring(0, 20) : undefined,
      topic_length: interview_topic ? interview_topic.length : 0,
      position,
    });

    // Check input information
    if (!name || !interview_topic) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing name or interview topic information",
        },
        { status: 400 }
      );
    }

    // Kiểm tra Redis có sẵn sàng không trước khi bắt đầu
    try {
      const redisReady = await redisDb.ping();
      if (!redisReady) {
        console.error("Redis không sẵn sàng trước khi bắt đầu phiên phỏng vấn");
        return NextResponse.json(
          {
            success: false,
            message:
              "Database service is currently unavailable. Please try again later.",
          },
          { status: 503 }
        );
      }
    } catch (pingError) {
      console.error("Lỗi khi kiểm tra kết nối Redis:", pingError);
    }

    // Create a more secure session_id using crypto
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const session_id =
      "session_" +
      Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .substring(0, 16);

    try {
      // Use Deepseek API to get the first question
      const response = await getFirstQuestion(name, interview_topic);

      // Check response
      if (!response || !response.question) {
        console.error("Invalid or empty response from Deepseek API");
        throw new Error("Invalid response from Deepseek API");
      }

      // Validate question format and length
      const question = response.question;
      if (typeof question !== "string" || question.trim().length === 0) {
        console.error("Empty or invalid question format received:", question);
        throw new Error("Invalid question format received from API");
      }

      // Only process question format, not content
      let processedQuestion = question.trim();

      // Handle case where question starts with "bruh" or inappropriate words
      if (processedQuestion.toLowerCase().trim().startsWith("bruh")) {
        console.warn(
          "Detected question starting with 'bruh', removing this word"
        );
        processedQuestion = processedQuestion
          .replace(/^bruh[,.\s]*/i, "")
          .trim();

        // Capitalize first letter
        if (processedQuestion.length > 0) {
          processedQuestion =
            processedQuestion.charAt(0).toUpperCase() +
            processedQuestion.slice(1);
        }
      }

      // Ensure the question is not overly long (to prevent DoS attacks or errors)
      if (processedQuestion.length > 2000) {
        console.warn("Question from API is too long, truncating...");
        processedQuestion = processedQuestion.substring(0, 1997) + "...";
      }

      // Update processed question in response
      response.question = processedQuestion;

      console.log(
        "Successfully received first question from Deepseek API:",
        response.question.substring(0, 100) + "..."
      );

      // Lưu phiên vào Redis với cơ chế thử lại
      let createdSession = null;
      let lastError = null;
      let attempts = 0;

      while (!createdSession && attempts < MAX_SESSION_CREATE_ATTEMPTS) {
        try {
          attempts++;
          console.log(
            `Thử tạo phiên Redis lần ${attempts}/${MAX_SESSION_CREATE_ATTEMPTS}`
          );

          createdSession = await redisDb.createSession(
            session_id,
            name,
            interview_topic,
            response.question,
            position // Pass position to createSession function
          );

          if (!createdSession) {
            throw new Error("Redis createSession returned null");
          }
        } catch (dbError) {
          lastError = dbError;
          console.error(
            `Lỗi khi tạo phiên Redis (lần thử ${attempts}/${MAX_SESSION_CREATE_ATTEMPTS}):`,
            dbError
          );

          if (attempts < MAX_SESSION_CREATE_ATTEMPTS) {
            console.log(`Chờ ${RETRY_DELAY}ms trước khi thử lại...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }

      if (!createdSession) {
        console.error(
          `Failed to create session in Redis after ${MAX_SESSION_CREATE_ATTEMPTS} attempts: ${session_id}`
        );
        throw new Error(
          `Failed to create interview session in Redis: ${
            lastError
              ? (lastError as Error).message || String(lastError)
              : "Unknown error"
          }`
        );
      }

      console.log(`Session created successfully in Redis: ${session_id}`);

      // Kiểm tra phiên đã được lưu
      const savedSession = await redisDb.getSession(session_id);
      if (!savedSession) {
        console.warn(
          "Session created but not immediately retrievable, this is unusual but proceeding anyway"
        );
      } else {
        console.log("Session verification successful");
      }

      // Save interview information to database
      const sessionInfo = {
        name,
        topic: interview_topic,
        position: position || "Unspecified",
      };

      // Create response to return to client
      const jsonResponse = NextResponse.json(
        {
          success: true,
          message: "Interview started successfully",
          session_id: session_id,
          question: response.question,
          is_completed: response.is_completed,
          session_info: sessionInfo,
        },
        { status: 200 }
      );

      // Add cookie to store session_id for 7 days
      jsonResponse.cookies.set({
        name: "interview_session_id",
        value: session_id,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });

      return jsonResponse;
    } catch (apiError: any) {
      console.error("Error calling API to get the first question:", apiError);

      // Report error when unable to get question from API
      return NextResponse.json(
        {
          success: false,
          message: "Could not get question from API. Please try again later.",
          error: apiError.message || "Unknown API error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error starting interview:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred when starting the interview: " +
          (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
