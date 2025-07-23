import { NextResponse } from "next/server";

type SkillItem = {
  name: string;
  level: number; // 0-100
  type: "technical" | "soft" | "domain";
};

type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  estimatedDuration: string;
  skills: SkillItem[];
  resources: {
    title: string;
    link: string;
    type: "course" | "book" | "documentation" | "video" | "project";
  }[];
  milestones: {
    title: string;
    completed: boolean;
  }[];
  type: "learning" | "project" | "certification" | "experience";
};

// Định nghĩa kiểu dữ liệu cho skill
interface Skill {
  name?: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  try {
    const {
      currentRole,
      targetRole,
      yearsExperience,
      skills,
      interests,
      // Thêm các trường mới cho job match
      currentSkills,
      targetSkills,
      weaknesses,
      careerGoal,
      jobTitle,
    } = await req.json();

    // Tạo tiêu đề roadmap
    const roadmapTitle = jobTitle
      ? `Skill Development Plan for ${jobTitle}`
      : targetRole
      ? `${currentRole || "Current Role"} to ${targetRole} Career Path`
      : `Career Development Roadmap`;

    // Xác định kỹ năng hiện tại
    const currentSkillsList = currentSkills || skills || [];

    // Xác định kỹ năng mục tiêu
    const targetSkillsList = targetSkills || [];

    // Xác định điểm yếu cần cải thiện
    const weaknessList = weaknesses || [];

    // Generate a unique ID for each step
    const generateId = () => Math.random().toString(36).substring(2, 9);

    // Xác định số bước dựa trên số lượng dữ liệu đầu vào
    const totalSteps =
      weaknessList.length > 0 ? Math.min(weaknessList.length, 4) : 4;

    // Generate the roadmap steps
    const roadmapSteps: RoadmapStep[] = [];

    // Thêm bước đầu tiên: Củng cố kỹ năng hiện tại
    roadmapSteps.push({
      id: generateId(),
      title: "Củng cố các kỹ năng hiện có",
      description: `Giai đoạn này tập trung vào việc củng cố các kỹ năng mạnh hiện tại ${
        currentSkillsList.length > 0
          ? `như ${currentSkillsList.slice(0, 3).join(", ")}`
          : ""
      } để tạo nền tảng vững chắc.`,
      timeframe: "0-1 tháng",
      estimatedDuration: "1 tháng",
      type: "learning",
      skills: currentSkillsList.slice(0, 3).map((skill: string | Skill) => ({
        name: typeof skill === "string" ? skill : skill.name || "Kỹ năng",
        level: 80,
        type: "technical" as const,
      })),
      resources: [
        {
          title: "Khóa học nâng cao",
          link: "https://coursera.org",
          type: "course",
        },
        {
          title: "Project thực hành",
          link: "https://github.com",
          type: "project",
        },
      ],
      milestones: [
        { title: "Hoàn thành khóa học nâng cao", completed: false },
        { title: "Xây dựng portfolio", completed: false },
      ],
    });

    // Thêm các bước phát triển kỹ năng còn thiếu
    for (let i = 0; i < Math.min(weaknessList.length, 3); i++) {
      const weakness = weaknessList[i];
      roadmapSteps.push({
        id: generateId(),
        title: `Phát triển kỹ năng: ${weakness}`,
        description: `Học và phát triển ${weakness} để tăng cường khả năng đáp ứng yêu cầu công việc.`,
        timeframe: `${i + 1}-${i + 2} tháng`,
        estimatedDuration: "1 tháng",
        type: i % 2 === 0 ? "project" : "certification",
        skills: [
          { name: weakness, level: 60, type: "technical" },
          {
            name: targetSkillsList[i] || "Kỹ năng liên quan",
            level: 70,
            type: "technical",
          },
        ],
        resources: [
          {
            title: `Khóa học ${weakness}`,
            link: "https://udemy.com",
            type: "course",
          },
          {
            title: "Sách tham khảo",
            link: "https://amazon.com",
            type: "book",
          },
        ],
        milestones: [
          {
            title: `Hoàn thành khóa học cơ bản về ${weakness}`,
            completed: false,
          },
          { title: "Ứng dụng vào dự án thực tế", completed: false },
        ],
      });
    }

    // Thêm bước cuối cùng: Đánh giá và ứng dụng
    roadmapSteps.push({
      id: generateId(),
      title: "Đánh giá và Ứng dụng",
      description:
        "Tổng hợp các kỹ năng đã học và ứng dụng vào thực tế công việc",
      timeframe: "5-6 tháng",
      estimatedDuration: "1 tháng",
      type: "experience",
      skills: [
        { name: "Kỹ năng tổng hợp", level: 85, type: "technical" },
        { name: "Kỹ năng trình bày", level: 75, type: "soft" },
        { name: "Kỹ năng làm việc nhóm", level: 90, type: "soft" },
      ],
      resources: [
        {
          title: "Workshop thực hành",
          link: "https://meetup.com",
          type: "course",
        },
        {
          title: "Tham gia cộng đồng",
          link: "https://stackoverflow.com",
          type: "documentation",
        },
      ],
      milestones: [
        { title: "Hoàn thành dự án tổng hợp", completed: false },
        { title: "Phản hồi từ mentor/nhà tuyển dụng", completed: false },
      ],
    });

    return NextResponse.json({
      roadmapTitle: roadmapTitle,
      steps: roadmapSteps,
      currentProgress: 0,
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
