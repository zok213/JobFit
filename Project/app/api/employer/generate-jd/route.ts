import { NextRequest, NextResponse } from "next/server";
import { callDeepseekAPI } from "@/app/utils/deepseekApi";

interface JobData {
  title: string;
  companyName: string;
  industry: string;
  location: string;
  remoteOption: string;
  experienceLevel: string;
  employmentType: string;
  keyResponsibilities: string;
  requiredSkills: string;
  preferredSkills: string;
  education: string;
  additionalNotes: string;
  tone: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const jobData: JobData = await req.json();

    // Validate required fields
    if (!jobData.title || !jobData.companyName || !jobData.industry) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Construct prompt for DeepSeek API
    const prompt = generateJDPrompt(jobData);

    // Call DeepSeek API
    const jobDescription = await callDeepseekAPI(prompt);

    // Return the generated job description
    return NextResponse.json({ jobDescription });
  } catch (error) {
    console.error("Error generating job description:", error);
    return NextResponse.json(
      {
        error: "Có lỗi xảy ra khi tạo mô tả công việc",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateJDPrompt(jobData: JobData): string {
  const remoteOptionText =
    {
      onsite: "tại văn phòng",
      hybrid: "làm việc kết hợp (hybrid)",
      remote: "làm việc từ xa",
    }[jobData.remoteOption] || "tại văn phòng";

  const experienceLevelText =
    {
      entry: "mới đi làm (0-1 năm kinh nghiệm)",
      mid: "trung cấp (2-4 năm kinh nghiệm)",
      senior: "cao cấp (5+ năm kinh nghiệm)",
      executive: "cấp quản lý",
    }[jobData.experienceLevel] || "";

  const employmentTypeText =
    {
      "full-time": "toàn thời gian",
      "part-time": "bán thời gian",
      contract: "hợp đồng",
      internship: "thực tập",
      freelance: "tự do",
    }[jobData.employmentType] || "";

  const toneDescription =
    {
      professional: "chuyên nghiệp, trang trọng",
      casual: "thân thiện, cởi mở",
      enthusiastic: "hào hứng, tạo động lực",
    }[jobData.tone] || "chuyên nghiệp";

  return `Hãy tạo một mô tả công việc chi tiết, hấp dẫn và chuyên nghiệp bằng tiếng Việt cho vị trí sau:

Thông tin vị trí:
- Tên vị trí: ${jobData.title}
- Công ty: ${jobData.companyName}
- Ngành nghề: ${jobData.industry}
- Địa điểm: ${jobData.location || "Không có thông tin"}
- Hình thức làm việc: ${remoteOptionText}
- Cấp độ kinh nghiệm: ${experienceLevelText}
- Loại hình công việc: ${employmentTypeText}

${
  jobData.keyResponsibilities
    ? `Trách nhiệm chính:\n${jobData.keyResponsibilities}\n`
    : ""
}
${
  jobData.requiredSkills
    ? `Yêu cầu và kỹ năng bắt buộc (các ứng viên PHẢI CÓ):\n${jobData.requiredSkills}\n`
    : ""
}
${
  jobData.preferredSkills
    ? `Yêu cầu và kỹ năng là lợi thế (nếu ứng viên có sẽ được ưu tiên):\n${jobData.preferredSkills}\n`
    : ""
}
${jobData.education ? `Yêu cầu học vấn:\n${jobData.education}\n` : ""}
${
  jobData.additionalNotes
    ? `Thông tin bổ sung:\n${jobData.additionalNotes}\n`
    : ""
}

Hãy tạo mô tả công việc hoàn chỉnh với các phần sau:
1. Giới thiệu về công ty
2. Mô tả vị trí và trách nhiệm công việc
3. Yêu cầu và tiêu chuẩn, phải phân biệt rõ ràng giữa:
   a. Yêu cầu bắt buộc (các kỹ năng/kinh nghiệm mà ứng viên phải có)
   b. Yêu cầu là lợi thế (các kỹ năng/kinh nghiệm mà nếu ứng viên có sẽ được ưu tiên)
4. Quyền lợi và phúc lợi
5. Quy trình ứng tuyển

Phong cách viết: ${toneDescription}.
Định dạng: sử dụng các tiêu đề rõ ràng, gạch đầu dòng cho các yêu cầu và trách nhiệm.
Hãy viết sao cho thu hút, chuyên nghiệp, dễ hiểu và hấp dẫn ứng viên tiềm năng. Tránh sử dụng ngôn ngữ phân biệt đối xử.
Mô tả công việc nên có độ dài vừa phải, từ 400-700 từ.`;
}
