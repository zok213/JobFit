"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MicIcon, StopCircleIcon, PlayIcon, PauseIcon } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

interface VoiceInterviewInterfaceProps {
  sessionId: string;
  initialMessage?: string;
  onSessionComplete?: () => void;
}

export function VoiceInterviewInterface({
  sessionId,
  initialMessage = "Hello! I'm your interview assistant. You can start speaking after pressing the record button.",
  onSessionComplete,
}: VoiceInterviewInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [sessionValidationRetries, setSessionValidationRetries] = useState(0);
  const maxRetries = 3;

  const recorderRef = useRef<{
    mediaRecorder: MediaRecorder;
    stream: MediaStream;
  } | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Create audio player when component mounts
  useEffect(() => {
    audioPlayerRef.current = new Audio();
    audioPlayerRef.current.onended = () => {
      setIsPlaying(false);
    };

    // Kiểm tra tình trạng phiên trước khi tải thông báo ban đầu
    const validateSession = async () => {
      try {
        setIsProcessing(true);

        // Thử hiển thị initialMessage trước khi session được xác thực
        if (initialMessage && sessionValidationRetries === 0) {
          setMessages([
            {
              role: "assistant",
              content: initialMessage,
            },
          ]);
        }

        console.log(
          `Validating session: ${sessionId}, attempt: ${
            sessionValidationRetries + 1
          }`
        );

        // Kiểm tra xem phiên có tồn tại không
        const checkResponse = await fetch(
          `/api/interview/session/${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // Sử dụng cache: 'no-store' để tránh cache
            cache: "no-store",
          }
        );

        if (!checkResponse.ok) {
          // Nếu phiên không tồn tại và chưa vượt quá số lần thử lại
          if (sessionValidationRetries < maxRetries) {
            console.log(
              `Session validation failed (${checkResponse.status}), retrying...`
            );
            setSessionValidationRetries((prev) => prev + 1);
            // Thử lại sau 1 giây
            setTimeout(validateSession, 1000);
            return false;
          }

          // Nếu đã vượt quá số lần thử lại, hiển thị lỗi
          setError(
            `Session not found (${checkResponse.status}). Please try starting a new interview.`
          );
          setIsProcessing(false);
          return false;
        }

        // Phiên hợp lệ
        console.log("Session validated successfully");
        setIsSessionInitialized(true);

        // Nếu đã có thông báo ban đầu, tạo audio cho nó
        if (initialMessage) {
          try {
            const audioUrl = await textToSpeech(initialMessage);
            // Cập nhật thông báo với audio
            setMessages([
              {
                role: "assistant",
                content: initialMessage,
                audioUrl,
              },
            ]);

            // Tự động phát audio
            if (audioPlayerRef.current) {
              playAudio(audioUrl);
            }
          } catch (audioError) {
            console.error(
              "Could not load audio for initial message:",
              audioError
            );
            // Vẫn giữ thông báo nhưng không có audio
          }
        }

        setIsProcessing(false);
        return true;
      } catch (error) {
        console.error("Error validating session:", error);

        // Thử lại nếu chưa vượt quá số lần thử
        if (sessionValidationRetries < maxRetries) {
          console.log(
            `Session validation error, retrying (${
              sessionValidationRetries + 1
            }/${maxRetries})...`
          );
          setSessionValidationRetries((prev) => prev + 1);
          setTimeout(validateSession, 1000);
          return false;
        }

        setError(`Error validating session: ${String(error)}`);
        setIsProcessing(false);
        return false;
      }
    };

    validateSession();

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
      }
    };
  }, [initialMessage, sessionId, sessionValidationRetries, maxRetries]);

  // Start recording
  const startRecording = async () => {
    try {
      // Kiểm tra xem phiên có hợp lệ không
      if (!isSessionInitialized) {
        setError(
          "Cannot record: session not initialized. Try refreshing the page."
        );
        return;
      }

      setIsRecording(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());

        // Create Blob from recorded chunks
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // Save URL for playback
        const audioUrl = URL.createObjectURL(audioBlob);

        // Add temporary user message
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: "Processing audio...",
            audioUrl,
          },
        ]);

        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      recorderRef.current = { mediaRecorder, stream };
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Cannot access microphone. Please check your permissions.");
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (
      recorderRef.current &&
      recorderRef.current.mediaRecorder.state === "recording"
    ) {
      recorderRef.current.mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Process recorded audio
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      // Convert audio to text
      const speechResponse = await fetch(
        "/api/interview/voice/speech-to-text",
        {
          method: "POST",
          body: formData,
          cache: "no-store",
        }
      );

      if (!speechResponse.ok) {
        const errorData = await speechResponse.json();
        console.error("Speech-to-text API error:", errorData);

        // Handle different error types
        if (errorData.error_code === "API_NOT_CONFIGURED") {
          setError("Speech-to-text functionality is currently unavailable");
          return;
        } else {
          throw new Error(
            errorData.message || "Error converting audio to text"
          );
        }
      }

      const speechData = await speechResponse.json();
      // Đảm bảo text nhận được đã được giải mã đúng
      let transcribedText = speechData.text;

      // Nếu text là một chuỗi JSON có mã hóa, giải mã nó
      if (
        typeof transcribedText === "string" &&
        ((transcribedText.startsWith('"') && transcribedText.endsWith('"')) ||
          transcribedText.includes("\\u"))
      ) {
        try {
          // Thử giải mã chuỗi JSON
          transcribedText = JSON.parse(transcribedText);
        } catch (e) {
          console.warn("Failed to parse JSON text, using as-is:", e);
        }
      }

      // Check if no text was recognized
      if (!transcribedText || transcribedText.trim().length === 0) {
        setError(
          "Could not recognize your speech. Please try again or speak louder."
        );
        setIsProcessing(false);
        return;
      }

      // Update user message with transcribed text
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = transcribedText;
        return updated;
      });

      // Thêm cơ chế retry nếu gặp lỗi session
      const sendAnswerWithRetry = async (retries = 0) => {
        try {
          // Send answer to API to process and get next question
          const answerResponse = await fetch("/api/interview/answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id: sessionId,
              answer: transcribedText,
            }),
            cache: "no-store",
          });

          if (!answerResponse.ok) {
            const errorData = await answerResponse.json();
            console.error("Answer API error:", errorData);

            // Nếu lỗi là SESSION_EXPIRED hoặc 410/404 và còn cơ hội thử lại
            if (
              (errorData.error_code === "SESSION_EXPIRED" ||
                answerResponse.status === 410 ||
                answerResponse.status === 404) &&
              retries < 2
            ) {
              console.log(
                `Session error, retrying answer submission (${
                  retries + 1
                }/2)...`
              );
              // Chờ 1 giây và thử lại
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return sendAnswerWithRetry(retries + 1);
            }

            throw new Error(errorData.message || "Error sending answer");
          }

          return await answerResponse.json();
        } catch (error) {
          if (retries < 2) {
            console.log(
              `Error submitting answer, retrying (${retries + 1}/2)...`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return sendAnswerWithRetry(retries + 1);
          }
          throw error;
        }
      };

      // Gửi câu trả lời với cơ chế thử lại
      const answerData = await sendAnswerWithRetry();

      // Check if interview session is completed
      if (answerData.is_completed) {
        if (onSessionComplete) {
          onSessionComplete();
        }
        return;
      }

      try {
        // Convert next question to audio
        const audioUrl = await textToSpeech(answerData.question);

        // Add new question from interviewer
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answerData.question,
            audioUrl,
          },
        ]);

        // Automatically play the next question
        playAudio(audioUrl);
      } catch (voiceError) {
        console.error("Error converting text to speech:", voiceError);

        // Still display the new question but without audio
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answerData.question,
          },
        ]);

        setError(
          "Cannot play audio, but you can still read the next question."
        );
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setError("An error occurred while processing audio: " + String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to convert text to speech
  const textToSpeech = async (text: string): Promise<string> => {
    try {
      const response = await fetch("/api/interview/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          session_id: sessionId,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        // Handle errors
        const errorData = await response.json();
        console.error("API error:", errorData);

        // Handle different error types
        if (errorData.error_code === "API_NOT_CONFIGURED") {
          throw new Error(
            "Text-to-speech functionality is currently unavailable"
          );
        } else if (errorData.error_code === "SESSION_NOT_FOUND") {
          throw new Error("Interview session does not exist or has ended");
        } else {
          throw new Error(
            errorData.message || "Error converting text to speech"
          );
        }
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error converting text to speech:", error);
      throw error;
    }
  };

  // Play audio
  const playAudio = (url: string) => {
    if (!audioPlayerRef.current) return;

    // Stop currently playing audio if any
    if (isPlaying) {
      audioPlayerRef.current.pause();
    }

    // Play new audio
    audioPlayerRef.current.src = url;
    audioPlayerRef.current.play().catch(console.error);
    setIsPlaying(true);
  };

  // Pause audio playback
  const pauseAudio = () => {
    if (!audioPlayerRef.current) return;

    audioPlayerRef.current.pause();
    setIsPlaying(false);
  };

  // Handle play/pause for a message
  const toggleAudio = (message: Message) => {
    if (!message.audioUrl) return;

    if (isPlaying && audioPlayerRef.current?.src === message.audioUrl) {
      pauseAudio();
    } else {
      playAudio(message.audioUrl);
    }
  };

  // Complete the interview session
  const completeSession = async () => {
    try {
      setIsProcessing(true);

      // Send request to end the interview session
      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          answer: "I want to end the interview. Thank you.",
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not complete the interview session");
      }

      const data = await response.json();

      // Create audio for the ending message
      const audioUrl = await textToSpeech(data.question);

      // Add ending message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.question,
          audioUrl,
        },
      ]);

      // Play ending message
      playAudio(audioUrl);

      // Call callback after completion
      if (onSessionComplete) {
        onSessionComplete();
      }
    } catch (error) {
      console.error("Error ending interview session:", error);
      setError("Could not end the interview session: " + String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={cn(
              "flex flex-col",
              message.role === "assistant" ? "bg-muted" : "bg-background"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Badge
                  variant={message.role === "assistant" ? "default" : "outline"}
                >
                  {message.role === "assistant" ? "Assistant" : "You"}
                </Badge>

                {message.audioUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAudio(message)}
                    className="p-1 h-6 w-6"
                  >
                    {isPlaying &&
                    audioPlayerRef.current?.src === message.audioUrl ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              <p className="mt-2">{message.content}</p>
            </CardContent>
          </Card>
        ))}

        {isProcessing && (
          <div className="flex justify-center">
            <Spinner className="h-8 w-8" />
            <span className="ml-2">Processing...</span>
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-red-800">{error}</CardContent>
          </Card>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing || !isSessionInitialized}
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <MicIcon className="h-8 w-8" />
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <StopCircleIcon className="h-8 w-8" />
            </Button>
          )}

          <Button
            onClick={completeSession}
            variant="outline"
            disabled={isProcessing || !isSessionInitialized}
          >
            End Interview
          </Button>
        </div>

        <p className="text-center mt-2 text-muted-foreground">
          {isRecording
            ? "Recording... Press to stop."
            : isSessionInitialized
            ? "Press to start recording"
            : sessionValidationRetries > 0
            ? `Initializing session (attempt ${sessionValidationRetries}/${maxRetries})...`
            : "Initializing session..."}
        </p>
      </div>
    </div>
  );
}
