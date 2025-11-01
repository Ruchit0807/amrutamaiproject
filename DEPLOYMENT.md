# 🚀 AMRUTAM AI - Complete Deployment Guide

A full-stack Ayurvedic AI platform with real ML model predictions for skin disease detection and personalized Ayurvedic remedies.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment Options](#deployment-options)
- [API Endpoints](#api-endpoints)

## 🏗️ Architecture

This project consists of:

1. **Backend (Python/FastAPI)**: ML model server with skin disease detection and Ayurvedic remedy generation
2. **Frontend (Next.js)**: React-based web interface
3. **ML Models**: 
   - EfficientNet-B0 for skin disease classification
   - OpenRouter API integration for Ayurvedic remedies

## 📦 Prerequisites

### Required Software

- **Python 3.9+** (for backend ML models)
- **Node.js 18+** (for frontend)
- **Git** (for cloning the repository)

### API Keys (Optional but Recommended)

1. **OpenRouter API Key** - For Ayurvedic remedy generation
   - Sign up at [OpenRouter.ai](https://openrouter.ai)
   - Free tier available

2. **Google Maps API Key** (Optional) - For clinic finder
   - Get from [Google Cloud Console](https://console.cloud.google.com)

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/amrutam-ai.git
cd amrutam-ai
```

### Step 2: Install Python Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Install Frontend Dependencies

```bash
cd amrutam-ai
npm install
```

## ⚙️ Configuration

### Create Environment File

Copy `env.example.txt` to create your environment configuration:

```bash
# Windows
copy env.example.txt .env

# Linux/Mac
cp env.example.txt .env
```

### Edit `.env` file:

```env
# Backend URL (change in production)
BACKEND_URL=http://localhost:8000

# OpenRouter API Key (get from https://openrouter.ai)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Google Maps API Key (optional)
GOOGLE_API_KEY=your-google-api-key-here
```

## 🚀 Running the Application

### Option 1: Quick Start Scripts

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

#### Terminal 1 - Start Backend:

```bash
# Activate virtual environment (if using)
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate  # Windows

# Start FastAPI server
python app.py
```

Backend will be available at: `http://localhost:8000`

#### Terminal 2 - Start Frontend:

```bash
cd amrutam-ai
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Option 3: Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🌐 Deployment Options

### 1. Local Development

Run both services locally (as described above).

### 2. Production with Docker

Build and deploy using Docker:

```bash
# Build Docker image
docker build -t amrutam-ai .

# Run container
docker run -p 8000:8000 -p 3000:3000 amrutam-ai
```

### 3. Cloud Deployment

#### Backend (FastAPI)

Deploy backend to cloud platforms supporting Python:

- **Render.com**: Connect GitHub repo, set build command: `pip install -r requirements.txt`, start command: `python app.py`
- **Railway**: Similar setup
- **Heroku**: Use Procfile with `web: uvicorn app:app --host 0.0.0.0 --port $PORT`

#### Frontend (Next.js)

Deploy frontend to Vercel/Netlify:

```bash
# Build for production
cd amrutam-ai
npm run build

# Deploy to Vercel
npx vercel

# Or deploy to Netlify
npx netlify deploy
```

**Important**: Set `BACKEND_URL` environment variable in your frontend deployment to point to your backend URL.

## 📡 API Endpoints

### Backend Endpoints (FastAPI)

- `GET /` - Health check
- `GET /health` - Server status
- `POST /api/skin` - Skin disease prediction
  - Input: Multipart form with `image` file
  - Output: `{disease, confidence, care, tips}`
- `POST /api/remedy` - Get Ayurvedic remedies
  - Input: `{symptoms: "fever, cough"}`
  - Output: `{text, structured}`

### Frontend API Routes

- `POST /api/skin` - Proxies to backend `/api/skin`
- `POST /api/remedy` - Proxies to backend `/api/remedy`

## 🔍 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Test skin disease detection (requires image)
curl -X POST -F "image=@test_image.jpg" http://localhost:8000/api/skin

# Test remedy API
curl -X POST http://localhost:8000/api/remedy \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever"}'
```

## 📁 Project Structure

```
amrutam/
├── app.py                    # FastAPI backend server
├── ayurvedic_remedies.py     # Ayurvedic remedy logic
├── skin_disease.py           # Skin disease detection (Gradio version)
├── skin_disease_module.py    # Simplified version for FastAPI
├── best_efficientnet.pth     # Trained ML model
├── requirements.txt          # Python dependencies
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Multi-container setup
├── start.sh / start.bat     # Quick start scripts
│
└── amrutam-ai/              # Frontend (Next.js)
    ├── src/
    │   ├── app/
    │   │   ├── api/         # API routes
    │   │   ├── skin/        # Skin disease page
    │   │   └── remedy/      # Ayurvedic remedies page
    │   └── components/
    ├── package.json
    └── next.config.mjs
```

## ⚠️ Important Notes

### Model File

Ensure `best_efficientnet.pth` is present in the root directory. This is the trained EfficientNet model for skin disease detection.

### API Keys

- **OpenRouter API**: Free tier allows limited requests. For production, consider paid plans.
- **Google Maps API**: Optional. Only needed if using clinic finder feature.

### Performance

- First API call may be slow (model loading)
- GPU not required but recommended for faster inference
- Model size: ~15 MB

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: efficientnet_pytorch`
```bash
pip install efficientnet_pytorch
```

**Problem**: Model file not found
- Ensure `best_efficientnet.pth` is in the root directory

### Frontend Issues

**Problem**: Cannot connect to backend
- Check `BACKEND_URL` in environment variables
- Ensure backend is running on port 8000

**Problem**: CORS errors
- Backend already configured with CORS middleware
- Check if firewall is blocking connections

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for holistic wellness**

