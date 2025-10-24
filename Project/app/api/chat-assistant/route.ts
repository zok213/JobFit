import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { message, cvContext, history } = await req.json();

    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const systemPrompt = `Bạn là trợ lý CV chuyên nghiệp và thân thiện. Nhiệm vụ của bạn là:
- Tư vấn cách viết CV hiệu quả
- Đề xuất cải thiện nội dung CV
- Trả lời câu hỏi về cấu trúc, format CV
- Gợi ý từ khóa và kỹ năng phù hợp
- Phân tích điểm mạnh/yếu của CV

Hãy trả lời ngắn gọn (3-5 câu), súc tích, dễ hiểu. Sử dụng bullet points nếu cần. Viết bằng tiếng Việt tự nhiên và chuyên nghiệp.`;

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add CV context if available
    if (cvContext) {
      messages.push({
        role: 'system',
        content: cvContext
      });
    }

    // Add recent history (last 5 messages)
    if (history && Array.isArray(history)) {
      history.slice(-5).forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời ngay bây giờ.';

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error('Error in chat assistant:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
