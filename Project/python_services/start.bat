@echo off
echo ===================================
echo JobFit Emotion Detection Setup
echo ===================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo Python found: 
python --version

REM Navigate to python_services directory
cd python_services

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ===================================
echo Starting Emotion Detection API
echo ===================================
echo.

REM Start the Flask API
python emotion_api.py

pause
