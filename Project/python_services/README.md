# Emotion Detection Service Setup

This guide will help you set up the Python-based emotion detection service for real-time facial emotion analysis during interviews.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher (for Next.js frontend)
- Webcam/Camera access

## Installation

### 1. Install Python Dependencies

Navigate to the `python_services` directory:

```bash
cd python_services
```

Create a virtual environment (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

Install required packages:

```bash
pip install -r requirements.txt
```

### 2. Download Pre-trained Models (Optional)

For better emotion detection accuracy, you can use pre-trained models:

#### Option A: FER2013 Model (Recommended)

Download a pre-trained emotion detection model from:

- https://github.com/serengil/deepface-models/releases
- https://github.com/oarriaga/face_classification

Place the model file in `python_services/models/` directory.

#### Option B: Use OpenCV Haar Cascade (Default)

The service will automatically use OpenCV's Haar Cascade for face detection, which is included in the OpenCV package.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Emotion Detection API URL
EMOTION_API_URL=http://localhost:5000

# Optional: Model path
EMOTION_MODEL_PATH=./models/emotion_model.h5
```

## Running the Service

### Start the Python Emotion Detection API

In the `python_services` directory:

```bash
python emotion_api.py
```

The API will start on `http://localhost:5000`

You should see:

```
Starting Emotion Detection API on port 5000
 * Running on http://0.0.0.0:5000
```

### Start the Next.js Application

In the root directory:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Testing the Emotion Detection

1. Navigate to the Interviewer page (`/interviewer`)
2. Enter your name and select a position
3. Enable **Show Camera**
4. Enable **Emotion Analysis**
5. Start the interview
6. The webcam feed will show:
   - Face detection bounding box
   - Current emotion label
   - Emotion confidence score
   - Real-time emotion score (0-100)
   - Average emotion score over time

## API Endpoints

### 1. Analyze Emotion

```http
POST /api/emotion/analyze
Content-Type: application/json

{
  "image": "base64_encoded_image",
  "session_id": "optional_session_id"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "timestamp": "2025-10-25T...",
    "faces_detected": 1,
    "faces": [
      {
        "bbox": {"x": 100, "y": 50, "w": 200, "h": 200},
        "emotions": {
          "Happy": 0.65,
          "Neutral": 0.25,
          "Surprise": 0.08,
          ...
        },
        "dominant_emotion": "Happy",
        "confidence": 0.65,
        "emotion_score": 75.5,
        "is_positive": true
      }
    ]
  }
}
```

### 2. Get Session Statistics

```http
GET /api/emotion/statistics/:sessionId
```

### 3. Generate Emotion Report

```http
GET /api/emotion/report/:sessionId
```

## Emotion Categories

The system detects 7 emotions:

| Emotion  | Score Weight | Category |
| -------- | ------------ | -------- |
| Happy    | 1.0          | Positive |
| Neutral  | 0.8          | Positive |
| Surprise | 0.6          | Positive |
| Fear     | 0.3          | Negative |
| Sad      | 0.2          | Negative |
| Disgust  | 0.1          | Negative |
| Angry    | 0.0          | Negative |

## Emotion Score Calculation

The emotion score (0-100) is calculated based on:

1. **Dominant Emotion Weight** (60%): Based on the detected emotion
2. **Positive Emotion Ratio** (40%): Percentage of positive emotions over time

### Score Interpretation:

- **80-100**: Excellent - Very positive and engaged
- **70-79**: Good - Generally positive demeanor
- **60-69**: Fair - Mixed emotions, room for improvement
- **0-59**: Needs Improvement - Consider practicing relaxation techniques

## Troubleshooting

### Issue: Python packages not installing

**Solution**: Make sure you have the correct Python version (3.8+) and pip is updated:

```bash
python -m pip install --upgrade pip
```

### Issue: OpenCV camera access denied

**Solution**:

- Windows: Allow camera access in Settings > Privacy > Camera
- Mac: System Preferences > Security & Privacy > Camera
- Linux: Check camera permissions with `ls -la /dev/video*`

### Issue: TensorFlow installation fails

**Solution**: Install TensorFlow separately:

```bash
pip install tensorflow==2.15.0
```

### Issue: Emotion API not responding

**Solution**:

1. Check if the Python service is running on port 5000
2. Verify EMOTION_API_URL in `.env` file
3. Check for firewall blocking port 5000

### Issue: Low emotion detection accuracy

**Solution**:

1. Ensure good lighting conditions
2. Position face clearly in camera view
3. Consider training/using a custom emotion detection model
4. Adjust detection interval (default: 2 seconds)

## Performance Optimization

### 1. Adjust Detection Frequency

In `WebcamFeed.tsx`, change the interval:

```typescript
// From 2 seconds to 3 seconds
emotionDetectionIntervalRef.current = setInterval(analyzeEmotion, 3000);
```

### 2. Reduce Image Quality

In `WebcamFeed.tsx`, adjust JPEG quality:

```typescript
// From 0.8 to 0.6
return canvas.toDataURL("image/jpeg", 0.6);
```

### 3. Use GPU Acceleration

For TensorFlow models, enable GPU:

```python
import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_memory_growth(gpus[0], True)
```

## Advanced: Custom Emotion Model

To use your own trained emotion detection model:

1. Train a CNN model on FER2013 or similar dataset
2. Save the model in Keras/TensorFlow format
3. Update `emotion_detection.py`:

```python
from tensorflow import keras

def __init__(self, emotion_model_path: str):
    self.emotion_model = keras.models.load_model(emotion_model_path)
```

4. Set model path in `.env`:

```
EMOTION_MODEL_PATH=./models/my_emotion_model.h5
```

## Production Deployment

### Docker Deployment

Create `Dockerfile` for Python service:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY python_services/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY python_services/ .

EXPOSE 5000

CMD ["python", "emotion_api.py"]
```

Build and run:

```bash
docker build -t emotion-detection .
docker run -p 5000:5000 emotion-detection
```

### Environment Variables for Production

```bash
# Production settings
EMOTION_API_URL=https://your-emotion-api.com
NODE_ENV=production
PORT=5000
```

## License

This emotion detection system uses OpenCV (BSD license) and TensorFlow (Apache 2.0 license).

## Support

For issues and questions:

- Check the logs in `emotion_api.py`
- Review browser console for frontend errors
- Ensure webcam permissions are granted
- Verify Python service is running

## Credits

- OpenCV for face detection
- TensorFlow for deep learning framework
- Haar Cascade classifiers for face detection
- FER2013 dataset for emotion classification research
