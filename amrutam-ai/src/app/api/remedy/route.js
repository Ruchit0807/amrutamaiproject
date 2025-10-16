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
  }
}
key = query.strip().lower()
if key in fallbacks:
    for k in ['herbs','home_remedies','lifestyle']:
        if len(sections[k]) == 0:
            sections[k] = fallbacks[key][k]

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
