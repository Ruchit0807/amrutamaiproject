"use client";

import { useState } from "react";
import WellnessBanner from "@/components/WellnessBanner";

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
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="font-serif text-4xl text-gray-100">AI Skin Health Predictor</h1>
      <p className="mt-2 text-gray-200">Gently assess your skin and explore Ayurvedic guidance with clarity.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="text-sm text-gray-200">Upload Skin Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-2xl border border-accent/30 bg-secondary p-3 text-neutral"
        />
        {!loading ? (
          <button
            type="submit"
            disabled={!file}
            className="justify-self-start rounded-full bg-accent text-secondary px-6 py-2 hover:bg-accent/90 disabled:opacity-50 shadow-sm"
          >
            Analyze
          </button>
        ) : (
          <div className="justify-self-start w-full max-w-md" role="status" aria-live="polite">
            <div className="loading-bar-track rounded-full bg-accent/20 h-3">
              <div className="loading-bar-fill bg-accent rounded-full" />
            </div>
            <p className="text-sm text-gray-200 mt-2">{"Let's take a deep breath, then view results."}</p>
          </div>
        )}
      </form>

      {error && <p className="mt-4 text-red-700">{error}</p>}

      {result && (
        <div className="mt-8 grid gap-4 animate-[fadeIn_0.4s_ease]">
          <div className="rounded-2xl bg-secondary p-6 border border-accent/20">
            <h3 className="font-serif text-xl text-accent">Predicted Disease</h3>
            <p className="text-neutral/90 mt-1">{result.disease}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-6 border border-accent/20">
            <h3 className="font-serif text-xl text-accent">Confidence</h3>
            <p className="text-neutral/90 mt-1">{Math.round(result.confidence * 100)}%</p>
          </div>
          <div className="rounded-2xl bg-secondary p-6 border border-accent/20">
            <h3 className="font-serif text-xl text-accent">Suggested Ayurvedic Care</h3>
            <ul className="text-neutral/90 list-disc pl-6 mt-2">
              {result.care?.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-secondary p-6 border border-accent/20">
            <h3 className="font-serif text-xl text-accent">Ayurvedic Skin-care Tips</h3>
            <ul className="text-neutral/90 list-disc pl-6 mt-2">
              {result.tips?.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <WellnessBanner title="Peace of Mind" subtitle="Relax, breathe, and give your skin time to heal." className="mt-12" />

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
