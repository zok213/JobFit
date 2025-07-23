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
  Download,
  Camera,
  MessageSquare,
  Info,
  Settings,
  HelpCircle,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI interviewer today. I'll be asking you some questions about your experience with React development. Are you ready to begin?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMicrophone = async () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = async () => {
    setIsCameraOn(!isCameraOn);
    
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-13rem)] max-h-[800px]">
      {/* Main chat section */}
      <div className="col-span-1 md:col-span-2 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-lime-300 rounded-t-lg">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-black" />
          </div>
          <div>
              <h3 className="font-semibold text-black">AI Interviewer</h3>
              <p className="text-xs text-gray-700">Technical Interview Session</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="bg-white text-black hover:bg-gray-100 transition-all shadow-sm" 
            onClick={() => router.push("/interviewer")}
            aria-label="End interview session"
          >
          End Interview
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-black text-lime-300 rounded-tr-none"
                      : "bg-white border border-gray-200 shadow-sm rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === "ai" ? (
                      <Avatar className="h-6 w-6 bg-lime-300">
                        <MessageSquare className="h-3 w-3 text-black" />
                      </Avatar>
                    ) : (
                      <Avatar className="h-6 w-6 bg-black border border-lime-300">
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
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
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
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          {transcript && (
            <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-600">
              <p className="font-medium text-xs text-gray-500 mb-1">Speech Recognition:</p>
              {transcript}
            </div>
          )}
          <div className="flex items-end gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
              placeholder="Type your response or use the microphone..."
              className="min-h-[60px] flex-1 resize-none border-gray-200 focus:border-lime-300 focus:ring-lime-300"
              aria-label="Your message"
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleMicrophone}
                variant="outline"
                size="icon"
                className={`rounded-full w-10 h-10 ${
                  isMicOn ? "bg-lime-300 text-black border-0" : "bg-white hover:bg-gray-50 hover:border-gray-300"
                } transition-all`}
                aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
                size="icon"
                className="rounded-full w-10 h-10 bg-black text-lime-300 hover:bg-gray-800 transition-all shadow-sm"
            aria-label="Send message"
          >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video & Options Section */}
      <div className="col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* Video feed */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 border-b border-gray-200 bg-gray-900 rounded-t-lg relative">
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg text-center p-6">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Camera is turned off</h3>
              <p className="text-gray-400 text-sm mb-4">
                Turn on your camera for the interviewer to see you
              </p>
              <Button
                onClick={toggleCamera}
                className="bg-lime-300 text-black hover:bg-lime-200"
              >
                Turn on Camera
              </Button>
            </div>
          )}
          
          {/* Camera controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              onClick={toggleCamera}
              variant="outline"
              size="sm"
              className={`rounded-full w-10 h-10 p-0 ${
                isCameraOn 
                  ? "bg-white text-black hover:bg-gray-100"
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
              className={`rounded-full w-10 h-10 p-0 ${
                isMicOn 
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Options panel */}
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-black">Interview Options</h3>
            <Badge variant="outline" className="bg-lime-50 text-black">
              In Progress
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            <Button variant="outline" className="w-full justify-start text-gray-700" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Interview Information
            </Button>
            <Button variant="outline" className="w-full justify-start text-gray-700" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-gray-700" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Tips
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-700" 
              size="sm"
              onClick={downloadTranscript}
            >
              <Download className="h-4 w-4 mr-2" />
              Save Transcript
          </Button>
          </div>
          
          <Card className="bg-lime-50 border-lime-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-gray-700" />
                <h4 className="font-medium">Interview Duration</h4>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Started at:</span>
                <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Duration:</span>
                <span className="font-medium">00:15:42</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 