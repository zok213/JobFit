import { NextRequest, NextResponse } from "next/server";

// Hàm chuyển đổi Markdown sang HTML
function convertMarkdownToHtml(markdown: string): string {
  // Thay thế các heading
  let html = markdown
    .replace(
      /^# (.*$)/gm,
      '<h1 class="text-2xl font-bold mb-4 text-blue-700">$1</h1>'
    )
    .replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold mb-3 text-blue-600">$1</h2>'
    )
    .replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-bold mb-2 text-blue-500">$1</h3>'
    )
    .replace(
      /^#### (.*$)/gm,
      '<h4 class="text-base font-bold mb-2 text-blue-500">$1</h4>'
    );

  // Thay thế danh sách
  html = html.replace(/^\s*[-*+]\s(.*)$/gm, '<li class="ml-4 mb-1">$1</li>');

  // Nhóm các thẻ li liên tiếp vào ul
  html = html.replace(/<\/li>\n<li/g, "</li><li");
  html = html.replace(
    /<li class="ml-4 mb-1">/g,
    '<ul class="list-disc mb-4 pl-5"><li class="ml-4 mb-1">'
  );
  html = html.replace(/<\/li>(?!\s*<li)/g, "</li></ul>");

  // Thay thế đoạn văn
  const paragraphs = html.split("\n\n");
  html = paragraphs
    .map((p) => {
      if (!p.trim()) return "";
      if (
        p.includes("<h1") ||
        p.includes("<h2") ||
        p.includes("<h3") ||
        p.includes("<h4") ||
        p.includes("<ul") ||
        p.includes("</ul>")
      ) {
        return p;
      }
      return `<p class="mb-4">${p}</p>`;
    })
    .join("");

  // Thay thế in đậm và in nghiêng
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

  // Thay thế backticks (inline code)
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="px-1 py-0.5 bg-gray-100 rounded text-sm">$1</code>'
  );

  // Tạo kiểu cho phần điểm phần trăm
  html = html.replace(
    /(\d{1,3})%/g,
    '<span class="font-bold text-green-600">$1%</span>'
  );

  // Thay thế các mục "Skills Match", "Experience Match", v.v. bằng các phần có màu sắc
  const sections = [
    { name: "Match Score", color: "bg-blue-100 border-blue-500" },
    { name: "Skills Match", color: "bg-green-100 border-green-500" },
    { name: "Experience Match", color: "bg-purple-100 border-purple-500" },
    { name: "Education Match", color: "bg-indigo-100 border-indigo-500" },
    { name: "Key Strengths", color: "bg-yellow-100 border-yellow-500" },
    { name: "Improvement Areas", color: "bg-red-100 border-red-500" },
    { name: "Recommendations", color: "bg-teal-100 border-teal-500" },
  ];

  for (const section of sections) {
    const regex = new RegExp(
      `<h2 class="text-xl font-bold mb-3 text-blue-600">${section.name}</h2>`,
      "g"
    );
    html = html.replace(
      regex,
      `<div class="p-4 rounded-lg ${section.color} border-l-4 mb-6">
        <h2 class="text-xl font-bold mb-3">${section.name}</h2>`
    );

    // Tìm heading tiếp theo để đóng div
    for (const nextSection of sections) {
      if (nextSection.name !== section.name) {
        const nextRegex = new RegExp(
          `<h2 class="text-xl font-bold mb-3 text-blue-600">${nextSection.name}</h2>`,
          "g"
        );
        html = html.replace(
          nextRegex,
          `</div><div class="p-4 rounded-lg ${nextSection.color} border-l-4 mb-6">
        <h2 class="text-xl font-bold mb-3">${nextSection.name}</h2>`
        );
      }
    }
  }

  // Đóng div cuối cùng
  html = html + "</div>";

  return `<div class="job-match-analysis">${html}</div>`;
}

// Hàm trích xuất điểm match từ nội dung phân tích
function extractMatchScore(content: string): number {
  try {
    // Tìm điểm match dựa trên định dạng chuẩn "X%" hoặc "X percent"
    const matchPercentRegex = /(\d{1,3})%/;
    const match = content.match(matchPercentRegex);

    if (match && match[1]) {
      const score = parseInt(match[1], 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        return score;
      }
    }

    // Nếu không tìm thấy, thử tìm trong cụm từ khác
    const matchTextRegex =
      /(?:match score|match percentage|overall match).*?(\d{1,3})%/i;
    const matchText = content.match(matchTextRegex);

    if (matchText && matchText[1]) {
      const score = parseInt(matchText[1], 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        return score;
      }
    }

    return 70; // Giá trị mặc định nếu không tìm thấy
  } catch (error) {
    console.error("Không thể trích xuất điểm match:", error);
    return 70;
  }
}

