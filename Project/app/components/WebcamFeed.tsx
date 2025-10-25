"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import * as faceDetection from "@tensorflow-models/face-detection";
import * as tf from "@tensorflow/tfjs";

interface EmotionData {
  dominant_emotion: string;
  confidence: number;
  emotion_score: number;
  emotions: Record<string, number>;
  is_positive: boolean;
}

interface WebcamFeedProps {
  enabled?: boolean;
  showFaceDetection?: boolean;
  showEmotionDetection?: boolean;
  sessionId?: string;
  onFaceDetected?: (detected: boolean) => void;
  onEmotionDetected?: (emotion: EmotionData | null) => void;
  className?: string;
}

export function WebcamFeed({
  enabled = true,
  showFaceDetection = true,
  showEmotionDetection = false,
  sessionId,
  onFaceDetected,
  onEmotionDetected,
  className = "",
}: WebcamFeedProps) {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isFaceDetectionActive, setIsFaceDetectionActive] = useState(false);
  const [isEmotionDetectionActive, setIsEmotionDetectionActive] =
    useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(
    null
  );
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [averageEmotionScore, setAverageEmotionScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [emotionApiAvailable, setEmotionApiAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const faceDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emotionDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveFaceDetections = useRef<number>(0);
  const consecutiveNoFaceDetections = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Capture frame for emotion analysis
  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== 4) return null;

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  // Analyze emotion from current frame
  const analyzeEmotion = async () => {
    if (!isEmotionDetectionActive || !isWebcamActive || !faceDetected) return;

    try {
      const frameData = captureFrame();

      if (!frameData) return;

      // Send frame to emotion detection API
      const response = await fetch("/api/interview/emotion/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: frameData,
          session_id: sessionId,
        }),
      });

      // Check if API is available
      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn(
            "Emotion detection API not available. Please start the Python service."
          );
          setEmotionApiAvailable(false);
          // Don't show error to user, just skip this analysis
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      // API is available
      setEmotionApiAvailable(true);

      const data = await response.json();

      if (data.success && data.data.faces && data.data.faces.length > 0) {
        const faceData = data.data.faces[0];
        const emotionData: EmotionData = {
          dominant_emotion: faceData.dominant_emotion,
          confidence: faceData.confidence,
          emotion_score: faceData.emotion_score,
          emotions: faceData.emotions,
          is_positive: faceData.is_positive,
        };

        setCurrentEmotion(emotionData);

        // Add to history
        setEmotionHistory((prev) => {
          const updated = [...prev, emotionData];
          // Keep last 50 emotions
          return updated.slice(-50);
        });

        // Calculate average score using current history
        const allScores = [...emotionHistory, emotionData].map(
          (e) => e.emotion_score
        );
        const avgScore =
          allScores.reduce((a, b) => a + b, 0) / allScores.length;
        setAverageEmotionScore(avgScore);

        // Notify parent component
        if (onEmotionDetected) {
          onEmotionDetected(emotionData);
        }
      }
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      // Don't set error state to avoid disrupting the interview
    }
  };

  // Start emotion detection interval
  useEffect(() => {
    if (
      isEmotionDetectionActive &&
      isWebcamActive &&
      faceDetected &&
      showEmotionDetection
    ) {
      // Analyze emotion every 2 seconds
      const intervalId = setInterval(analyzeEmotion, 2000);
      emotionDetectionIntervalRef.current = intervalId;

      // Run first analysis immediately
      analyzeEmotion();

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    } else {
      // Clear interval if conditions are not met
      if (emotionDetectionIntervalRef.current) {
        clearInterval(emotionDetectionIntervalRef.current);
        emotionDetectionIntervalRef.current = null;
      }
    }
  }, [
    isEmotionDetectionActive,
    isWebcamActive,
    faceDetected,
    showEmotionDetection,
  ]);

  // Prevent zoom on the video container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Add event listeners
    container.addEventListener("gesturestart", preventDefault);
    container.addEventListener("gesturechange", preventDefault);
    container.addEventListener("gestureend", preventDefault);
    container.addEventListener("touchmove", preventZoom, { passive: false });
    container.addEventListener("wheel", preventWheel, { passive: false });

    return () => {
      container.removeEventListener("gesturestart", preventDefault);
      container.removeEventListener("gesturechange", preventDefault);
      container.removeEventListener("gestureend", preventDefault);
      container.removeEventListener("touchmove", preventZoom);
      container.removeEventListener("wheel", preventWheel);
    };
  }, []);

  // Initialize TensorFlow.js and load face detection model
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        setIsLoading(true);

        // Set TensorFlow backend
        await tf.ready();
        console.log("TensorFlow.js initialized");

        // Load the MediaPipe face detection model
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig =
          {
            runtime: "tfjs",
            maxFaces: 1,
            modelType: "short",
          };

        detectorRef.current = await faceDetection.createDetector(
          model,
          detectorConfig
        );

        setModelLoaded(true);
        console.log("Face detection model loaded");
      } catch (err) {
        console.error("Error loading TensorFlow model:", err);
        setError("Could not load face detection model");
      } finally {
        setIsLoading(false);
      }
    };

    if (showFaceDetection && enabled) {
      initializeTensorFlow();
    }

    return () => {
      // Cleanup
      if (detectorRef.current) {
        detectorRef.current = null;
      }
    };
  }, [showFaceDetection, enabled]);

  // Start webcam
  const startWebcam = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsWebcamActive(true);
          setIsLoading(false);

          // Start face detection if enabled
          if (showFaceDetection && modelLoaded && detectorRef.current) {
            setIsFaceDetectionActive(true);
            detectFaces();
          }

          // Start emotion detection if enabled
          if (showEmotionDetection) {
            setIsEmotionDetectionActive(true);
          }
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError(
        "Could not access webcam. Please check your permissions and ensure no other application is using the camera."
      );
      setIsLoading(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (faceDetectionTimeoutRef.current) {
      clearTimeout(faceDetectionTimeoutRef.current);
      faceDetectionTimeoutRef.current = null;
    }

    // Reset detection counters
    consecutiveFaceDetections.current = 0;
    consecutiveNoFaceDetections.current = 0;

    setIsWebcamActive(false);
    setIsFaceDetectionActive(false);
    setIsEmotionDetectionActive(false);
    setFaceDetected(false);
    setCurrentEmotion(null);
  };

  // Face detection loop
  const detectFaces = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !detectorRef.current ||
      !isFaceDetectionActive
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Detect faces
      const faces = await detectorRef.current.estimateFaces(video);

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hasFace = faces.length > 0;

      // Implement debounce logic - require 3 consecutive detections to change state
      if (hasFace) {
        consecutiveFaceDetections.current++;
        consecutiveNoFaceDetections.current = 0;

        // Only update to "face detected" after 3 consecutive detections
        if (consecutiveFaceDetections.current >= 3 && !faceDetected) {
          setFaceDetected(true);
          if (onFaceDetected) {
            onFaceDetected(true);
          }
        }
      } else {
        consecutiveNoFaceDetections.current++;
        consecutiveFaceDetections.current = 0;

        // Only update to "no face detected" after 5 consecutive non-detections
        if (consecutiveNoFaceDetections.current >= 5 && faceDetected) {
          setFaceDetected(false);
          if (onFaceDetected) {
            onFaceDetected(false);
          }
        }
      }

      // Draw bounding boxes around detected faces
      if (hasFace) {
        faces.forEach((face) => {
          const box = face.box;

          // Draw rectangle
          ctx.strokeStyle = "#84cc16"; // lime-500
          ctx.lineWidth = 3;
          ctx.strokeRect(box.xMin, box.yMin, box.width, box.height);

          // Draw label
          ctx.fillStyle = "#84cc16";
          ctx.font = "16px sans-serif";
          ctx.fillText("Face Detected", box.xMin, box.yMin - 10);

          // Draw keypoints if available
          if (face.keypoints) {
            face.keypoints.forEach((keypoint) => {
              ctx.fillStyle = "#facc15"; // yellow-400
              ctx.beginPath();
              ctx.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
              ctx.fill();
            });
          }
        });
      } else {
        // Display "No face detected" message
        ctx.fillStyle = "#ef4444"; // red-500
        ctx.font = "20px sans-serif";
        ctx.fillText(
          "No face detected",
          canvas.width / 2 - 80,
          canvas.height / 2
        );
      }
    } catch (err) {
      console.error("Error during face detection:", err);
    }

    // Continue detection loop
    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  // Toggle face detection
  const toggleFaceDetection = () => {
    if (isFaceDetectionActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setIsFaceDetectionActive(false);

      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } else if (modelLoaded && detectorRef.current) {
      setIsFaceDetectionActive(true);
      detectFaces();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Card
      className={`overflow-hidden ${className}`}
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      <CardContent className="p-4">
        <div className="space-y-4" style={{ touchAction: "pan-y" }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-sm">Interview Camera</h3>
            </div>
            <div className="flex items-center gap-2">
              {isWebcamActive && faceDetected && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Face Detected
                </Badge>
              )}
            </div>
          </div>

          {/* Video container */}
          <div
            ref={containerRef}
            className="webcam-container-fixed relative bg-gray-900 rounded-lg overflow-hidden aspect-video touch-none select-none"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              touchAction: "none",
              WebkitTouchCallout: "none",
            }}
          >
            {!isWebcamActive && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                <div className="text-center text-gray-400 mb-4">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera is off</p>
                </div>
                <Button
                  onClick={startWebcam}
                  disabled={isLoading}
                  size="lg"
                  className="bg-lime-500 hover:bg-lime-600 text-black"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera
                </Button>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Video element */}
            <video
              ref={videoRef}
              className={`webcam-video-fixed w-full h-full object-cover touch-none ${
                !isWebcamActive ? "hidden" : ""
              }`}
              autoPlay
              playsInline
              muted
              style={{
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                willChange: "auto",
              }}
            />

            {/* Canvas for face detection overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute top-0 left-0 w-full h-full pointer-events-none ${
                !isFaceDetectionActive ? "hidden" : ""
              }`}
              style={{ zIndex: 1 }}
            />

            {/* Camera control overlay - appears when camera is active */}
            {isWebcamActive && (
              <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3"
                style={{ zIndex: 20 }}
              >
                <Button
                  onClick={stopWebcam}
                  disabled={isLoading}
                  size="sm"
                  variant="destructive"
                  className="shadow-lg"
                >
                  <CameraOff className="h-4 w-4 mr-1" />
                  Stop Camera
                </Button>

                {showFaceDetection && modelLoaded && (
                  <Button
                    onClick={toggleFaceDetection}
                    disabled={isLoading}
                    size="sm"
                    variant="secondary"
                    className="shadow-lg"
                  >
                    {isFaceDetectionActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide Detection
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Show Detection
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Position Yourself badge overlay */}
            {isWebcamActive && !faceDetected && isFaceDetectionActive && (
              <div className="absolute top-4 right-4" style={{ zIndex: 20 }}>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 shadow-lg"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Position Yourself
                </Badge>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          {isWebcamActive && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Tips for best results:</p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>Ensure good lighting on your face</li>
                <li>Position yourself in the center of the frame</li>
                <li>Maintain eye contact with the camera</li>
                <li>Keep a professional background</li>
              </ul>
            </div>
          )}

          {/* Emotion Analysis Display */}
          {showEmotionDetection && isWebcamActive && !emotionApiAvailable && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-orange-900 mb-1">
                    Emotion Detection Service Not Running
                  </h4>
                  <p className="text-xs text-orange-800 mb-2">
                    The Python emotion detection service is not available. To enable this feature:
                  </p>
                  <ol className="text-xs text-orange-800 space-y-1 ml-4 list-decimal">
                    <li>Open a terminal and run: <code className="bg-orange-100 px-1 py-0.5 rounded">cd python_services</code></li>
                    <li>Start the service: <code className="bg-orange-100 px-1 py-0.5 rounded">python emotion_api.py</code></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {showEmotionDetection && isWebcamActive && currentEmotion && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  {currentEmotion.is_positive ? (
                    <Smile className="h-4 w-4 text-green-600" />
                  ) : (
                    <Frown className="h-4 w-4 text-orange-600" />
                  )}
                  Current Emotion
                </h4>
                <Badge
                  variant="outline"
                  className={`${
                    currentEmotion.is_positive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {currentEmotion.dominant_emotion}
                </Badge>
              </div>

              {/* Emotion Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Emotion Score</span>
                  <span className="font-semibold">
                    {currentEmotion.emotion_score.toFixed(1)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentEmotion.emotion_score >= 70
                        ? "bg-green-500"
                        : currentEmotion.emotion_score >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(currentEmotion.emotion_score, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Average Score */}
              {emotionHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-semibold">
                      {averageEmotionScore.toFixed(1)}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        averageEmotionScore >= 70
                          ? "bg-lime-500"
                          : averageEmotionScore >= 50
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: `${Math.min(averageEmotionScore, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Emotion Distribution */}
              <div className="space-y-1">
                <span className="text-xs text-gray-600">
                  Emotion Confidence
                </span>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(currentEmotion.emotions)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([emotion, probability]) => (
                      <div
                        key={emotion}
                        className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                      >
                        <span className="text-gray-700">{emotion}</span>
                        <span className="font-medium">
                          {(probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Frames Analyzed */}
              <div className="text-xs text-gray-500 text-center">
                {emotionHistory.length} frames analyzed
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
