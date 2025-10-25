# 🚀 Quick Fix: Start Emotion Detection Service

## The Problem
The emotion detection feature requires a Python Flask service running on port 5000. If you see no emotion data, the service is not running.

## Quick Solution (Windows - Recommended)

### Option 1: Use the Batch Script
```bash
cd python_services
start.bat
```

### Option 2: Manual Start
```bash
# 1. Navigate to python_services
cd python_services

# 2. Install dependencies (first time only)
pip install flask flask-cors opencv-python numpy pillow

# 3. Start the service
python emotion_api.py
```

You should see:
```
Starting Emotion Detection API on port 5000
 * Running on http://0.0.0.0:5000
```

## Quick Solution (Linux/Mac)

```bash
# 1. Navigate to python_services
cd python_services

# 2. Install dependencies (first time only)
pip3 install flask flask-cors opencv-python numpy pillow

# 3. Start the service
python3 emotion_api.py
```

## Verify It's Working

1. **Check the service is running:**
   - Open browser: http://localhost:5000/health
   - Should see: `{"status": "healthy", "service": "emotion-detection"}`

2. **Test in the app:**
   - Go to http://localhost:3000/interviewer
   - Enable "Show Camera"
   - Enable "Emotion Analysis"
   - Start interview
   - You should see emotion labels appear!

## Common Issues

### ❌ "pip is not recognized"
**Solution:** Install Python 3.8+ from python.org

### ❌ "Port 5000 already in use"
**Solution:** 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### ❌ "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```bash
pip install flask flask-cors opencv-python numpy pillow
```

### ❌ "Cannot access webcam"
**Solution:**
- Close other apps using camera (Zoom, Teams, etc.)
- Check camera permissions in system settings
- Try restarting browser

## What Should Happen

When working correctly:
1. **Python service logs** show: `POST /api/emotion/analyze 200`
2. **Browser console** shows: `Emotion API is available`
3. **UI displays**:
   - Current emotion badge (e.g., "Happy")
   - Emotion score (0-100)
   - Emotion confidence percentages

## Need Help?

Check the full documentation:
- `README.md` - Complete setup guide
- `QUICKSTART_EMOTION.md` - Step-by-step tutorial
- `EMOTION_DETECTION_IMPLEMENTATION.md` - Technical details

## TL;DR - Just Show Me The Commands

```bash
# Terminal 1: Start Python Service
cd python_services
pip install -r requirements.txt
python emotion_api.py

# Terminal 2: Start Next.js
npm run dev

# Browser: Test
# http://localhost:3000/interviewer
# Enable Camera + Emotion Analysis ✅
```

That's it! 🎉
