"""
Flask API for Emotion Detection Service
Provides REST API endpoints for real-time emotion analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from emotion_detection import (
    EmotionDetector,
    decode_base64_image,
    encode_image_to_base64,
)
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize emotion detector
detector = EmotionDetector()

# Store session data (in production, use Redis or database)
session_data = {}


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "healthy",
            "service": "emotion-detection",
            "timestamp": datetime.now().isoformat(),
        }
    )


@app.route("/api/emotion/analyze", methods=["POST"])
def analyze_emotion():
    """
    Analyze emotion from a single frame

    Expected JSON body:
    {
        "image": "base64_encoded_image",
        "session_id": "optional_session_id"
    }

    Returns:
    {
        "success": true,
        "data": {
            "faces": [...],
            "timestamp": "...",
            ...
        }
    }
    """
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"success": False, "error": "Missing image data"}), 400

        # Decode image
        image_base64 = data["image"]
        frame = decode_base64_image(image_base64)

        if frame is None:
            return jsonify({"success": False, "error": "Failed to decode image"}), 400

        # Analyze frame
        results = detector.analyze_frame(frame)

        # Store in session if session_id provided
        session_id = data.get("session_id")
        if session_id:
            if session_id not in session_data:
                session_data[session_id] = {
                    "created_at": datetime.now().isoformat(),
                    "frames_analyzed": 0,
                    "emotion_history": [],
                }

            session_data[session_id]["frames_analyzed"] += 1
            session_data[session_id]["emotion_history"].append(
                {"timestamp": results["timestamp"], "faces": results["faces"]}
            )

        return jsonify({"success": True, "data": results})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/emotion/analyze-annotated", methods=["POST"])
def analyze_emotion_annotated():
    """
    Analyze emotion and return annotated image

    Expected JSON body:
    {
        "image": "base64_encoded_image",
        "session_id": "optional_session_id"
    }

    Returns:
    {
        "success": true,
        "data": {
            "analysis": {...},
            "annotated_image": "base64_encoded_annotated_image"
        }
    }
    """
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"success": False, "error": "Missing image data"}), 400

        # Decode image
        image_base64 = data["image"]
        frame = decode_base64_image(image_base64)

        if frame is None:
            return jsonify({"success": False, "error": "Failed to decode image"}), 400

        # Analyze frame
        results = detector.analyze_frame(frame)

        # Draw annotations
        annotated_frame = detector.draw_annotations(frame, results)

        # Encode annotated image
        annotated_base64 = encode_image_to_base64(annotated_frame)

        # Store in session if session_id provided
        session_id = data.get("session_id")
        if session_id:
            if session_id not in session_data:
                session_data[session_id] = {
                    "created_at": datetime.now().isoformat(),
                    "frames_analyzed": 0,
                    "emotion_history": [],
                }

            session_data[session_id]["frames_analyzed"] += 1
            session_data[session_id]["emotion_history"].append(
                {"timestamp": results["timestamp"], "faces": results["faces"]}
            )

        return jsonify(
            {
                "success": True,
                "data": {"analysis": results, "annotated_image": annotated_base64},
            }
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/emotion/statistics/<session_id>", methods=["GET"])
def get_session_statistics(session_id):
    """
    Get emotion statistics for a session

    Returns:
    {
        "success": true,
        "data": {
            "total_frames": 100,
            "average_score": 75.5,
            "emotion_distribution": {...},
            ...
        }
    }
    """
    try:
        if session_id not in session_data:
            return jsonify({"success": False, "error": "Session not found"}), 404

        # Get overall statistics from detector
        stats = detector.get_emotion_statistics()

        # Add session-specific data
        session = session_data[session_id]
        stats["session_info"] = {
            "session_id": session_id,
            "created_at": session["created_at"],
            "frames_analyzed": session["frames_analyzed"],
            "duration": _calculate_duration(session["created_at"]),
        }

        return jsonify({"success": True, "data": stats})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/emotion/session/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    """
    Delete session data and reset statistics

    Returns:
    {
        "success": true,
        "message": "Session deleted"
    }
    """
    try:
        if session_id in session_data:
            del session_data[session_id]

        # Reset detector statistics
        detector.reset_statistics()

        return jsonify({"success": True, "message": "Session deleted successfully"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/emotion/batch-analyze", methods=["POST"])
def batch_analyze():
    """
    Analyze multiple frames in batch

    Expected JSON body:
    {
        "images": ["base64_1", "base64_2", ...],
        "session_id": "optional_session_id"
    }

    Returns:
    {
        "success": true,
        "data": {
            "results": [...],
            "summary": {...}
        }
    }
    """
    try:
        data = request.get_json()

        if not data or "images" not in data:
            return jsonify({"success": False, "error": "Missing images data"}), 400

        images = data["images"]
        session_id = data.get("session_id")

        results = []

        for img_base64 in images:
            frame = decode_base64_image(img_base64)

            if frame is not None:
                analysis = detector.analyze_frame(frame)
                results.append(analysis)

        # Calculate summary statistics
        summary = _calculate_batch_summary(results)

        # Store in session
        if session_id:
            if session_id not in session_data:
                session_data[session_id] = {
                    "created_at": datetime.now().isoformat(),
                    "frames_analyzed": 0,
                    "emotion_history": [],
                }

            session_data[session_id]["frames_analyzed"] += len(results)
            for result in results:
                session_data[session_id]["emotion_history"].append(
                    {"timestamp": result["timestamp"], "faces": result["faces"]}
                )

        return jsonify(
            {"success": True, "data": {"results": results, "summary": summary}}
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/emotion/report/<session_id>", methods=["GET"])
def generate_report(session_id):
    """
    Generate comprehensive emotion report for interview session

    Returns:
    {
        "success": true,
        "data": {
            "session_summary": {...},
            "emotion_analysis": {...},
            "recommendations": [...]
        }
    }
    """
    try:
        if session_id not in session_data:
            return jsonify({"success": False, "error": "Session not found"}), 404

        session = session_data[session_id]
        stats = detector.get_emotion_statistics()

        # Generate recommendations
        recommendations = _generate_recommendations(stats)

        # Calculate overall performance score
        performance_score = _calculate_performance_score(stats)

        report = {
            "session_summary": {
                "session_id": session_id,
                "created_at": session["created_at"],
                "frames_analyzed": session["frames_analyzed"],
                "duration": _calculate_duration(session["created_at"]),
                "performance_score": performance_score,
            },
            "emotion_analysis": stats,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
        }

        return jsonify({"success": True, "data": report})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def _calculate_duration(created_at: str) -> str:
    """Calculate duration from created timestamp"""
    try:
        start = datetime.fromisoformat(created_at)
        duration = datetime.now() - start
        minutes = int(duration.total_seconds() / 60)
        seconds = int(duration.total_seconds() % 60)
        return f"{minutes}m {seconds}s"
    except:
        return "Unknown"


def _calculate_batch_summary(results: list) -> dict:
    """Calculate summary statistics from batch results"""
    if not results:
        return {}

    total_faces = sum(r["faces_detected"] for r in results)

    all_emotions = []
    all_scores = []

    for result in results:
        for face in result.get("faces", []):
            all_emotions.append(face["dominant_emotion"])
            all_scores.append(face["emotion_score"])

    return {
        "total_frames": len(results),
        "total_faces_detected": total_faces,
        "average_faces_per_frame": total_faces / len(results) if results else 0,
        "average_emotion_score": np.mean(all_scores) if all_scores else 0,
        "most_common_emotion": (
            max(set(all_emotions), key=all_emotions.count) if all_emotions else None
        ),
    }


def _generate_recommendations(stats: dict) -> list:
    """Generate recommendations based on emotion statistics"""
    recommendations = []

    avg_score = stats.get("average_score", 0)
    positive_ratio = stats.get("positive_ratio", 0)
    trend = stats.get("recent_trend", "stable")

    # Score-based recommendations
    if avg_score < 50:
        recommendations.append(
            {
                "type": "warning",
                "category": "Overall Performance",
                "message": "Your emotional expression could be more positive. Try to maintain a friendly and engaged demeanor.",
                "priority": "high",
            }
        )
    elif avg_score < 70:
        recommendations.append(
            {
                "type": "info",
                "category": "Overall Performance",
                "message": "Good emotional expression overall. Consider being slightly more expressive to show enthusiasm.",
                "priority": "medium",
            }
        )
    else:
        recommendations.append(
            {
                "type": "success",
                "category": "Overall Performance",
                "message": "Excellent emotional expression! You maintained a positive and professional demeanor.",
                "priority": "low",
            }
        )

    # Positive ratio recommendations
    if positive_ratio < 0.5:
        recommendations.append(
            {
                "type": "warning",
                "category": "Emotional Balance",
                "message": "Try to maintain more positive emotions during the interview. Practice relaxation techniques before interviews.",
                "priority": "high",
            }
        )
    elif positive_ratio < 0.7:
        recommendations.append(
            {
                "type": "info",
                "category": "Emotional Balance",
                "message": "Your emotional balance is decent. Focus on staying calm and confident.",
                "priority": "medium",
            }
        )

    # Trend-based recommendations
    if trend == "declining":
        recommendations.append(
            {
                "type": "warning",
                "category": "Energy Level",
                "message": "Your energy seems to be declining. Take short breaks during long interviews and stay hydrated.",
                "priority": "medium",
            }
        )
    elif trend == "improving":
        recommendations.append(
            {
                "type": "success",
                "category": "Energy Level",
                "message": "Great! Your confidence is growing throughout the interview.",
                "priority": "low",
            }
        )

    # Check for specific emotions
    emotion_dist = stats.get("emotion_distribution", {})

    if emotion_dist.get("Fear", 0) > 0.3:
        recommendations.append(
            {
                "type": "warning",
                "category": "Confidence",
                "message": "You show signs of nervousness. Practice mock interviews to build confidence.",
                "priority": "high",
            }
        )

    if emotion_dist.get("Angry", 0) > 0.2:
        recommendations.append(
            {
                "type": "warning",
                "category": "Composure",
                "message": "Try to maintain composure even during challenging questions. Take a breath before answering.",
                "priority": "high",
            }
        )

    if emotion_dist.get("Sad", 0) > 0.2:
        recommendations.append(
            {
                "type": "info",
                "category": "Engagement",
                "message": "Show more enthusiasm and energy. Sit up straight and make eye contact.",
                "priority": "medium",
            }
        )

    return recommendations


def _calculate_performance_score(stats: dict) -> dict:
    """Calculate overall performance score"""
    avg_score = stats.get("average_score", 0)
    positive_ratio = stats.get("positive_ratio", 0)

    # Weighted score
    overall = avg_score * 0.6 + positive_ratio * 100 * 0.4

    if overall >= 80:
        rating = "Excellent"
        color = "green"
    elif overall >= 70:
        rating = "Good"
        color = "lime"
    elif overall >= 60:
        rating = "Fair"
        color = "yellow"
    else:
        rating = "Needs Improvement"
        color = "red"

    return {"score": round(overall, 1), "rating": rating, "color": color}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Emotion Detection API on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
