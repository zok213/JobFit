import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked"; // Thêm thư viện marked để chuyển đổi markdown sang HTML

// API route để tương tác trực tiếp với Jina AI API
export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const data = await req.json();
    console.log(
      "🚀 API route received request:",
      data.chatInput.substring(0, 100) + "..."
    );

    // Gọi trực tiếp đến Jina AI DeepSearch API
    console.log("🔌 Connecting directly to Jina AI API");

    const jinaApiKey = process.env.JINA_API_KEY || "";

    // Cấu trúc payload cho API
    const payload = {
      model: "jina-deepsearch-v1",
      messages: [
        {
          role: "user",
          content: `Create a detailed roadmap based on the topic: "${data.chatInput}". 
The roadmap structure should include:

1. Main title describing the roadmap
2. Brief introduction about the roadmap
3. Development stages (at least 4 stages), each stage should have:
   - Stage title and timeframe
   - Clear description of the stage objectives
   - List of core skills to develop (3-5 skills)
   - For EACH skill, provide 1 specific link to a quality learning resource
   - List of recommended learning resources (3-5 sources), including:
     * Online courses (with specific links to each course)
     * Books and materials (with links to purchase or read online)
     * Practical projects (brief description and link to tutorials if available)
   - Important milestones to achieve in this stage

4. Additional advice and next development directions

Ensure each link is a real link to an official website, do not use fake links. For courses, prioritize famous sources like Coursera, Udemy, edX, etc.
Format the result in Markdown with headings, bullet points, and properly embedded links.`,
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

    // Chuyển đổi markdown sang HTML
    try {
      // Sử dụng marked để chuyển đổi markdown sang HTML
      const html = marked.parse(content as string) as string;
      const enhancedHtml = addStylesToHTML(html);

      // Trả về cả hai định dạng markdown và HTML
      console.log("📤 Returning content to frontend");
      return NextResponse.json({
        text: content, // Vẫn giữ phiên bản markdown để tương thích ngược
        html: enhancedHtml, // Thêm phiên bản HTML
        nonce: String(Date.now()),
      });
    } catch (error) {
      console.error("❌ Error converting markdown to HTML:", error);
      // Nếu có lỗi khi chuyển đổi HTML, vẫn trả về markdown
      return NextResponse.json({
        text: content,
        nonce: String(Date.now()),
      });
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

// Hàm thêm style đặc biệt cho HTML để làm nổi bật links và tạo cây tương tác
function addStylesToHTML(html: string): string {
  try {
    // DOMParser không khả dụng trong NodeJS (server-side), sử dụng phương pháp thay thế

    // Tìm tiêu đề chính (h1)
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1 = h1Match
      ? h1Match[1].replace(/<[^>]*>/g, "")
      : "Career Development Roadmap";

    // Tìm đoạn giới thiệu (paragraph đầu tiên)
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const introP = pMatch
      ? pMatch[1].replace(/<[^>]*>/g, "")
      : "This roadmap will guide you through the necessary steps to develop your skills.";

    // Tìm tất cả các giai đoạn (h2)
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
    const stages: { title: string; content: string }[] = [];

    let h2Match;
    let lastIndex = 0;
    let allH2Matches = [];

    // Thu thập tất cả các h2 và vị trí của chúng
    while ((h2Match = h2Regex.exec(html)) !== null) {
      allH2Matches.push({
        title: h2Match[1].replace(/<[^>]*>/g, ""),
        index: h2Match.index,
      });
    }

    // Xử lý từng giai đoạn
    for (let i = 0; i < allH2Matches.length; i++) {
      const currentH2 = allH2Matches[i];
      const nextH2 = allH2Matches[i + 1];

      const startIndex = html.indexOf("</h2>", currentH2.index) + 5;
      const endIndex = nextH2 ? nextH2.index : html.length;

      const content = html.substring(startIndex, endIndex).trim();

      stages.push({
        title: currentH2.title,
        content: content,
      });
    }

    // Xác định phần lời khuyên (giai đoạn cuối)
    let advice = null;
    if (stages.length > 0) {
      const lastStage = stages[stages.length - 1];
      if (
        lastStage.title.toLowerCase().includes("advice") ||
        lastStage.title.toLowerCase().includes("additional") ||
        lastStage.title.toLowerCase().includes("next")
      ) {
        advice = stages.pop();
      }
    }

    // Xây dựng HTML tĩnh cho cây roadmap (không cần script)
    let treeHtml = `
      <div class="roadmap-tree">
        <style>
          /* CSS cho Roadmap Tree */
          .roadmap-tree {
            margin: 2rem 0;
            padding: 2rem;
            border-radius: 1rem;
            background: #FAFAFA;
            font-family: system-ui, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
          }
          
          .roadmap-tree::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 40%;
            height: 100%;
            background-image: url('/img/bg-pattern.svg');
            background-repeat: repeat;
            background-size: 300px;
            opacity: 0.07;
            z-index: 0;
            pointer-events: none;
          }
          
          .tree-container {
            position: relative;
            z-index: 1;
          }
          
          .tree-node {
            padding: 1rem 1.5rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            position: relative;
            border: 2px solid #d9f99d;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: box-shadow 0.3s ease;
          }
          
          .tree-node:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .tree-node.introduction {
            background: #65a30d;
            color: white;
            border-color: #65a30d;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(163, 230, 53, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(163, 230, 53, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(163, 230, 53, 0);
            }
          }
          
          .tree-node.stage {
            background: #f7fee7;
            border-color: #a3e635;
          }
          
          .tree-node.advice {
            background: #f5f3ff;
            border-color: #c4b5fd;
          }
          
          .tree-node-title {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px dashed rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
          }
          
          .tree-node.introduction .tree-node-title::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'%3E%3C/path%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }
          
          .tree-node.stage .tree-node-title::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2365a30d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'%3E%3C/path%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }
          
          .tree-node.advice .tree-node-title::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237c3aed'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'%3E%3C/path%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }
          
          .tree-connector {
            position: absolute;
            left: 49.5%;
            width: 3px;
            background-color: #a3e635;
            z-index: 0;
          }
          
          /* CSS đặc biệt để làm nổi bật liên kết trong nội dung */
          .tree-node-content a {
            color: #65a30d;
            text-decoration: none;
            font-weight: 500;
            padding: 0.1rem 0.3rem;
            background-color: #f7fee7;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
            display: inline-block;
          }
          
          .tree-node-content a:hover {
            color: #4d7c0f;
            background-color: #ecfccb;
            transform: translateY(-1px);
          }
          
          .tree-node.introduction .tree-node-content a {
            color: #ffffff;
            background-color: rgba(255,255,255,0.2);
          }
          
          .tree-node.introduction .tree-node-content a:hover {
            background-color: rgba(255,255,255,0.3);
          }
          
          /* Styling các phần tử con bên trong nút */
          .tree-node-content ul {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            list-style-type: disc;
          }
          
          .tree-node-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          
          .tree-node-content p {
            margin-bottom: 0.75rem;
            line-height: 1.7;
          }
          
          .tree-node-content h3 {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: inherit;
          }
        </style>
        
        <div class="tree-container">
          <!-- Introduction Node -->
          <div class="tree-node introduction">
            <div class="tree-node-title">${h1}</div>
            <div class="tree-node-content">
              <p>${introP}</p>
            </div>
          </div>
          
          <!-- Connector Line -->
          <div class="tree-connector" style="top: 70px; height: ${
            40 * stages.length
          }px;"></div>
    `;

    // Add stage nodes
    stages.forEach((stage, index) => {
      treeHtml += `
          <!-- Stage ${index + 1} -->
          <div class="tree-node stage" style="margin-top: 25px;">
            <div class="tree-node-title">${stage.title}</div>
            <div class="tree-node-content">
              ${stage.content}
            </div>
          </div>
      `;
    });

    // Add advice node if exists
    if (advice) {
      treeHtml += `
          <!-- Advice Node -->
          <div class="tree-node advice" style="margin-top: 25px;">
            <div class="tree-node-title">${advice.title}</div>
            <div class="tree-node-content">
              ${advice.content}
            </div>
          </div>
      `;
    }

    // Close the container
    treeHtml += `
        </div>
      </div>
    `;

    return treeHtml;
  } catch (e) {
    console.error("Error creating roadmap tree:", e);
    // Return original HTML in case of error
    return `
      <div class="roadmap-content">
        <style>
          .roadmap-content h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #171717;
            border-bottom: 2px solid #d9f99d;
            padding-bottom: 0.5rem;
          }
          .roadmap-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #171717;
            border-left: 4px solid #a3e635;
            padding-left: 0.75rem;
          }
          .roadmap-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5rem;
            color: #404040;
          }
          .roadmap-content ul {
            margin-top: 1rem;
            margin-bottom: 1rem;
            list-style-type: disc;
            padding-left: 1.5rem;
          }
          .roadmap-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          .roadmap-content a {
            color: #65a30d;
            text-decoration: none;
            font-weight: 500;
            padding: 0.1rem 0.3rem;
            background-color: #f7fee7;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
          }
          .roadmap-content a:hover {
            color: #4d7c0f;
            background-color: #ecfccb;
          }
          .roadmap-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
          }
          .roadmap-content strong {
            font-weight: 600;
            color: #171717;
          }
          .roadmap-content blockquote {
            border-left: 3px solid #a3e635;
            padding-left: 1rem;
            margin-left: 0;
            color: #525252;
            font-style: italic;
            margin: 1.5rem 0;
          }
          .roadmap-content code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
          }
          .roadmap-content pre {
            background: #f8f8f8;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          .roadmap-content pre code {
            background: transparent;
            padding: 0;
          }
          .roadmap-content img {
            max-width: 100%;
            border-radius: 4px;
            margin: 1.5rem 0;
          }
          .roadmap-content hr {
            border: 0;
            height: 1px;
            background: #d9f99d;
            margin: 2rem 0;
          }
        </style>
        ${html}
      </div>
    `;
  }
}
