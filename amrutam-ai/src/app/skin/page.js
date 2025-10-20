"use client";

import { useState } from "react";

export default function SkinPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/skin", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to analyze image");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-white">AI Skin Health Predictor</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="text-sm text-white">Upload Skin Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-2xl border border-accent/20 bg-secondary/80 p-3 text-amber-900"
        />
        {!loading ? (
          <button
            type="submit"
            disabled={!file}
            className="justify-self-start rounded-full bg-accent text-secondary px-6 py-2 hover:bg-accent/90 disabled:opacity-50"
          >
            Analyze
          </button>
        ) : (
          <div className="justify-self-start w-full max-w-md" role="status" aria-live="polite">
            <div className="loading-bar-track rounded-full bg-accent/20 h-3">
              <div className="loading-bar-fill bg-accent rounded-full" />
            </div>
            <p className="text-sm text-neutral/70 mt-2">{"let's take a deep breath then look at results!"}</p>
          </div>
        )}
      </form>

      {error && <p className="mt-4 text-red-700">{error}</p>}

      {result && (
        <div className="mt-8 grid gap-4 animate-[fadeIn_0.4s_ease]">
          <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
            <h3 className="font-serif text-xl text-accent">Predicted Disease</h3>
            <p className="text-amber-900 mt-1">{result.disease}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
            <h3 className="font-serif text-xl text-accent">Confidence</h3>
            <p className="text-amber-900 mt-1">{Math.round(result.confidence * 100)}%</p>
          </div>
          <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
            <h3 className="font-serif text-xl text-accent">Suggested Ayurvedic Care</h3>
            <ul className="text-amber-900 list-disc pl-6 mt-2">
              {result.care?.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
            <h3 className="font-serif text-xl text-accent">Ayurvedic Skin-care Tips</h3>
            <ul className="text-amber-900 list-disc pl-6 mt-2">
              {result.tips?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
