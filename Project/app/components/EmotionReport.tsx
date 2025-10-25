"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface EmotionReportProps {
  sessionId: string;
  onClose?: () => void;
}

interface ReportData {
  session_summary: {
    session_id: string;
    created_at: string;
    frames_analyzed: number;
    duration: string;
    performance_score: {
      score: number;
      rating: string;
      color: string;
    };
  };
  emotion_analysis: {
    total_frames: number;
    average_score: number;
    min_score: number;
    max_score: number;
    emotion_distribution: Record<string, number>;
    positive_ratio: number;
    dominant_emotion: string;
    recent_trend: string;
  };
  recommendations: Array<{
    type: string;
    category: string;
    message: string;
    priority: string;
  }>;
}

export function EmotionReport({ sessionId, onClose }: EmotionReportProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/interview/emotion/report/${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch emotion report");
      }

      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("Error fetching emotion report:", err);
      setError(err.message || "Failed to load emotion report");
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating emotion report...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !reportData) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            {error || "No report data available"}
          </p>
          <Button onClick={fetchReport} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { session_summary, emotion_analysis, recommendations } = reportData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emotion Analysis Report</h2>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        )}
      </div>

      {/* Overall Performance Score */}
      <Card className="border-2 border-lime-200 bg-lime-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-lime-600" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <div className="text-6xl font-bold text-lime-600 mb-2">
                {session_summary.performance_score.score}
              </div>
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 bg-${session_summary.performance_score.color}-100 border-${session_summary.performance_score.color}-300`}
              >
                {session_summary.performance_score.rating}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {session_summary.frames_analyzed}
                </div>
                <div className="text-sm text-gray-600">Frames Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {session_summary.duration}
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(emotion_analysis.positive_ratio * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Positive Emotions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emotion Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="font-semibold">
                  {emotion_analysis.average_score.toFixed(1)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-lime-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(emotion_analysis.average_score, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Minimum:</span>
                <span className="font-semibold ml-2">
                  {emotion_analysis.min_score.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Maximum:</span>
                <span className="font-semibold ml-2">
                  {emotion_analysis.max_score.toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4 py-4">
              {getTrendIcon(emotion_analysis.recent_trend)}
              <div>
                <div className="text-2xl font-bold capitalize">
                  {emotion_analysis.recent_trend}
                </div>
                <div className="text-sm text-gray-600">
                  Your emotional state throughout the interview
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Emotion Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(emotion_analysis.emotion_distribution)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, percentage]) => (
                <div key={emotion}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{emotion}</span>
                    <span className="text-sm text-gray-600">
                      {(percentage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        ["Happy", "Neutral", "Surprise"].includes(emotion)
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${percentage * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-gray-600" />
              <span className="text-sm">
                <strong>Dominant Emotion:</strong>{" "}
                {emotion_analysis.dominant_emotion}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === "success"
                    ? "bg-green-50 border-green-500"
                    : rec.type === "warning"
                    ? "bg-orange-50 border-orange-500"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getTypeIcon(rec.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">
                        {rec.category}
                      </span>
                      <Badge variant={getPriorityColor(rec.priority) as any}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={fetchReport} variant="outline">
          Refresh Report
        </Button>
        {onClose && (
          <Button onClick={onClose} className="bg-lime-600 hover:bg-lime-700">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
