#!/bin/bash

# Start script for AMRUTAM AI
echo "🚀 Starting AMRUTAM AI..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Start backend in background
echo "🔧 Starting Python backend..."
cd "$(dirname "$0")"
python3 app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd amrutam-ai
npm run dev &
FRONTEND_PID=$!

echo "✅ AMRUTAM AI is running!"
echo "📡 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait

