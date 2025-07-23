"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  User,
  AlertCircle,
  Download,
  Loader2,
  Camera,
  PauseCircle,
  MessageSquare,
  Info,
  CheckCircle,
  Clock,
  ThumbsUp,
  Award,
  PieChart,
  Volume2,
  Users,
  BarChart3,
  VolumeX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export function EnhancedChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI interviewer today. I'll be asking you questions about your experience and skills. Please turn on your camera and microphone when you're ready to begin.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [confidenceScore, setConfidenceScore] = useState(65);
  const [showTips, setShowTips] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState({
    pace: 70,
    clarity: 80,
    engagement: 75,
    techAccuracy: 85
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition with proper hydration handling
  useEffect(() => {
    // Only run this on client side to prevent hydration mismatch
    let SpeechRecognition: any = null;
    
    // Delay the initialization slightly to ensure client-side only execution
    const initSpeechRecognition = () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          speechRecognitionRef.current = new SpeechRecognition();
          speechRecognitionRef.current.continuous = true;
          speechRecognitionRef.current.interimResults = true;
          
          speechRecognitionRef.current.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join("");
            setTranscript(transcript);
            setInputValue(transcript);
            
            // Update confidence metrics randomly to simulate real-time analysis
            if (isMicOn) {
              setCurrentFeedback(prev => ({
                pace: Math.min(100, prev.pace + (Math.random() > 0.5 ? 1 : -1)),
                clarity: Math.min(100, prev.clarity + (Math.random() > 0.5 ? 1 : -1)),
                engagement: Math.min(100, prev.engagement + (Math.random() > 0.5 ? 1 : -1)),
                techAccuracy: Math.min(100, prev.techAccuracy + (Math.random() > 0.5 ? 1 : -1))
              }));
              
              setConfidenceScore(prev => 
                Math.min(100, Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)))
              );
            }
          };
        }
      }
    };
    
    // Use a timeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      initSpeechRecognition();
    }, 100);
      
    return () => {
      clearTimeout(timer);
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMicOn]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setTranscript("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's interesting! Can you tell me more about a challenging project you worked on?",
        "How do you approach problem-solving when facing technical difficulties?",
        "Could you describe your experience with state management in React?",
        "What do you think sets you apart from other candidates for this position?",
        "How do you stay updated with the latest developments in web technologies?",
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Update confidence score with a small boost after answering
      setConfidenceScore(prev => 
        Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5)))
      );
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMicrophone = async () => {
    if (isMicOn) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsMicOn(false);
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(prevStream => {
          if (prevStream) {
            const videoTracks = prevStream.getVideoTracks();
            return new MediaStream([...videoTracks, ...stream.getAudioTracks()]);
          }
          return stream;
        });
        
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.start();
          setIsRecording(true);
        }
        
        setIsMicOn(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Unable to access microphone. Please check your device permissions.");
      }
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (mediaStream) {
        const videoTracks = mediaStream.getVideoTracks();
        videoTracks.forEach(track => track.stop());
        
        const newStream = new MediaStream(
          mediaStream.getTracks().filter(track => track.kind !== 'video')
        );
        setMediaStream(newStream);
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setMediaStream(prevStream => {
          if (prevStream) {
            const audioTracks = prevStream.getAudioTracks();
            return new MediaStream([...audioTracks, ...stream.getVideoTracks()]);
          }
          return stream;
        });
        
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Unable to access camera. Please check your device permissions.");
      }
    }
  };

  const downloadTranscript = () => {
    const text = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender === 'ai' ? 'AI Interviewer' : 'You'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-lime-400";
    if (value >= 40) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-13rem)] max-h-[800px]">
      {/* Video & Analysis Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden"
      >
        {/* Video feed */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 border-b border-gray-200 bg-gray-900 rounded-t-lg relative overflow-hidden">
          {isCameraOn ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full relative"
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Overlay for confidence score */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-full p-2 flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#333" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#c1fa7e" 
                      strokeWidth="3" 
                      strokeDasharray={`${confidenceScore} 100`}
                      strokeLinecap="round"
                      className="drop-shadow-glow"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{confidenceScore}%</span>
                  </div>
                </div>
                <span className="text-xs text-white font-medium">Confidence</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg text-center p-6"
            >
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Camera is turned off</h3>
              <p className="text-gray-400 text-sm mb-4">
                Turn on your camera for the interviewer to see you
              </p>
              <Button
                onClick={toggleCamera}
                className="bg-lime-300 text-black hover:bg-lime-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Turn on Camera
              </Button>
            </motion.div>
          )}
          
          {/* Camera controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
          >
            <Button
              onClick={toggleCamera}
              variant="outline"
              size="sm"
              className={`rounded-full w-10 h-10 p-0 transition-all duration-300 ${
                isCameraOn 
                  ? "bg-white text-black hover:bg-gray-100 shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button
              onClick={toggleMicrophone}
              variant="outline"
              size="sm"
              className={`rounded-full w-10 h-10 p-0 transition-all duration-300 ${
                isMicOn 
                  ? "bg-white text-black hover:bg-gray-100 shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
        
        {/* Analysis panel */}
        <div className="p-4 space-y-4 overflow-auto flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black">Interview Analysis</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => setShowTips(!showTips)}
            >
              <Info className="h-3.5 w-3.5 mr-1" />
              {showTips ? "Hide Tips" : "Show Tips"}
            </Button>
          </div>
          
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-lime-50 border border-lime-200 rounded-lg p-3 text-sm"
              >
                <h4 className="font-medium text-black mb-2 flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1 text-lime-600" />
                  Interview Tips
                </h4>
                <ul className="text-xs space-y-1.5 text-gray-700">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                    <span>Use the STAR method for behavioral questions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain eye contact with the camera</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={isRecording ? "lime" : "outline"} className={isRecording ? "bg-lime-100 text-lime-800" : "bg-gray-50 text-gray-700"}>
                  {isRecording ? "Recording" : "Not Recording"}
                </Badge>
                {isRecording && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </Badge>
            </div>
            
            <Card className="p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-gray-700" />
                Voice Analysis
              </h4>
              
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Pace</span>
                    <span className="font-medium">{currentFeedback.pace}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFeedback.pace}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${getMetricColor(currentFeedback.pace)} rounded-full`}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Clarity</span>
                    <span className="font-medium">{currentFeedback.clarity}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFeedback.clarity}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${getMetricColor(currentFeedback.clarity)} rounded-full`}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{currentFeedback.engagement}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFeedback.engagement}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${getMetricColor(currentFeedback.engagement)} rounded-full`}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3 italic flex items-center">
                {isMicOn ? (
                  <>
                    <Volume2 className="h-3 w-3 mr-1 text-lime-600" />
                    <span>Voice detection is active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3 w-3 mr-1 text-gray-500" />
                    <span>Turn on your microphone for analysis</span>
                  </>
                )}
              </p>
            </Card>
            
            <Button
              onClick={downloadTranscript}
              variant="outline"
              className="w-full mt-2 transition-all duration-300 hover:bg-lime-50 hover:border-lime-300"
              disabled={messages.length <= 1}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main chat section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="col-span-1 md:col-span-2 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Chat header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-lime-300 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <MessageSquare className="h-5 w-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-black">AI Interviewer</h3>
              <p className="text-xs text-gray-700">Technical Interview Session</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:shadow-md" 
            onClick={() => router.push("/interviewer")}
          >
            End Interview
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-black text-lime-300 rounded-tr-none shadow-md"
                        : "bg-white border border-gray-200 shadow-sm rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "ai" ? (
                        <Avatar className="h-6 w-6 bg-lime-300 shadow-sm">
                          <MessageSquare className="h-3 w-3 text-black" />
                        </Avatar>
                      ) : (
                        <Avatar className="h-6 w-6 bg-black border border-lime-300 shadow-sm">
                          <User className="h-3 w-3 text-lime-300" />
                        </Avatar>
                      )}
                      <span className="text-xs font-medium">
                        {message.sender === "ai" ? "AI Interviewer" : "You"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${message.sender === "user" ? "text-lime-300" : "text-gray-800"}`}>
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200 shadow-sm rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 bg-lime-300">
                      <MessageSquare className="h-3 w-3 text-black" />
                    </Avatar>
                    <span className="text-xs font-medium">AI Interviewer</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 p-2 bg-lime-50 rounded border border-lime-200 text-sm text-gray-600"
              >
                <p className="font-medium text-xs text-gray-500 mb-1 flex items-center">
                  <Mic className="h-3 w-3 mr-1 text-lime-600" />
                  Speech Recognition:
                </p>
                {transcript}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-end gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response or use the microphone..."
              className="min-h-[60px] flex-1 resize-none border-gray-200 focus:border-lime-300 focus:ring-lime-300 shadow-sm transition-all duration-300"
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleMicrophone}
                variant="outline"
                size="icon"
                className={`rounded-full w-10 h-10 transition-all duration-300 hover:shadow-md ${
                  isMicOn ? "bg-lime-300 text-black border-0 shadow-md" : "bg-white"
                }`}
                aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="rounded-full w-10 h-10 bg-black text-lime-300 hover:bg-gray-800 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 

// Add this CSS to your global stylesheet or a local CSS module
// .drop-shadow-glow {
//   filter: drop-shadow(0 0 6px #c1fa7e);
// } 