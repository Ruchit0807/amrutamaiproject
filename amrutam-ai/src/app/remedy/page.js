"use client";

import { useMemo, useState, useEffect } from "react";

export default function RemedyPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [text, setText] = useState("");
  const [structured, setStructured] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12 + 5, 95));
    }, 300);
    return () => clearInterval(id);
  }, [loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setText("");
    setStructured(null);
    try {
      const res = await fetch("/api/remedy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: query }),
      });
      if (!res.ok) throw new Error("Failed to fetch remedies");
      const data = await res.json();
      if (data.text) setText(data.text);
      if (data.structured) setStructured(data.structured);
      if (data.remedies) setResults(data.remedies);
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }
  };

  const derivedCards = useMemo(() => {
    if (!structured) return [];
    const cards = [];
    const guessDose = (s) => {
      const t = s.toLowerCase();
      if (t.includes("paste") || t.includes("lep")) return "Apply a thin layer 1–2x daily for 7–10 days";
      if (t.includes("decoction") || t.includes("kwath") || t.includes("tea") || t.includes("infusion")) return "150–200 ml warm, once daily";
      if (t.includes("oil") || t.includes("taila") || t.includes("ghee")) return "Massage gently for 10–15 min; rinse with lukewarm water";
      return "Use as directed; consult a professional";
    };
    structured.herbs?.forEach((h) => cards.push({ name: h.split(":")[0], herbs: [h], dosage: guessDose(h), notes: "Herbal formulation based on classical guidance." }));
    structured.home_remedies?.forEach((h) => cards.push({ name: h.split(":")[0], herbs: [], dosage: guessDose(h), notes: h }));
    return cards.slice(0, 8);
  }, [structured]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-white">Find the Right Ayurvedic Remedy for You</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="text-sm text-white">Describe your symptoms or disease</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., dry itchy patches on elbows, redness, scaling"
          className="min-h-28 rounded-2xl border border-accent/20 bg-secondary/80 p-4 outline-none focus:ring-2 focus:ring-primary/50 text-amber-900"
        />
        {!loading ? (
          <button
            type="submit"
            disabled={!query.trim()}
            className="justify-self-start rounded-full bg-accent text-secondary px-6 py-2 hover:bg-accent/90 disabled:opacity-50"
          >
            Get Remedies
          </button>
        ) : (
          <div className="justify-self-start w-full max-w-md" role="status" aria-live="polite">
          <div className="loading-bar-track rounded-full bg-accent/20 h-3">
              <div className="loading-bar-fill bg-accent rounded-full" style={{ width: `${Math.round(progress)}%` }} />
            </div>
            <p className="text-sm text-white mt-2">{"let's take a deep breath then look at results!"}</p>
            <button type="button" className="mt-2 rounded-full bg-accent text-secondary px-4 py-1 text-sm" disabled>
              {`Loading ${Math.round(progress)}%`}
            </button>
          </div>
        )}
      </form>

      {error && <p className="mt-4 text-red-700">{error}</p>}

      {structured && (
        <div className="mt-8 grid gap-4">
          <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
            <h3 className="font-serif text-xl text-accent">Ayurvedic Guidance</h3>
            <p className="text-neutral/80 mt-1"><span className="font-semibold">Condition:</span> {structured.disease}</p>
            {structured.understanding && (
              <p className="text-neutral/80 mt-1"><span className="font-semibold">Understanding:</span> {structured.understanding}</p>
            )}
          </div>
          {structured.herbs?.length > 0 && (
            <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
              <h3 className="font-serif text-xl text-accent">Herbal Remedies</h3>
              <ul className="list-disc pl-6 mt-2 text-neutral/80">
                {structured.herbs.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          {structured.home_remedies?.length > 0 && (
            <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
              <h3 className="font-serif text-xl text-accent">Home Remedies</h3>
              <ul className="list-disc pl-6 mt-2 text-neutral/80">
                {structured.home_remedies.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          {structured.lifestyle?.length > 0 && (
            <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
              <h3 className="font-serif text-xl text-accent">Lifestyle & Diet Tips</h3>
              <ul className="list-disc pl-6 mt-2 text-neutral/80">
                {structured.lifestyle.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!structured && text && (
        <div className="mt-8 rounded-2xl bg-secondary p-5 border border-accent/10 whitespace-pre-wrap text-neutral/90">
          {text}
        </div>
      )}

      {/* Wellness extras */}
      <div className="mt-12 grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
          <h3 className="font-serif text-xl text-accent">Dosha Balance</h3>
          <p className="text-neutral/80 mt-1">Answer a few questions to assess Vata-Pitta-Kapha balance. Coming soon.</p>
        </div>
        <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
          <h3 className="font-serif text-xl text-accent">Daily Dinacharya</h3>
          <p className="text-neutral/80 mt-1">Simple morning and evening routine suggestions for skin health.</p>
        </div>
        <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
          <h3 className="font-serif text-xl text-accent">Food Guidelines</h3>
          <p className="text-neutral/80 mt-1">Sattvic, seasonal foods and hydration tips tailored to your condition.</p>
        </div>
        <div className="rounded-2xl bg-secondary p-5 border border-accent/10">
          <h3 className="font-serif text-xl text-accent">Breathwork</h3>
          <p className="text-neutral/80 mt-1">2–5 mins of Nadi Shodhana or Box Breathing to calm Pitta and stress.</p>
        </div>
      </div>

      {(results.length > 0 || derivedCards.length > 0) && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-accent">Personalized Remedy Cards</h2>
          <div className="mt-4 grid gap-4">
            {(derivedCards.length > 0 ? derivedCards : results).map((r, idx) => (
              <div key={idx} className="rounded-2xl bg-secondary p-5 border border-accent/10 hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl text-accent">{r.name}</h3>
                  <button type="button" className="rounded-full px-3 py-1 text-xs bg-accent text-secondary hover:bg-accent/90">Add to Plan</button>
                </div>
                {r.herbs && r.herbs.length > 0 && (
                  <p className="text-sm text-neutral/80 mt-1"><span className="font-semibold">Herbs:</span> {r.herbs.join(", ")}</p>
                )}
                {r.dosage && (
                  <p className="text-sm text-neutral/80 mt-1"><span className="font-semibold">Dosage:</span> {r.dosage}</p>
                )}
                {r.notes && <p className="text-sm text-neutral/70 mt-1">{r.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-white">
        Disclaimer: This AI tool provides general recommendations. Please consult a professional before starting any treatment.
      </p>
    </div>
  );
}
