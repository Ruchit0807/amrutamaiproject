import Link from "next/link";
import { FaLeaf, FaDna } from "react-icons/fa6";
import { LuFlower2 } from "react-icons/lu";
import Meditating from "@/components/Meditating";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import AyurvedaStrip from "@/components/AyurvedaStrip";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-secondary to-primary/20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <AnimateOnScroll className="space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl text-accent tracking-tight">AMRUTAM AI</h1>
          <p className="text-lg text-neutral/90">Discover the Intelligence of Ayurveda & Wellness</p>
          <p className="text-neutral/80">Integrative Health, Ayurveda & AI-based Skin Wellness Platform</p>
          <Link
            href="/journey"
            className="inline-block mt-4 rounded-full bg-accent text-secondary px-6 py-3 hover:bg-accent/90 transition-colors"
          >
            Start Your Wellness Journey
          </Link>
        </AnimateOnScroll>
        <div className="flex justify-center md:justify-end">
          <div className="animate-float-soft">
            <Meditating className="w-72 h-72 md:w-[22rem] md:h-[22rem]" />
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="font-serif text-3xl text-accent mb-4">Why AMRUTAM AI?</h2>
        <p className="text-neutral/80 max-w-3xl">
          AMRUTAM AI blends ancient Ayurvedic wisdom with modern AI to recommend personalized remedies and predict skin conditions for holistic, informed wellness decisions.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimateOnScroll className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><FaLeaf /></div>
            <h3 className="font-serif text-xl text-accent mt-2">Personalized Ayurvedic Remedies</h3>
            <p className="text-neutral/80 text-sm mt-1">Tailored guidance rooted in classical texts and modern insights.</p>
          </AnimateOnScroll>
          <AnimateOnScroll className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><FaDna /></div>
            <h3 className="font-serif text-xl text-accent mt-2">AI-based Skin Disease Detection</h3>
            <p className="text-neutral/80 text-sm mt-1">Image-driven predictions with confidence scoring.</p>
          </AnimateOnScroll>
          <AnimateOnScroll className="rounded-2xl bg-secondary p-6 border border-accent/10 shadow-sm hover:shadow transition-shadow">
            <div className="text-accent text-2xl"><LuFlower2 /></div>
            <h3 className="font-serif text-xl text-accent mt-2">Integrative Wellness Insights</h3>
            <p className="text-neutral/80 text-sm mt-1">Holistic dashboards and routines (Coming Soon).</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-2xl mx-auto px-4 py-4">
        <AnimateOnScroll className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-8 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-amber-900 mb-2">Support Our Mission</h3>
              <p className="text-amber-900 text-sm">
                Help us continue developing AI-powered Ayurvedic wellness solutions.
              </p>
            </div>
            <a
              href="https://buymeacoffee.com/ruchit0807"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-800 text-white px-6 py-2 hover:bg-amber-900 transition-colors font-medium shadow-md hover:shadow-lg ml-4"
            >
              <span>☕</span>
              Buy me a coffee
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
