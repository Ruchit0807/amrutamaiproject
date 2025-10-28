"""
FastAPI Backend Server for AMRUTAM AI
Provides endpoints for skin disease detection and Ayurvedic remedies
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import numpy as np
import io
import sys
import os
import requests
import json
import re
from typing import Optional

# Import our ML modules
from efficientnet_pytorch import EfficientNet
from skin_disease_module import treatment_info

app = FastAPI(title="AMRUTAM AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = "best_efficientnet.pth"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyAFtMxYO0cN--eTlKMJObp9wdTI49ea5SM")

# Load skin disease model
class_names = [
    'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous', 'Candidiasis',
    'DrugEruption', 'Eczema', 'Infestations_Bites', 'Lichen', 'Lupus',
    'Moles', 'Psoriasis', 'Rosacea', 'Seborrh_Keratoses', 'SkinCancer',
    'Sun_Sunlight_Damage', 'Tinea', 'Unknown_Normal', 'Vascular_Tumors',
    'Vasculitis', 'Vitiligo', 'Warts'
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = EfficientNet.from_name('efficientnet-b0')
model._fc = nn.Linear(model._fc.in_features, len(class_names))
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval().to(device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# treatment_info is imported from skin_disease_module

@app.get("/")
async def root():
    return {"message": "AMRUTAM AI Backend API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "device": str(device)}

@app.post("/api/skin")
async def predict_skin_disease(image: UploadFile = File(...)):
    """Predict skin disease from uploaded image"""
    try:
        # Read image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Preprocess
        img_t = transform(img).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(img_t)
            probs = torch.nn.functional.softmax(outputs, dim=1).cpu().numpy()[0]
            idx = int(np.argmax(probs))
            disease = class_names[idx]
            confidence = float(probs[idx])
        
        # Get treatment info
        info = treatment_info.get(disease, {})
        care = info.get('treatment', [])
        home = info.get('home_remedies', [])
        
        return {
            "disease": disease,
            "confidence": confidence,
            "care": care,
            "tips": home
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/remedy")
async def get_ayurvedic_remedy(data: dict):
    """Get Ayurvedic remedies for given symptoms"""
    try:
        query = data.get("symptoms", "")
        if not query:
            raise HTTPException(status_code=400, detail="No symptoms provided")
        
        # Get remedies from OpenRouter API
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": "google/gemma-3-12b-it:free",
            "messages": [{
                "role": "user",
                "content": (
                    f"You are an expert Ayurvedic doctor and wellness guide. "
                    f"Give short and engaging Ayurvedic remedies for the disease '{query}'. "
                    f"Reply under 10 lines with emojis and bullet points. "
                    f"Include:\n"
                    f"- Disease name in English + Hindi\n"
                    f"- 1-line Ayurvedic understanding 🌿\n"
                    f"- 3-4 herbal remedies with Hindi/Sanskrit names 🪷\n"
                    f"- 2-3 home remedies 🏡\n"
                    f"- 2 short lifestyle or diet tips 🍃\n"
                    f"Make it factual, easy to read, and avoid long paragraphs."
                ),
            }],
            "temperature": 0.7,
            "max_tokens": 400,
        }
        
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            # Use fallback if API fails
            return get_fallback_remedy(query)
        
        res_json = response.json()
        if "choices" in res_json and len(res_json["choices"]) > 0:
            text = res_json["choices"][0]["message"]["content"].strip()
        else:
            return get_fallback_remedy(query)
        
        # Parse response
        structured = parse_ayurvedic_response(query, text)
        
        return {
            "text": text,
            "structured": structured
        }
    except Exception as e:
        return get_fallback_remedy(query)

def parse_ayurvedic_response(query, text):
    """Parse Ayurvedic response into structured format"""
    lines = [ln.rstrip() for ln in text.splitlines()]
    
    sections = {'herbs': [], 'home_remedies': [], 'lifestyle': []}
    current = None
    
    # Simple parsing logic
    for ln in lines:
        low = ln.lower()
        if 'ayurvedic' in low or 'dosha' in low:
            understanding = clean(ln)
            break
    
    # Extract sections
    for ln in lines:
        if any(kw in ln.lower() for kw in ['herb', 'remedy', 'home', 'lifestyle', 'diet']):
            if 'herb' in ln.lower():
                current = 'herbs'
            elif 'home' in ln.lower():
                current = 'home_remedies'
            elif 'lifestyle' in ln.lower() or 'diet' in ln.lower():
                current = 'lifestyle'
            continue
        
        if current and ln.strip():
            cleaned = clean(ln)
            if cleaned and not re.match(r"^[A-Za-z ]+:$", cleaned):
                sections[current].append(cleaned)
    
    return {
        'disease': query,
        'understanding': locals().get('understanding', ''),
        'herbs': sections['herbs'][:8],
        'home_remedies': sections['home_remedies'][:8],
        'lifestyle': sections['lifestyle'][:8],
    }

def clean(s):
    """Clean text"""
    s = s.strip()
    s = re.sub(r"^[\-\*•–—\d\.\)\s]+", "", s)
    s = re.sub(r"^[\u2700-\u27BF\u1F300-\u1FAFF]+\s*", "", s)
    return s.strip().strip(':').strip()

def get_fallback_remedy(query):
    """Get fallback remedies when API fails"""
    fallbacks = {
        'fever': {'herbs': ['Tulsi + Ginger tea', 'Turmeric milk'], 'home_remedies': ['Rest, stay hydrated'], 'lifestyle': ['Light diet']},
        'acne': {'herbs': ['Neem paste', 'Turmeric + Honey'], 'home_remedies': ['Aloe vera gel'], 'lifestyle': ['Avoid oily foods']},
        'eczema': {'herbs': ['Coconut oil', 'Aloe vera'], 'home_remedies': ['Oatmeal bath'], 'lifestyle': ['Avoid harsh soaps']},
    }
    
    query_lower = query.lower()
    matched = fallbacks.get(query_lower, {'herbs': ['Consult Ayurvedic practitioner'], 'home_remedies': ['Maintain healthy lifestyle'], 'lifestyle': ['Balanced diet']})
    
    return {
        "text": f"Ayurvedic guidance for {query}",
        "structured": {
            'disease': query,
            'understanding': 'Traditional Ayurvedic approach',
            'herbs': matched.get('herbs', []),
            'home_remedies': matched.get('home_remedies', []),
            'lifestyle': matched.get('lifestyle', [])
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

