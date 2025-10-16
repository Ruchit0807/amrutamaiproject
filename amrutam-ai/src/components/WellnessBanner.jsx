export default function WellnessBanner({ title = "Holistic Wellness", subtitle = "Calm mind. Healthy skin. Balanced doshas.", className = "mt-10" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-accent/10 bg-gradient-to-br from-[#F5F5E6] via-[#e9f0cf] to-[#dbe7b8] p-6 ${className}`}
      aria-label="Wellness inspiration"
    >
      <div className="relative z-10">
        <h2 className="font-serif text-2xl md:text-3xl text-accent">{title}</h2>
        <p className="mt-1 text-neutral/80 md:text-lg">{subtitle}</p>
        <ul className="mt-4 grid gap-2 text-neutral/80 text-sm md:text-base list-disc pl-5">
          <li>Mindful breath: Inhale 4 • Hold 4 • Exhale 6</li>
          <li>Hydrate warmly • Favour sattvic foods • Sleep by 10 pm</li>
          <li>Gentle sun • Unplug rituals • Gratitude journaling</li>
        </ul>
      </div>
      {/* Decorative graphics */}
      <svg className="absolute -top-6 -right-6 h-40 w-40 opacity-40" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BFCB6F" />
            <stop offset="100%" stopColor="#9fb85e" />
          </linearGradient>
        </defs>
        <path d="M100 20 C140 40,160 80,140 120 C120 160,80 160,60 120 C40 80,60 40,100 20 Z" fill="url(#leafGrad)" />
      </svg>
      <svg className="absolute -bottom-8 -left-8 h-48 w-48 opacity-30" viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r="70" fill="#BFCB6F" />
        <circle cx="100" cy="100" r="40" fill="#F5F5E6" opacity="0.8" />
      </svg>
    </section>
  );
}


