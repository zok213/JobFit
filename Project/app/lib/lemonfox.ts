/**
 * Lemonfox AI API Client
 * Module for interacting with Lemonfox AI API
 * for speech-to-text and text-to-speech conversion
 */

// API Configuration
const API_BASE_URL = "https://api.lemonfox.ai/v1";
// Try to use environment variable - để ý là server-side không thể sử dụng NEXT_PUBLIC_*
const API_KEY =
  process.env.LEMONFOX_API_KEY || "HISa6s9XqFGb3PwUDcjsQ1JAt9rcTpWB";

// Available voice types
export enum VoiceType {
  FEMALE_NATURAL = "female_natural",
  MALE_NATURAL = "male_natural",
  FEMALE_CLEAR = "female_clear",
  MALE_CLEAR = "male_clear",
  SARAH = "sarah",
  HEART = "heart",
  BELLA = "bella",
  MICHAEL = "michael",
  RIVER = "river",
  JESSICA = "jessica",
  NOVA = "nova",
  SKYLER = "skyler",
  ERIC = "eric",
  LIAM = "liam",
  ONYX = "onyx",
  ALICE = "alice",
  EMMA = "emma",
  DANIEL = "daniel",
  GEORGE = "george",
  LEWIS = "lewis",
}

// Tạo các lỗi tùy chỉnh
export class LemonfoxApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "LemonfoxApiError";
    this.statusCode = statusCode;
  }
}

export class LemonfoxConfigError extends Error {
  constructor(message: string = "API key chưa được cấu hình") {
    super(message);
    this.name = "LemonfoxConfigError";
  }
}

/**
 * Kiểm tra xem API key đã được cấu hình chưa
 * @returns true nếu API key đã cấu hình, false nếu chưa
 */
export function isApiConfigured(): boolean {
  return API_KEY !== undefined && API_KEY !== null && API_KEY.trim() !== "";
}

/**
 * Kiểm tra và ném lỗi nếu API key chưa được cấu hình
 * @throws LemonfoxConfigError nếu API key chưa được cấu hình
 */
function validateApiConfig(): void {
  if (!isApiConfigured()) {
    console.error("Lemonfox API key chưa được cấu hình");
    throw new LemonfoxConfigError();
  }
}

/**
 * Convert speech to text
 * @param audioBlob - Audio data to convert
 * @returns Promise<string> - Text converted from speech
 * @throws LemonfoxConfigError nếu API key chưa được cấu hình
 * @throws LemonfoxApiError nếu API call thất bại
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
  validateApiConfig();

  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("language", "english"); // Chuyển sang tiếng Anh
    formData.append("response_format", "json");

    const response = await fetch(
      `https://api.lemonfox.ai/v1/audio/transcriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.error(
        `Lemonfox API error: ${errorData.message || response.statusText}`
      );
      throw new LemonfoxApiError(
        errorData.message || "Lỗi khi chuyển đổi âm thanh thành văn bản",
        response.status
      );
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    if (
      error instanceof LemonfoxConfigError ||
      error instanceof LemonfoxApiError
    ) {
      throw error;
    }
    console.error("Speech to text conversion failed:", error);
    throw new LemonfoxApiError(
      "Lỗi không xác định khi chuyển đổi âm thanh thành văn bản"
    );
  }
}

/**
 * Convert text to speech
 * @param text - Text to convert to speech
 * @param voiceType - Voice type (default is sarah)
 * @returns Promise<ArrayBuffer> - Audio data as ArrayBuffer
 * @throws LemonfoxConfigError nếu API key chưa được cấu hình
 * @throws LemonfoxApiError nếu API call thất bại
 */
export async function textToSpeech(
  text: string,
  voiceType: VoiceType | string = VoiceType.JESSICA
): Promise<ArrayBuffer> {
  validateApiConfig();

  try {
    // Cấu hình cho giọng nói tiếng Anh với chất lượng trung bình
    const response = await fetch(`${API_BASE_URL}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        voice: voiceType,
        response_format: "mp3",
        language: "en", // Chuyển sang tiếng Anh
        speed: 1.0, // Tốc độ bình thường
        quality: "medium", // Chất lượng trung bình
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lemonfox API error: ${errorText}`);
      throw new LemonfoxApiError(
        `Lỗi khi chuyển đổi văn bản thành âm thanh: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return await response.arrayBuffer();
  } catch (error) {
    if (
      error instanceof LemonfoxConfigError ||
      error instanceof LemonfoxApiError
    ) {
      throw error;
    }
    console.error("Text to speech conversion failed:", error);
    throw new LemonfoxApiError(
      "Lỗi không xác định khi chuyển đổi văn bản thành âm thanh"
    );
  }
}

/**
 * Get list of available voices
 * @returns Promise<Array<{id: string, name: string, language: string}>> - List of voices
 * @throws LemonfoxConfigError nếu API key chưa được cấu hình
 * @throws LemonfoxApiError nếu API call thất bại
 */
export async function getAvailableVoices(): Promise<
  Array<{ id: string; name: string; language: string }>
> {
  validateApiConfig();

  try {
    const response = await fetch(`${API_BASE_URL}/voices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lemonfox API error: ${errorText}`);
      throw new LemonfoxApiError(
        `Lỗi khi lấy danh sách giọng nói: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    if (
      error instanceof LemonfoxConfigError ||
      error instanceof LemonfoxApiError
    ) {
      throw error;
    }
    console.error("Failed to fetch available voices:", error);
    throw new LemonfoxApiError(
      "Lỗi không xác định khi lấy danh sách giọng nói"
    );
  }
}

/**
 * Tiếp nhận một tệp âm thanh dài và cắt thành các đoạn nhỏ hơn
 * Hữu ích khi xử lý các đoạn ghi âm dài vượt quá giới hạn của API
 * @param audioBlob - Dữ liệu âm thanh dạng Blob
 * @param segmentDuration - Thời lượng mỗi đoạn (tính bằng giây)
 * @returns Promise<Blob[]> - Mảng các đoạn âm thanh đã được cắt
 */
export async function segmentAudio(
  audioBlob: Blob,
  segmentDuration: number = 30
): Promise<Blob[]> {
  // Giả lập việc phân đoạn, trong thực tế cần xử lý audio phức tạp hơn
  // Chức năng này sẽ được triển khai sau nếu cần thiết
  return [audioBlob];
}

/**
 * Tối ưu hóa âm thanh để nhận dạng giọng nói tốt hơn
 * @param audioBlob - Dữ liệu âm thanh dạng Blob
 * @returns Promise<Blob> - Dữ liệu âm thanh đã được tối ưu hóa
 */
export async function optimizeAudioForSpeechRecognition(
  audioBlob: Blob
): Promise<Blob> {
  // Hàm này sẽ được triển khai sau với các thuật toán xử lý âm thanh
  // như lọc nhiễu, chuẩn hóa âm lượng, v.v.
  return audioBlob;
}