// Hàm trích xuất danh sách các điểm mạnh từ nội dung
function extractStrengths(content: string): string[] {
  try {
    const strengthsRegex = /strengths|key strengths/i;
    const sections = content.split(/#{1,3} /);

    for (const section of sections) {
      if (strengthsRegex.test(section)) {
        const lines = section
          .split("\n")
          .filter((line) => line.trim().startsWith("-"));
        if (lines.length > 0) {
          return lines.map((line) => line.replace(/^- /, "").trim());
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Không thể trích xuất điểm mạnh:", error);
    return [];
  }
}

// Hàm trích xuất danh sách các điểm yếu từ nội dung
function extractWeaknesses(content: string): string[] {
  try {
    const weaknessesRegex = /weaknesses|improvement areas/i;
    const sections = content.split(/#{1,3} /);

    for (const section of sections) {
      if (weaknessesRegex.test(section)) {
        const lines = section
          .split("\n")
          .filter((line) => line.trim().startsWith("-"));
        if (lines.length > 0) {
          return lines.map((line) => line.replace(/^- /, "").trim());
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Không thể trích xuất điểm yếu:", error);
    return [];
  }
}

// Hàm trích xuất danh sách các đề xuất từ nội dung
function extractRecommendations(content: string): string[] {
  try {
    const recommendationsRegex = /recommendations/i;
    const sections = content.split(/#{1,3} /);

    for (const section of sections) {
      if (recommendationsRegex.test(section)) {
        const lines = section
          .split("\n")
          .filter((line) => line.trim().startsWith("-"));
        if (lines.length > 0) {
          return lines.map((line) => line.replace(/^- /, "").trim());
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Không thể trích xuất đề xuất:", error);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const data = await req.json();

    if (!data.cvText || !data.jobDescription) {
      return NextResponse.json(
        { error: "Missing CV text or job description" },
        { status: 400 }
      );
    }

    console.log(
      "🚀 Job Match API received request",
      data.jobDescription.substring(0, 100) + "..."
    );

    // Gửi text từ CV và mô tả công việc đến Jina DeepSearch API
    console.log("🔌 Connecting to Jina AI DeepSearch API");

    const jinaApiKey =
      "jina_bafb743236fb458fb79db0dcaca4dd6cOcq6cZEzckw2sGbJgdvuy4fNvqHR";

    // Cấu trúc payload cho API
    const payload = {
      model: "jina-deepsearch-v1",
      messages: [
        {
          role: "user",
          content: `Analyze how well this candidate's CV matches the job description:
          
CV Text:
"""
${data.cvText}
"""

Job Description:
"""
${data.jobDescription}
"""

Please provide a comprehensive job match analysis with the following sections:
1. Match Score: Give an overall match percentage (0-100%) and brief explanation
2. Skills Match: List matching skills, missing skills, and exceeding skills
3. Experience Match: Analyze how the candidate's experience aligns with job requirements
4. Education Match: Evaluate educational requirements vs. candidate's qualifications
5. Key Strengths: Highlight the candidate's most relevant strengths for this role
6. Improvement Areas: Skills or experiences the candidate could develop to better match
7. Recommendations: Specific advice for the candidate to improve their fit for this role

Format the response in Markdown with clear headings and organized information.`,
        },
      ],
      stream: false,
      temperature: 0.5,
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

    // Phân tích nội dung để lấy điểm match và các thông tin khác
    const matchScore = extractMatchScore(content);
    const strengths = extractStrengths(content);
    const weaknesses = extractWeaknesses(content);
    const recommendations = extractRecommendations(content);

    // Chuyển đổi Markdown sang HTML
    const htmlContent = convertMarkdownToHtml(content);

    // Trả về kết quả phân tích
    return NextResponse.json({
      analysis: content, // Vẫn giữ bản gốc Markdown
      htmlAnalysis: htmlContent, // Thêm phiên bản HTML
      matchScore: matchScore,
      matchPercentage: matchScore,
      strengths: strengths,
      weaknesses: weaknesses,
      recommendations: recommendations,
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
}
