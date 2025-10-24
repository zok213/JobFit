import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { contentType, context, prompt } = await req.json();

    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    // Build system prompt based on content type
    let systemPrompt = '';
    switch (contentType) {
      case 'summary':
        systemPrompt = 'Bạn là chuyên gia viết CV chuyên nghiệp. Hãy tạo một đoạn professional summary ngắn gọn (3-5 câu), súc tích, nổi bật điểm mạnh và kinh nghiệm. Viết bằng tiếng Việt tự nhiên, chuyên nghiệp.';
        break;
      case 'experience':
        systemPrompt = 'Bạn là chuyên gia viết CV. Hãy tạo mô tả công việc chi tiết (3-5 bullet points hoặc 1 đoạn văn), nêu rõ trách nhiệm và thành tựu. Viết bằng tiếng Việt chuyên nghiệp.';
        break;
      case 'skills':
        systemPrompt = 'Bạn là chuyên gia CV. Hãy tạo danh sách kỹ năng liên quan (cách nhau bởi dấu phẩy), phù hợp với vị trí công việc. Viết bằng tiếng Việt.';
        break;
      default:
        systemPrompt = 'Bạn là trợ lý viết CV chuyên nghiệp. Hãy tạo nội dung theo yêu cầu, viết bằng tiếng Việt chuyên nghiệp và súc tích.';
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `${context}\n\n${prompt || 'Hãy tạo nội dung phù hợp.'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
