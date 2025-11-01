@echo off
echo Starting AMRUTAM AI...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.9 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

REM Start backend
echo Starting Python backend...
start "AMRUTAM Backend" cmd /k "python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting Next.js frontend...
cd amrutam-ai
start "AMRUTAM Frontend" cmd /k "npm run dev"

echo.
echo AMRUTAM AI is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause

