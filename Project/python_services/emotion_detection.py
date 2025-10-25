"""
Emotion Detection Service using OpenCV and Deep Learning
Supports real-time facial emotion analysis for interview assessment
"""

import cv2
import numpy as np
from typing import Dict, List, Optional, Tuple
import base64
from datetime import datetime
import json


class EmotionDetector:
    """
    Real-time emotion detection using OpenCV and pre-trained models
    Detects 7 emotions: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
    """

    EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

    # Emotion scoring weights for interview assessment
    EMOTION_WEIGHTS = {
        "Happy": 1.0,
        "Neutral": 0.8,
        "Surprise": 0.6,
        "Fear": 0.3,
        "Sad": 0.2,
        "Angry": 0.0,
        "Disgust": 0.1,
    }

    # Interview appropriate emotions
    POSITIVE_EMOTIONS = ["Happy", "Neutral", "Surprise"]
    NEGATIVE_EMOTIONS = ["Angry", "Disgust", "Fear", "Sad"]

    def __init__(self, face_cascade_path: str = None, emotion_model_path: str = None):
        """
        Initialize the emotion detector with face detection and emotion classification models

        Args:
            face_cascade_path: Path to Haar Cascade XML file for face detection
            emotion_model_path: Path to pre-trained emotion detection model
        """
        # Load Haar Cascade for face detection
        if face_cascade_path is None:
            face_cascade_path = (
                cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            )

        self.face_cascade = cv2.CascadeClassifier(face_cascade_path)

        # Load emotion detection model (will be loaded separately)
        self.emotion_model = None
        self.emotion_model_path = emotion_model_path

        # Statistics tracking
        self.emotion_history = []
        self.frame_count = 0

    def load_emotion_model(self):
        """
        Load the emotion detection model
        This should be called after initialization if model path is provided
        """
        if self.emotion_model_path:
            try:
                # Load your custom emotion detection model here
                # For example: self.emotion_model = load_model(self.emotion_model_path)
                print(f"Loading emotion model from {self.emotion_model_path}")
                # Placeholder - implement actual model loading
                pass
            except Exception as e:
                print(f"Error loading emotion model: {e}")

    def detect_faces(self, frame: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Detect faces in the frame using Haar Cascade

        Args:
            frame: Input image frame

        Returns:
            List of face coordinates (x, y, w, h)
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(48, 48),
            flags=cv2.CASCADE_SCALE_IMAGE,
        )
        return faces

    def preprocess_face(
        self, face_roi: np.ndarray, target_size: Tuple[int, int] = (48, 48)
    ) -> np.ndarray:
        """
        Preprocess face ROI for emotion detection

        Args:
            face_roi: Face region of interest
            target_size: Target size for the model input

        Returns:
            Preprocessed face image
        """
        # Convert to grayscale if needed
        if len(face_roi.shape) == 3:
            face_gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        else:
            face_gray = face_roi

        # Resize to target size
        face_resized = cv2.resize(face_gray, target_size)

        # Normalize pixel values
        face_normalized = face_resized / 255.0

        # Reshape for model input
        face_processed = np.expand_dims(face_normalized, axis=0)
        face_processed = np.expand_dims(face_processed, axis=-1)

        return face_processed

    def predict_emotion(self, face_roi: np.ndarray) -> Dict[str, float]:
        """
        Predict emotion from face ROI

        Args:
            face_roi: Face region of interest

        Returns:
            Dictionary of emotion probabilities
        """
        # Preprocess face
        processed_face = self.preprocess_face(face_roi)

        # If model is loaded, use it for prediction
        if self.emotion_model:
            predictions = self.emotion_model.predict(processed_face, verbose=0)
            emotion_probs = predictions[0]
        else:
            # Fallback: Use simple heuristics based on image properties
            emotion_probs = self._heuristic_emotion_detection(face_roi)

        # Create emotion dictionary
        emotion_dict = {
            emotion: float(prob) for emotion, prob in zip(self.EMOTIONS, emotion_probs)
        }

        return emotion_dict

    def _heuristic_emotion_detection(self, face_roi: np.ndarray) -> np.ndarray:
        """
        Fallback heuristic emotion detection when model is not available
        Uses simple image analysis techniques

        Args:
            face_roi: Face region of interest

        Returns:
            Array of emotion probabilities
        """
        # Convert to grayscale
        gray = (
            cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
            if len(face_roi.shape) == 3
            else face_roi
        )

        # Calculate various features
        brightness = np.mean(gray)
        contrast = np.std(gray)

        # Edge detection for facial features
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size

        # Simple heuristic mapping
        # This is a simplified approach - actual emotion detection requires trained models
        probabilities = np.zeros(len(self.EMOTIONS))

        # Neutral as baseline
        probabilities[self.EMOTIONS.index("Neutral")] = 0.4

        # Adjust based on features
        if brightness > 140:
            probabilities[self.EMOTIONS.index("Happy")] += 0.3

        if contrast > 50:
            probabilities[self.EMOTIONS.index("Surprise")] += 0.2

        if edge_density > 0.15:
            probabilities[self.EMOTIONS.index("Fear")] += 0.1

        # Normalize probabilities
        probabilities = probabilities / np.sum(probabilities)

        return probabilities

    def analyze_frame(self, frame: np.ndarray) -> Dict:
        """
        Analyze a single frame for emotions

        Args:
            frame: Input image frame

        Returns:
            Analysis results including detected faces and emotions
        """
        self.frame_count += 1

        # Detect faces
        faces = self.detect_faces(frame)

        results = {
            "timestamp": datetime.now().isoformat(),
            "frame_number": self.frame_count,
            "faces_detected": len(faces),
            "faces": [],
        }

        # Analyze each face
        for x, y, w, h in faces:
            # Extract face ROI
            face_roi = frame[y : y + h, x : x + w]

            # Predict emotion
            emotion_probs = self.predict_emotion(face_roi)

            # Get dominant emotion
            dominant_emotion = max(emotion_probs, key=emotion_probs.get)
            confidence = emotion_probs[dominant_emotion]

            # Calculate emotion score
            emotion_score = self._calculate_emotion_score(emotion_probs)

            face_result = {
                "bbox": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
                "emotions": emotion_probs,
                "dominant_emotion": dominant_emotion,
                "confidence": float(confidence),
                "emotion_score": float(emotion_score),
                "is_positive": dominant_emotion in self.POSITIVE_EMOTIONS,
            }

            results["faces"].append(face_result)

            # Add to history
            self.emotion_history.append(
                {
                    "timestamp": results["timestamp"],
                    "emotion": dominant_emotion,
                    "score": emotion_score,
                    "confidence": confidence,
                }
            )

        return results

    def _calculate_emotion_score(self, emotion_probs: Dict[str, float]) -> float:
        """
        Calculate overall emotion score for interview assessment
        Higher score indicates more positive/appropriate emotions

        Args:
            emotion_probs: Dictionary of emotion probabilities

        Returns:
            Emotion score (0-100)
        """
        weighted_score = sum(
            emotion_probs.get(emotion, 0) * self.EMOTION_WEIGHTS.get(emotion, 0)
            for emotion in self.EMOTIONS
        )

        # Convert to 0-100 scale
        score = weighted_score * 100

        return score

    def get_emotion_statistics(self, last_n_frames: int = None) -> Dict:
        """
        Get emotion statistics from history

        Args:
            last_n_frames: Number of recent frames to analyze (None for all)

        Returns:
            Statistics dictionary
        """
        if not self.emotion_history:
            return {
                "total_frames": 0,
                "average_score": 0,
                "emotion_distribution": {},
                "positive_ratio": 0,
            }

        # Get recent history
        history = (
            self.emotion_history[-last_n_frames:]
            if last_n_frames
            else self.emotion_history
        )

        # Calculate statistics
        scores = [entry["score"] for entry in history]
        emotions = [entry["emotion"] for entry in history]

        emotion_counts = {emotion: emotions.count(emotion) for emotion in set(emotions)}
        total_emotions = len(emotions)

        emotion_distribution = {
            emotion: count / total_emotions for emotion, count in emotion_counts.items()
        }

        positive_count = sum(
            1 for emotion in emotions if emotion in self.POSITIVE_EMOTIONS
        )
        positive_ratio = positive_count / total_emotions if total_emotions > 0 else 0

        return {
            "total_frames": len(history),
            "average_score": np.mean(scores) if scores else 0,
            "min_score": min(scores) if scores else 0,
            "max_score": max(scores) if scores else 0,
            "emotion_distribution": emotion_distribution,
            "positive_ratio": positive_ratio,
            "dominant_emotion": (
                max(emotion_counts, key=emotion_counts.get) if emotion_counts else None
            ),
            "recent_trend": self._calculate_trend(
                scores[-10:] if len(scores) >= 10 else scores
            ),
        }

    def _calculate_trend(self, scores: List[float]) -> str:
        """
        Calculate emotion trend from recent scores

        Args:
            scores: List of recent scores

        Returns:
            Trend description ('improving', 'declining', 'stable')
        """
        if len(scores) < 2:
            return "stable"

        # Simple linear regression
        x = np.arange(len(scores))
        slope = np.polyfit(x, scores, 1)[0]

        if slope > 2:
            return "improving"
        elif slope < -2:
            return "declining"
        else:
            return "stable"

    def draw_annotations(self, frame: np.ndarray, analysis_result: Dict) -> np.ndarray:
        """
        Draw emotion annotations on the frame

        Args:
            frame: Input frame
            analysis_result: Analysis results from analyze_frame

        Returns:
            Annotated frame
        """
        annotated_frame = frame.copy()

        for face in analysis_result["faces"]:
            bbox = face["bbox"]
            x, y, w, h = bbox["x"], bbox["y"], bbox["w"], bbox["h"]

            # Choose color based on emotion positivity
            color = (0, 255, 0) if face["is_positive"] else (0, 165, 255)

            # Draw bounding box
            cv2.rectangle(annotated_frame, (x, y), (x + w, y + h), color, 2)

            # Draw emotion label
            label = f"{face['dominant_emotion']}: {face['confidence']*100:.1f}%"
            label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)

            # Draw background for text
            cv2.rectangle(
                annotated_frame,
                (x, y - label_size[1] - 10),
                (x + label_size[0], y),
                color,
                -1,
            )

            # Draw text
            cv2.putText(
                annotated_frame,
                label,
                (x, y - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                2,
            )

            # Draw emotion score
            score_text = f"Score: {face['emotion_score']:.1f}"
            cv2.putText(
                annotated_frame,
                score_text,
                (x, y + h + 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                1,
            )

        return annotated_frame

    def reset_statistics(self):
        """Reset emotion history and statistics"""
        self.emotion_history = []
        self.frame_count = 0


def decode_base64_image(base64_string: str) -> np.ndarray:
    """
    Decode base64 image string to numpy array

    Args:
        base64_string: Base64 encoded image

    Returns:
        Decoded image as numpy array
    """
    # Remove data URL prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    # Decode base64
    img_data = base64.b64decode(base64_string)

    # Convert to numpy array
    nparr = np.frombuffer(img_data, np.uint8)

    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    return img


def encode_image_to_base64(image: np.ndarray) -> str:
    """
    Encode numpy array image to base64 string

    Args:
        image: Image as numpy array

    Returns:
        Base64 encoded image string
    """
    # Encode image to jpg
    _, buffer = cv2.imencode(".jpg", image)

    # Convert to base64
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    return f"data:image/jpeg;base64,{img_base64}"


# Global detector instance
_detector_instance = None


def get_detector_instance() -> EmotionDetector:
    """
    Get or create singleton emotion detector instance

    Returns:
        EmotionDetector instance
    """
    global _detector_instance

    if _detector_instance is None:
        _detector_instance = EmotionDetector()

    return _detector_instance


if __name__ == "__main__":
    # Test the emotion detector
    print("Testing Emotion Detector...")

    detector = EmotionDetector()
    print("Emotion Detector initialized successfully")

    # Test with webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam")
        exit()

    print("Press 'q' to quit, 's' to see statistics")

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Could not read frame")
            break

        # Analyze frame
        results = detector.analyze_frame(frame)

        # Draw annotations
        annotated_frame = detector.draw_annotations(frame, results)

        # Display
        cv2.imshow("Emotion Detection", annotated_frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break
        elif key == ord("s"):
            stats = detector.get_emotion_statistics()
            print("\n=== Emotion Statistics ===")
            print(json.dumps(stats, indent=2))
            print("========================\n")

    cap.release()
    cv2.destroyAllWindows()

    # Final statistics
    final_stats = detector.get_emotion_statistics()
    print("\n=== Final Statistics ===")
    print(json.dumps(final_stats, indent=2))
