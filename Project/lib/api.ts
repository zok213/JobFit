import { supabase } from "./supabase";
import { logger, logApiRequest } from "./debug-utils";

// API base URL - this should be set in environment variables
// For development, we'll use the default backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Check API URL during initialization
if (!process.env.NEXT_PUBLIC_API_URL) {
  logger.warn(
    "NEXT_PUBLIC_API_URL is not defined, using default:",
    API_BASE_URL
  );
}

// Add mock data flag to avoid backend dependency
export const USE_MOCK_DATA = false;

/**
 * Generic API client for making authenticated requests to the backend
 */
class ApiClient {
  /**
   * Get authentication token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // Check for mock token (for testing/demo purposes)
      const mockToken = localStorage.getItem("supabase_auth_token");
      if (mockToken) {
        console.log("Using mock auth token");
        return mockToken;
      }

      // Normal flow with Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        logger.error("Error getting auth session:", error);
        return null;
      }

      return data.session?.access_token || null;
    } catch (error) {
      logger.error("Exception getting auth token:", error);
      return null;
    }
  }

  /**
   * Make an authenticated request to the backend
   */
  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    // Add auth token if available
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      logger.warn(`Making unauthenticated request to ${endpoint}`);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return logApiRequest(endpoint, "GET", null, async () => {
      const response = await this.fetchWithAuth(endpoint);

      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }

      return response.json();
    });
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return logApiRequest(endpoint, "POST", data, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }

      return response.json();
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return logApiRequest(endpoint, "PUT", data, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }

      return response.json();
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return logApiRequest(endpoint, "DELETE", null, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }

      return response.json();
    });
  }

  /**
   * AI Services
   */
  async generateText(prompt: string, options: any = {}): Promise<any> {
    return this.post<any>("/api/ai/generate", {
      prompt,
      ...options,
    });
  }

  async getEmbedding(text: string, options: any = {}): Promise<any> {
    return this.post<any>("/api/ai/embed", {
      text,
      ...options,
    });
  }

  async listAIProviders(): Promise<string[]> {
    return this.get<string[]>("/api/ai/providers");
  }

  /**
   * Job Match Services
   */
  async uploadCV(formData: FormData): Promise<any> {
    const token = await this.getAuthToken();

    const headers = new Headers();

    // Add auth token if available
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      logger.warn("Uploading CV without authentication");
    }

    const url = `${API_BASE_URL}/api/resumes/upload`;

    return logApiRequest(
      "/api/resumes/upload",
      "POST (FormData)",
      { fileName: formData.get("file")?.toString() },
      async () => {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          const errorMsg = `API error: ${response.status}`;
          throw new Error(errorMsg);
        }

        return response.json();
      }
    );
  }

  async findJobMatches(criteria: any): Promise<any> {
    return this.post<any>("/api/jobs/match", criteria);
  }

  /**
   * Career Roadmap Services
   */
  async generateRoadmap(data: any): Promise<any> {
    try {
      console.log("Calling roadmap API with input:", data.chatInput);

      // Gọi đến Next.js API route
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput: data.chatInput,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API responded with status ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("API response received:", result);
      return result;
    } catch (error) {
      console.error("Error generating roadmap:", error);
      throw error;
    }
  }

  async getUserRoadmaps(): Promise<any> {
    return this.get<any>("/api/roadmaps/user");
  }

  /**
   * Interview Services
   */
  async startInterview(jobId: string): Promise<any> {
    return this.post<any>("/api/interviews/start", { jobId });
  }

  async submitInterviewAnswer(
    interviewId: string,
    questionId: string,
    answer: string
  ): Promise<any> {
    return this.post<any>("/api/interviews/answer", {
      interviewId,
      questionId,
      answer,
    });
  }

  /**
   * Health check to confirm API is accessible
   */
  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);

      if (!response.ok) {
        logger.error(`Health check failed: ${response.status}`);
        return { status: "error" };
      }

      return response.json();
    } catch (error) {
      logger.error("API health check failed:", error);
      return { status: "error" };
    }
  }

  /**
   * Gọi API workflow để tạo roadmap
   * @param data Object chứa thông tin về công việc, kỹ năng và mục tiêu
   * @returns Promise với kết quả từ API
   */
  async generateRoadmapFromWorkflow(data: {
    jobTitle?: string;
    currentSkills?: string[];
    targetSkills?: string[];
    careerGoal?: string;
    timeframe?: string;
  }): Promise<any> {
    // Nếu dùng mock data, trả về dữ liệu giả
    if (USE_MOCK_DATA) {
      console.log("Using mock data for workflow-based roadmap generation");

      // Tạo delay giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTitle = data.jobTitle || data.careerGoal || "Your Career";
      const mockSkills = data.currentSkills?.join(", ") || "existing skills";
      const mockTargets = data.targetSkills?.join(", ") || "target skills";
      const mockTimeframe = data.timeframe || "6 months";

      return {
        success: true,
        roadmap: {
          title: `Career Path: ${mockTitle}`,
          description: `From ${mockSkills} to ${mockTargets} in ${mockTimeframe}`,
          steps: [
            {
              title: "Foundation Building",
              description: "Master the fundamental concepts",
              duration: "2 weeks",
              resources: [
                {
                  type: "course",
                  title: "Comprehensive Introduction",
                  url: "https://example.com/course1",
                },
                {
                  type: "book",
                  title: "The Definitive Guide",
                  author: "Expert Author",
                },
              ],
            },
            {
              title: "Skill Development",
              description: "Practice with real-world applications",
              duration: "1 month",
              resources: [
                {
                  type: "project",
                  title: "Build a Portfolio Project",
                  description: "Create something to showcase your skills",
                },
                {
                  type: "tutorial",
                  title: "Advanced Techniques",
                  url: "https://example.com/tutorial",
                },
              ],
            },
            {
              title: "Professional Growth",
              description: "Expand knowledge to industry standards",
              duration: "2 months",
              resources: [
                {
                  type: "certification",
                  title: "Industry Certification",
                  provider: "Recognized Provider",
                },
                {
                  type: "community",
                  title: "Join Professional Community",
                  url: "https://community.example.com",
                },
              ],
            },
          ],
          estimatedCompletionTime: mockTimeframe,
          difficulty: "Intermediate",
        },
      };
    }

    try {
      // Sử dụng JinaAI để tạo roadmap
      const jina_api_key = process.env.JINA_API_KEY || "";
      const jina_api_url = "https://deepsearch.jina.ai/v1/chat/completions";

      const currentSkillsText =
        data.currentSkills && data.currentSkills.length > 0
          ? `Current skills: ${data.currentSkills.join(", ")}`
          : "No specific current skills provided";

      const targetSkillsText =
        data.targetSkills && data.targetSkills.length > 0
          ? `Target skills to acquire: ${data.targetSkills.join(", ")}`
          : "";

      // Tạo prompt cho LLM
      const prompt = `
Generate a detailed career development roadmap for someone with the following information:
- Current role or position: ${data.jobTitle || "Not specified"}
- Career goal: ${data.careerGoal || "Not specified"}
- ${currentSkillsText}
- ${targetSkillsText}
- Desired timeframe to achieve goal: ${data.timeframe || "Not specified"}

Please format your response as a JSON object with the following structure:
{
  "title": "Career Path: [Job Title] to [Career Goal]",
  "description": "A brief overview of the roadmap",
  "steps": [
    {
      "title": "Step Title",
      "description": "Detailed description of what should be accomplished in this step",
      "duration": "Time duration (e.g. '2 weeks', '1 month')",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "resources": [
        {
          "type": "course",
          "title": "Course Name",
          "url": "Course URL"
        },
        {
          "type": "book",
          "title": "Book Title",
          "author": "Author Name"
        },
        {
          "type": "project",
          "title": "Project Title",
          "description": "Project Description"
        }
      ]
    }
  ],
  "estimatedCompletionTime": "Total estimated time",
  "difficulty": "Beginner/Intermediate/Advanced"
}

Ensure that each step includes actionable information and relevant learning resources.
Do not include any text outside of the JSON structure.
`;

      // Gọi API của JinaAI
      const response = await fetch(jina_api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jina_api_key}`,
        },
        body: JSON.stringify({
          model: "jina-deepsearch", // hoặc model phù hợp
          messages: [
            {
              role: "system",
              content:
                "You are a career development advisor specializing in creating career roadmaps",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2, // Thiết lập nhiệt độ thấp để có kết quả nhất quán
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("JinaAI API error:", errorData);
        throw new Error(`JinaAI API error: ${response.status}`);
      }

      const jinaResponse = await response.json();

      // Phân tích JSON từ phản hồi
      let roadmapData;
      try {
        // Có thể cần phân tích nội dung từ message
        const contentText = jinaResponse.choices[0].message.content;
        roadmapData = JSON.parse(contentText);
      } catch (error) {
        console.error("Error parsing JinaAI response:", error);
        throw new Error("Failed to parse roadmap data from AI response");
      }

      return {
        success: true,
        roadmap: roadmapData,
      };
    } catch (error) {
      console.error("Error calling JinaAI:", error);

      // Fallback to our workflow API if JinaAI fails
      return this.post<any>("/api/workflow/roadmap", data);
    }
  }
}

// Create and export a singleton instance
export const api = new ApiClient();
