# ==========================================================
# 🌿 Ayurvedic Remedies Chat Bot using Google Gemma 3 12B (Free)
# (Fixed: No system message -> works correctly)
# ==========================================================

import requests
import json
from colorama import Fore, Style

# ----------------------------------------------------------
# 🔑 Paste your OpenRouter API key here
# ----------------------------------------------------------
OPENROUTER_API_KEY = "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"  # ← Replace with your key

# ----------------------------------------------------------
# 🧠 Function to get Ayurvedic remedies using Gemma 3 12B model
# ----------------------------------------------------------
def get_ayurvedic_remedy(disease: str):
    """
    Uses Google Gemma 3 12B model via OpenRouter API to get concise Ayurvedic remedies.
    """
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/ruchitsonawane",  # optional
        "X-Title": "Ayurvedic Remedies Chatbot",  # optional
    }

    # 👇 Moved system instructions inside user prompt
    data = {
        "model": "google/gemma-3-12b-it:free",
        "messages": [
            {
                "role": "user",
                "content": (
                    f"You are an expert Ayurvedic doctor and wellness guide. "
                    f"Give short and engaging Ayurvedic remedies for the disease '{disease}'. "
                    f"Reply under 10 lines with emojis and bullet points. "
                    f"Include:\n"
                    f"- Disease name in English + Hindi\n"
                    f"- 1-line Ayurvedic understanding 🌿\n"
                    f"- 3-4 herbal remedies with Hindi/Sanskrit names 🪷\n"
                    f"- 2-3 home remedies 🏡\n"
                    f"- 2 short lifestyle or diet tips 🍃\n"
                    f"Make it factual, easy to read, and avoid long paragraphs."
                ),
            }
        ],
        "temperature": 0.7,
        "max_tokens": 400,
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            res_json = response.json()
            if "choices" in res_json and len(res_json["choices"]) > 0:
                return res_json["choices"][0]["message"]["content"].strip()
            else:
                return "⚠️ No valid response from the model."
        else:
            return f"⚠️ API Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"❌ Error: {str(e)}"


# ----------------------------------------------------------
# 💬 Chat Loop
# ----------------------------------------------------------
def start_ayurveda_bot():
    print(Fore.GREEN + "\n🌿 Namaste! I'm your Ayurvedic Remedy Bot (Gemma 3 12B).")
    print(Fore.CYAN + "Ask me about any disease (like 'Fever', 'Diabetes', 'Hair Fall', etc.)")
    print(Fore.YELLOW + "Type 'exit' anytime to quit.\n" + Style.RESET_ALL)

    while True:
        user_input = input(Fore.LIGHTWHITE_EX + "🧘 You: " + Style.RESET_ALL).strip()

        if user_input.lower() in ["exit", "quit", "bye"]:
            print(Fore.GREEN + "🙏 Dhanyavaad! Take care of your health. 🌸" + Style.RESET_ALL)
            break

        if not user_input:
            print(Fore.RED + "⚠️ Please enter a disease name." + Style.RESET_ALL)
            continue

        print(Fore.LIGHTBLACK_EX + "🔍 Finding Ayurvedic remedies..." + Style.RESET_ALL)
        reply = get_ayurvedic_remedy(user_input)
        print(Fore.LIGHTGREEN_EX + "\n🌿 Ayurvedic Advice:\n" + Style.RESET_ALL + reply + "\n")


# ----------------------------------------------------------
# 🚀 Run the bot
# ----------------------------------------------------------
if __name__ == "__main__":
    start_ayurveda_bot()
