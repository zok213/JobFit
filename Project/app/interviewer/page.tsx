"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import {
  MessageSquare,
  Briefcase,
  Clock,
  Zap,
  Sparkles,
  Send,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { isApiConfigured, setupInstructions } from "@/config/api-config";
import { Switch } from "@/components/ui/switch";
import { VoiceInterviewInterface } from "@/app/components/VoiceInterviewInterface";
import { db } from "@/app/lib/db";
import { WebcamFeed } from "@/app/components/WebcamFeed";

interface InterviewSession {
  sessionId: string;
  question: string;
  isCompleted: boolean;
  messages: Message[];
}

interface Message {
  timestamp: string;
  type: string;
  question: string | null;
  answer: string | null;
}

export default function InterviewerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Job interview");
  const [position, setPosition] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showEmotionDetection, setShowEmotionDetection] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
  const [emotionReport, setEmotionReport] = useState<any>(null);

  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Marketing Specialist",
    "Sales Representative",
    "Human Resources",
    "Financial Analyst",
  ];

  const interviewTypes = [
    {
      id: "technical",
      title: "Technical Interview",
      description:
        "Practice technical questions for software development, data science, and other technical roles",
      icon: <Zap className="h-6 w-6 text-black" />,
      duration: "30-45 min",
      color: "bg-lime-100 border-lime-200",
      topic: "Technical job interview",
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description:
        "Practice common behavioral questions to showcase your soft skills and past experiences",
      icon: <MessageSquare className="h-6 w-6 text-black" />,
      duration: "20-30 min",
      color: "bg-lime-100 border-lime-200",
      topic: "Behavioral job interview questions and soft skills assessment",
    },
    {
      id: "rolespecific",
      title: "Role-Specific Interview",
      description:
        "Tailored interview practice for specific job roles like marketing, finance, or management",
      icon: <Briefcase className="h-6 w-6 text-black" />,
      duration: "25-40 min",
      color: "bg-lime-100 border-lime-200",
      topic:
        "Job interview for specific roles including marketing, finance, or management positions",
    },
  ];

  // Kiểm tra cấu hình API khi component load
  useEffect(() => {
    setApiConfigured(isApiConfigured());
  }, []);

  useEffect(() => {
    const checkActiveSession = () => {
      // Kiểm tra xem có phiên phỏng vấn đang hoạt động từ cookie không
      const currentSession = db.getCurrentSessionFromCookie();
      if (currentSession && !currentSession.isCompleted) {
        console.log(
          "Restoring interview session from cookie:",
          currentSession.sessionId
        );

        // Tự động khôi phục phiên
        setSession({
          sessionId: currentSession.sessionId,
          question:
            currentSession.questions[currentSession.questions.length - 1],
          isCompleted: currentSession.isCompleted,
          messages: [], // Phần messages có thể được khôi phục từ câu hỏi và câu trả lời
        });

        // Khôi phục thông tin người dùng
        setName(currentSession.name);
        setPosition(currentSession.position);
      }
    };

    checkActiveSession();
  }, []);

  const startInterview = async (type: string) => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!position.trim()) {
      alert("Please select a position for the interview");
      return;
    }

    setSelectedType(type);
    setLoading(true);
    setErrorMessage(null);

    try {
      // Tìm đối tượng interview type từ id
      const selectedInterview = interviewTypes.find((t) => t.id === type);
      const interviewTopic = selectedInterview
        ? selectedInterview.topic
        : "Job interview";

      // Kết hợp chủ đề phỏng vấn với vị trí đã chọn
      const fullTopic = `${interviewTopic} for ${position} position`;

      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          interview_topic: fullTopic,
          position: position,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not start the interview");
      }

      // Kiểm tra dữ liệu trả về
      if (!data.session_id || !data.question) {
        throw new Error("Invalid response data");
      }

      // Hiển thị thông báo nếu đang sử dụng câu hỏi dự phòng
      if (data.is_fallback) {
        console.warn("Using fallback question due to API issues");
      }

      setSession({
        sessionId: data.session_id,
        question: data.question,
        isCompleted: data.is_completed || false,
        messages: [],
      });
    } catch (error: any) {
      console.error("Error starting interview:", error);
      setErrorMessage(
        error.message || "An error occurred when starting the interview"
      );
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!session || !answer.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      console.log("Sending answer:", {
        session_id: session.sessionId,
        answer_length: answer.length,
      });

      const response = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session.sessionId,
          answer: answer,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("API error:", responseData);
        throw new Error(responseData.message || "Could not send answer");
      }

      console.log("API response:", responseData);

      // Kiểm tra dữ liệu trả về
      if (!responseData.question) {
        throw new Error("Invalid next question");
      }

      // Hiển thị thông báo nếu đang sử dụng câu hỏi dự phòng
      if (responseData.is_fallback) {
        console.warn("Using fallback question due to API issues");
      }

      // Thêm câu hỏi và câu trả lời vào messages
      const newMessage: Message = {
        timestamp: new Date().toISOString(),
        type: "next_question",
        question: session.question,
        answer: answer,
      };

      setSession({
        ...session,
        question: responseData.question,
        isCompleted: responseData.is_completed,
        messages: [...session.messages, newMessage],
      });

      setAnswer("");

      // Nếu phỏng vấn kết thúc, tải transcript
      if (responseData.is_completed) {
        loadTranscript();
      }
    } catch (error: any) {
      console.error("Error sending answer:", error);
      setErrorMessage(error.message || "Unknown error when sending answer");
    } finally {
      setLoading(false);
    }
  };

  const loadTranscript = async () => {
    if (!session) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/interview/transcript/${session.sessionId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải bảng điểm");
      }

      const data = await response.json();

      // Kiểm tra dữ liệu trả về
      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error("Dữ liệu bảng điểm không hợp lệ");
      }

      setSession({
        ...session,
        messages: data.messages,
      });

      setShowTranscript(true);
    } catch (error: any) {
      console.error("Lỗi khi tải bảng điểm:", error);
      setErrorMessage(error.message || "Lỗi không xác định khi tải bảng điểm");
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setSession(null);
    setAnswer("");
    setSelectedType(null);
    setShowTranscript(false);
    setErrorMessage(null);
    setUseVoiceMode(false);
  };

  // Hiển thị trang chọn loại phỏng vấn
  if (!session) {
    return (
      <DashboardShell activeNavItem="interviewer" userRole="employee">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">
              AI Interviewer
            </h1>
            <p className="text-gray-500 mt-1">
              Practice interviews with AI and get feedback
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Practice Makes Perfect</h2>
                <p className="text-gray-500">
                  Enter your name and select interview type
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
              />

              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select position for interview
                </label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-300 focus:ring focus:ring-lime-200 focus:ring-opacity-50 p-2.5 border"
                >
                  <option value="">-- Select position --</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Voice Interview
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable this feature to use voice instead of text input
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={useVoiceMode}
                    onCheckedChange={setUseVoiceMode}
                    id="voice-mode"
                  />
                  {useVoiceMode ? (
                    <Mic className="h-5 w-5 text-lime-600" />
                  ) : (
                    <MicOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Show Camera
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable webcam to see yourself during the interview
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showWebcam}
                    onCheckedChange={setShowWebcam}
                    id="webcam-mode"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Emotion Analysis
                  </label>
                  <p className="text-xs text-gray-500">
                    Get real-time feedback on your emotional expressions
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showEmotionDetection}
                    onCheckedChange={setShowEmotionDetection}
                    id="emotion-mode"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {interviewTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-6 transition-all hover:shadow-md ${type.color} hover:scale-[1.02] duration-200`}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                        {type.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {type.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{type.duration}</span>
                      </div>
                      <Button
                        onClick={() => startInterview(type.id)}
                        className="bg-black hover:bg-gray-800 text-lime-300"
                        disabled={loading}
                      >
                        {loading && selectedType === type.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold">How It Works</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                  <span className="font-bold text-black">1</span>
                </div>
                <h4 className="font-medium mb-2">Choose Interview Type</h4>
                <p className="text-sm text-gray-500">
                  Select the type of interview you want to practice
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                  <span className="font-bold text-black">2</span>
                </div>
                <h4 className="font-medium mb-2">Answer Questions</h4>
                <p className="text-sm text-gray-500">
                  Respond to AI-generated interview questions
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                  <span className="font-bold text-black">3</span>
                </div>
                <h4 className="font-medium mb-2">Get Feedback</h4>
                <p className="text-sm text-gray-500">
                  Receive detailed feedback and improvement suggestions
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Hiển thị trang phỏng vấn
  if (session && !showTranscript) {
    return (
      <DashboardShell activeNavItem="interviewer" userRole="employee">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetInterview}
                className="text-gray-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-bold">AI Interview</h1>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-500">
                {selectedType &&
                  interviewTypes.find((t) => t.id === selectedType)?.title}
              </div>
              <div className="text-sm font-medium text-lime-600">
                Position: {position}
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Centered larger camera when user enables Show Camera */}
            {showWebcam && !useVoiceMode && (
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-3xl h-[420px]">
                  <WebcamFeed
                    enabled={true}
                    showFaceDetection={true}
                    showEmotionDetection={showEmotionDetection}
                    sessionId={session.sessionId}
                    onFaceDetected={(detected) => setFaceDetected(detected)}
                    onEmotionDetected={(emotion) => setCurrentEmotion(emotion)}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Main interview area */}
            <div className="w-full">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 min-h-[500px] flex flex-col">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">An error occurred</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex-grow">
                  <Card className="bg-gray-50 p-4 mb-6">
                    <p className="text-gray-800 font-medium">
                      {session.question}
                    </p>
                  </Card>

                  {session.messages.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        Interview history:
                      </h3>
                      <div className="max-h-60 overflow-y-auto space-y-3">
                        {session.messages.map((msg, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="bg-lime-50 p-3 rounded-md">
                              <p className="text-sm font-medium">
                                {msg.question}
                              </p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md">
                              <p className="text-sm">{msg.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  {!session.isCompleted ? (
                    useVoiceMode ? (
                      <div className="mb-4">
                        <div className="bg-lime-50 p-3 rounded-lg mb-3 flex items-center">
                          <Mic className="h-5 w-5 text-lime-600 mr-2" />
                          <p className="text-sm">
                            Voice interview mode is activated
                          </p>
                        </div>

                        <VoiceInterviewInterface
                          sessionId={session.sessionId}
                          initialMessage={session.question}
                          showWebcam={showWebcam}
                          showEmotionDetection={showEmotionDetection}
                          onSessionComplete={() => {
                            if (session) {
                              setSession({ ...session, isCompleted: true });
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Textarea
                          placeholder="Enter your answer..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="min-h-[120px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={submitAnswer}
                            disabled={loading || !answer.trim()}
                            className="bg-black hover:bg-gray-800 text-lime-300"
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            Submit Answer
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Type "stop" or "end" to finish the interview
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center">
                      <h2 className="text-xl font-medium mb-4">
                        Interview Completed!
                      </h2>
                      <Button onClick={loadTranscript}>View Transcript</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Hiển thị bảng điểm
  return (
    <DashboardShell activeNavItem="interviewer" userRole="employee">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetInterview}
              className="text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Interview Transcript</h1>
          </div>
          <div className="text-sm font-medium text-lime-600">
            Position: {position}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Thank you for completing the interview!
            </h2>
            <p className="text-gray-500">
              Below is the transcript of your interview for {position}
            </p>
          </div>

          <div className="space-y-6">
            {session.messages
              .filter(
                (msg) =>
                  msg.type === "next_question" && msg.question && msg.answer
              )
              .map((msg, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Question:</p>
                    <p className="font-medium">{msg.question}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your answer:</p>
                    <p>{msg.answer}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={resetInterview}>Start New Interview</Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
