# AMRUTAM AI Deployment Guide

## Frontend Deployment (Netlify)

The frontend is deployed to Netlify and configured to work with a separate Python backend.

### Netlify Configuration

1. **Build Settings:**
   - Base directory: `amrutam-ai`
   - Build command: `npm run build`
   - Publish directory: `amrutam-ai/.next`

2. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: URL of your Python backend (e.g., Heroku, Railway, etc.)

### Current Setup

The `netlify.toml` file is configured to:
- Build only the Next.js frontend
- Ignore Python dependencies
- Set up proper redirects for SPA routing

## Backend Deployment (Separate Service)

The Python backend with AI models should be deployed separately to a service that supports Python:

### Recommended Services:
1. **Heroku** - Easy deployment with Python support
2. **Railway** - Modern alternative to Heroku
3. **Render** - Free tier available
4. **Google Cloud Run** - Serverless Python deployment
5. **AWS Lambda** - For serverless functions

### Backend Files:
- `ayurvedic_remedies.py` - Ayurvedic remedy recommendations
- `skin_disease.py` - Skin disease prediction
- `best_efficientnet.pth` - Trained AI model
- `requirements.txt` - Python dependencies

### Backend Setup:
1. Create a new repository for the Python backend
2. Deploy the Python files to your chosen service
3. Update the `NEXT_PUBLIC_API_URL` environment variable in Netlify

## API Endpoints

The frontend expects these endpoints on the backend:
- `POST /api/remedy` - For Ayurvedic remedy recommendations
- `POST /api/skin` - For skin disease prediction

## Local Development

1. **Frontend:** `cd amrutam-ai && npm run dev`
2. **Backend:** Run Python files locally and update API URL

## Troubleshooting

If you encounter build errors:
1. Ensure you're only deploying the `amrutam-ai` directory to Netlify
2. Check that `netlify.toml` is in the root of your repository
3. Verify environment variables are set correctly
