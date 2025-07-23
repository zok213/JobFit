// Utility to communicate with Deepseek API
import { apiConfig } from "@/config/api-config";

interface DeepseekResponse {
  question: string;
  is_completed: boolean;
}

// Function to call DeepSeek API
export async function callDeepseekAPI(prompt: string): Promise<string> {
  try {
    const config = apiConfig.deepseek;
    console.log("Sending prompt to Deepseek API:", prompt);

    // Check API key
    if (!config.apiKey || config.apiKey === "") {
      console.warn(
        "DeepSeek API key is not configured, cannot generate questions"
      );
      throw new Error("DeepSeek API key is not configured");
    }

    // Call the actual API
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: config.temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Check response structure
    if (
      !data ||
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message
    ) {
      throw new Error("Invalid API response: missing required data fields");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Deepseek API:", error);
    throw new Error("Cannot connect to Deepseek API");
  }
}

// Function to extract question from response
function extractQuestionFromResponse(responseText: string): string {
  // Log original response for debugging
  console.log(
    "Processing original response from API:",
    responseText.substring(0, 100) + "..."
  );

  // If the response is empty or too short, report an error
  if (!responseText || responseText.length < 2) {
    console.error("Response from API is too short or empty");
    throw new Error("Invalid response from API");
  }

  let questionText = responseText.trim();

  // Check if the response is JSON
  try {
    // Try to parse JSON
    const parsedJson = JSON.parse(responseText);

    // If there's a question field, return it
    if (
      parsedJson.question &&
      typeof parsedJson.question === "string" &&
      parsedJson.question.length > 2
    ) {
      console.log("Found question field in JSON:", parsedJson.question);
      return parsedJson.question;
    }

    // If there's no question field, find the first field that's a string
    for (const key in parsedJson) {
      if (typeof parsedJson[key] === "string" && parsedJson[key].length > 2) {
        console.log(
          `Using ${key} field from JSON as fallback:`,
          parsedJson[key]
        );
        return parsedJson[key];
      }
    }

    // If no suitable field is found in JSON, use the entire original text
    console.warn("No suitable field found in JSON, using original text");
    questionText = responseText.trim();
  } catch (e) {
    // If not JSON, continue processing as text
    console.log("Response is not valid JSON, processing as text");
  }

  // Check different patterns to find question
  // Pattern 1: {"question": "..."}
  const jsonMatch = responseText.match(/"question"\s*:\s*"([^"]{5,})"/);
  if (jsonMatch && jsonMatch[1]) {
    console.log("Found JSON question pattern in string:", jsonMatch[1]);
    return jsonMatch[1];
  }

  // Pattern 2: Look for text between quotation marks containing a question mark
  const questionMarkMatch = responseText.match(/"([^"]{10,}[?])"/);
  if (questionMarkMatch && questionMarkMatch[1]) {
    console.log(
      "Found string pattern containing question mark:",
      questionMarkMatch[1]
    );
    return questionMarkMatch[1];
  }

  // If no special pattern is found, use the entire text
  return questionText;
}

export async function getFirstQuestion(
  name: string,
  topic: string
): Promise<DeepseekResponse> {
  try {
    console.log(`Getting first question for "${name}" on topic "${topic}"`);

    if (!name || !topic) {
      console.error("Missing name or topic parameter for first question");
      throw new Error("Missing required information: name or topic");
    }

    const prompt = `Start an interview with a candidate named "${name}" on the topic "${topic}". 
    KEEP IT BRIEF, just provide the first question. DO NOT add explanations. 
    The question should be relevant to the field of "${topic}".`;

    // Call API to get the question
    const responseText = await callDeepseekAPI(prompt);

    // Extract question from response
    const question = extractQuestionFromResponse(responseText);

    // Clean up question before returning
    const cleanedQuestion = cleanupQuestion(question);

    console.log(`First question: "${cleanedQuestion}"`);

    return {
      question: cleanedQuestion,
      is_completed: false,
    };
  } catch (error: any) {
    console.error("Error getting first question:", error);
    throw new Error(`Cannot get first question: ${error.message}`);
  }
}

function cleanupQuestion(question: string): string {
  if (!question) return "";

  let cleaned = question.trim();

  // Remove unwanted special characters from start of string
  cleaned = cleaned.replace(/^['"*_~]+/, "");

  // Ensure question has a question mark at the end (if it doesn't already)
  if (
    cleaned.length > 10 &&
    !cleaned.endsWith("?") &&
    !cleaned.endsWith(".") &&
    !cleaned.endsWith("!")
  ) {
    cleaned += "?";
  }

  // Ensure question starts with a capital letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

export async function getNextQuestion(
  sessionId: string,
  topic: string,
  previousQuestions: string[],
  previousAnswers: string[]
): Promise<DeepseekResponse> {
  try {
    console.log(
      `Getting next question for session ${sessionId}, previous questions count: ${previousQuestions.length}`
    );

    // Check input parameters
    if (!sessionId || !topic) {
      throw new Error("Missing required information: sessionId or topic");
    }

    // Create interview history
    let interviewHistory = "";

    // Number of elements to take from end of array (most recent history)
    const maxHistoryItems = Math.min(
      previousQuestions.length,
      previousAnswers.length + 1
    );

    for (let i = 0; i < maxHistoryItems; i++) {
      const questionIndex = previousQuestions.length - maxHistoryItems + i;
      if (questionIndex >= 0 && questionIndex < previousQuestions.length) {
        interviewHistory += `Interviewer: ${previousQuestions[questionIndex]}\n\n`;
      }

      const answerIndex = previousAnswers.length - maxHistoryItems + i;
      if (answerIndex >= 0 && answerIndex < previousAnswers.length) {
        interviewHistory += `Candidate: ${previousAnswers[answerIndex]}\n\n`;
      }
    }

    // Create prompt to get next question from DeepSeek API
    const prompt = `Below is the history of an interview on the topic "${topic}". 
      Please provide the next question ONLY based on the candidate's previous answer.
      KEEP IT BRIEF, just provide the next question. DO NOT add explanations.
      If the candidate wants to end the interview, provide a conclusion and mark the interview as completed.
      
      Interview history:
      ${interviewHistory}`;

    // Call API to get next question
    const responseText = await callDeepseekAPI(prompt);

    // Extract question from response
    const question = extractQuestionFromResponse(responseText);

    // Clean up question
    const cleanedQuestion = cleanupQuestion(question);

    // Check if this is the final question
    const isCompleted =
      previousQuestions.length >= 5 || // 5 questions completed
      cleanedQuestion.toLowerCase().includes("thank you") || // Contains "thank you"
      cleanedQuestion.toLowerCase().includes("completed") || // Contains "completed"
      cleanedQuestion.toLowerCase().includes("end"); // Contains "end"

    console.log(
      `Next question: "${cleanedQuestion}", completed: ${isCompleted}`
    );

    return {
      question: cleanedQuestion,
      is_completed: isCompleted,
    };
  } catch (error: any) {
    console.error("Error getting next question:", error);
    throw new Error(`Cannot get next question: ${error.message}`);
  }
}
