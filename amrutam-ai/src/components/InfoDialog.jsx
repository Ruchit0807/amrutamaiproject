"use client";

import { useEffect } from "react";

export default function InfoDialog({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full mx-4 rounded-2xl border border-accent/20 bg-secondary p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl text-accent">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-full px-3 py-1 text-sm bg-accent text-secondary hover:bg-accent/90">Close</button>
        </div>
        <div className="mt-4 text-neutral/90">
          {children}
        </div>
      </div>
    </div>
  );
}



