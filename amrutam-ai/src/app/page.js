import Link from "next/link";
import { FaLeaf, FaDna } from "react-icons/fa6";
import { LuFlower2 } from "react-icons/lu";
import Meditating from "@/components/Meditating";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-secondary to-primary/20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl text-accent tracking-tight">AMRUTAM AI</h1>
          <p className="text-lg text-neutral/90">Discover the Intelligence of Ayurveda & Wellness</p>
          <p className="text-neutral/80">Integrative Health, Ayurveda & AI-based Skin Wellness Platform</p>
          <Link
            href="/journey"
            className="inline-block mt-4 rounded-full bg-accent text-secondary px-6 py-3 hover:bg-accent/90 transition-colors"
          >
            Start Your Wellness Journey
          </Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <Meditating className="w-72 h-72 md:w-[22rem] md:h-[22rem]" />
        </div>
      </section>

      {/* Why section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="font-serif text-3xl text-accent mb-4">Why AMRUTAM AI?</h2>
        <p className="text-neutral/80 max-w-3xl">
          AMRUTAM AI blends ancient Ayurvedic wisdom with modern AI to recommend personalized remedies and predict skin conditions for holistic, informed wellness decisions.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><FaLeaf /></div>
            <h3 className="font-serif text-xl text-accent mt-2">Personalized Ayurvedic Remedies</h3>
            <p className="text-neutral/80 text-sm mt-1">Tailored guidance rooted in classical texts and modern insights.</p>
          </div>
          <div className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><FaDna /></div>
            <h3 className="font-serif text-xl text-accent mt-2">AI-based Skin Disease Detection</h3>
            <p className="text-neutral/80 text-sm mt-1">Image-driven predictions with confidence scoring.</p>
          </div>
          <div className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><LuFlower2 /></div>
            <h3 className="font-serif text-xl text-accent mt-2">Integrative Wellness Insights</h3>
            <p className="text-neutral/80 text-sm mt-1">Holistic dashboards and routines (Coming Soon).</p>
          </div>
        </div>
      </section>

      {/* Support box */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-secondary border border-accent/10 p-6 md:p-8 shadow-sm">
          <div className="md:flex items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-accent">Support This Project</h3>
              <p className="text-neutral/80 mt-2 max-w-2xl">
                If AMRUTAM AI helps you, consider buying me a coffee. Your support keeps
                the Ayurvedic research, model improvements, and hosting going.
              </p>
            </div>
            <a
              href="https://buymeacoffee.com/ruchit0807"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center rounded-full bg-accent text-secondary px-6 py-3 hover:bg-accent/90 transition-colors"
            >
              Buy me a coffee
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
