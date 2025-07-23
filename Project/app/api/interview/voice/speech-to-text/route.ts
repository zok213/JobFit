import { NextRequest, NextResponse } from "next/server";
import {
  speechToText,
  LemonfoxConfigError,
  LemonfoxApiError,
  isApiConfigured,
} from "@/app/lib/lemonfox";
import redisDb from "@/app/lib/redis";

export async function POST(request: NextRequest) {
  console.log("Đã nhận request tới /api/interview/voice/speech-to-text");

  try {
    // Kiểm tra nếu API key chưa được cấu hình
    if (!isApiConfigured()) {
      console.error("Lemonfox API key chưa được cấu hình");
      return NextResponse.json(
        {
          success: false,
          message:
            "Chức năng chuyển giọng nói thành văn bản chưa được cấu hình",
          error_code: "API_NOT_CONFIGURED",
        },
        { status: 501 }
      );
    } else {
      console.log("API key đã được cấu hình");
    }

    // Kiểm tra Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      console.log("Lỗi Content-Type không đúng:", contentType);
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type phải là multipart/form-data",
        },
        { status: 415 }
      );
    }

    // Lấy form data từ request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const sessionId = formData.get("session_id") as string;

    if (!audioFile) {
      console.error("Thiếu file âm thanh cần chuyển đổi");
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu file âm thanh cần chuyển đổi",
        },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "File âm thanh quá lớn, giới hạn là 10MB",
        },
        { status: 400 }
      );
    }

    // Kiểm tra phiên phỏng vấn trong Redis nếu cần
    if (sessionId) {
      let retryCount = 0;
      const maxRetries = 2;
      let session = null;

      while (!session && retryCount <= maxRetries) {
        session = await redisDb.getSession(sessionId);

        if (!session) {
          console.log(
            `Speech-to-Text API: Session check attempt ${retryCount + 1}/${
              maxRetries + 1
            } - not found in Redis: ${sessionId}`
          );

          if (retryCount < maxRetries) {
            // Chờ 500ms trước khi thử lại
            await new Promise((resolve) => setTimeout(resolve, 500));
            retryCount++;
          } else {
            console.error(
              `Speech-to-Text API: Session not found in Redis after ${
                maxRetries + 1
              } attempts: ${sessionId}`
            );
            return NextResponse.json(
              {
                success: false,
                message: "Phiên phỏng vấn không tồn tại hoặc đã kết thúc",
                error_code: "SESSION_NOT_FOUND",
              },
              { status: 404 }
            );
          }
        }
      }

      console.log(`Speech-to-Text API: Session found in Redis: ${sessionId}`);
    }

    console.log("Bắt đầu chuyển giọng nói thành văn bản.");

    // Chuyển File thành Blob để xử lý
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([arrayBuffer], { type: audioFile.type });

    // Thử chuyển giọng nói thành văn bản
    try {
      // Gọi API Lemonfox để chuyển đổi audio thành text
      const text = await speechToText(audioBlob);

      // Trả về kết quả
      return NextResponse.json({
        success: true,
        text: text,
      });
    } catch (error) {
      console.error("Error converting speech to text:", error);

      // Xử lý các loại lỗi khác nhau
      if (error instanceof LemonfoxConfigError) {
        return NextResponse.json(
          {
            success: false,
            message: "Speech-to-text API chưa được cấu hình đúng",
            error_code: "API_NOT_CONFIGURED",
          },
          { status: 501 }
        );
      } else if (error instanceof LemonfoxApiError) {
        return NextResponse.json(
          {
            success: false,
            message: `Lỗi API: ${error.message}`,
            error_code: "API_ERROR",
          },
          { status: 502 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: `Lỗi khi chuyển đổi giọng nói thành văn bản: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Unexpected error in speech-to-text API:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi không mong đợi: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
