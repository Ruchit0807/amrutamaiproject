"""
Simplified skin disease module for import into FastAPI
"""
import torch
import torch.nn as nn
from torchvision import transforms
from efficientnet_pytorch import EfficientNet

class_names = [
    'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous', 'Candidiasis',
    'DrugEruption', 'Eczema', 'Infestations_Bites', 'Lichen', 'Lupus',
    'Moles', 'Psoriasis', 'Rosacea', 'Seborrh_Keratoses', 'SkinCancer',
    'Sun_Sunlight_Damage', 'Tinea', 'Unknown_Normal', 'Vascular_Tumors',
    'Vasculitis', 'Vitiligo', 'Warts'
]

# Define treatment_info inline
treatment_info = {
    "Acne": {
        "description": "😣 A common skin condition caused by clogged pores and excess oil.",
        "treatment": [
            "💧 Topical Retinoids (Adapalene, Tretinoin)",
            "🧼 Benzoyl Peroxide or Salicylic Acid face wash",
            "💊 Oral Antibiotics (Doxycycline, Minocycline)",
            "🚫 Use oil-free moisturizers & avoid heavy makeup"
        ],
        "home_remedies": [
            "🍯 Apply raw honey mask 2-3 times a week (antibacterial!)",
            "🥒 Use aloe vera gel overnight for calming effect",
            "🍋 Dab diluted lemon juice for spot treatment",
            "🚰 Drink plenty of water to flush out toxins"
        ],
        "side_effects": [
            "⚠️ Retinoids may cause dryness or peeling",
            "👕 Benzoyl Peroxide can bleach clothes",
            "☀️ Antibiotics may cause sun sensitivity"
        ]
    },
    "Eczema": {
        "description": "🧴 Chronic itchy inflammation of the skin.",
        "treatment": [
            "💦 Moisturizers (Eucerin, Cetaphil)",
            "🌿 Topical Steroids (Hydrocortisone)",
            "🚫 Avoid allergens and harsh soaps"
        ],
        "home_remedies": [
            "🛁 Oatmeal bath to reduce itching",
            "🥥 Apply coconut oil or shea butter for moisture",
            "🌿 Use aloe vera or cucumber juice for soothing"
        ],
        "side_effects": [
            "⚠️ Overuse of steroids can thin skin",
            "✅ Moisturizers are safe"
        ]
    },
    "Psoriasis": {
        "description": "🌀 Autoimmune condition causing red, scaly plaques.",
        "treatment": [
            "🧴 Topical Corticosteroids or Vitamin D analogs",
            "💡 Phototherapy (UVB light therapy)",
            "💊 Systemic medications (Methotrexate, Cyclosporine)"
        ],
        "home_remedies": [
            "🌿 Aloe vera gel reduces scaling",
            "💧 Coconut oil moisturizes patches",
            "☀️ Short, safe sunlight exposure (10–15 mins)"
        ],
        "side_effects": [
            "⚠️ Steroid overuse thins skin",
            "🌞 UV therapy may cause dryness"
        ]
    },
    "Unknown_Normal": {
        "description": "🌿 Your skin looks healthy and happy!",
        "treatment": [
            "🧴 Maintain a gentle skincare routine",
            "☀️ Use sunscreen & stay hydrated"
        ],
        "home_remedies": [
            "💧 Drink 8+ glasses of water daily",
            "🍊 Eat vitamin C-rich foods (orange, amla)",
            "😴 Get 7–8 hours of sleep for skin repair"
        ],
        "side_effects": [
            "✅ None — keep glowing!"
        ]
    }
}

# Simplified: just return the dict
def get_treatment_info():
    return treatment_info

