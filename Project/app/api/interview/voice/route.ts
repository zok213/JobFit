import { NextRequest, NextResponse } from "next/server";
import {
  textToSpeech,
  VoiceType,
  LemonfoxConfigError,
  LemonfoxApiError,
  isApiConfigured,
} from "@/app/lib/lemonfox";
import redisDb from "@/app/lib/redis";

export async function POST(request: NextRequest) {
  console.log("Đã nhận request tới /api/interview/voice");

  try {
    // Protect against attacks with Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log("Lỗi Content-Type không đúng:", contentType);
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type phải là application/json",
        },
        { status: 415 }
      );
    }

    // Kiểm tra trước nếu API key chưa được cấu hình
    if (!isApiConfigured()) {
      console.error("Lemonfox API key chưa được cấu hình");
      return NextResponse.json(
        {
          success: false,
          message:
            "Chức năng chuyển văn bản thành giọng nói chưa được cấu hình",
          error_code: "API_NOT_CONFIGURED",
        },
        { status: 501 }
      );
    } else {
      console.log("API key đã được cấu hình");
    }

    // Get information from request body
    const body = await request.json();
    const { text, session_id, voice_type } = body;
    console.log("Đã nhận request với text:", text?.substring(0, 50), "...");

    // Check for missing information
    if (!text) {
      console.error("Thiếu thông tin văn bản cần chuyển đổi");
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu thông tin văn bản cần chuyển đổi",
        },
        { status: 400 }
      );
    }

    // Limit text length to prevent DoS attacks
    if (text.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Văn bản quá dài, giới hạn là 2000 ký tự",
        },
        { status: 400 }
      );
    }

    // Kiểm tra phiên phỏng vấn trong Redis nếu cần
    if (session_id) {
      let retryCount = 0;
      const maxRetries = 2;
      let session = null;

      while (!session && retryCount <= maxRetries) {
        session = await redisDb.getSession(session_id);

        if (!session) {
          console.log(
            `Voice API: Session check attempt ${retryCount + 1}/${
              maxRetries + 1
            } - not found in Redis: ${session_id}`
          );

          if (retryCount < maxRetries) {
            // Chờ 500ms trước khi thử lại
            await new Promise((resolve) => setTimeout(resolve, 500));
            retryCount++;
          } else {
            console.error(
              `Voice API: Session not found in Redis after ${
                maxRetries + 1
              } attempts: ${session_id}`
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

      console.log(`Voice API: Session found in Redis: ${session_id}`);
    }

    console.log("Bắt đầu chuyển văn bản thành giọng nói.");

    // Sử dụng VoiceType từ library - mặc định là JESSICA cho giọng nữ tiếng Anh
    // Chọn giọng phù hợp với tính năng phỏng vấn
    const selectedVoice = voice_type || VoiceType.JESSICA;

    // Chuẩn bị văn bản để phù hợp với tiếng Anh
    // Thêm dấu chấm câu nếu không có để tạo ngắt nghỉ tự nhiên
    let processedText = text;
    if (
      !processedText.endsWith(".") &&
      !processedText.endsWith("?") &&
      !processedText.endsWith("!")
    ) {
      processedText += ".";
    }

    // Thử chuyển văn bản thành giọng nói
    try {
      // Gọi API Lemonfox để chuyển đổi text thành audio
      const audioData = await textToSpeech(processedText, selectedVoice);

      // Trả về audio data dưới dạng blob
      return new Response(audioData, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      console.error("Error converting text to speech:", error);

      // Xử lý các loại lỗi khác nhau
      if (error instanceof LemonfoxConfigError) {
        return NextResponse.json(
          {
            success: false,
            message: "Text-to-speech API chưa được cấu hình đúng",
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
            message: `Lỗi khi chuyển đổi văn bản thành giọng nói: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Unexpected error in voice API:", error);
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
