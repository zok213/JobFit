# Emotion Detection System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Interview Page (/interviewer)                  │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │  │
│  │  │ Name Input      │  │ Position Select  │  │ Interview Type  │ │  │
│  │  └─────────────────┘  └──────────────────┘  └─────────────────┘ │  │
│  │  ┌─────────────────┐  ┌──────────────────┐                       │  │
│  │  │ 📷 Show Camera  │  │ 😊 Emotion       │  ← NEW TOGGLES       │  │
│  │  │    Toggle       │  │    Analysis      │                       │  │
│  │  └─────────────────┘  └──────────────────┘                       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     WEBCAM FEED COMPONENT                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │               📹 Video Feed (640x480)                       │ │  │
│  │  │  ┌───────────────────────────────────────────────────────┐ │ │  │
│  │  │  │  🟩 Face Detection Box                                │ │ │  │
│  │  │  │     "Happy - 85.3%"                                   │ │ │  │
│  │  │  └───────────────────────────────────────────────────────┘ │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                     │  │
│  │  Real-Time Display:                                                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ 😊 Current Emotion: Happy                                   │ │  │
│  │  │ ████████████████░░░░  75.5/100  (Emotion Score)            │ │  │
│  │  │ ████████████████░░░░  72.3/100  (Average Score)            │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │ Top Emotions:                                               │ │  │
│  │  │  Happy: 65%  | Neutral: 25%                                │ │  │
│  │  │  Surprise: 8% | Fear: 2%                                   │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │ 📊 45 frames analyzed                                       │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓ (Every 2 seconds)
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPTURE & ENCODE                                      │
│  Canvas.toDataURL() → Base64 JPEG (quality: 0.8)                       │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER                                     │
│  POST /api/interview/emotion/analyze                                    │
│  {                                                                       │
│    "image": "data:image/jpeg;base64,...",                              │
│    "session_id": "session_abc123"                                      │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓ (HTTP Request)
┌─────────────────────────────────────────────────────────────────────────┐
│                PYTHON FLASK API (Port 5000)                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  emotion_api.py                                                   │  │
│  │  ├── POST /api/emotion/analyze                                    │  │
│  │  ├── POST /api/emotion/analyze-annotated                          │  │
│  │  ├── GET  /api/emotion/statistics/:sessionId                      │  │
│  │  ├── GET  /api/emotion/report/:sessionId                          │  │
│  │  └── DELETE /api/emotion/session/:sessionId                       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              EMOTION DETECTION ENGINE                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  emotion_detection.py - EmotionDetector Class                     │  │
│  │                                                                     │  │
│  │  1. Decode Base64 → NumPy Array                                   │  │
│  │     ↓                                                              │  │
│  │  2. OpenCV Face Detection (Haar Cascade)                          │  │
│  │     cv2.CascadeClassifier('haarcascade_frontalface_default.xml')  │  │
│  │     ↓                                                              │  │
│  │  3. Extract Face ROI (Region of Interest)                         │  │
│  │     frame[y:y+h, x:x+w]                                           │  │
│  │     ↓                                                              │  │
│  │  4. Preprocess Face                                               │  │
│  │     - Convert to grayscale                                        │  │
│  │     - Resize to 48x48                                             │  │
│  │     - Normalize (0-1)                                             │  │
│  │     ↓                                                              │  │
│  │  5. Emotion Classification                                        │  │
│  │     ┌─────────────────────────────────────┐                      │  │
│  │     │ ML Model (if available)             │                      │  │
│  │     │   or                                 │                      │  │
│  │     │ Heuristic Analysis:                  │                      │  │
│  │     │  - Brightness analysis               │                      │  │
│  │     │  - Contrast measurement              │                      │  │
│  │     │  - Edge detection                    │                      │  │
│  │     └─────────────────────────────────────┘                      │  │
│  │     ↓                                                              │  │
│  │  6. Generate Emotion Probabilities                                │  │
│  │     {                                                              │  │
│  │       "Happy": 0.65,                                              │  │
│  │       "Neutral": 0.25,                                            │  │
│  │       "Surprise": 0.08,                                           │  │
│  │       "Fear": 0.02,                                               │  │
│  │       ...                                                          │  │
│  │     }                                                              │  │
│  │     ↓                                                              │  │
│  │  7. Calculate Emotion Score                                       │  │
│  │     Score = Σ(emotion_prob × emotion_weight)                     │  │
│  │     Weights: Happy(1.0), Neutral(0.8), ... Angry(0.0)           │  │
│  │     ↓                                                              │  │
│  │  8. Update Statistics & History                                   │  │
│  │     - Add to emotion_history[]                                    │  │
│  │     - Calculate averages                                          │  │
│  │     - Detect trends                                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     JSON RESPONSE                                        │
│  {                                                                       │
│    "success": true,                                                     │
│    "data": {                                                            │
│      "timestamp": "2025-10-25T10:30:45.123Z",                          │
│      "faces_detected": 1,                                              │
│      "faces": [{                                                        │
│        "bbox": {"x": 120, "y": 80, "w": 200, "h": 200},              │
│        "emotions": {                                                    │
│          "Happy": 0.65, "Neutral": 0.25, ...                          │
│        },                                                               │
│        "dominant_emotion": "Happy",                                    │
│        "confidence": 0.65,                                             │
│        "emotion_score": 75.5,                                          │
│        "is_positive": true                                             │
│      }]                                                                 │
│    }                                                                    │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                 UPDATE UI COMPONENTS                                     │
│  - currentEmotion state                                                 │
│  - emotionHistory array                                                 │
│  - averageEmotionScore                                                  │
│  - Visual gauges and charts                                             │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                       AFTER INTERVIEW COMPLETION
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                    EMOTION REPORT GENERATION                             │
│  GET /api/interview/emotion/report/:sessionId                           │
│                                                                           │
│  Analyzes emotion_history[] to generate:                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. Performance Score                                            │   │
│  │    - Overall score: 75.5/100                                    │   │
│  │    - Rating: "Good"                                             │   │
│  │                                                                  │   │
│  │ 2. Statistics                                                   │   │
│  │    - Total frames: 45                                           │   │
│  │    - Duration: 1m 30s                                           │   │
│  │    - Average: 72.3                                              │   │
│  │    - Min/Max: 45.2 / 89.6                                       │   │
│  │    - Positive ratio: 78%                                        │   │
│  │                                                                  │   │
│  │ 3. Emotion Distribution                                         │   │
│  │    Happy:    45%  ████████████                                  │   │
│  │    Neutral:  30%  ████████                                      │   │
│  │    Surprise: 15%  ████                                          │   │
│  │    Fear:     10%  ██                                            │   │
│  │                                                                  │   │
│  │ 4. Trend Analysis                                               │   │
│  │    📈 Improving - Your confidence grew during interview         │   │
│  │                                                                  │   │
│  │ 5. Personalized Recommendations                                 │   │
│  │    ✅ Excellent emotional expression!                           │   │
│  │    💡 Consider being slightly more expressive                   │   │
│  │    ⚠️  Practice relaxation techniques for nervousness           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                            DATA PERSISTENCE
═══════════════════════════════════════════════════════════════════════════

Session Data Storage (In-Memory):
┌─────────────────────────────────────────────────────────────────────────┐
│  session_data = {                                                        │
│    "session_abc123": {                                                  │
│      "created_at": "2025-10-25T10:30:00Z",                             │
│      "frames_analyzed": 45,                                             │
│      "emotion_history": [                                               │
│        {                                                                 │
│          "timestamp": "2025-10-25T10:30:02Z",                          │
│          "faces": [{                                                    │
│            "dominant_emotion": "Happy",                                │
│            "emotion_score": 75.5                                       │
│          }]                                                              │
│        },                                                                │
│        ...                                                               │
│      ]                                                                   │
│    }                                                                     │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘

Note: For production, replace with Redis or PostgreSQL


═══════════════════════════════════════════════════════════════════════════
                           SYSTEM COMPONENTS
═══════════════════════════════════════════════════════════════════════════

Frontend (React/Next.js):
  ├── app/interviewer/page.tsx          [Main interview page]
  ├── app/components/
  │   ├── WebcamFeed.tsx                [Camera + Emotion Display]
  │   ├── VoiceInterviewInterface.tsx   [Voice mode support]
  │   └── EmotionReport.tsx             [Report component]
  └── app/api/interview/emotion/
      ├── analyze/route.ts              [Proxy to Python]
      ├── statistics/[sessionId]/route.ts
      └── report/[sessionId]/route.ts

Backend (Python/Flask):
  ├── python_services/
  │   ├── emotion_detection.py          [Core detection logic]
  │   ├── emotion_api.py                [Flask API server]
  │   ├── requirements.txt              [Dependencies]
  │   ├── start.sh / start.bat          [Startup scripts]
  │   └── README.md                     [Setup guide]

Documentation:
  ├── EMOTION_DETECTION_IMPLEMENTATION.md
  ├── QUICKSTART_EMOTION.md
  └── python_services/ARCHITECTURE.md  [This file]
```

## Key Features

### 1. Real-Time Processing

- Analysis every 2 seconds (configurable)
- Non-blocking asynchronous requests
- Smooth UI updates

### 2. Intelligent Scoring

- Weighted emotion system
- Historical trend analysis
- Context-aware recommendations

### 3. Scalable Architecture

- Microservice design (Python + Next.js)
- RESTful API interface
- Easy to extend and modify

### 4. User-Friendly

- Toggle on/off capability
- Visual feedback
- Comprehensive reports
- Actionable insights

## Performance Characteristics

- **Latency**: ~100-200ms per analysis
- **Throughput**: 30+ requests/minute
- **Memory**: ~300MB (Python service)
- **CPU**: 5-10% (without GPU)
- **Network**: ~50KB per request

## Security Considerations

- No permanent storage of images
- Session-based data isolation
- CORS configured for development
- Ready for authentication integration
