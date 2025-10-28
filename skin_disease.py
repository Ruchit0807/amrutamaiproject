# ==============================================================
# 🧬 AI SKIN DISEASE DETECTION + TREATMENT + SIDE EFFECTS + CLINIC FINDER (AUTOCOMPLETE + PRE-FILLED GOOGLE API)
# ==============================================================

import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import gradio as gr
from efficientnet_pytorch import EfficientNet
import requests
import os

# ==============================================================
# ✅ STEP 1: Define Class Names
# ==============================================================

class_names = [ 
    'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous', 'Candidiasis',
    'DrugEruption', 'Eczema', 'Infestations_Bites', 'Lichen', 'Lupus',
    'Moles', 'Psoriasis', 'Rosacea', 'Seborrh_Keratoses', 'SkinCancer',
    'Sun_Sunlight_Damage', 'Tinea', 'Unknown_Normal', 'Vascular_Tumors',
    'Vasculitis', 'Vitiligo', 'Warts'
]

# ==============================================================
# ✅ STEP 2: Load Model
# ==============================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = EfficientNet.from_name('efficientnet-b0')
model._fc = nn.Linear(model._fc.in_features, len(class_names))
model.load_state_dict(torch.load("best_efficientnet.pth", map_location=device))
model.eval().to(device)

# ==============================================================
# ✅ STEP 3: Image Preprocessing
# ==============================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ==============================================================
# ✅ STEP 3.5: Treatment + Side Effects + Home Remedies
# ==============================================================

