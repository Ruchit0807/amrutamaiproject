export const runtime = "nodejs";

import { spawn } from "child_process";
import path from "path";

function runPython(args, options = {}) {
  return new Promise((resolve, reject) => {
    const tryExec = (cmdIndex) => {
      const cmd = cmdIndex === 0 ? "py" : "python";
      const child = spawn(cmd, args, { ...options });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));
      child.on("error", (err) => {
        if (cmdIndex === 0) return tryExec(1);
        reject(err);
      });
      child.on("close", (code) => {
        if (code === 0) return resolve(stdout.trim());
        if (cmdIndex === 0 && /'py' is not recognized/i.test(stderr)) return tryExec(1);
        reject(new Error(stderr || `Python exited with code ${code}`));
      });
    };
    tryExec(0);
  });
}

export async function POST(request) {
  try {
    const { symptoms } = await request.json();
    const textInput = (symptoms || "").toString();
    if (!textInput.trim()) throw new Error("No symptoms provided");

    const projectRoot = path.resolve(process.cwd(), ".."); // D:\amrutam
    const pyCode = `
import sys, json, re
from ayurvedic_remedies import get_ayurvedic_remedy

def clean(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^[\-\*•–—\d\.\)\s]+", "", s)
    s = re.sub(r"^[\u2700-\u27BF\u1F300-\u1FAFF]+\s*", "", s)  # leading emojis
    return s.strip().strip(':').strip()

headers = {
  'herbs': ['herbal', 'remed', 'allies'],
  'home_remedies': ['home', 'comfort'],
  'lifestyle': ['lifestyle', 'diet', 'wellness', 'booster']
}

def detect_header(line: str):
    low = line.lower()
    if not any(ch.isalpha() for ch in low):
        return None
    for key, kws in headers.items():
        if any(k in low for k in kws) and (low.endswith(':') or '**' in low or 'tips' in low or 'remedies' in low or 'allies' in low or 'boosters' in low):
            return key
    return None

query = sys.argv[1]
text = get_ayurvedic_remedy(query)
lines_raw = [ln.rstrip() for ln in text.splitlines()]

# Extract understanding (first line containing 'ayurvedic' or a short sentence with dosha)
under = ''
for ln in lines_raw:
    low = ln.lower()
    if 'ayurvedic' in low or 'dosha' in low or 'pitta' in low or 'vata' in low or 'kapha' in low:
        under = clean(ln)
        break

sections = {'herbs': [], 'home_remedies': [], 'lifestyle': []}
current = None
for ln in lines_raw:
    head = detect_header(ln)
    if head:
        current = head
        continue
    if current:
        # bullet-like or short suggestion lines
        if ln.strip() and (re.match(r"^[\-\*•–—\d]+[\).\s]", ln.strip()) or len(ln.strip()) <= 120 or re.match(r"^[\u2700-\u27BF\u1F300-\u1FAFF]", ln.strip())):
            cleaned = clean(ln)
            if cleaned and not re.match(r"^[A-Za-z ]+:$", cleaned):
                sections[current].append(cleaned)

# Fallback: pull any bullet lines if sections are empty
if not any(sections.values()):
    bullets = [clean(ln) for ln in lines_raw if ln.strip().startswith(('-', '*', '•', '–', '—')) or re.match(r"^[\u2700-\u27BF\u1F300-\u1FAFF]", ln.strip())]
    sections['herbs'] = bullets[:4]
    sections['home_remedies'] = bullets[4:7]
    sections['lifestyle'] = bullets[7:10]

# Condition-specific defaults if still empty
# Expanded knowledge base and synonyms for multiple conditions
synonyms = {
  'pimples': 'acne', 'zits': 'acne', 'acne vulgaris': 'acne',
  'atopic dermatitis': 'eczema', 'dermatitis': 'eczema',
  'seborrheic dermatitis': 'dandruff', 'flaky scalp': 'dandruff',
  'hair loss': 'hair_fall', 'alopecia': 'hair_fall',
  'dyspepsia': 'indigestion', 'gas': 'indigestion', 'bloating': 'indigestion',
  'heartburn': 'acid_reflux', 'acid reflux': 'acid_reflux', 'gerd': 'acid_reflux',
  'common cold': 'cold', 'runny nose': 'cold',
  'headache': 'migraine',
  'sleeplessness': 'insomnia', 'sleep issues': 'insomnia',
  'stress': 'anxiety', 'worry': 'anxiety'
}

fallbacks = {
  'fever': {
    'herbs': [
      'Guduchi (Tinospora cordifolia) decoction',
      'Tulsi (Holy Basil) + Dry Ginger (Shunthi) tea',
      'Coriander seed water (Dhania)'],
    'home_remedies': [
      'Warm water sips every 30–60 mins',
      'Rest in a cool, ventilated room',
      'Lukewarm sponge if temperature rises'],
    'lifestyle': [
      'Light sattvic diet (khichdi, moong soup)',
      'Avoid cold drinks and heavy/oily food']
  },
  'acne': {
    'herbs': [
      'Neem (Azadirachta indica) leaves paste for spot application',
      'Turmeric (Haridra) + Honey paste on lesions',
      'Manjistha (Rubia cordifolia) decoction as blood purifier'],
    'home_remedies': [
      'Wash face with lukewarm water; avoid harsh scrubs',
      'Aloe vera gel thin layer at night',
      'Avoid oily, spicy foods; keep pillowcases clean'],
    'lifestyle': [
      'Manage stress with 5–10 min breathwork daily',
      'Sleep 7–8 hours; hydrate 2–3 liters/day']
  },
  'eczema': {
    'herbs': [
      'Coconut oil (Narikela taila) gentle application 2x daily',
      'Licorice (Yashtimadhu) + Coconut oil soothing application',
      'Triphala decoction wash for affected area'],
    'home_remedies': [
      'Oatmeal (Avena) lukewarm compress for itching',
      'Avoid hot showers; use mild, fragrance-free cleansers'],
    'lifestyle': [
      'Wear breathable cotton; avoid known triggers',
      'Anti-inflammatory diet (greens, turmeric, ginger)']
  },
  'psoriasis': {
    'herbs': [
      'Turmeric (Curcumin) with black pepper in warm water',
      'Aloe vera gel application on plaques',
      'Neem oil diluted with coconut oil for overnight use'],
    'home_remedies': [
      'Sunlight 10–15 min/day avoiding peak hours',
      'Moisturize immediately after bath'],
    'lifestyle': [
      'Avoid smoking/alcohol; manage stress',
      'Gentle yoga and pranayama 10–15 min/day']
  },
  'dandruff': {
    'herbs': [
      'Tea tree oil (few drops) in coconut oil scalp massage',
      'Neem leaf rinse after shampoo',
      'Amla (Emblica officinalis) hair pack weekly'],
    'home_remedies': [
      'Wash scalp 2–3x/week; avoid very hot water',
      'Rinse sweat after workouts'],
    'lifestyle': [
      'Balanced diet with zinc and B vitamins',
      'Reduce sugar spikes; hydrate well']
  },
  'hair_fall': {
    'herbs': [
      'Bhringraj (Eclipta alba) oil scalp massage 3x/week',
      'Amla + Brahmi hair mask weekly'],
    'home_remedies': [
      'Gentle combing; avoid tight hairstyles',
      'Protein-rich diet (dal, nuts, seeds)'],
    'lifestyle': [
      '7–8h sleep; manage stress',
      'Check iron, vitamin D, B12 with a professional if persistent']
  },
  'indigestion': {
    'herbs': [
      'Jeera (Cumin) + Ajwain (Carom) + Saunf (Fennel) tea',
      'Ginger (Shunthi) warm infusion before meals'],
    'home_remedies': [
      'Small, frequent meals; avoid late-night eating',
      'Walk 10–15 min after meals'],
    'lifestyle': [
      'Chew food thoroughly; avoid carbonated drinks']
  },
  'constipation': {
    'herbs': [
      'Triphala (1–2 g) at bedtime with warm water',
      'Isabgol (Psyllium husk) with warm water'],
    'home_remedies': [
      'Warm water after waking; add ghee to meals',
      'Soaked raisins at night'],
    'lifestyle': [
      'Fiber-rich diet; regular bowel routine']
  },
  'diarrhea': {
    'herbs': [
      'Pomegranate peel decoction',
      'Nutmeg (Jaiphal) pinch in buttermilk'],
    'home_remedies': [
      'ORS and hydration; bland diet (khichdi, banana)',
      'Avoid milk, raw salads temporarily'],
    'lifestyle': [
      'Rest; consult if blood/fever/dehydration']
  },
  'cold': {
    'herbs': [
      'Tulsi + Black Pepper + Ginger warm tea',
      'Steam inhalation with ajwain seeds'],
    'home_remedies': [
      'Warm soups; avoid cold foods/drinks'],
    'lifestyle': [
      'Adequate rest; keep chest/neck warm']
  },
  'cough': {
    'herbs': [
      'Honey + Turmeric + Black Pepper paste 2–3x/day',
      'Licorice (Yashtimadhu) tea for throat soothing'],
    'home_remedies': [
      'Warm water sips; avoid dust/smoke'],
    'lifestyle': [
      'Humidify room; elevate head while sleeping']
  },
  'sore_throat': {
    'herbs': [
      'Warm salt water gargle 2–3x/day',
      'Turmeric milk at bedtime'],
    'home_remedies': [
      'Honey-ginger tea; rest voice'],
    'lifestyle': [
      'Avoid very cold/irritating foods']
  },
  'migraine': {
    'herbs': [
      'Ginger tea at onset of headache',
      'Brahmi (Bacopa) with warm water daily'],
    'home_remedies': [
      'Dark, quiet room rest; cold compress'],
    'lifestyle': [
      'Regular sleep; identify and avoid triggers']
  },
  'insomnia': {
    'herbs': [
      'Ashwagandha (Withania) at night as per guidance',
      'Nutmeg pinch in warm milk at bedtime'],
    'home_remedies': [
      'Screen-free wind-down 1 hour before bed'],
    'lifestyle': [
      'Consistent sleep/wake time; cool, dark room']
  },
  'anxiety': {
    'herbs': [
      'Brahmi (Bacopa) or Jatamansi (Nardostachys) as advised',
      'Tulsi tea daily'],
    'home_remedies': [
      'Box breathing 4-4-4-4 for 3–5 minutes'],
    'lifestyle': [
      'Daily walk/yoga; reduce caffeine']
  },
  'acid_reflux': {
    'herbs': [
      'Licorice (Deglycyrrhizinated) before meals',
      'Coriander seed water cool infusion'],
    'home_remedies': [
      'Small meals; avoid lying down after eating'],
    'lifestyle': [
      'Avoid spicy, fried foods; elevate head end']
  }
}

# Merge fallbacks for single or multiple diseases in query
def dedupe(seq):
    seen = set()
    out = []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

parts = [p.strip().lower() for p in re.split(r",|/|;|\band\b|\bor\b", query) if p.strip()]
if not parts:
    parts = [query.strip().lower()]
rn_parts = []
for p in parts:
    rn_parts.append(synonyms.get(p, p))

for key in rn_parts:
    if key in fallbacks:
        for k in ['herbs','home_remedies','lifestyle']:
            sections[k] = dedupe((sections[k] or []) + fallbacks[key][k])

structured = {
  'disease': query,
  'understanding': under,
  'herbs': sections['herbs'][:8],
  'home_remedies': sections['home_remedies'][:8],
  'lifestyle': sections['lifestyle'][:8],
}
print(json.dumps({'structured': structured, 'text': text}))
`;

    const output = await runPython(["-c", pyCode, textInput], { cwd: projectRoot });
    const data = JSON.parse(output);
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { status: 400 });
  }
}
