import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // Kiểm tra xem request có đúng là form data không
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Kiểm tra định dạng file
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "doc"].includes(fileType || "")) {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please upload PDF, DOCX, or DOC files.",
        },
        { status: 400 }
      );
    }

    console.log(`🔍 Processing ${file.name} (${file.size} bytes)`);

    // Lưu file tạm thời để xử lý
    const tempDir = path.join(os.tmpdir(), "jobfit-uploads");
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (err) {
      console.error("Error creating temp directory:", err);
    }

    const filePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    console.log(`💾 Saved file temporarily to ${filePath}`);

    // Trích xuất nội dung từ file
    let extractedText = "";

    try {
      // Sử dụng thư viện trích xuất văn bản từ PDF/DOCX
      // Trong môi trường thực, bạn sẽ sử dụng pdf-parse, mammoth, textract...
      // Ở đây sẽ giả định rằng đã có trích xuất thành công
      extractedText = await extractTextFromFile(filePath, fileType || "");

      // Xóa file tạm sau khi đã xử lý
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error extracting text from file:", error);
      return NextResponse.json(
        { error: "Failed to extract text from file" },
        { status: 500 }
      );
    }

    // Gửi văn bản đã trích xuất đến Jina DeepSearch API
    console.log("🔌 Connecting to Jina AI DeepSearch API");

    try {
      const jinaApiKey = process.env.JINA_API_KEY || "";

      // Cấu trúc payload cho API
      const payload = {
        model: "jina-deepsearch-v1",
        messages: [
          {
            role: "user",
            content: `Provide a deep and insightful analysis on this CV: "${extractedText}". 
            Ensure the response is well-structured with the following sections:
            1. Candidate Summary: A brief overview of the candidate's background and skills
            2. Key Skills: List and categorize their skills (technical, soft, domain knowledge)
            3. Experience Analysis: Highlight important roles and achievements
            4. Education: Analysis of educational background
            5. Strengths: What makes this candidate stand out
            6. Areas for Improvement: Constructive feedback on potential gaps
            7. Job Fit Assessment: Types of roles this candidate would be suitable for
            
            Format the result in Markdown with clear headings and bullet points.`,
          },
        ],
        stream: false,
        temperature: 0.7,
      };

      // Gọi đến Jina AI API
      const response = await fetch(
        "https://deepsearch.jina.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${jinaApiKey}`,
            "User-Agent": "Mozilla/5.0",
          },
          body: JSON.stringify(payload),
          // Thêm timeout để tránh chờ quá lâu
          signal: AbortSignal.timeout(120000), // 120 giây timeout
        }
      );

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Jina AI API error:", response.status, errorText);
        return NextResponse.json(
          {
            error: `Jina AI API responded with status ${response.status}: ${errorText}`,
          },
          { status: response.status }
        );
      }

      // Xử lý kết quả từ Jina AI API
      const jinaResult = await response.json();
      console.log("✅ Received response from Jina AI API");

      // Trích xuất nội dung
      let content = "";
      if (jinaResult.choices && jinaResult.choices.length > 0) {
        const choice = jinaResult.choices[0];
        if (choice.message && choice.message.content) {
          content = choice.message.content;
        } else if (choice.text) {
          content = choice.text;
        }
      }

      if (!content) {
        console.error("❌ No content found in Jina AI response");
        return NextResponse.json(
          { error: "No content found in Jina AI response" },
          { status: 500 }
        );
      }

      // Trả về phân tích CV
      return NextResponse.json({
        text: content,
        summary: extractSummary(content),
        fileInfo: {
          name: file.name,
          size: file.size,
          type: fileType,
        },
        timestamp: new Date().toISOString(),
      });
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

// Hàm trích xuất văn bản từ file (giả lập cho demo)
async function extractTextFromFile(
  filePath: string,
  fileType: string
): Promise<string> {
  // Trong môi trường thực, bạn sẽ sử dụng thư viện trích xuất văn bản thích hợp
  // Ví dụ: pdf-parse cho PDF, mammoth cho DOCX

  // Ở đây chỉ đọc nội dung của file như text để demo
  try {
    // Đối với triển khai thực tế:
    // if (fileType === 'pdf') {
    //   const pdfParse = require('pdf-parse');
    //   const dataBuffer = await fs.readFile(filePath);
    //   const data = await pdfParse(dataBuffer);
    //   return data.text;
    // } else if (fileType === 'docx') {
    //   const mammoth = require('mammoth');
    //   const result = await mammoth.extractRawText({ path: filePath });
    //   return result.value;
    // }

    // Demo: Trả về một phần nội dung file
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent.substring(0, 10000); // Lấy một phần nội dung để demo
  } catch (error) {
    console.error(`Error extracting text from ${fileType} file:`, error);
    return "Demo CV content for testing purposes. This would normally contain the extracted text from the CV file.";
  }
}

// Hàm trích xuất tóm tắt từ phân tích
function extractSummary(content: string): string {
  // Tìm và trích xuất phần tóm tắt từ content (đoạn đầu tiên hoặc phần "Summary")
  const summaryMatch = content.match(
    /(?:summary|overview):([^]*?)(?:\n\n|\n#)/i
  );
  if (summaryMatch && summaryMatch[1]) {
    return summaryMatch[1].trim();
  }

  // Nếu không tìm thấy, lấy đoạn văn bản đầu tiên
  const firstParagraph = content.split("\n\n")[0];
  return firstParagraph.replace(/^#.*\n/, "").trim();
}
