export const runtime = "nodejs";

import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

function runPython(args, options = {}) {
  return new Promise((resolve, reject) => {
    // Try 'py' (Windows) then 'python'
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
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image) throw new Error("No image");

    const arrayBuffer = await image.arrayBuffer();
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "amrutam-"));
    const imgPath = path.join(tmpDir, "upload.jpg");
    await fs.writeFile(imgPath, Buffer.from(arrayBuffer));

    const projectRoot = path.resolve(process.cwd(), ".."); // D:\amrutam

    const pyCode = `
import json, sys
from PIL import Image
import torch
import torch.nn.functional as F
import numpy as np
import skin_disease as sd

path = sys.argv[1]
img = Image.open(path).convert('RGB')
img_t = sd.transform(img).unsqueeze(0).to(sd.device)
with torch.no_grad():
    logits = sd.model(img_t)
    probs = F.softmax(logits, dim=1).cpu().numpy()[0]
    idx = int(np.argmax(probs))
    disease = sd.class_names[idx]
    conf = float(probs[idx])
info = sd.treatment_info.get(disease, {})
care = info.get('treatment', [])
home = info.get('home_remedies', [])
print(json.dumps({'disease': disease, 'confidence': conf, 'care': care, 'tips': home}))
`;

    const output = await runPython(["-c", pyCode, imgPath], { cwd: projectRoot });
    const data = JSON.parse(output);
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { status: 400 });
  }
}
