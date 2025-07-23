import { NextRequest, NextResponse } from "next/server";

// API route để tương tác với Python API proxy
export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const data = await req.json();
    console.log(
      "🚀 API route received request:",
      data.chatInput.substring(0, 100) + "..."
    );

    // Lấy URL Python API từ biến môi trường
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    console.log("🔌 Connecting to Python API at:", apiUrl);

    // Gọi đến Python API server
    const response = await fetch(`${apiUrl}/api/roadmap/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput: data.chatInput,
      }),
      // Thêm timeout để tránh chờ quá lâu
      signal: AbortSignal.timeout(60000), // 60 giây timeout
    });

    // Kiểm tra nếu response không thành công
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Python API error:", response.status, errorText);
      return NextResponse.json(
        { error: `API responded with status ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    // Trả về kết quả cho frontend
    const result = await response.json();
    console.log(
      "✅ Received response from Python API:",
      result.text
        ? `${result.text.substring(0, 100)}...`
        : "No text in response"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("💥 API route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