# (You already had full treatment_info — keeping same content)
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

    "Actinic_Keratosis": {
        "description": "☀️ Precancerous scaly patches from long-term sun exposure.",
        "treatment": [
            "❄️ Cryotherapy (freezing lesions)",
            "🧴 Topical 5-fluorouracil (5-FU) or Imiquimod cream",
            "💡 Photodynamic therapy (PDT)"
        ],
        "home_remedies": [
            "🍅 Apply fresh tomato pulp (rich in antioxidants)",
            "🧴 Use coconut oil to soothe dryness",
            "☀️ Avoid midday sun & always wear SPF 50+ sunscreen"
        ],
        "side_effects": [
            "🔥 Redness or burning from topical therapy",
            "💧 Blistering or pigmentation post-cryotherapy"
        ]
    },

    "Benign_tumors": {
        "description": "😊 Non-cancerous lumps like lipomas or cysts.",
        "treatment": [
            "👀 Observation if painless",
            "✂️ Surgical excision if painful or growing",
            "💡 Laser or cryotherapy for cosmetic removal"
        ],
        "home_remedies": [
            "🥥 Massage with warm castor oil to improve circulation",
            "🍋 Apply diluted apple cider vinegar on cyst (anti-inflammatory)",
            "🚿 Keep area clean and avoid squeezing"
        ],
        "side_effects": [
            "⚠️ Minor scars after surgery",
            "💧 Temporary swelling after cryotherapy"
        ]
    },

    "Bullous": {
        "description": "💥 Autoimmune blistering skin disorders.",
        "treatment": [
            "💊 Systemic corticosteroids (Prednisone)",
            "🧬 Immunosuppressants (Azathioprine)",
            "🩹 Cool compress or soothing gel for blisters"
        ],
        "home_remedies": [
            "❄️ Cold compress to reduce itching",
            "🌿 Apply aloe vera gel gently over blisters",
            "🥛 Oatmeal bath to calm irritation"
        ],
        "side_effects": [
            "⚠️ Steroids can raise blood sugar",
            "😷 Immunosuppressants lower immune defense"
        ]
    },

    "Candidiasis": {
        "description": "🍞 Fungal infection (Candida) often in moist skin folds.",
        "treatment": [
            "🧴 Topical antifungals (Clotrimazole, Miconazole)",
            "💊 Oral Fluconazole for severe cases",
            "🚿 Keep area dry & clean"
        ],
        "home_remedies": [
            "🍶 Apply diluted coconut oil (natural antifungal)",
            "🍎 Use apple cider vinegar rinse",
            "🌬️ Wear loose, breathable cotton clothes"
        ],
        "side_effects": [
            "🔥 Mild burning from creams",
            "⚠️ Oral antifungals may affect liver function"
        ]
    },

    "DrugEruption": {
        "description": "💊 Allergic skin reaction due to a medication.",
        "treatment": [
            "🚫 Stop the suspected drug immediately",
            "💤 Antihistamines for itching",
            "🧴 Topical or oral corticosteroids for inflammation"
        ],
        "home_remedies": [
            "🛁 Cool oatmeal or baking soda bath",
            "❄️ Cold compress for rashes",
            "🥥 Apply aloe vera or coconut oil for soothing"
        ],
        "side_effects": [
            "😴 Antihistamines may cause drowsiness",
            "⚠️ Steroids may cause mood changes or skin thinning"
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

    "Infestations_Bites": {
        "description": "🦟 Skin irritation due to insect bites or parasites.",
        "treatment": [
            "💤 Antihistamines to reduce itching",
            "🧴 Topical corticosteroids for swelling",
            "🧼 Scabicidal creams (Permethrin) if scabies suspected"
        ],
        "home_remedies": [
            "🧊 Ice pack to relieve swelling",
            "🍯 Honey to reduce redness and itchiness",
            "🍋 Rub diluted lemon juice for natural antiseptic effect"
        ],
        "side_effects": [
            "⚠️ Topical steroids may irritate skin",
            "🔥 Permethrin may cause mild burning"
        ]
    },

    "Lichen": {
        "description": "💜 Inflammatory skin condition with flat, itchy bumps.",
        "treatment": [
            "🧴 Topical corticosteroids",
            "💤 Oral antihistamines for itching",
            "💡 Phototherapy for resistant cases"
        ],
        "home_remedies": [
            "🌿 Aloe vera gel to soothe inflammation",
            "🥥 Coconut oil for moisturization",
            "🍵 Green tea compress to reduce irritation"
        ],
        "side_effects": [
            "⚠️ Steroid overuse can thin skin",
            "☀️ Phototherapy may cause redness"
        ]
    },

    "Lupus": {
        "description": "🌞 Autoimmune disease causing facial rashes.",
        "treatment": [
            "🧴 Topical steroids for lesions",
            "💊 Hydroxychloroquine (Plaquenil)",
            "☀️ Sun protection & anti-inflammatory medication"
        ],
        "home_remedies": [
            "🍋 Lemon water daily for detox",
            "🌿 Turmeric milk (anti-inflammatory)",
            "😴 Get enough rest & avoid stress triggers"
        ],
        "side_effects": [
            "⚠️ Hydroxychloroquine may affect vision (rare)",
            "💧 Steroids can cause weight gain"
        ]
    },

    "Moles": {
        "description": "🟤 Common pigmented growths — usually harmless.",
        "treatment": [
            "👀 Observation unless changes occur",
            "✂️ Surgical removal if irregular or symptomatic"
        ],
        "home_remedies": [
            "🍎 Apply diluted apple cider vinegar cautiously",
            "🥥 Castor oil + baking soda paste overnight",
            "☀️ Use sunscreen to prevent mole darkening"
        ],
        "side_effects": [
            "⚠️ Minor scarring post-surgery"
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

    "Rosacea": {
        "description": "🌸 Chronic facial redness and visible veins.",
        "treatment": [
            "🧴 Topical Metronidazole or Azelaic acid",
            "💊 Oral antibiotics (Doxycycline)",
            "💡 Laser therapy for vessels"
        ],
        "home_remedies": [
            "❄️ Cold compress to calm redness",
            "🍵 Green tea toner (anti-inflammatory!)",
            "🚫 Avoid spicy foods and alcohol"
        ],
        "side_effects": [
            "🔥 Topical creams can sting",
            "☀️ Antibiotics increase sun sensitivity"
        ]
    },

    "Seborrh_Keratoses": {
        "description": "🟤 Non-cancerous brown, waxy growths on skin.",
        "treatment": [
            "❄️ Cryotherapy (liquid nitrogen)",
            "🩹 Curettage (scraping)",
            "💡 Laser therapy for cosmetic reasons"
        ],
        "home_remedies": [
            "🍯 Apply honey + lemon mixture to lighten spots",
            "🥥 Use coconut oil daily for smoother skin",
            "🧴 Apply aloe vera for gentle hydration"
        ],
        "side_effects": [
            "⚠️ Temporary redness or pigmentation after removal"
        ]
    },

    "SkinCancer": {
        "description": "🚨 Abnormal skin cell growth that may spread if untreated.",
        "treatment": [
            "✂️ Surgical excision",
            "❄️ Cryotherapy or radiation therapy",
            "💊 Chemotherapy or immunotherapy (for advanced cases)"
        ],
        "home_remedies": [
            "🍅 Tomato & green tea (rich in antioxidants)",
            "🥦 Eat cruciferous veggies to boost immune defense",
            "☀️ Use broad-spectrum SPF & protective clothing"
        ],
        "side_effects": [
            "💧 Pain or scarring post-surgery",
            "😩 Chemo may cause fatigue or nausea"
        ]
    },

    "Sun_Sunlight_Damage": {
        "description": "🌞 Skin damage from prolonged UV exposure.",
        "treatment": [
            "🧴 Apply broad-spectrum sunscreen daily",
            "🌿 Use retinoids to repair",
            "💧 Hydrate & use vitamin C serums"
        ],
        "home_remedies": [
            "🍅 Tomato pulp mask (natural sun protector)",
            "🥒 Cucumber juice for cooling",
            "🍯 Honey + aloe vera gel to soothe burns"
        ],
        "side_effects": [
            "⚠️ Retinoids may cause mild irritation initially"
        ]
    },

    "Tinea": {
        "description": "🌀 Fungal infection (ringworm) of skin or scalp.",
        "treatment": [
            "🧴 Topical antifungal creams (Clotrimazole, Ketoconazole)",
            "💊 Oral antifungals (Terbinafine) if severe",
            "🚿 Maintain hygiene and dryness"
        ],
        "home_remedies": [
            "🥥 Apply coconut oil + a pinch of turmeric",
            "🍋 Dab diluted apple cider vinegar",
            "☀️ Dry affected area completely after bath"
        ],
        "side_effects": [
            "🔥 Mild itching or redness at site",
            "⚠️ Oral antifungals may affect liver (rare)"
        ]
    },

    "Vascular_Tumors": {
        "description": "❤️ Overgrowth of blood vessels forming red or purple lesions.",
        "treatment": [
            "💡 Laser therapy or surgical removal",
            "👀 Observation for small, stable lesions"
        ],
        "home_remedies": [
            "🍎 Apply diluted apple cider vinegar gently",
            "🥦 Eat antioxidant-rich foods (broccoli, spinach)",
            "🧴 Apply aloe vera gel for calmness"
        ],
        "side_effects": [
            "💜 Temporary bruising post-laser"
        ]
    },

    "Vasculitis": {
        "description": "🩸 Inflammation of blood vessels causing red spots or ulcers.",
        "treatment": [
            "💊 Systemic corticosteroids (Prednisone)",
            "🧬 Immunosuppressants (Cyclophosphamide)",
            "🦠 Treat underlying infection if present"
        ],
        "home_remedies": [
            "🍵 Turmeric milk (anti-inflammatory)",
            "🌿 Ginger tea improves blood flow",
            "💧 Stay hydrated & elevate affected limbs"
        ],
        "side_effects": [
            "⚠️ Steroids may cause weight gain",
            "😷 Immunosuppressants can lower immune defense"
        ]
    },

    "Vitiligo": {
        "description": "⚪ Loss of skin pigment causing white patches.",
        "treatment": [
            "🧴 Topical corticosteroids or calcineurin inhibitors",
            "💡 Phototherapy (NB-UVB)",
            "🎨 Camouflage makeup or depigmentation"
        ],
        "home_remedies": [
            "🍎 Apply red clay mixed with ginger juice",
            "🌿 Basil + lime juice paste (boosts melanin)",
            "☀️ Get mild sun exposure early morning"
        ],
        "side_effects": [
            "⚠️ Mild redness or dryness from creams",
            "☀️ Phototherapy may cause mild burns"
        ]
    },

    "Warts": {
        "description": "🦠 Caused by HPV forming rough skin bumps.",
        "treatment": [
            "🧴 Salicylic acid topical treatment",
            "❄️ Cryotherapy (liquid nitrogen)",
            "💡 Laser or surgical removal"
        ],
        "home_remedies": [
            "🍌 Rub inner banana peel on wart (enzymatic)",
            "🍎 Apply apple cider vinegar nightly",
            "🥔 Dab raw potato juice daily"
        ],
        "side_effects": [
            "⚠️ Cryotherapy can blister skin",
            "🔥 Topical acids may sting slightly"
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
# ⚠️ To keep message size manageable, don’t remove this in your real file.

# ==============================================================
# ✅ STEP 4: Google API Setup (AUTOMATIC)
# ==============================================================

# 🔑 Google Maps API key read from environment (set GOOGLE_API_KEY)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

def find_nearby_clinics(location_text):
    """Uses Google Places Text Search API to find skin clinics near the entered city"""
    if not GOOGLE_API_KEY:
        return "⚠️ Missing GOOGLE_API_KEY. Please set it in environment."

    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=dermatology+clinic+near+{location_text}&key={GOOGLE_API_KEY}"
    response = requests.get(url)
    data = response.json()

    status = data.get("status", "")
    if status != "OK":
        msg = data.get("error_message") or status or "Unknown error"
        return f"⚠️ Google API error: {msg}"

    if "results" not in data or len(data["results"]) == 0:
        return "No nearby clinics found."

    results = data["results"][:5]
    clinic_list = []
    for clinic in results:
        name = clinic.get("name", "Unknown Clinic")
        address = clinic.get("formatted_address", "Address not available")
        rating = clinic.get("rating", "N/A")
        maps_url = f"https://www.google.com/maps/search/?api=1&query={name.replace(' ', '+')}"
        clinic_list.append(f"🏥 **{name}**\n📍 {address}\n⭐ Rating: {rating}\n[Open in Maps]({maps_url})\n")

    return "\n".join(clinic_list)

# ==============================================================
# ✅ STEP 5: Prediction Function
# ==============================================================

def predict(image, location_text):
    image = Image.fromarray(image).convert("RGB")
    img_t = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_t)
        _, preds = torch.max(outputs, 1)
        predicted_class = class_names[preds.item()]

    info = treatment_info.get(predicted_class, {
        "description": "Information unavailable.",
        "treatment": ["Consult a dermatologist."],
        "home_remedies": ["Try soothing natural moisturizers."],
        "side_effects": ["No known side effects."]
    })

    desc = info.get("description", "")
    treat_list = info.get("treatment", [])
    home_list = info.get("home_remedies", [])
    sides_list = info.get("side_effects", [])

    treat = "\n".join([f"- {t}" for t in treat_list])
    home = "\n".join([f"- {h}" for h in home_list])
    sides = "\n".join([f"- {s}" for s in sides_list])

    clinic_text = ""
    if location_text and location_text.strip():
        clinic_text = "\n\n---\n🧭 **Nearby Skin Clinics:**\n" + find_nearby_clinics(location_text)

    return (
        f"🩺 **Detected Disease:** {predicted_class}\n\n"
        f"📋 **Description:**\n\n{desc}\n\n"
        f"💊 **Suggested Treatment:**\n\n{treat or '- Not available.'}\n\n"
        f"🌿 **Home Remedies:**\n\n{home or '- Not available.'}\n\n"
        f"⚠️ **Possible Side Effects:**\n\n{sides or '- None reported.'}"
        f"{clinic_text}"
    )

# ==============================================================
# ✅ STEP 6: Autocomplete Integration
# ==============================================================

def gen_autocomplete_html():
    script_tag = f'<script src="https://maps.googleapis.com/maps/api/js?key={GOOGLE_API_KEY}&libraries=places"></script>'
    return f"""
{script_tag}
<script>
  function initAutocomplete() {{
    const root = document;
    const input = root.querySelector('#location_input textarea, #location_input input');
    if (!input || !window.google || !google.maps || !google.maps.places) return;
    const autocomplete = new google.maps.places.Autocomplete(input, {{ types: ['(cities)'] }});
  }}
  window.addEventListener('load', initAutocomplete);
</script>
"""

autocomplete_html = gen_autocomplete_html()

# ==============================================================
# ✅ STEP 7: Gradio Interface
# ==============================================================

with gr.Blocks(title="🌿 AI Skin Disease Detector") as demo:
    gr.HTML("<h1 style='text-align:center;'>🌿 AI Skin Disease Detector + Treatment + Nearby Clinics</h1>")
    gr.HTML("<p style='text-align:center;'>Upload a skin image to detect disease, see treatments, side effects, and nearby dermatologists.</p>")

    with gr.Row():
        img_input = gr.Image(type="numpy", label="Upload a skin image")
        location_input = gr.Textbox(label="Enter your city or area", placeholder="Enter your city or area", elem_id="location_input")

    output = gr.Markdown(label="Diagnosis, Treatment, and Clinic Info")

    btn = gr.Button("🔍 Analyze & Find Clinics")
    btn.click(fn=predict, inputs=[img_input, location_input], outputs=output)

    gr.HTML(autocomplete_html)

# ==============================================================
# ✅ STEP 8: Launch
# ==============================================================

if __name__ == "__main__":
    demo.launch()
