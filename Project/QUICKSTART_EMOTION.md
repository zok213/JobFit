# 🚀 Quick Start: Emotion Detection

Get the emotion detection feature running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 14+ installed
- Webcam connected

## Setup Steps

### 1️⃣ Install Python Dependencies (First Time Only)

**Windows:**

```bash
cd python_services
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/Mac:**

```bash
cd python_services
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2️⃣ Start Emotion Detection Service

**Windows:**

```bash
cd python_services
start.bat
```

**Linux/Mac:**

```bash
cd python_services
./start.sh
```

You should see:

```
Starting Emotion Detection API on port 5000
 * Running on http://0.0.0.0:5000
```

### 3️⃣ Start Next.js Application

Open a new terminal:

```bash
npm run dev
```

### 4️⃣ Test Emotion Detection

1. Open browser: `http://localhost:3000/interviewer`
2. Enter your name
3. Select a position
4. ✅ Enable "Show Camera"
5. ✅ Enable "Emotion Analysis" ⭐ NEW FEATURE
6. Click "Start" on any interview type
7. See real-time emotion feedback! 🎉

## Quick Test Checklist

- [ ] Python service running on port 5000
- [ ] Next.js running on port 3000
- [ ] Webcam permission granted
- [ ] Face detected in camera
- [ ] Emotion label showing
- [ ] Score updating

## Troubleshooting

### ❌ Port 5000 already in use

```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### ❌ Python packages fail to install

```bash
pip install --upgrade pip
pip install opencv-python numpy flask flask-cors
```

### ❌ Camera not detected

- Check camera permissions in system settings
- Try closing other apps using camera (Zoom, Teams, etc.)
- Restart browser

### ❌ No emotion detected

- Ensure good lighting on your face
- Position face in center of frame
- Wait 2-3 seconds for first analysis

## What You'll See

### During Interview

- 📷 Webcam feed with face detection box
- 😊 Current emotion badge (e.g., "Happy")
- 📊 Real-time score: 75.5/100
- 📈 Average score over time
- 🎯 Top 4 emotions distribution

### After Interview

- 🏆 Overall performance score
- 📉 Detailed statistics
- 💡 Personalized recommendations
- 📊 Emotion distribution chart

## Features Overview

| Feature                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Real-Time Analysis** | Emotion detected every 2 seconds                    |
| **7 Emotions**         | Happy, Sad, Angry, Fear, Disgust, Surprise, Neutral |
| **Scoring System**     | 0-100 scale with weighted emotions                  |
| **Performance Report** | Comprehensive analysis after interview              |
| **Recommendations**    | Personalized tips for improvement                   |
| **Trend Analysis**     | Improving/Declining/Stable tracking                 |

## Emotion Scores Explained

| Score  | Rating        | What It Means                     |
| ------ | ------------- | --------------------------------- |
| 80-100 | 🌟 Excellent  | Very positive, confident demeanor |
| 70-79  | ✅ Good       | Generally positive, professional  |
| 60-69  | 👍 Fair       | Adequate, room for improvement    |
| 0-59   | ⚠️ Needs Work | Practice relaxation techniques    |

## Next Steps

1. ✅ Complete test interview
2. ✅ Review emotion report
3. ✅ Adjust settings (optional)
4. ✅ Practice with different expressions
5. ✅ Compare multiple sessions

## Advanced Usage

### Adjust Analysis Frequency

Edit `app/components/WebcamFeed.tsx`:

```typescript
// Line ~80: Change from 2000ms to 3000ms
emotionDetectionIntervalRef.current = setInterval(analyzeEmotion, 3000);
```

### Enable Debug Logging

Edit `python_services/emotion_api.py`:

```python
# Last line: Set debug=True
app.run(host='0.0.0.0', port=5000, debug=True)
```

## Documentation

- 📖 Full Setup Guide: `python_services/README.md`
- 📋 Implementation Details: `EMOTION_DETECTION_IMPLEMENTATION.md`
- 🔧 API Documentation: See Flask API comments

## Support

Having issues? Check:

1. Terminal logs from Python service
2. Browser console (F12)
3. Camera permissions
4. Port availability

## Success Indicators

✅ Python service shows "Running on http://0.0.0.0:5000"
✅ No errors in terminal
✅ Webcam light is on
✅ Green "Face Detected" badge appears
✅ Emotion label updates regularly
✅ Score changes as you change expression

---

**Ready to test?** Start with a smile! 😊

The system should detect "Happy" emotion with a high score (70+).
Try different expressions to see how the score changes!
