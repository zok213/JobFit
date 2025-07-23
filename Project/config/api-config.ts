// API configuration for external services
export const apiConfig = {
  // Configuration for DeepSeek API
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
    temperature: 0.7,
    maxTokens: 500,
  },

  // Configuration for OpenAI API
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 500,
  },

  // Configuration for ElevenLabs API (text-to-speech)
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || "",
    apiUrl: "https://api.elevenlabs.io/v1/text-to-speech",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
    modelId: "eleven_monolingual_v1",
  },

  // Configuration for AssemblyAI API (speech-to-text)
  assemblyai: {
    apiKey: process.env.ASSEMBLYAI_API_KEY || "",
    apiUrl: "https://api.assemblyai.com/v2",
  },
};

// Function to check if API is configured properly
export function isApiConfigured(): boolean {
  // Check if at least one of the major APIs is configured
  return !!(
    (apiConfig.deepseek.apiKey && apiConfig.deepseek.apiKey.length > 0) ||
    (apiConfig.openai.apiKey && apiConfig.openai.apiKey.length > 0)
  );
}

// Instructions for setting up the API
export const setupInstructions = {
  title: "API Configuration Required",
  description:
    "To use the voice interview feature, you need to set up API keys in your environment variables.",
  steps: [
    "Create a .env.local file in the root of your project.",
    "Add your DeepSeek API key: DEEPSEEK_API_KEY=your_api_key",
    "Add your OpenAI API key: OPENAI_API_KEY=your_api_key",
    "Add your ElevenLabs API key for text-to-speech: ELEVENLABS_API_KEY=your_api_key",
    "Add your AssemblyAI API key for speech-to-text: ASSEMBLYAI_API_KEY=your_api_key",
    "Restart the development server.",
  ],
  links: [
    {
      text: "DeepSeek API",
      url: "https://deepseek.com",
    },
    {
      text: "OpenAI API",
      url: "https://openai.com/api",
    },
    {
      text: "ElevenLabs API",
      url: "https://elevenlabs.io",
    },
    {
      text: "AssemblyAI API",
      url: "https://assemblyai.com",
    },
  ],
};
